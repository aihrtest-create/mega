import React, { useMemo, useRef } from "react";
import { motion } from "motion/react";
import { addDays, format, isSameDay, isWeekend, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useV3 } from "../state";
import { v3 } from "../theme";
import { TIME_SLOTS } from "../data";
import { Stepper, formatPrice } from "../components/UI";
import { BottomBar } from "../components/BottomBar";

const DAYS_AHEAD = 60;

export function ScreenDateTime() {
  const { state, update, setScreen, isWeekendBooking } = useV3();
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i));
  }, []);

  const ready = !!state.date && !!state.time;

  return (
    <div className="min-h-screen pb-32" style={{ background: v3.bg }}>
      {/* Hero — branded header reminiscent of PDF cover */}
      <div
        className="relative overflow-hidden pb-7"
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, ${v3.orangeBright} 0%, ${v3.orange} 65%, #FF7A1F 100%)`,
        }}
      >
        {/* decorative stars from PDF */}
        <span className="absolute top-6 right-6 text-2xl rotate-12">✨</span>
        <span className="absolute top-16 right-16 text-lg -rotate-12 opacity-80">⚡</span>
        <span className="absolute top-12 left-6 text-xl opacity-70">⭐</span>

        <div className="max-w-lg mx-auto px-5 pt-7">
          <div className="flex items-center gap-2 mb-5">
            <div
              className="px-3 py-1.5 rounded-[10px] text-white font-extrabold"
              style={{ background: "rgba(0,0,0,0.10)", letterSpacing: 0.3 }}
            >
              hello <span className="opacity-90">park</span>
            </div>
          </div>
          <h1 className="text-white font-extrabold leading-[0.95] text-[34px] tracking-tight">
            Ваш праздник
            <br />
            <span style={{ color: v3.purpleDeep }}>в Парке будущего</span>
          </h1>
          <p className="text-white/95 mt-3 text-[14px] leading-snug max-w-[280px]">
            Выберите дату, время и количество детей — соберём для вас идеальный день рождения.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto -mt-4 relative z-10">
        {/* Date picker card */}
        <div
          className="mx-3 rounded-[28px] p-4"
          style={{ background: v3.bg, boxShadow: v3.shadow }}
        >
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h2 className="text-[18px] font-extrabold" style={{ color: v3.purpleDeep }}>
              Когда отмечаем?
            </h2>
            {state.date && (
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: isWeekendBooking ? v3.pinkHit : v3.purpleDeep,
                  background: isWeekendBooking ? "#FFE0EA" : v3.lavender,
                }}
              >
                {isWeekendBooking ? "выходной" : "будний"}
              </span>
            )}
          </div>

          {/* Horizontal day strip */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {days.map((d) => {
              const selected = state.date && isSameDay(state.date, d);
              const we = isWeekend(d);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => update({ date: d })}
                  className="shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95"
                  style={{
                    width: 56,
                    height: 76,
                    background: selected ? v3.purpleDeep : "white",
                    color: selected ? "white" : v3.ink,
                    border: selected ? "none" : "1.5px solid #EFEAFA",
                    scrollSnapAlign: "start",
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide leading-none"
                    style={{
                      color: selected ? "rgba(255,255,255,0.9)" : we ? v3.pinkHit : v3.inkSoft,
                    }}
                  >
                    {format(d, "EEE", { locale: ru })}
                  </span>
                  <span className="text-[20px] font-extrabold mt-1.5 leading-none">
                    {format(d, "d")}
                  </span>
                  <span
                    className="text-[10px] font-medium mt-1 leading-none"
                    style={{ color: selected ? "rgba(255,255,255,0.85)" : v3.inkSoft }}
                  >
                    {format(d, "LLL", { locale: ru })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="mx-3 mt-3 rounded-[28px] p-4" style={{ background: v3.bg, boxShadow: v3.shadowSoft }}>
          <h2 className="text-[18px] font-extrabold mb-3 px-1" style={{ color: v3.purpleDeep }}>
            Во сколько?
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((t) => {
              const selected = state.time === t;
              return (
                <button
                  key={t}
                  onClick={() => update({ time: t })}
                  className="rounded-2xl py-3 text-[15px] font-extrabold transition-all active:scale-95"
                  style={{
                    background: selected ? v3.purpleDeep : v3.lavender,
                    color: selected ? "white" : v3.purpleDeep,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Children count */}
        <div className="mx-3 mt-3 rounded-[28px] p-4 flex items-center justify-between" style={{ background: v3.bg, boxShadow: v3.shadowSoft }}>
          <div>
            <div className="text-[16px] font-extrabold" style={{ color: v3.purpleDeep }}>
              Сколько детей?
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: v3.inkSoft }}>
              Программы рассчитаны на 8 детей
            </div>
          </div>
          <Stepper
            value={state.childrenCount}
            min={4}
            max={20}
            onDec={() => update({ childrenCount: Math.max(4, state.childrenCount - 1) })}
            onInc={() => update({ childrenCount: Math.min(20, state.childrenCount + 1) })}
          />
        </div>

        {/* Hint card */}
        <div className="mx-3 mt-4 rounded-2xl p-4 flex items-start gap-3" style={{ background: v3.cream }}>
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-[12.5px] leading-snug" style={{ color: v3.ink }}>
            Будний день — выгоднее. Цены пакетов для&nbsp;будней начинаются от&nbsp;
            <span className="font-extrabold" style={{ color: v3.orange }}>
              {formatPrice(24900)}
            </span>
            .
          </p>
        </div>
      </div>

      {ready && (
        <BottomBar
          label="Выбрать пакет"
          caption={`${format(state.date!, "d MMMM, EEEE", { locale: ru })} · ${state.time} · ${state.childrenCount} детей`}
          onClick={() => setScreen("package")}
        />
      )}
    </div>
  );
}

// re-export for the screen switcher
export default ScreenDateTime;

// Suppress unused `motion` if we ever drop the entry animation — keep import for parity
void motion;
