import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Moon, Sun } from "lucide-react";
import { MEGA_ROOM_DETAILS } from "../data/megaConfig";

/* ─── Package Data ─── */
const PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    weekdayOnly: true,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 2,5 часа",
      "Квест на выбор — 60 мин.",
      "Мини-дискотека — 15 мин.",
      "Оформление шарами — 8 шт.",
      "WOW-поздравление Лиса Рокки",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 24900,
    weekendPrice: null,
    oldPrice: 32900,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "3 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 3 часа",
      "Квест на выбор — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Дискотека или треш-коробка — 25 мин.",
      "Оформление: шары + фонтан",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз",
      "Детские обеды",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 47900,
    weekendPrice: 57900,
    oldPrice: 63990,
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "4 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 4 часа",
      "Квест на выбор — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Дискотека или треш-коробка — 25 мин.",
      "Шоу-программа на выбор — 30 мин.",
      "Фотограф — 2 часа",
      "Оформление: шары + 2 фонтана",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз или Пиньята",
      "Шар-цифра",
      "Подарки всем гостям",
      "Детские обеды",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 79900,
    weekendPrice: 89900,
    oldPrice: 105990,
  }
];

const MEGA_PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Интерактивная комната — 2,5 часа",
      "Квест или анимационная программа — 45 мин.",
      "Мини-диско — 10 мин.",
      "Интерактивный вынос торта — 5 мин.",
      "Праздничное украшение и сервировка",
      "Именное поздравление от Лиса Рокки",
      "Стилизованные пригласительные",
      "Подарок имениннику",
    ],
    weekdayPrice: 24900,
    weekendPrice: 34900,
    oldPrice: null,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "2,5 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Интерактивная комната — 2,5 часа",
      "Квест или анимационная программа — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Треш-коробка или диско — 25 мин.",
      "Шар-сюрприз",
      "Интерактивный вынос торта — 5 мин.",
      "Праздничное украшение и сервировка",
      "Супер-подарок имениннику",
      "Стилизованные пригласительные",
    ],
    weekdayPrice: 39900,
    weekendPrice: 49900,
    oldPrice: null,
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "3 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Интерактивная комната — 3 часа",
      "Квест или анимационная программа — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Треш-коробка или диско — 25 мин.",
      "Шар-сюрприз или Пиньята",
      "Шоу-программа на выбор — 30 мин.",
      "Интерактивный вынос торта — 5 мин.",
      "Подарки всем гостям",
      "Супер-подарок имениннику",
    ],
    weekdayPrice: 65900,
    weekendPrice: 69900,
    oldPrice: null,
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

