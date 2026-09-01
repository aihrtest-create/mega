import React from "react";
import { EmeraldStar3D, getPublicUrl } from "./SlideShows";

interface QuestCardData {
  id: string;
  title: string[];
  duration: string;
  age: string;
  image: string;
  hasStar?: boolean;
}

const DEFAULT_QUESTS: QuestCardData[] = [
  {
    id: "roblox",
    title: ["Квест", "Роблокс"],
    duration: "60 мин",
    age: "6-12 лет",
    image: "/assets/rocky-quest-1.webp",
  },
  {
    id: "minecraft",
    title: ["Квест", "Майнкрафт"],
    duration: "60 мин",
    age: "6-12 лет",
    image: "/assets/rocky-quest-2.webp",
  },
  {
    id: "harry",
    title: ["Гарри Поттер:", "Тайная комната"],
    duration: "60 мин",
    age: "7-14 лет",
    image: "/assets/rocky-quest-3.webp",
  },
  {
    id: "space",
    title: ["Космический", "квест Hello"],
    duration: "60 мин",
    age: "5-10 лет",
    image: "/assets/rocky-quest-4.webp",
    hasStar: true,
  },
];

export function SlideQuests({
  quests = DEFAULT_QUESTS,
  title = "Квесты и приключения",
  footerNote = "В каждый базовый пакет включен 1 квест на выбор",
}: {
  quests?: QuestCardData[];
  title?: string;
  footerNote?: string;
}) {
  return (
    <div
      className="relative w-full aspect-[16/9] bg-white text-[#101010] select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between px-[5.2%] pt-[4.2%] pb-[3.2%]">
        <div className="w-full flex items-start justify-between">
          <h1
            className="text-[#5822E5] font-black tracking-[-0.03em] leading-[1.05]"
            style={{
              fontSize: "clamp(28px, 4.3vw, 68px)",
              fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
              fontWeight: 900,
            }}
          >
            {title}
          </h1>
        </div>

        <div className="w-full grid grid-cols-4 gap-[2.4vw] my-auto items-start">
          {quests.map((quest) => {
            const resolvedImgSrc = getPublicUrl(quest.image);
            return (
              <div
                key={quest.id}
                className="flex flex-col items-center group transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/3.8] rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-visible bg-[#F0F0F5] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="w-full h-full rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-gray-100">
                    <img
                      src={resolvedImgSrc}
                      alt={quest.title.join(" ")}
                      className="w-full h-full object-cover object-center block"
                      loading="eager"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("/mega/")) {
                          target.src = `/mega${quest.image}`;
                        }
                      }}
                    />
                  </div>
                  {quest.hasStar && (
                    <div className="absolute -top-[1.2vw] -right-[1.2vw] w-[4vw] h-[4vw] min-w-[32px] min-h-[32px] max-w-[64px] max-h-[64px] z-10">
                      <EmeraldStar3D className="w-full h-full" />
                    </div>
                  )}
                </div>

                <div
                  className="mt-[1.4vw] mb-[0.9vw] text-center text-[#5822E5] font-extrabold tracking-[-0.02em] leading-[1.18] flex flex-col items-center justify-center min-h-[3.2vw]"
                  style={{
                    fontSize: "clamp(13px, 1.65vw, 26px)",
                    fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {quest.title.map((line, idx) => (
                    <span key={idx} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center">
                  <div
                    className="bg-[#FFC700] hover:bg-[#FFD000] text-black font-black rounded-full px-[1.8vw] py-[0.55vw] shadow-[0_2px_8px_rgba(255,199,0,0.35)] transition-transform duration-200 group-hover:scale-105 inline-flex items-center justify-center whitespace-nowrap cursor-default"
                    style={{
                      fontSize: "clamp(12px, 1.45vw, 24px)",
                      fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                      fontWeight: 900,
                    }}
                  >
                    {quest.duration}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex justify-end items-end pt-[0.8vw]">
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
