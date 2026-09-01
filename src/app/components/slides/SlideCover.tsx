import React from "react";
import { getPublicUrl } from "./SlideShows";

export function SlideCover({
  title = "День рождения будущего!",
  subtitle = "ИНТЕРАКТИВНЫЙ МУЛЬТИМЕДИЙНЫЙ ПАРК",
  location = "HELLO PARK • МЕГА ТЕПЛЫЙ СТАН",
  image = "/presentation/12.webp",
}: {
  title?: string;
  subtitle?: string;
  location?: string;
  image?: string;
}) {
  const resolvedImg = getPublicUrl(image);

  return (
    <div
      className="relative w-full aspect-[16/9] bg-[#0A0A10] text-white select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      {/* Background Hero Photo */}
      <div className="absolute inset-0">
        <img
          src={resolvedImg}
          alt="День рождения будущего"
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes("/mega/")) {
              target.src = `/mega${image}`;
            }
          }}
        />
        {/* Soft Vignette & Deep Gradient Overlay for Maximum Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
      </div>

      {/* Top Bar: Logo & Location Tag */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between px-[5.2%] pt-[4.2%] z-10">
        <div className="flex items-center gap-3">
          <span className="bg-black/40 backdrop-blur-md border border-white/20 px-[1.2vw] py-[0.4vw] rounded-full text-white/90 font-extrabold tracking-wider text-[0.8vw] uppercase">
            {location}
          </span>
        </div>

        {/* Hello Park Official Logo Badge */}
        <div className="flex items-center gap-[0.8vw] bg-black/40 backdrop-blur-md border border-white/20 px-[1.4vw] py-[0.7vw] rounded-[1.2vw] shadow-2xl">
          <div className="w-[3.2vw] h-[3.2vw] min-w-[32px] min-h-[32px] rounded-[0.8vw] bg-[#FF6022] flex items-center justify-center shadow-lg shadow-[#FF6022]/40">
            <span className="text-[1.8vw] font-black text-white leading-none">hp</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white font-black text-[1.5vw] leading-none tracking-tight">
              hello park
            </span>
            <span className="text-white/70 font-semibold text-[0.75vw] tracking-wider uppercase mt-[0.2vw]">
              парк будущего
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Left: Huge Slogan in Vivid Yellow */}
      <div className="absolute bottom-0 left-0 px-[5.2%] pb-[4.8%] z-10 max-w-[70vw]">
        <div className="inline-block mb-[1vw]">
          <span className="bg-[#5822E5]/90 backdrop-blur-md text-white font-extrabold px-[1.2vw] py-[0.4vw] rounded-full text-[0.9vw] tracking-wider uppercase shadow-lg shadow-[#5822E5]/30">
            {subtitle}
          </span>
        </div>

        <h1
          className="text-[#FFE600] font-black tracking-[-0.03em] leading-[0.98] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: "clamp(36px, 6.2vw, 100px)",
            fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
            fontWeight: 900,
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
