import React from "react";
import { getPublicUrl } from "./SlideShows";

interface ClassicQuestItem {
  id: string;
  name: string;
  genre: string;
  duration: string;
  age: string;
  image: string;
}

const CLASSIC_QUESTS: ClassicQuestItem[] = [
  {
    id: "fort",
    name: "Форт Боярд",
    genre: "Приключения & Испытания",
    duration: "60 мин",
    age: "6-14 лет",
    image: "/quests/fort.webp",
  },
  {
    id: "harry",
    name: "Гарри Поттер",
    genre: "Магия & Тайная комната",
    duration: "60 мин",
    age: "7-14 лет",
    image: "/quests/harry.webp",
  },
  {
    id: "squid",
    name: "Игра в кальмара",
    genre: "Хит-челленджи & Баттлы",
    duration: "60 мин",
    age: "8-14 лет",
    image: "/quests/squid.webp",
  },
  {
    id: "heroes",
    name: "Миссия Супергероев",
    genre: "Командный экшн",
    duration: "60 мин",
    age: "5-10 лет",
    image: "/quests/heroes.webp",
  },
];

export function SlideClassicQuests() {
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
                fontWeight: 900,
              }}
            >
              Классические квесты
            </h1>
          </div>
          <div className="bg-[#F0EDFF] text-[#5822E5] px-[1.2vw] py-[0.4vw] rounded-full text-[0.85vw] font-black">
            👥 2 ведущих • До 20 детей
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="w-full grid grid-cols-4 gap-[2.2vw] my-auto items-stretch h-[72%]">
          {CLASSIC_QUESTS.map((quest) => {
            const resolvedImg = getPublicUrl(quest.image);
            return (
              <div
                key={quest.id}
                className="relative rounded-[24px] sm:rounded-[30px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.08)] bg-gray-100 flex flex-col justify-end group transition-all duration-300 hover:scale-[1.02]"
              >
                <img
                  src={resolvedImg}
                  alt={quest.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("/mega/")) {
                      target.src = `/mega${quest.image}`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                <div className="relative z-10 p-[1.4vw] text-white text-left">
                  <span className="text-[#FFC700] font-black text-[0.7vw] uppercase tracking-wider block">
                    {quest.genre}
                  </span>
                  <h3
                    className="text-white font-black text-[1.4vw] leading-tight mt-[0.2vw]"
                    style={{ fontWeight: 800 }}
                  >
                    {quest.name}
                  </h3>
                  <div className="mt-[0.6vw] flex items-center gap-[0.4vw]">
                    <span className="bg-white/20 backdrop-blur-md text-white font-bold text-[0.7vw] px-[0.7vw] py-[0.2vw] rounded-full">
                      ⏱️ {quest.duration}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white font-bold text-[0.7vw] px-[0.7vw] py-[0.2vw] rounded-full">
                      🎯 {quest.age}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="w-full flex justify-end items-end pt-[0.4vw]">
          <p className="text-[#9E9EA7] font-medium text-[0.85vw] tracking-normal text-right">
            Также доступны квесты: Барби, Путешествие Сафари, Блогеры, Фортнайт и Суперагенты
          </p>
        </div>
      </div>
    </div>
  );
}