export function Step1Format() {
  const { state, updateState, isMega } = useWizard();
  const packages = isMega ? MEGA_PACKAGES : PACKAGES;

  const handleSelect = (id: typeof PACKAGES[number]["id"] | "custom") => {
    if (state.packageType === id) return;

    const includeFood = !isMega && (id === "premium" || id === "exclusive");
    const megaRoom = isMega && id !== "custom" ? MEGA_ROOM_DETAILS[id] : null;
    updateState({ 
      packageType: id, 
      includeFood,
      questType: null,
      patiroom: megaRoom ? "mega_room" : null,
      patiroomDetails: megaRoom?.label || null,
      patiroomHours: megaRoom?.hours || 3,
      cafeZones: [],
      animators: [],
      premiumCostume: null,
      shows: [],
      masterClasses: [],
      customFood: {},
      megaOwnCatering: false,
      megaFood: {},
      cakeChoice: null,
      fillingChoice: null,
      cakeCustomText: "",
      hasReachedSummary: false,
      discoChoice: null,
      balloonChoice: null
    });
  };


  const renderFeature = (text: string) => {
    // Dynamically look for " — " to extract values into highlighted pills
    if (text.includes(" — ")) {
      const parts = text.split(" — ");
      const value = parts.pop()!;
      const label = parts.join(" — ");
      
      // Determine pill color: orange for counts (шт), purple for times (мин/часа)
      const isOrange = value.includes("шт") || value.includes("шт.");
      const pillBgColor = isOrange ? "#ff6022" : "#5b21cc";
      
      return (
        <span className="font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {label} —{" "}
          <span 
            className="text-white font-bold px-[10px] py-[2px] rounded-[13px] ml-[4px] leading-none inline-flex items-center" 
            style={{ backgroundColor: pillBgColor, height: '24px' }}
          >
            {value}
          </span>
        </span>
      );
    }

    // For plain features like "Шар-сюрприз"
    return (
      <span className="font-medium text-[#101011] text-[16px] leading-[22.4px]">
        {text}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-16"
    >
      {/* Header */}
      <div className="text-center mb-8 px-4 pt-2">
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎉</span>
          Выберите пакет
        </h1>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          {isMega ? "День рождения в Hello Park МЕГА" : "День рождения в Hello Park"}
        </p>
      </div>


      {/* Weekend note */}
      <AnimatePresence>
        {state.isWeekend && !isMega && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-700 text-xs">
                🌟 Пакет «Hello Fun» доступен только по будням.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package cards */}
      <div className="flex flex-col gap-[36px] mt-4">
        {packages.map((pkg, i) => {
          const isSelected = state.packageType === pkg.id;
          const isDisabled = pkg.weekdayOnly && state.isWeekend;
          const displayPrice = state.isWeekend ? (pkg.weekendPrice ?? pkg.weekdayPrice) : pkg.weekdayPrice;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isDisabled ? 0.45 : 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative pr-1"
            >
              {/* Duration Badge (Top Right Rotated) - Adjusted for clipping */}
              <div className="absolute right-0 top-[-16px] rotate-[-5deg] z-20 flex items-center justify-center pointer-events-none origin-bottom-right">
                <div 
                  className="px-[24px] rounded-[15px] flex items-center justify-center min-w-[110px] shadow-md h-[46px] bg-[#5b21cc]"
                >
                  <span className="font-black text-white text-[24px] tracking-[-0.5px] leading-none mt-[-2px]">
                    {pkg.duration}
                  </span>
                </div>
              </div>

              <div
                onClick={() => !isDisabled && handleSelect(pkg.id)}
                className={`bg-white rounded-[24px] w-full relative transition-all duration-300 cursor-pointer ${
                  isDisabled ? "pointer-events-none" : "hover:shadow-md"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 12px 40px ${pkg.borderColor}30, 0 4px 12px rgba(0,0,0,0.05)`
                    : "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Border effect based on selection */}
                <div 
                  className="absolute inset-0 rounded-[24px] pointer-events-none transition-all duration-300"
                  style={{ 
                    border: `2.5px solid ${isSelected ? pkg.borderColor : '#E5E5E5'}`,
                  }}
                />

                <div className="flex flex-col px-[24px] pt-[28px] pb-[28px] relative z-0">
                  {/* Header */}
                  <div className="mb-[24px] pr-[100px]">
                    <h2 className="text-[32px] tracking-[-0.5px] leading-[1]">
                      <span className="font-black text-[#101011]">{pkg.emoji} </span>
                      <span className="font-black" style={{ color: pkg.nameColor }}>{pkg.name}</span>
                    </h2>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-[12px] mb-[24px]">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex gap-[12px] items-start relative">
                        <div 
                          className="rounded-full size-[8px] mt-[8px] shrink-0 bg-[#ff6022]" 
                        />
                        {renderFeature(feature)}
                      </div>
                    ))}
                  </div>

                  {/* Purple 'Free Entry for Adults' Badge */}
                  <div className="mb-[36px] ml-[-4px]">
                    <div className="bg-[#5b21cc] rounded-[13px] inline-flex items-center justify-center px-[20px] py-[6px] shadow-sm">
                      <span className="font-semibold text-white text-[15px]">
                        Взрослым вход бесплатный
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-center gap-[2px] mb-[20px]">
                    {pkg.oldPrice && (
                      <p className="text-[#999490] text-[16px] line-through font-semibold leading-none">
                        {formatPrice(pkg.oldPrice)} ₽
                      </p>
                    )}
                    <p className="text-[#ff6022] text-[32px] tracking-[-0.5px] font-black leading-none mt-[4px]">
                      {formatPrice(displayPrice)} ₽
                    </p>
                    {pkg.weekendPrice && !state.isWeekend && (
                      <span className="text-xs text-[#ABABAB] mt-2">
                        {formatPrice(pkg.weekendPrice)} ₽ в выходные
                      </span>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) handleSelect(pkg.id);
                    }}
                    className="w-full mt-[4px] py-[16px] rounded-full active:scale-[0.97] transition-all duration-300"
                    style={{
                      backgroundColor: isSelected ? pkg.borderColor : '#ff6022',
                      boxShadow: isSelected ? `0 6px 20px ${pkg.borderColor}40` : 'none'
                    }}
                  >
                    <span className="text-white text-[17px] flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
                      {isSelected ? (
                        <>
                          <Check className="w-5 h-5" />
                          Выбрано
                        </>
                      ) : (
                        "Выбрать пакет"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Custom Package - Expressive large card */}
        {!isMega && <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            onClick={() => handleSelect("custom")}
            className="relative rounded-[28px] p-[3px] cursor-pointer active:scale-[0.98] transition-all overflow-hidden"
          >
            {/* Border based on selection */}
            <div 
              className={`absolute inset-0 rounded-[28px] transition-all duration-500 ${
                state.packageType === "custom" 
                  ? "bg-[#ff6022] opacity-100" 
                  : "bg-[#E5E5E5] opacity-80"
              }`}
              style={state.packageType === "custom" ? { boxShadow: '0 0 32px rgba(255,96,34,0.4)' } : {}}
            />
            
            {/* Inner card */}
            <div className={`relative rounded-[26px] px-6 py-7 transition-colors ${
                state.packageType === "custom" ? "bg-white/95" : "bg-white hover:bg-gray-50/80"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-[64px] h-[64px] rounded-2xl bg-[#ff6022]/10 flex items-center justify-center">
                    <span className="text-[40px]">🧩</span>
                  </div>
                  <div>
                    <div className={`font-black text-[28px] leading-tight tracking-[-0.5px] ${
                      state.packageType === "custom" 
                        ? "text-[#ff6022]" 
                        : "text-[#1A1A1A]"
                    }`}>
                      Собери сам
                    </div>
                    <div className="text-[14px] text-[#747474] font-medium mt-1">
                      Создай уникальный праздник
                    </div>
                  </div>
                </div>
                {state.packageType === "custom" && (
                  <div className="w-[40px] h-[40px] rounded-full bg-[#ff6022] flex items-center justify-center text-white shadow-lg shrink-0 mt-1">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Любой квест", "Любые герои", "Только нужные опции"].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-lg px-3 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6022]" />
                    <span className="text-[12px] font-medium text-[#3A3A3A]">{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className={`w-full py-3.5 rounded-2xl text-center font-bold text-[16px] transition-all ${
                state.packageType === "custom"
                  ? "bg-[#ff6022] text-white shadow-lg shadow-[#ff6022]/25"
                  : "bg-[#ff6022] text-white"
              }`}>
                {state.packageType === "custom" ? "✓ Выбрано" : "Выбрать →"}
              </div>
            </div>
          </div>
        </motion.div>}

      </div>
    </motion.div>
  );
}
