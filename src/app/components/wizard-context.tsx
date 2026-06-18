import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { isWeekendOrHoliday2026 } from "../data/holidays";
import { FOOD_MENU } from "../data/foodMenu";
import {
  MEGA_MC_PRICE,
  MEGA_PACKAGE_PRICES,
  MEGA_SHOW_PRICES,
  ParkId,
  getMegaFoodTotal,
} from "../data/megaConfig";

// Backend API URL — Timeweb VPS (HTTPS через nip.io)
const API_BASE = import.meta.env.VITE_API_URL || 'https://194-87-118-33.nip.io';

// ──────────────────────────────────────────────
// localStorage cache helpers
// ──────────────────────────────────────────────
const CACHE_VERSION = 3;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function getActiveParkId(): ParkId {
  const params = new URLSearchParams(window.location.search);
  if (params.get("park") === "hello") return "hello";
  if (window.location.pathname.includes("/hello")) return "hello";
  return "mega";
}

function getCacheKey(leadId: string | null, parkId: ParkId) {
  if (parkId === "hello") {
    return leadId ? `wizard_cache_${leadId}` : 'wizard_cache_standalone';
  }
  return leadId ? `wizard_cache_${parkId}_${leadId}` : `wizard_cache_${parkId}_standalone`;
}

interface CachedData {
  version: number;
  timestamp: number;
  step: number;
  state: WizardState;
  submitted?: boolean;
}

function saveToCache(key: string, step: number, state: WizardState, submitted = false) {
  try {
    const data: CachedData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      step,
      state: {
        ...state,
        // Date needs special handling — store as ISO string
        date: state.date ? (state.date as unknown as string) : null,
      },
      submitted,
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable (e.g. private mode)
  }
}

function loadFromCache(key: string): { step: number; state: WizardState; submitted?: boolean } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data: CachedData = JSON.parse(raw);

    // Version mismatch or expired
    if (data.version !== CACHE_VERSION) { localStorage.removeItem(key); return null; }
    if (Date.now() - data.timestamp > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }

    // Restore Date object
    const restored: WizardState = {
      ...data.state,
      date: data.state.date ? new Date(data.state.date as unknown as string) : null,
    };

    return { step: data.step, state: restored, submitted: data.submitted };
  } catch {
    return null;
  }
}

function clearCacheByKey(key: string) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

export interface WizardState {
  parkId: ParkId;
  // Step 1
  packageType: "basic" | "premium" | "exclusive" | "custom" | null;
  isWeekend: boolean;
  // Step 2 — Quests
  questType: "phygital_voxels" | "phygital_space" | "classic_fort" | "classic_minecraft" | "classic_squid" | "classic_barbie" | "classic_safari" | "classic_harry" | "classic_harley" | "classic_heroes" | "classic_pirates" | "classic_wednesday" | "classic_bloggers" | "classic_fortnite" | "classic_agents" | "animator" | "none" | null;
  // Step 3 — Location
  patiroom: string | null;
  patiroomDetails: string | null;
  patiroomHours: number;
  cafeZones: string[];
  // Step 4 — Animators
  animators: string[];
  premiumCostume: string | null;
  // Step 5 — Shows
  shows: string[];
  // Step 6 — Master classes
  masterClasses: string[];
  // Step 7 — Food
  includeFood: boolean;
  customFood: Record<string, number>;
  megaOwnCatering: boolean;
  megaFood: Record<string, number>;
  cakeChoice: string | null;
  fillingChoice: string | null;
  cakeCustomText: string;
  // Step 7 — Date/time
  date: Date | null;
  time: string;
  childrenCount: number;
  adultsCount: number;
  // Step 8 — Contact
  contactName: string;
  contactPhone: string;
  contactComment: string;
  isQuestPopupOpen: boolean;
  hasReachedSummary: boolean;
  discoChoice: "disco" | "trash_box" | null;
  balloonChoice: "balloon" | "pinata" | null;
  additionalActivities: string[];
  additionalServices: string[];
}

