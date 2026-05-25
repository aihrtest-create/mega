import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, Sparkles } from "lucide-react";
import { useV3 } from "../state";
import { v3, PACKAGE_TINTS } from "../theme";
import {
  PACKAGES,
  ANIMATORS,
  QUESTS,
  SHOWS,
  MASTER_CLASSES,
  EXTRAS,
  SERVICES,
  CAKES,
  ENTRY_TICKET_PRICE,
  PATIROOM_HOURLY_RATE,
} from "../data";
import { TopBar } from "../components/TopBar";
import { BottomBar } from "../components/BottomBar";
import { formatPrice, Pill } from "../components/UI";

interface Line {
  label: string;
  detail?: string;
  price: number;
  isFree?: boolean;
}

export function ScreenSummary() {
  const { state, setScreen, totalPrice, isWeekendBooking, basePrice, reset } = useV3();
  const [submitted, setSubmitted] = useState(false);
  const isIndividual = state.packageId === "individual";

  const pkg = useMemo(
    () => (state.packageId && state.packageId !== "individual" ? PACKAGES.find((p) => p.id === state.packageId) : null),
    [state.packageId],
  );

  const lines: Line[] = useMemo(() => {
    const out: Line[] = [];

    if (isIndividual) {
      out.push({
        label: "Безлимитные билеты",
        detail: `${formatPrice(ENTRY_TICKET_PRICE)} × ${state.childrenCount} детей`,
        price: state.childrenCount * ENTRY_TICKET_PRICE,
      });
      out.push({
        label: "Аренда патирума",
        detail: `${state.individualPatiroomHours} ч × ${formatPrice(PATIROOM_HOURLY_RATE)}`,
        price: state.individualPatiroomHours * PATIROOM_HOURLY_RATE,
      });
    } else if (pkg) {
      out.push({
        label: `Пакет «${pkg.name}»`,
        detail: `${pkg.features.length} услуг включено · ${isWeekendBooking ? "выходной" : "будни"}`,
        price: basePrice,
      });
    }

    // hero / quest
    if (state.animatorId) {
      const a = ANIMATORS.find((x) => x.id === state.animatorId);
      if (a) out.push({ label: `Аниматор «${a.name}»`, isFree: !isIndividual, price: 0 });
    } else if (state.questId) {
      const q = QUESTS.find((x) => x.id === state.questId);
      if (q) out.push({ label: `Квест «${q.name}»`, isFree: !isIndividual, price: 0 });
    }

    // included MC
    if (state.includedMasterClassId) {
      const m = MASTER_CLASSES.find((x) => x.id === state.includedMasterClassId);
      if (m) out.push({ label: `Мастер-класс «${m.name}»`, isFree: true, price: 0 });
    }
    // included show
    if (state.includedShowId) {
      const s = SHOWS.find((x) => x.id === state.includedShowId);
      if (s) out.push({ label: `Шоу «${s.name}»`, isFree: true, price: 0 });
    }

    // Extras: paid shows
    for (const id of state.extraShowIds) {
      const s = SHOWS.find((x) => x.id === id);
      if (!s) continue;
      const price =
        state.packageId === "exclusive" ? s.exclusiveSurcharge : s.basePrice;
      out.push({ label: `Шоу «${s.name}»`, detail: state.packageId === "exclusive" && s.exclusiveSurcharge === 0 ? "Включено" : "Дополнительно", price });
    }
    for (const id of state.extraMasterClassIds) {
      const m = MASTER_CLASSES.find((x) => x.id === id);
      if (!m) continue;
      out.push({ label: `Мастер-класс «${m.name}»`, detail: "Дополнительно", price: m.basePrice });
    }
    for (const id of state.extraIds) {
      const e = EXTRAS.find((x) => x.id === id);
      if (!e) continue;
      out.push({ label: e.name, detail: e.duration, price: e.price });
    }
    for (const id of state.serviceIds) {
      const s = SERVICES.find((x) => x.id === id);
      if (!s) continue;
      out.push({ label: s.name, detail: s.meta, price: s.price });
    }
    if (state.cakeId) {
      const c = CAKES.find((x) => x.id === state.cakeId);
      if (c) out.push({ label: c.name, detail: c.description, price: c.price });
    }

    return out;
  }, [state, pkg, basePrice, isWeekendBooking, isIndividual]);

  const dateLabel = state.date
    ? format(state.date, "EEEE, d MMMM", { locale: ru })
    : "";

  const tint = pkg ? PACKAGE_TINTS[pkg.id] : PACKAGE_TINTS.individual;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: v3.bg }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="rounded-[32px] p-7 max-w-sm w-full text-center"
          style={{
            background: `linear-gradient(165deg, ${v3.lavender}, white 60%)`,
            boxShadow: v3.shadow,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{ background: `linear-gradient(135deg, ${v3.purpleDeep}, ${v3.purpleSoft})` }}
          >
            <Sparkles className="w-9 h-9 text-white" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-[24px] font-extrabold mb-2" style={{ color: v3.purpleDeep }}>
            Заявка отправлена!
          </h2>
          <p className="text-[14px] leading-snug mb-5" style={{ color: v3.inkSoft }}>
            Менеджер Hello Park свяжется с вами в&nbsp;ближайшее время, чтобы подтвердить детали.
          </p>
          <div
            className="rounded-2xl px-4 py-3 mb-5 text-left"
            style={{ background: "white", boxShadow: v3.shadowSoft }}
          >
            <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: v3.inkSoft }}>
              Детали брони
            </div>
            <div className="text-[14px] font-bold mt-1" style={{ color: v3.ink }}>
              {dateLabel} · {state.time}
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: v3.inkSoft }}>
              {state.childrenCount} детей · {pkg ? pkg.name : "свой набор"}
            </div>
            <div className="text-[18px] font-extrabold mt-2 tabular-nums" style={{ color: v3.orange }}>
              {formatPrice(totalPrice)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              setSubmitted(false);
            }}
            className="w-full py-3.5 rounded-full font-bold text-white"
            style={{ background: v3.orange, boxShadow: v3.shadowCta }}
          >
            Собрать новый праздник
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: v3.bg }}>
      <TopBar
        onBack={() => setScreen(isIndividual ? "individual" : "customize")}
        title="Ваш праздник"
        subtitle={dateLabel}
      />

      {/* Hero summary */}
      <div className="max-w-lg mx-auto px-3 pt-3">
        <div className="rounded-[28px] p-5 relative overflow-hidden" style={{ background: tint.fill }}>
          <span className="absolute top-3 right-3 text-2xl">🎉</span>
          <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: tint.ink, opacity: 0.7 }}>
            {pkg ? `Пакет ${pkg.name}` : "Свой набор"}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h1 className="text-[26px] font-extrabold leading-tight" style={{ color: tint.ink }}>
              {dateLabel}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Pill bg="white" color={tint.ink}>
              {state.time}
            </Pill>
            <Pill bg="white" color={tint.ink}>
              {state.childrenCount} детей
            </Pill>
            {pkg?.badge === "hit" && (
              <Pill bg={v3.greenTag} color={v3.greenTagText}>ХИТ</Pill>
            )}
          </div>
        </div>
      </div>

      {/* Lines */}
      <div className="max-w-lg mx-auto px-3 pt-4 space-y-2">
        <h3 className="px-2 text-[14px] font-extrabold uppercase tracking-wide" style={{ color: v3.inkSoft }}>
          Что входит
        </h3>
        {lines.map((l, i) => (
          <div
            key={i}
            className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{ background: "white", border: "1.5px solid #EFEAFA" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0"
              style={{ background: l.isFree ? v3.greenTag : v3.lavender }}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: l.isFree ? v3.greenTagText : v3.purpleDeep }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold leading-tight" style={{ color: v3.ink }}>
                {l.label}
              </div>
              {l.detail && (
                <div className="text-[12px] mt-0.5" style={{ color: v3.inkSoft }}>
                  {l.detail}
                </div>
              )}
            </div>
            <div
              className="text-[14px] font-extrabold tabular-nums whitespace-nowrap"
              style={{ color: l.isFree || l.price === 0 ? v3.greenTagText : v3.purpleDeep }}
            >
              {l.isFree || l.price === 0 ? "Включено" : formatPrice(l.price)}
            </div>
          </div>
        ))}
      </div>

      {/* Total card */}
      <div className="max-w-lg mx-auto px-3 pt-4">
        <div
          className="rounded-[24px] px-5 py-4 flex items-center justify-between"
          style={{ background: v3.purpleDeep, color: "white", boxShadow: v3.shadow }}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide opacity-70">
              Итого
            </div>
            <div className="text-[26px] font-extrabold tabular-nums leading-none mt-1">
              {formatPrice(totalPrice)}
            </div>
          </div>
          <div className="text-right opacity-90 text-[12px] leading-tight max-w-[150px]">
            Финальную стоимость подтвердит менеджер при бронировании
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="max-w-lg mx-auto px-3 pt-3">
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: v3.cream }}>
          <span className="text-2xl shrink-0">📞</span>
          <p className="text-[12.5px] leading-snug" style={{ color: v3.ink }}>
            После брони с вами свяжется менеджер по телефону, чтобы согласовать
            тортик, аниматора и любые тонкости.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {!submitted && (
          <BottomBar
            label="Забронировать праздник"
            price={totalPrice}
            variant="purple"
            onClick={() => setSubmitted(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
