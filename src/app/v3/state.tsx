import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { isWeekendOrHoliday2026 } from "../data/holidays";
import {
  PACKAGES,
  SHOWS,
  MASTER_CLASSES,
  EXTRAS,
  SERVICES,
  CAKES,
  ENTRY_TICKET_PRICE,
  PATIROOM_HOURLY_RATE,
  type PackageId,
} from "./data";

export type Screen =
  | "datetime"
  | "package"
  | "customize"
  | "individual"
  | "summary";

export interface V3State {
  // Step 1 — booking basics
  date: Date | null;
  time: string;
  childrenCount: number;

  // Package selection
  packageId: PackageId | null;

  // What's been selected to fill the included slots
  animatorId: string | null; // for "анимация с любимым героем"
  questId: string | null;    // OR quest instead of animator
  // included MC pick (Premium / Exclusive get one for free)
  includedMasterClassId: string | null;
  // included show pick (Exclusive gets one for free)
  includedShowId: string | null;

  // Paid extras (на любой пакет)
  extraShowIds: string[];
  extraMasterClassIds: string[];
  extraIds: string[];      // тэш-коробка / диско / челлендж
  serviceIds: string[];    // фотограф / аквагрим
  cakeId: "partner" | "own" | null;

  // Individual mode
  individualPatiroomHours: number;
}

const initialState: V3State = {
  date: null,
  time: "",
  childrenCount: 8,
  packageId: null,
  animatorId: null,
  questId: null,
  includedMasterClassId: null,
  includedShowId: null,
  extraShowIds: [],
  extraMasterClassIds: [],
  extraIds: [],
  serviceIds: [],
  cakeId: null,
  individualPatiroomHours: 3,
};

interface V3ContextValue {
  state: V3State;
  screen: Screen;
  setScreen: (s: Screen) => void;
  update: (patch: Partial<V3State>) => void;
  reset: () => void;

  // Derived
  isWeekendBooking: boolean;
  basePrice: number;
  totalPrice: number;
  selectedAnimatorOrQuestLabel: string | null;
  toggleId: (key: "extraShowIds" | "extraMasterClassIds" | "extraIds" | "serviceIds", id: string) => void;
}

const V3Context = createContext<V3ContextValue | null>(null);

export function useV3() {
  const ctx = useContext(V3Context);
  if (!ctx) throw new Error("useV3 must be used within V3Provider");
  return ctx;
}

export function V3Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<V3State>(initialState);
  const [screen, setScreen] = useState<Screen>("datetime");

  const update = useCallback((patch: Partial<V3State>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    setScreen("datetime");
  }, []);

  const toggleId = useCallback(
    (key: "extraShowIds" | "extraMasterClassIds" | "extraIds" | "serviceIds", id: string) => {
      setState((s) => {
        const arr = s[key];
        const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
        return { ...s, [key]: next };
      });
    },
    [],
  );

  const isWeekendBooking = useMemo(() => (state.date ? isWeekendOrHoliday2026(state.date) : false), [state.date]);

  const basePrice = useMemo(() => {
    if (!state.packageId) return 0;
    if (state.packageId === "individual") {
      // entry tickets + patiroom rental (custom mode)
      return state.childrenCount * ENTRY_TICKET_PRICE + state.individualPatiroomHours * PATIROOM_HOURLY_RATE;
    }
    const pkg = PACKAGES.find((p) => p.id === state.packageId);
    if (!pkg) return 0;
    return isWeekendBooking ? pkg.weekendPrice : pkg.weekdayPrice;
  }, [state.packageId, state.childrenCount, state.individualPatiroomHours, isWeekendBooking]);

  const totalPrice = useMemo(() => {
    let total = basePrice;
    const isIndividual = state.packageId === "individual";

    // Extra shows
    for (const id of state.extraShowIds) {
      const item = SHOWS.find((s) => s.id === id);
      if (!item) continue;
      total += item.basePrice;
    }
    // Extra master classes
    for (const id of state.extraMasterClassIds) {
      const item = MASTER_CLASSES.find((m) => m.id === id);
      if (!item) continue;
      total += item.basePrice;
    }
    // Extras (трэш-коробка/диско/челлендж)
    for (const id of state.extraIds) {
      const item = EXTRAS.find((e) => e.id === id);
      if (!item) continue;
      total += item.price;
    }
    // Services (фотограф/аквагрим)
    for (const id of state.serviceIds) {
      const item = SERVICES.find((s) => s.id === id);
      if (!item) continue;
      total += item.price;
    }
    // Cake
    if (state.cakeId) {
      const cake = CAKES.find((c) => c.id === state.cakeId);
      if (cake) total += cake.price;
    }

    // Exclusive: 1 included show — surcharge logic for paid extras already handled by basePrice
    // For paid extra shows when "exclusive" already includes one: charge surcharge instead of full price
    if (state.packageId === "exclusive") {
      // recompute extras for shows: the *selected included show* is free,
      // any others use surcharge. Above we charged full price — adjust:
      total -= state.extraShowIds.reduce((sum, id) => {
        const s = SHOWS.find((x) => x.id === id);
        return s ? sum + s.basePrice - s.exclusiveSurcharge : sum;
      }, 0);
    }
    // Premium / Exclusive: 1 MC is included; extras keep full price (PDF: extra MC = +15k₽)

    // Individual: nothing included, everything is paid
    if (isIndividual) {
      // No-op — we already used basePrice + each extra at full price
    }

    return Math.max(0, total);
  }, [basePrice, state]);

  const selectedAnimatorOrQuestLabel = useMemo(() => {
    if (state.questId) return "Тематический квест";
    if (state.animatorId) return "Любимый герой";
    return null;
  }, [state.animatorId, state.questId]);

  const value: V3ContextValue = {
    state,
    screen,
    setScreen,
    update,
    reset,
    isWeekendBooking,
    basePrice,
    totalPrice,
    selectedAnimatorOrQuestLabel,
    toggleId,
  };

  return <V3Context.Provider value={value}>{children}</V3Context.Provider>;
}