interface WizardContextType {
  parkId: ParkId;
  isMega: boolean;
  isExp: boolean;
  step: number;
  totalSteps: number;
  visibleSteps: number[];
  state: WizardState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateState: (partial: Partial<WizardState>) => void;
  totalPrice: number;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  leadId: string | null;
  submitToAPI: (price?: number) => Promise<boolean>;
  clearCache: () => void;
  resetWizard: () => void;
  showResumeBanner: boolean;
  confirmResume: () => void;
  confirmRestart: () => void;
}

const initialState: WizardState = {
  parkId: "hello",
  packageType: null,
  isWeekend: false,
  questType: null,
  patiroom: null,
  patiroomDetails: null,
  patiroomHours: 3,
  cafeZones: [],
  animators: [],
  premiumCostume: null,
  shows: [],
  masterClasses: [],
  includeFood: false,
  customFood: {},
  megaOwnCatering: true,
  megaFood: {},
  cakeChoice: null,
  fillingChoice: null,
  cakeCustomText: "",
  date: null,
  time: "",
  childrenCount: 8,
  adultsCount: 4,
  contactName: "",
  contactPhone: "",
  contactComment: "",
  isQuestPopupOpen: false,
  hasReachedSummary: false,
  discoChoice: null,
  balloonChoice: null,
  additionalActivities: [],
  additionalServices: [],
};

function createInitialState(parkId: ParkId): WizardState {
  return {
    ...initialState,
    parkId,
    cafeZones: [],
    animators: [],
    shows: [],
    masterClasses: [],
    customFood: {},
    megaFood: {},
  };
}

const WizardContext = createContext<WizardContextType | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

const TOTAL_STEPS = 17;
const MEGA_STEPS_BASE = [1, 2, 3, 4, 8, 9, 12];

function getMegaSteps(packageType: WizardState["packageType"]) {
  const steps = [...MEGA_STEPS_BASE];
  if (packageType === "custom") {
    // Insert step 17 before 3 (index 2)
    steps.splice(steps.indexOf(3), 0, 17);
  }
  if (packageType === "exclusive" || packageType === "custom") {
    // Insert step 7 before 9
    steps.splice(steps.indexOf(9), 0, 7);
  }
  if (packageType === "premium" || packageType === "exclusive") {
    // Insert step 13 before 9
    steps.splice(steps.indexOf(9), 0, 13);
  }
  if (packageType === "exclusive") {
    // Insert step 14 before 9
    steps.splice(steps.indexOf(9), 0, 14);
  }
  if (packageType === "custom") {
    // Insert step 15 before 9 (Additional Activities)
    steps.splice(steps.indexOf(9), 0, 15);
  }
  // Insert step 16 before 9 (Additional Services)
  steps.splice(steps.indexOf(9), 0, 16);
  return steps;
}

const PACKAGE_PRICES: Record<string, [number, number]> = {
  custom:    [0, 0],
  basic:     [24900, 0],      // basic is weekday-only
  premium:   [47900, 57900],
  exclusive: [79900, 89900],
};

const PHYGITAL_QUEST_ADDON = 2000;
const CLASSIC_QUEST_ADDON = 10000;
const PATIROOM_HOURLY_RATE = 3000; // Custom mode: 3000₽/hour for any patiroom

// ── Per-child surcharge ──
// Every package is priced for 8 children. Each additional child costs extra.
// Does not apply to "custom" (no fixed package base) or when no package is chosen.
export const INCLUDED_CHILDREN = 8;
export const EXTRA_CHILD_WEEKDAY = 855;
export const EXTRA_CHILD_WEEKEND = 1215;

export function getExtraChildrenCount(state: WizardState): number {
  if (!state.packageType) return 0;
  if (state.packageType === "custom") return state.childrenCount || 0;
  return Math.max(0, (state.childrenCount || 0) - INCLUDED_CHILDREN);
}

export function getExtraChildrenCost(state: WizardState, isWeekend: boolean): number {
  return getExtraChildrenCount(state) * (isWeekend ? EXTRA_CHILD_WEEKEND : EXTRA_CHILD_WEEKDAY);
}

// ── Custom mode: gift logic based on selected services ──
export interface CustomGift {
  id: string;
  name: string;
  gradient: string;
  emoji: string;
}

