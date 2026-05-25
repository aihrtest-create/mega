import { useRef, useState, useEffect } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Feature segment types ─── */
type Segment =
  | { type: "text"; value: string }
  | { type: "pill"; value: string; color: "orange" | "purple" };

interface PackageDef {
  id: "basic" | "premium" | "exclusive" | "custom";
  helloName: string;
  helloNameStyle: "italic" | "normal";
  helloColor: string;
  accentColor: string;
  durationBadgeBg: string;
  weekdayPrice: number;
  weekendPrice: number | null;
  oldPrice: number | null;
  duration: string;
  weekdayOnly: boolean;
  badge: string | null;
  inheritsFrom: string | null;
  inheritColor: string;
  freeAdults: boolean;
  features: Segment[][];
}

/* ─── Package Data ─── */
const PACKAGES: PackageDef[] = [
  {
    id: "basic",
    helloName: "Fun",
    helloNameStyle: "italic",
    helloColor: "#FF6022",
    accentColor: "#FF6022",
    durationBadgeBg: "linear-gradient(135deg, #8B6CF6, #FF6022)",
    weekdayPrice: 24900,
    weekendPrice: null,
    oldPrice: 32900,
    duration: "3 часа",
    weekdayOnly: true,
    badge: null,
    inheritsFrom: null,
    inheritColor: "#6C4AED",
    freeAdults: true,
    features: [
      [{ type: "text", value: "Безлимитные билеты в парк — " }, { type: "pill", value: "8 шт.", color: "orange" }],
      [{ type: "text", value: "WOW-поздравление от Лиса Рокки" }],
      [{ type: "text", value: "Анимационная программа — " }, { type: "pill", value: "45 мин.", color: "purple" }],
      [{ type: "text", value: "Мини-дискотека — 15 мин." }],
      [{ type: "text", value: "Украшение шарами с гелием — 8 шт." }],
      [{ type: "text", value: "Подарок имениннику" }],
      [{ type: "text", value: "Электронные пригласительные" }],
    ],
  },
  {
    id: "premium",
    helloName: "Star",
    helloNameStyle: "italic",
    helloColor: "#FF6022",
    accentColor: "#FF6022",
    durationBadgeBg: "linear-gradient(135deg, #FF6022, #FF8A50)",
    weekdayPrice: 47900,
    weekendPrice: 57900,
    oldPrice: 59900,
    duration: "3 часа",
    weekdayOnly: false,
    badge: "ХИТ ПРОДАЖ",
    inheritsFrom: "Hello Fun",
    inheritColor: "#6C4AED",
    freeAdults: true,
    features: [
      [{ type: "text", value: "Мастер-класс на выбор — " }, { type: "pill", value: "30 мин.", color: "purple" }],
      [{ type: "text", value: "Дискотека / треш-коробка — " }, { type: "pill", value: "25 мин.", color: "purple" }],
      [{ type: "text", value: "Шары: гелий + фонтан из шаров" }],
      [{ type: "text", value: "Шар-сюрприз" }],
      [{ type: "text", value: "Детские обеды — " }, { type: "pill", value: "8 шт.", color: "orange" }],
    ],
  },
  {
    id: "exclusive",
    helloName: "VIP",
    helloNameStyle: "normal",
    helloColor: "#6C4AED",
    accentColor: "#6C4AED",
    durationBadgeBg: "linear-gradient(135deg, #6C4AED, #9B7BFF)",
    weekdayPrice: 79900,
    weekendPrice: 89900,
    oldPrice: 99900,
    duration: "4 часа",
    weekdayOnly: false,
    badge: null,
    inheritsFrom: "Hello Star",
    inheritColor: "#6C4AED",
    freeAdults: true,
    features: [
      [{ type: "text", value: "Шоу-программа на выбор — " }, { type: "pill", value: "30 мин.", color: "purple" }],
      [{ type: "text", value: "Фотограф — " }, { type: "pill", value: "2 часа", color: "purple" }],
      [{ type: "text", value: "Пиньята или Шар-цифра" }],
      [{ type: "text", value: "Подарки всем гостям" }],
    ],
  },
  {
    id: "custom",
    helloName: "Mix",
    helloNameStyle: "italic",
    helloColor: "#747474",
    accentColor: "#1A1A1A",
    durationBadgeBg: "linear-gradient(135deg, #3A3A3A, #747474)",
    weekdayPrice: 0,
    weekendPrice: 0,
    oldPrice: null,
    duration: "Любое",
    weekdayOnly: false,
    badge: null,
    inheritsFrom: null,
    inheritColor: "#747474",
    freeAdults: false,
    features: [
      [{ type: "text", value: "Выберите только то, что нужно" }],
      [{ type: "text", value: "Гибкое ценообразование" }],
      [{ type: "text", value: "Любые комбинации услуг" }],
      [{ type: "text", value: "Собери сам" }],
    ],
  },
];

