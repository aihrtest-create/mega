import React from "react";
import { getPublicUrl } from "./SlideShows";

interface ActivityCard {
  id: string;
  name: string;
  price: string;
  desc: string;
  image: string;
}

const ACTIVITIES: ActivityCard[] = [
  {
    id: "pinata",
    name: "Пиньята с наполнением",
    price: "7 000 ₽",
    desc: "Яркая фигура с конфетами и подарками, которую именинник разбивает вместе с друзьями.",
    image: "/activities/pinata_new.webp",
  },
  {
    id: "surprise_balloon",
    name: "Шар-сюрприз",
    price: "4 000 ₽",
    desc: "Огромный шар под потолком, взрывающийся сотнями маленьких шариков и конфетти!",
    image: "/activities/red_balloon.webp",
  },
  {
    id: "mini_disco",
    name: "Мини-дискотека",
    price: "6 000 ₽",
    desc: "Зажигательные танцы, любимые треки и интерактивные баттлы с ведущим.",
    image: "/activities/mini_disco.webp",
  },
  {
    id: "trash_box",
    name: "Треш-коробка",
    price: "7 000 ₽",
    desc: "Челлендж «Что внутри?»: дети на ощупь угадывают загадочные предметы и существ.",
    image: "/activities/trash_box.webp",
  },
];

export function SlideActivities() {
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
          <h1
            className="text-[#5822E5] font-black tracking-[-0.03em] leading-[1.05]"
            style={{
              fontSize: "clamp(28px, 4.2vw, 66px)",
              fontWeight: 900,
            }}
          >
            Дополнительные активности
          </h1>
        </div>

        {/* 4 Cards Grid */}
        <div className="w-full grid grid-cols-4 gap-[2.4vw] my-auto items-start">
          {ACTIVITIES.map((act) => {
            const resolvedImg = getPublicUrl(act.image);
            return (
              <div
                key={act.id}
                className="flex flex-col items-center group transition-all duration-300"
              >
                {/* Image Frame */}
                <div className="relative w-full aspect-[3/3.8] rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-[#F5F5FA] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={resolvedImg}
                    alt={act.name}
                    className="w-full h-full object-cover object-center block"
                    loading="eager"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("/mega/")) {
                        target.src = `/mega${act.image}`;
                      }
                    }}
                  />
                </div>

                {/* Title */}
                <div className="mt-[1.4vw] mb-[0.9vw] text-center text-[#5822E5] font-extrabold tracking-[-0.02em] leading-[1.18] flex flex-col items-center justify-center min-h-[3.2vw]">
                  <span
                    style={{
                      fontSize: "clamp(13px, 1.5vw, 24px)",
                      fontWeight: 800,
                    }}
                  >
                    {act.name}
                  </span>
                </div>

                {/* Yellow Price Badge */}
                <div className="flex justify-center">
                  <div
                    className="bg-[#FFC700] hover:bg-[#FFD000] text-black font-black rounded-full px-[1.8vw] py-[0.55vw] shadow-[0_2px_8px_rgba(255,199,0,0.35)] inline-flex items-center justify-center cursor-default"
                    style={{
                      fontSize: "clamp(12px, 1.45vw, 24px)",
                      fontWeight: 900,
                    }}
                  >
                    {act.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="w-full flex justify-end items-end pt-[0.4vw]">
          <p className="text-[#9E9EA7] font-medium text-[0.85vw] tracking-normal text-right">
            Шар-сюрприз или Пиньята уже включены в пакет «Эксклюзив»!
          </p>
        </div>
      </div>
    </div>
  );
}
