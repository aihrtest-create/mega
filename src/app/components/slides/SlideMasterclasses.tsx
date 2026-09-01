import React from "react";
import { EmeraldStar3D, getPublicUrl } from "./SlideShows";

interface MasterClassCardData {
  id: string;
  title: string[];
  price: string;
  image: string;
  hasStar?: boolean;
}

const DEFAULT_MC: MasterClassCardData[] = [
  {
    id: "ebru",
    title: ["Рисование", "на воде Эбру"],
    price: "15 000₽",
    image: "/shows/soap.webp",
  },
  {
    id: "tshirts",
    title: ["Роспись", "футболок"],
    price: "15 000₽",
    image: "/shows/neon.webp",
  },
  {
    id: "soap",
    title: ["Мастер-класс", "Мыловарение"],
    price: "15 000₽",
    image: "/shows/science.webp",
  },
  {
    id: "icecream",
    title: ["Приготовление", "мороженого"],
    price: "15 000₽",
    image: "/shows/paper.webp",
    hasStar: true,
  },
];

export function SlideMasterclasses({
  classes = DEFAULT_MC,
  title = "Мастер-классы",
  footerNote = "Каждый участник забирает готовую работу с собой на память",
}: {
  classes?: MasterClassCardData[];
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
          {classes.map((item) => {
            const resolvedImgSrc = getPublicUrl(item.image);
            return (
              <div
                key={item.id}
                className="flex flex-col items-center group transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/3.8] rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-visible bg-[#F0F0F5] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="w-full h-full rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-gray-100">
                    <img
                      src={resolvedImgSrc}
                      alt={item.title.join(" ")}
                      className="w-full h-full object-cover object-center block"
                      loading="eager"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("/mega/")) {
                          target.src = `/mega${item.image}`;
                        }
                      }}
                    />
                  </div>
                  {item.hasStar && (
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
                  {item.title.map((line, idx) => (
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
                    {item.price}
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