const PILL_STYLES = {
  orange: { bg: "rgba(255, 96, 34, 0.14)", color: "#FF6022" },
  purple: { bg: "rgba(108, 74, 237, 0.14)", color: "#6C4AED" },
};

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

/* ─── Component ─── */
export function Step1FormatV2() {
  const { state, updateState } = useWizard();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelect = (id: PackageDef["id"]) => {
    if (state.packageType === id) return;

    const includeFood = id === "premium" || id === "exclusive";
    updateState({ 
      packageType: id, 
      includeFood,
      questType: null,
      patiroom: null,
      patiroomDetails: null,
      patiroomHours: 3,
      cafeZones: [],
      animators: [],
      premiumCostume: null,
      shows: [],
      masterClasses: [],
      customFood: {},
      cakeChoice: null,
      fillingChoice: null,
      cakeCustomText: "",
      hasReachedSummary: false,
      discoChoice: null,
      balloonChoice: null
    });
  };


  /* Scroll tracking */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.82;
      const gap = 16;
      const idx = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(Math.max(idx, 0), PACKAGES.length - 1));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = cardRefs.current[idx];
    if (!target) return;
    const containerRect = el.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const scrollLeft = el.scrollLeft + (targetRect.left - containerRect.left) - 20;
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="pb-6"
    >
      {/* Header */}
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎉</span>
          Выберите пакет
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          День рождения в Hello Park
        </p>
      </div>


      {/* Weekend note */}
      <AnimatePresence>
        {state.isWeekend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden px-4"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-700 text-xs">
                🌟 Пакет «Hello Fun» доступен только по будням. В выходные — «Hello Star» и «Hello VIP».
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mb-4 px-4">
        {PACKAGES.map((pkg, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              backgroundColor: i === activeIndex ? pkg.accentColor : "#D5D5D5",
            }}
          />
        ))}
      </div>

      {/* ─── Horizontal Scroll Cards ─── */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 px-5 pt-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {PACKAGES.map((pkg, i) => {
          const isSelected = state.packageType === pkg.id;
          const isDisabled = pkg.weekdayOnly && state.isWeekend;
          const isCustom = pkg.id === "custom";
          const displayPrice = state.isWeekend ? (pkg.weekendPrice ?? pkg.weekdayPrice) : pkg.weekdayPrice;

          return (
            <motion.div
              key={pkg.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isDisabled ? 0.4 : 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="snap-center shrink-0 relative"
              style={{ width: "82%" }}
            >
              {/* ── Duration Badge (tilted, overflows card) ── */}
              <div
                className="absolute -top-3 -right-2 z-10 text-white font-black px-6 py-3 rounded-2xl pointer-events-none select-none"
                style={{
                  background: pkg.durationBadgeBg,
                  transform: "rotate(6deg)",
                  fontSize: "20px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  letterSpacing: "-0.02em",
                }}
              >
                {pkg.duration}
              </div>

              {/* ── Card ── */}
              <div
                onClick={() => !isDisabled && handleSelect(pkg.id)}
                className={`rounded-[28px] bg-white transition-all duration-300 cursor-pointer overflow-hidden ${
                  isDisabled ? "opacity-40 pointer-events-none" : ""
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 8px 40px ${pkg.accentColor}25, 0 1px 6px rgba(0,0,0,0.06)`
                    : "0 4px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
                  outline: isSelected ? `2.5px solid ${pkg.accentColor}` : "none",
                  outlineOffset: "-2.5px",
                }}
              >
                <div className="px-7 pt-8 pb-7">

                  {/* ── Package name: Hello + Name ── */}
                  <div className="mb-8 pr-16">
                    <h2 className="text-[32px] leading-none font-black tracking-tight">
                      <span className="text-[#1A1A1A]">Hello </span>
                      <span
                        style={{
                          color: pkg.helloColor,
                          fontStyle: pkg.helloNameStyle === "italic" ? "italic" : "normal",
                        }}
                      >
                        {pkg.helloName}
                      </span>
                    </h2>
                  </div>

                  {/* Badge (e.g., ХИТ ПРОДАЖ) */}
                  {pkg.badge && (
                    <div className="mb-5 -mt-3">
                      <span
                        className="text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block"
                        style={{
                          background: pkg.durationBadgeBg,
                          transform: "rotate(-2deg)",
                        }}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* "Всё из ..." inheritance badge */}
                  {pkg.inheritsFrom && (
                    <div
                      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6"
                      style={{ background: "rgba(108, 74, 237, 0.1)" }}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#6C4AED]">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[13px] font-bold text-[#6C4AED]">
                        Всё из «{pkg.inheritsFrom}», плюс:
                      </span>
                    </div>
                  )}

                  {/* ── Features List ── */}
                  <div className="flex flex-col gap-5 mb-7">
                    {pkg.features.map((segments, fi) => (
                      <div key={fi} className="flex items-start gap-3.5">
                        {/* Bullet dot */}
                        <div
                          className="w-[10px] h-[10px] rounded-full shrink-0 mt-[7px]"
                          style={{ backgroundColor: pkg.accentColor }}
                        />
                        {/* Segments: text + pills */}
                        <span className="text-[16px] text-[#1A1A1A] leading-snug font-medium">
                          {segments.map((seg, si) => {
                            if (seg.type === "text") {
                              return <span key={si}>{seg.value}</span>;
                            }
                            const pillStyle = PILL_STYLES[seg.color];
                            return (
                              <span
                                key={si}
                                className="inline-flex items-center px-3 py-0.5 rounded-lg text-[14px] font-bold align-middle whitespace-nowrap"
                                style={{
                                  backgroundColor: pillStyle.bg,
                                  color: pillStyle.color,
                                }}
                              >
                                {seg.value}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ── Free adults pill (tilted) ── */}
                  {pkg.freeAdults && (
                    <div className="mb-6">
                      <span
                        className="inline-flex items-center text-white text-[15px] font-bold px-6 py-3 rounded-2xl"
                        style={{
                          background: "linear-gradient(135deg, #6C4AED, #9B7BFF)",
                          boxShadow: "0 4px 14px rgba(108, 74, 237, 0.3)",
                          transform: "rotate(-2deg)",
                          display: "inline-block",
                        }}
                      >
                        Взрослым вход бесплатный
                      </span>
                    </div>
                  )}

                  {/* ── Price Section ── */}
                  <div className="text-center pt-1">
                    {/* Old price */}
                    {!isCustom && pkg.oldPrice && (
                      <div className="text-[#ABABAB] text-[16px] line-through mb-1 italic">
                        {formatPrice(pkg.oldPrice)} ₽
                      </div>
                    )}

                    {/* Current price */}
                    {isCustom ? (
                      <div className="text-[18px] font-bold text-[#747474]">
                        Вы сами формируете стоимость
                      </div>
                    ) : (
                      <div
                        className="text-[32px] font-black"
                        style={{ color: pkg.accentColor }}
                      >
                        {formatPrice(displayPrice)} ₽
                      </div>
                    )}

                    {/* Weekend price note */}
                    {!isCustom && pkg.weekendPrice && !state.isWeekend && (
                      <div className="text-[12px] text-[#ABABAB] mt-1">
                        {formatPrice(pkg.weekendPrice)} ₽ в выходные
                      </div>
                    )}
                  </div>

                  {/* ── CTA Button ── */}
                  <div className="mt-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) handleSelect(pkg.id);
                      }}
                      className="w-full py-4 rounded-2xl text-white text-[16px] font-bold transition-all duration-200 active:scale-[0.97]"
                      style={{
                        background: isSelected
                          ? pkg.accentColor
                          : `linear-gradient(135deg, ${pkg.accentColor}, ${pkg.accentColor}CC)`,
                        boxShadow: `0 6px 24px ${pkg.accentColor}35`,
                      }}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" />
                          Выбрано
                        </span>
                      ) : (
                        "Выбрать пакет"
                      )}
                    </button>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: pkg.accentColor,
                        boxShadow: `0 3px 10px ${pkg.accentColor}40`,
                      }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center gap-4 mt-1 px-4">
        <button
          onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full border-[1.5px] border-[#E5E5E5] bg-white flex items-center justify-center transition-all hover:border-[#ABABAB] disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-[#3A3A3A]" />
        </button>
        <button
          onClick={() => scrollToCard(Math.min(PACKAGES.length - 1, activeIndex + 1))}
          disabled={activeIndex === PACKAGES.length - 1}
          className="w-10 h-10 rounded-full border-[1.5px] border-[#E5E5E5] bg-white flex items-center justify-center transition-all hover:border-[#ABABAB] disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-[#3A3A3A]" />
        </button>
      </div>
    </motion.div>
  );
}
