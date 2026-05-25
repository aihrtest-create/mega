import React from "react";
import { motion } from "motion/react";
import { Check, Sparkles, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useV3 } from "../state";
import { v3, PACKAGE_TINTS } from "../theme";
import { PACKAGES } from "../data";
import { Pill, formatPrice } from "../components/UI";
import { TopBar } from "../components/TopBar";

export function ScreenPackage() {
  const { state, update, setScreen, isWeekendBooking } = useV3();

  const handlePick = (pkg: "basic" | "premium" | "exclusive" | "individual") => {
    if (pkg === "individual") {
      update({ packageId: "individual" });
      setScreen("individual");
    } else {
      update({ packageId: pkg });
      setScreen("customize");
    }
  };

  const dateLabel = state.date
    ? `${format(state.date, "d MMMM", { locale: ru })} · ${state.time} · ${state.childrenCount} детей`
    : "";

  return (
    <div className="min-h-screen pb-20" style={{ background: v3.bg }}>
      <TopBar onBack={() => setScreen("datetime")} title="Выберите пакет" subtitle={dateLabel} />

      {/* Subtitle */}
      <div className="max-w-lg mx-auto px-5 pt-3 pb-4">
        <p className="text-[13.5px] leading-snug" style={{ color: v3.inkSoft }}>
          Готовый праздник с подарком — в каждом пакете уже всё, чтобы устроить
          незабываемый день рождения. Сверху можно добавить шоу, мастер-классы и торт.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-3 space-y-4">
        {PACKAGES.map((pkg, i) => {
          const tint = PACKAGE_TINTS[pkg.id];
          const price = isWeekendBooking ? pkg.weekendPrice : pkg.weekdayPrice;
          const altPrice = isWeekendBooking ? pkg.weekdayPrice : pkg.weekendPrice;
          return (
            <motion.button
              key={pkg.id}
              type="button"
              onClick={() => handlePick(pkg.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="block w-full text-left rounded-[28px] overflow-hidden active:scale-[0.99] transition-transform"
              style={{ background: tint.fill, boxShadow: v3.shadowSoft }}
            >
              {/* Header strip */}
              <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[24px] font-extrabold" style={{ color: tint.ink }}>
                      {pkg.name}
                    </h3>
                    {pkg.badge === "hit" && (
                      <Pill bg={v3.greenTag} color={v3.greenTagText}>
                        ХИТ ПРОДАЖ
                      </Pill>
                    )}
                  </div>
                  <p className="text-[13px] font-medium" style={{ color: tint.ink, opacity: 0.75 }}>
                    {pkg.tagline}
                  </p>
                </div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={3} style={{ color: tint.ink }} />
                </div>
              </div>

              {/* Features list — top 5 */}
              <div className="px-5 pb-3 space-y-1.5">
                {pkg.features.slice(0, 5).map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{ background: tint.chip }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </span>
                    <span className="text-[13px] leading-snug" style={{ color: tint.ink }}>
                      {f}
                    </span>
                  </div>
                ))}
                {pkg.features.length > 5 && (
                  <div className="text-[12px] font-bold pt-1" style={{ color: tint.ink, opacity: 0.7 }}>
                    + ещё {pkg.features.length - 5} {pkg.features.length - 5 > 4 ? "пунктов" : "пункта"}
                  </div>
                )}
              </div>

              {/* Price footer — bright pill */}
              <div
                className="mx-3 mb-3 rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.65)" }}
              >
                <span className="text-[12px] font-semibold" style={{ color: tint.ink, opacity: 0.7 }}>
                  {isWeekendBooking ? "Выходной" : "Будни"} · на 8 детей
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[22px] font-extrabold tabular-nums" style={{ color: tint.ink }}>
                    {formatPrice(price)}
                  </span>
                  <span className="text-[11px] font-medium line-through" style={{ color: tint.ink, opacity: 0.4 }}>
                    {isWeekendBooking ? "будни" : "вых."} {formatPrice(altPrice)}
                  </span>
                </span>
              </div>
            </motion.button>
          );
        })}

        {/* Individual */}
        <motion.button
          type="button"
          onClick={() => handlePick("individual")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="block w-full text-left rounded-[28px] p-5 active:scale-[0.99] transition-transform"
          style={{
            background: PACKAGE_TINTS.individual.fill,
            border: `1.5px dashed ${v3.purpleSoft}`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "white" }}
            >
              <Sparkles className="w-5 h-5" style={{ color: v3.purpleDeep }} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[20px] font-extrabold" style={{ color: v3.purpleDeep }}>
                  Свой набор
                </h3>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: v3.purpleDeep }} />
              </div>
              <p className="text-[13px] mt-1 leading-snug" style={{ color: v3.purpleDeep, opacity: 0.78 }}>
                Соберите праздник по-своему — отдельные билеты, патирум по часам,
                любые дополнительные услуги.
              </p>
            </div>
          </div>
        </motion.button>

        <div className="px-2 pt-3 pb-2 text-center">
          <p className="text-[11px]" style={{ color: v3.inkMuted }}>
            Программы рассчитаны на 8 детей. Подробности уточняйте у менеджера.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScreenPackage;