const ALL_CUSTOM_GIFTS: CustomGift[] = [
  { id: "invite", name: "Электронные пригласительные", gradient: "from-[#d4fc79] to-[#96e6a1]", emoji: "✉️" },
  { id: "wow", name: "WOW-поздравление от Лиса Рокки", gradient: "from-[#a1c4fd] to-[#c2e9fb]", emoji: "🎉" },
  { id: "gift", name: "Подарок имениннику", gradient: "from-[#a18cd1] to-[#fbc2eb]", emoji: "🎁" },
  { id: "balloon_decor", name: "Украшение шарами", gradient: "from-[#fbc2eb] to-[#a6c1ee]", emoji: "🎈" },
  { id: "balloon", name: "Шар-сюрприз", gradient: "from-[#ffecd2] to-[#fcb69f]", emoji: "🎊" },
  { id: "pinata", name: "Пиньята / Шар-цифра", gradient: "from-[#ff9a9e] to-[#fecfef]", emoji: "🪅" },
  { id: "gifts_all", name: "Подарки всем гостям", gradient: "from-[#84fab0] to-[#8fd3f4]", emoji: "🛍️" },
];

export function getCustomGifts(state: WizardState): CustomGift[] {
  if (state.packageType !== "custom") return [];
  const gifts: CustomGift[] = [];
  const hasAnyService = state.questType || state.patiroom || state.shows.length > 0
    || state.masterClasses.length > 0 || state.includeFood || state.animators.length > 0;
  const hasQuest = !!state.questType && state.questType !== "none";
  const hasShow = state.shows.length > 0;
  const hasMC = state.masterClasses.length > 0;
  const hasFood = state.includeFood;
  const hasPatiroom = !!state.patiroom;

  // Level 1: any service → invites
  if (hasAnyService) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "invite")!);
  }
  // Level 2: quest → wow + birthday gift
  if (hasQuest) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "wow")!);
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gift")!);
  }
  // Level 3: patiroom → balloon decor
  if (hasPatiroom) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon_decor")!);
  }
  // Level 4: quest + show or MC → surprise balloon
  if (hasQuest && (hasShow || hasMC)) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon")!);
  }
  // Level 5: quest + show + MC → pinata
  if (hasQuest && hasShow && hasMC) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "pinata")!);
  }
  // Level 6: quest + show + MC + food → gifts for all
  if (hasQuest && hasShow && hasMC && hasFood) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gifts_all")!);
  }

  return gifts;
}

