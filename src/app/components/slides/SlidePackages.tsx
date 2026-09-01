import React from "react";
import { EmeraldStar3D, getPublicUrl } from "./SlideShows";

interface PackageCardData {
  id: string;
  name: string;
  badge?: string;
  duration: string;
  weekdayPrice: string;
  weekendPrice?: string;
  color: string;
  accentBg: string;
  features: string[];
  image?: string;
  isHit?: boolean;
}

const DEFAULT_PACKAGES: PackageCardData[] = [
  {
    id: "basic",
    name: "Базовый",
    duration: "2,5 часа",
    weekdayPrice: "24 900 ₽",
    weekendPrice: "34 900 ₽",
    color: "#EF5299",
    accentBg: "from-[#EF5299]/10 to-[#EF5299]/5",
    image: "/presentation/11.webp",
    features: [
      "8 безлимитных входных билетов",
      "Фиджитал Патирум — 2,5 часа",
      "Ведущий или фиджитал-квест (40 мин.)",
      "Мини-дискотека (15 мин.)",
      "Оформление: шары + сервировка стола",
      "WOW-поздравление от Лиса Рокки",
      "Торжественный вынос торта",
      "Электронные пригласительные",
      "Подарок имениннику",
    ],
  },
  {
    id: "premium",
    name: "Премиум",
    badge: "ХИТ ПРОДАЖ",
    duration: "2,5 часа",
    weekdayPrice: "39 900 ₽",
    weekendPrice: "49 900 ₽",
    color: "#FF7F00",
    accentBg: "from-[#FF7F00]/15 to-[#FF7F00]/5",
    image: "/presentation/16.webp",
    isHit: true,
    features: [
      "8 безлимитных входных билетов",
      "Фиджитал Патирум — 2,5 часа",
      "Ведущий или фиджитал-квест на выбор",
      "⭐ Мастер-класс на выбор (30 мин.)",
      "⭐ Треш-коробка или дискотека (20 мин.)",
      "⭐ Шар-сюрприз с наполнением",
      "Оформление: шары + сервировка",
      "WOW-поздравление от Лиса Рокки",
      "Вынос торта и пригласительные",
      "Супер-подарок имениннику",
    ],
  },
  {
    id: "exclusive",
    name: "Эксклюзив",
    badge: "ВСЁ ВКЛЮЧЕНО",
    duration: "3 часа",
    weekdayPrice: "65 900 ₽",
    weekendPrice: "69 900 ₽",
    color: "#5822E5",
    accentBg: "from-[#5822E5]/15 to-[#5822E5]/5",
    image: "/presentation/21.webp",
    features: [
      "8 безлимитных входных билетов",
      "Фиджитал Патирум — 3 часа",
      "Ведущий или фиджитал-квест на выбор",
      "✨ Шоу-программа на выбор (30 мин.)",
      "✨ Мастер-класс на выбор (30 мин.)",
      "✨ Дискотека или треш-коробка (20 мин.)",
      "✨ Шар-сюрприз или Пиньята",
      "✨ Подарки всем гостям праздника",
      "Оформление: шары + сервировка",
      "Супер-подарок имениннику",
    ],
  },
];

export function SlidePackages({
  title = "Пакеты праздника",
  packages = DEFAULT_PACKAGES,
  footerNote = "Все пакеты рассчитаны на компанию из 8 детей. Взрослые гости — бесплатно!",
}: {
  title?: string;
  packages?: PackageCardData[];
  footerNote?: string;
}) {
  return (
    <div
      className="relative w-full aspect-[16/9] bg-white text-[#101010] select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between px-[5.2%] pt-[3.8%] pb-[3.2%]">
        {/* Header */}
        <div className="w-full flex items-start justify-between">
          <div>
            <h1
              className="text-[#5822E5] font-black tracking-[-0.03em] leading-[1.05]"
              style={{
                fontSize: "clamp(28px, 4.2vw, 66px)",
                fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                fontWeight: 900,
              }}
            >
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-[0.8vw] bg-[#F5F5FA] px-[1.2vw] py-[0.4vw] rounded-full text-[0.85vw] font-extrabold text-[#5822E5]">
            <span>🎈 Hello Park Мега Теплый Стан</span>
          </div>
        </div>

        {/* 3 Package Cards */}
        <div className="w-full grid grid-cols-3 gap-[2vw] my-auto items-stretch h-[74%]">
          {packages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative rounded-[22px] sm:rounded-[28px] md:rounded-[34px] p-[1.6vw] flex flex-col justify-between transition-all duration-300 border ${
                  pkg.isHit
                    ? "border-[#FF7F00] shadow-[0_16px_40px_rgba(255,127,0,0.18)] bg-gradient-to-b from-[#FFF9F2] to-white scale-[1.02] z-10"
                    : "border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white"
                }`}
              >
                {/* Hit Badge */}
                {pkg.badge && (
                  <div className="absolute -top-[0.8vw] right-[1.4vw] z-10">
                    <span
                      className="text-white font-black text-[0.7vw] px-[0.9vw] py-[0.3vw] rounded-full uppercase tracking-wider shadow-md"
                      style={{ backgroundColor: pkg.color }}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Top: Name & Duration */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-black tracking-[-0.02em] leading-none"
                      style={{
                        color: pkg.color,
                        fontSize: "clamp(18px, 2.2vw, 36px)",
                        fontWeight: 900,
                      }}
                    >
                      {pkg.name}
                    </h3>
                    <span className="bg-gray-100 text-gray-700 font-extrabold text-[0.75vw] px-[0.8vw] py-[0.3vw] rounded-full">
                      ⏱️ {pkg.duration}
                    </span>
                  </div>

                  {/* Pricing Badge */}
                  <div className="mt-[0.8vw] mb-[1vw] flex items-baseline gap-[0.6vw]">
                    <span
                      className="text-black font-black leading-none"
                      style={{
                        fontSize: "clamp(16px, 1.8vw, 30px)",
                        fontWeight: 900,
                      }}
                    >
                      {pkg.weekdayPrice}
                    </span>
                    {pkg.weekendPrice && (
                      <span className="text-gray-400 font-bold text-[0.8vw]">
                        / вых {pkg.weekendPrice}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-100 mb-[0.9vw]" />

                  {/* Features List */}
                  <ul className="space-y-[0.35vw] text-left">
                    {pkg.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-[0.4vw] text-[#101010] font-medium leading-[1.25]"
                        style={{ fontSize: "clamp(9px, 0.8vw, 13.5px)" }}
                      >
                        <span className="text-[#00C853] font-black text-[0.8vw]">✓</span>
                        <span className={feat.startsWith("✨") || feat.startsWith("⭐") ? "font-bold text-[#5822E5]" : ""}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Pill */}
                <div className="mt-[1vw] pt-[0.6vw] border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[0.7vw] font-extrabold text-gray-400 uppercase tracking-wider">
                    8 детей включено
                  </span>
                  <div
                    className="w-[1.8vw] h-[1.8vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-black"
                    style={{ backgroundColor: pkg.color }}
                  >
                    →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="w-full flex justify-end items-end pt-[0.4vw]">
          <p
            className="text-[#9E9EA7] font-medium tracking-normal text-right leading-none select-text"
            style={{
              fontSize: "clamp(9px, 0.95vw, 15px)",
              fontFamily: "'Cy Grotesk', 'Gilroy', 'Onest', sans-serif",
            }}
          >
            {footerNote}
          </p>
        </div>
      </div>
    </div>
  );
}