function hasCustomGifts(state: WizardState): boolean {
  return getCustomGifts(state).length > 0;
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [parkId] = useState<ParkId>(() => getActiveParkId());
  const isMega = parkId === "mega";

  // Lead ID from URL parameter (?lead=abc123)
  const [leadId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lead');
  });

  // Derive cache key from leadId
  const cacheKey = getCacheKey(leadId, parkId);
  const parkInitialState = React.useMemo(() => createInitialState(parkId), [parkId]);

  // Try to restore from cache on first render
  // If cache exists with step > 1 and not submitted, show resume banner
  const cachedOnMount = useRef(loadFromCache(cacheKey));
  const hasPendingSession = cachedOnMount.current && (cachedOnMount.current.step > 1) && !cachedOnMount.current.submitted;

  const [showResumeBanner, setShowResumeBanner] = useState(!!hasPendingSession);

  const [step, setStep] = useState(() => {
    const cached = cachedOnMount.current;
    if (!cached) return 1;
    // If submitted, restore to step 12 to show submitted screen
    if (cached.submitted) return cached.step;
    // If pending session, start at 1 until user confirms resume
    if (hasPendingSession) return 1;
    return Math.max(cached.step, 1);
  });
  const [state, setState] = useState<WizardState>(() => {
    const cached = cachedOnMount.current;
    if (!cached) return parkInitialState;
    // If submitted, restore full state
    if (cached.submitted) {
      return {
        ...parkInitialState,
        ...cached.state,
        parkId,
        patiroomHours: cached.state.patiroomHours ?? 3,
      };
    }
    // If pending session, start with initial state until user confirms
    if (hasPendingSession) return parkInitialState;
    return {
      ...parkInitialState,
      ...cached.state,
      parkId,
      patiroomHours: cached.state.patiroomHours ?? 3,
    };
  });
  const [submitted, setSubmitted] = useState(() => {
    const cached = cachedOnMount.current;
    return cached?.submitted ?? false;
  });

  // Flag to prevent overwriting cache during initial lead data fetch
  const isInitializing = useRef(true);
  useEffect(() => { isInitializing.current = false; }, []);

  // Update hasReachedSummary
  useEffect(() => {
    if (step === 12 && !state.hasReachedSummary) {
      setState(s => ({ ...s, hasReachedSummary: true }));
    }
  }, [step, state.hasReachedSummary]);

  // Persist state + step to localStorage on every change
  useEffect(() => {
    if (showResumeBanner) return; // Don't overwrite cache while banner is shown
    saveToCache(cacheKey, step, state, submitted);
  }, [step, state, cacheKey, submitted, showResumeBanner]);

  // Clear cache helper (call after successful submission)
  const clearCache = useCallback(() => {
    clearCacheByKey(cacheKey);
  }, [cacheKey]);

  // Reset entire wizard state
  const resetWizard = useCallback(() => {
    clearCacheByKey(cacheKey);
    setState(parkInitialState);
    setStep(1);
    setSubmitted(false);
    setShowResumeBanner(false);
  }, [cacheKey, parkInitialState]);

  // Resume banner actions
  const confirmResume = useCallback(() => {
    const cached = cachedOnMount.current;
    if (cached) {
      setState({
        ...parkInitialState,
        ...cached.state,
        parkId,
        patiroomHours: cached.state.patiroomHours ?? 3,
      });
      setStep(Math.max(cached.step, 1));
    }
    setShowResumeBanner(false);
  }, [parkId, parkInitialState]);

  const confirmRestart = useCallback(() => {
    clearCacheByKey(cacheKey);
    setState(parkInitialState);
    setStep(1);
    setSubmitted(false);
    setShowResumeBanner(false);
  }, [cacheKey, parkInitialState]);

  // On mount: if we have a leadId, notify server and pre-fill contact data
  useEffect(() => {
    if (!leadId || !API_BASE) return;

    // Notify server that configurator was opened
    fetch(`${API_BASE}/api/leads/${leadId}/opened`, { method: 'POST' }).catch(() => {});

    // Fetch lead data to pre-fill name and phone
    fetch(`${API_BASE}/api/leads/${leadId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.lead) {
          setState(s => ({
            ...s,
            contactName: data.lead.name || s.contactName,
            contactPhone: data.lead.phone || s.contactPhone,
          }));
        }
      })
      .catch(() => {});
  }, [leadId]);

  // Submit configuration to API
  // Note: totalPrice is passed by the component calling submitToAPI
  const submitToAPI = useCallback(async (price?: number): Promise<boolean> => {
    if (!leadId || !API_BASE) return true; // No lead = standalone mode, always OK
    try {
      const payload = {
        ...state,
        parkId,
        date: state.date?.toISOString(),
        totalPrice: price ?? 0,
      };
      const res = await fetch(`${API_BASE}/api/leads/${leadId}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.success;
    } catch {
      console.error('Failed to submit to API');
      return false;
    }
  }, [leadId, state, parkId]);

  const nextStep = useCallback(() => {
    setStep((s) => {
      if (isMega) {
        const steps = getMegaSteps(state.packageType);
        const index = steps.indexOf(s);
        if (index >= 0) return steps[Math.min(index + 1, steps.length - 1)];
        return steps[0];
      }

      let next = s + 1;
      
      // After Packages (Step 2)
      if (s === 2) {
        if (state.packageType === "custom") {
          next = 17;
        } else {
          next = 3;
        }
      }

      // After Custom Guests (Step 17) -> go to Quests (3)
      if (s === 17) {
        next = 3;
      }
      
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 3 && !state.questType?.startsWith("phygital_")) {
        next = 5;
      }
      
      // Going from Kids Location (Step 5) → skip to step 7 (Shows), 8 (MC) or 15 (Activities)
      if (s === 5) {
        if (state.packageType === "basic") {
          next = 15; // Skip Shows(7) and MC(8)
        } else if (state.packageType === "premium") {
          next = 8; // Skip Shows(7)
        } else {
          next = 7;
        }
      }

      if (s === 8) {
        next = 15;
      }

      if (s === 15) {
        if (state.packageType === "premium" || state.packageType === "exclusive") {
          next = 13;
        } else {
          next = 6;
        }
      }

      // After Disco (13) → go to Balloon (14) if Exclusive, else Adult Location (6)
      if (s === 13) {
        if (state.packageType === "exclusive") {
          next = 14;
        } else {
          next = 6;
        }
      }

      // After Balloon (14) → go to Adult Location (6)
      if (s === 14) {
        next = 6;
      }

      // After Adult Location (6) → go to Cakes (10)
      if (s === 6) {
        next = 10;
      }

      // After Cakes (10) → go to Included (11) or Additional Services (16)
      if (s === 10) {
        if (state.packageType === "custom" && !hasCustomGifts(state)) {
          next = 16;
        } else {
          next = 11;
        }
      }

      // After Included (11) → go to Additional Services (16)
      if (s === 11) {
        next = 16;
      }

      // After Additional Services (16) → go to Food (9)
      if (s === 16) {
        next = 9;
      }

      // After Food (9) → go to Summary (12)
      if (s === 9) {
        next = 12;
      }
      
      return Math.min(next, TOTAL_STEPS);
    });
  }, [isMega, state.questType, state.packageType, state.date, state.isWeekend]);

  const prevStep = useCallback(() => {
    setStep((s) => {
      if (isMega) {
        const steps = getMegaSteps(state.packageType);
        const index = steps.indexOf(s);
        if (index >= 0) return steps[Math.max(index - 1, 0)];
        return steps[0];
      }

      let prev = s - 1;
      
      // Going back from Summary (12)
      if (s === 12) {
        prev = 9; // Food is now the last step before summary
      }
      // Going back from Food (9)
      else if (s === 9) {
        prev = 16;
      }
      // Going back from Additional Services (16)
      else if (s === 16) {
        if (state.packageType === "custom" && !hasCustomGifts(state)) {
          prev = 10;
        } else {
          prev = 11;
        }
      }
      // Going back from Included Bonuses (11)
      else if (s === 11) {
        prev = 10;
      }
      // Going back from Cakes (10)
      else if (s === 10) {
        prev = 6;
      }
      // Going back from Adult Location (6)
      else if (s === 6) {
        if (state.packageType === "exclusive") {
          prev = 14;
        } else if (state.packageType === "premium") {
          prev = 13;
        } else {
          prev = 15;
        }
      }
      // Going back from Balloon (14)
      else if (s === 14) {
        prev = 13;
      }
      // Going back from Disco (13)
      else if (s === 13) {
        prev = 15;
      }
      // Going back from Additional Services (16) (handled above, but keeping as fallback)
      else if (s === 15) {
        if (state.packageType === "basic") {
          prev = 5;
        } else {
          prev = 8;
        }
      }
      // Going back from MC (8)
      else if (s === 8) {
        if (state.packageType === "premium") {
          prev = 5;
        } else if (state.packageType === "exclusive" || state.packageType === "custom") {
          prev = 7;
        }
      }
      // Going back from Shows (7)
      else if (s === 7) {
        prev = 5;
      }
      // If going back from Kids Location (5) and not phygital quest, skip Animators (4)
      else if (s === 5 && !state.questType?.startsWith("phygital_")) {
        prev = 3;
      }
      // Going back from Quests (3)
      else if (s === 3) {
        if (state.packageType === "custom") {
          prev = 17;
        } else {
          prev = 2;
        }
      }
      // Going back from Custom Guests (17) -> go to Packages (2)
      else if (s === 17) {
        prev = 2;
      }
      
      return Math.max(prev, 1);
    });
  }, [isMega, state.questType, state.packageType, state.date, state.isWeekend]);
  const updateState = useCallback(
    (partial: Partial<WizardState>) => setState((s) => ({ ...s, ...partial })),
    []
  );

  const totalPrice = (() => {
    let total = 0;

    if (isMega) {
      if (state.packageType) {
        const effectiveWeekend = state.date ? isWeekendOrHoliday2026(state.date) : state.isWeekend;
        const [weekday, weekend] = MEGA_PACKAGE_PRICES[state.packageType] || [0, 0];
        total += effectiveWeekend ? weekend : weekday;
      }

      // Quest addon (Фиджитал-игра / "animator" is always included → 0)
      if (state.questType && state.questType !== "none" && state.questType !== "animator") {
        if (state.packageType === "custom") {
          total += state.questType.startsWith("phygital_") ? 12000 : 16000;
        } else if (state.questType.startsWith("classic_")) {
          if (state.packageType === "basic") total += 16000;
          else if (state.packageType === "premium") total += 16000;
          else if (state.packageType === "exclusive") total += 9000;
        }
      }

      if (state.animators.length > 1) {
        total += (state.animators.length - 1) * 8000;
      }

      const showPrices = MEGA_SHOW_PRICES;
      if (state.packageType === "exclusive") {
        let showsCost = 0;
        for (const show of state.shows) showsCost += showPrices[show] || 0;
        if (state.shows.length > 0) showsCost -= showPrices[state.shows[0]] || 0;
        total += showsCost;
      } else {
        for (const show of state.shows) total += showPrices[show] || 0;
      }

      if (state.packageType === "premium" || state.packageType === "exclusive") {
        total += Math.max(0, state.masterClasses.length - 1) * MEGA_MC_PRICE;
      } else {
        total += state.masterClasses.length * MEGA_MC_PRICE;
      }

      // Cafe zone deposits
      const effectiveWeekend = state.date ? isWeekendOrHoliday2026(state.date) : state.isWeekend;
      for (const zone of state.cafeZones) {
        if (zone === "cafe_round") total += effectiveWeekend ? 10000 : 5000;
        if (zone === "cafe_small") total += 5000;
        if (zone === "cafe_pink") total += effectiveWeekend ? 10000 : 5000;
        if (zone === "cafe_pink_full") total += effectiveWeekend ? 20000 : 10000;
      }

      total += getMegaFoodTotal(state.megaFood);

      // Additional Activities
      for (const act of state.additionalActivities) {
        if (act === "trash-animals") total += 35000;
        if (act === "trash-box") total += 7000;
        if (act === "mini-disco") total += 6000;
        if (act === "challenge-party") total += 10000;
      }

      // Additional Services
      for (const srv of state.additionalServices) {
        if (srv === "photo") total += 7000;
        if (srv === "aqua") total += 7000;
      }

      // Extra children beyond the 8 included in the package
      total += getExtraChildrenCost(state, effectiveWeekend);

      return total;
    }

    // Package base price
    if (state.packageType) {
      const [weekday, weekend] = PACKAGE_PRICES[state.packageType] || [0, 0];
      total += state.isWeekend ? weekend : weekday;
    }

    // Quest addon (Фиджитал-игра / "animator" is always included → 0)
    if (state.questType && state.questType !== "none" && state.questType !== "animator") {
      if (state.packageType === "custom") {
        total += state.questType.startsWith("phygital_") ? 12000 : 16000;
      } else if (state.questType.startsWith("classic_")) {
        // Surcharge for classic quests in packages
        if (state.packageType === "basic") total += 16000;
        else if (state.packageType === "premium") total += 16000;
        else if (state.packageType === "exclusive") total += 9000;
      }
    }

    // Patiroom hourly rate (custom mode only — packages include patiroom)
    if (state.packageType === "custom" && state.patiroom) {
      total += (Number.isNaN(state.patiroomHours) ? 3 : state.patiroomHours || 3) * PATIROOM_HOURLY_RATE;
    }

    // Cafe zone deposits (multiple can be selected)
    // Use actual date's weekend status if date is set, otherwise use toggle
    const effectiveWeekend = state.date ? isWeekendOrHoliday2026(state.date) : state.isWeekend;
    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_small") total += 5000;
      if (zone === "cafe_pink") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") total += effectiveWeekend ? 20000 : 10000;
    }

    // Additional animators (+8000 each beyond the first)
    if (state.animators.length > 1) {
      total += (state.animators.length - 1) * 8000;
    }

    // Premium costume
    if (state.premiumCostume) total += 8000;

    // Shows
    const showPrices: Record<string, number> = { soap: 14000, paper: 15000, tesla: 15000, professor: 14000 };
    if (state.packageType === "custom" || state.packageType === "basic" || state.packageType === "premium") {
      for (const show of state.shows) {
        if (showPrices[show]) total += showPrices[show];
      }
    } else if (state.packageType === "exclusive") {
      // 1 is free, rest are paid. Let's just subtract the cheapest? Or just assume the first selected is free.
      // Usually it's simplest to just subtract the cost of one show if length > 0.
      if (state.shows.length > 0) {
        let showsCost = 0;
        for (const show of state.shows) {
          if (showPrices[show]) showsCost += showPrices[show];
        }
        // Subtract up to the minimum price of selected to be fair, or just a fixed ~15000? Let's just subtract the first item's price.
        showsCost -= showPrices[state.shows[0]];
        total += showsCost;
      }
    }

    // MK — included in premium/exclusive (1 free); charged for basic
    if (state.packageType === "basic" || state.packageType === "custom") {
      total += state.masterClasses.length * 15000;
    } else if (state.packageType === "premium" || state.packageType === "exclusive") {
      total += Math.max(0, state.masterClasses.length - 1) * 15000;
    }

    // Food — kids set is included in premium/exclusive. If removed, we subtract price.
    if (state.includeFood && (state.packageType === "basic" || state.packageType === "custom")) {
      total += 12070;
    } else if (!state.includeFood && (state.packageType === "premium" || state.packageType === "exclusive")) {
      total -= 12070;
    }

    // Custom food calculations
    Object.entries(state.customFood).forEach(([itemId, qty]) => {
      if (qty > 0) {
        for (const cat of FOOD_MENU) {
          const item = cat.items.find((i) => i.id === itemId);
          if (item) {
            total += item.price * qty;
            break;
          }
        }
      }
    });

    // Cake
    if (state.cakeChoice) {
      if (state.cakeChoice === "own_cake") {
        total += 2000;
      } else {
        total += 8400;
      }
    }

    // Additional Activities
    for (const act of state.additionalActivities) {
      if (act === "trash-animals") total += 35000;
      if (act === "trash-box") total += 7000;
      if (act === "mini-disco") total += 6000;
      if (act === "challenge-party") total += 10000;
    }

    // Additional Services
    for (const srv of state.additionalServices) {
      if (srv === "photo") total += 7000;
      if (srv === "aqua") total += 7000;
    }

    // Extra children beyond the 8 included in the package
    total += getExtraChildrenCost(state, effectiveWeekend);

    return total;
  })();

  const visibleSteps = React.useMemo(() => {
    if (isMega) return getMegaSteps(state.packageType);

    // Actual navigation order: 1→2→17?→3→4?→5→7?→8?→15→13?→14?→6→10→11?→16→9→12
    const list = [1, 2, 17, 3, 4, 5, 7, 8, 15, 13, 14, 6, 10, 11, 16, 9, 12];
    return list.filter((s) => {
      // Skip Custom Guests (17) if not custom
      if (s === 17 && state.packageType !== "custom") return false;
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 4 && state.questType && !state.questType.startsWith("phygital_")) return false;
      // Skip Shows(7) if basic or premium
      if (s === 7 && (state.packageType === "basic" || state.packageType === "premium")) return false;
      // Skip MC(8) if basic
      if (s === 8 && state.packageType === "basic") return false;
      // Skip Disco (13) if basic or custom
      if (s === 13 && (state.packageType === "basic" || state.packageType === "custom")) return false;
      // Skip Balloon (14) if not exclusive
      if (s === 14 && state.packageType !== "exclusive") return false;
      // Skip Included Bonuses (11) if custom AND no gifts earned
      if (s === 11 && state.packageType === "custom" && !hasCustomGifts(state)) return false;
      return true;
    });
  }, [isMega, state.questType, state.packageType]);

  const isExp = React.useMemo(() => !new URLSearchParams(window.location.search).has("noexp"), []);

  return (
    <WizardContext.Provider
      value={{
        parkId, isMega, isExp,
        step, totalSteps: TOTAL_STEPS, visibleSteps, state, setStep,
        nextStep, prevStep, updateState, totalPrice, submitted, setSubmitted,
        leadId, submitToAPI, clearCache, resetWizard,
        showResumeBanner, confirmResume, confirmRestart
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
