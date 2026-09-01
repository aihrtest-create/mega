import React from "react";

export const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const baseUrl = (import.meta as any).env?.BASE_URL || "/";
  const cleanPath = path.replace(/^\//, "");
  return baseUrl.endsWith("/") ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
};

export interface ShowCardData {
  id: string;
  title: string[]; // Lines of text
  price: string;
  image: string;
  hasStar?: boolean;
}

export const DEFAULT_SHOWS: ShowCardData[] = [
  {
    id: "neon",
    title: ["Шоу неоновых", "подушек"],
    price: "15 000₽",
    image: "/shows/neon.webp",
  },
  {
    id: "science",
    title: ["Научное шоу"],
    price: "14 000₽",
    image: "/shows/science.webp",
  },
  {
    id: "paper",
    title: ["Бумажное шоу"],
    price: "15 000₽",
    image: "/shows/paper.webp",
  },
  {
    id: "soap",
    title: ["Шоу мыльных", "пузырей"],
    price: "14 000₽",
    image: "/shows/soap.webp",
    hasStar: true,
  },
];

// 3D Emerald Star Icon matching the reference in top-right of Card 4
export function EmeraldStar3D({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className} filter drop-shadow-[0_6px_14px_rgba(0,230,118,0.45)] pointer-events-none select-none`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform rotate-[14deg]"
      >
        <defs>
          <linearGradient id="emerald_grad_main" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#69F0AE" />
            <stop offset="35%" stopColor="#00E676" />
            <stop offset="70%" stopColor="#00C853" />
            <stop offset="100%" stopColor="#007E33" />
          </linearGradient>
          <linearGradient id="emerald_grad_facet_top" x1="50%" y1="0%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#C8E6C9" />
            <stop offset="100%" stopColor="#00E676" />
          </linearGradient>
          <linearGradient id="emerald_grad_facet_left" x1="0%" y1="50%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#00C853" />
          </linearGradient>
          <linearGradient id="emerald_grad_facet_right" x1="100%" y1="50%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#004D40" />
          </linearGradient>
          <linearGradient id="emerald_grad_facet_bottom" x1="50%" y1="100%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="emerald_specular" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Star Silhouette */}
        <path
          d="M50 4 C50 30 30 50 4 50 C30 50 50 70 50 96 C50 70 70 50 96 50 C70 50 50 30 50 4 Z"
          fill="url(#emerald_grad_main)"
        />
        {/* Facet Top-Left */}
        <path
          d="M50 4 C50 28 36 42 12 50 L50 50 Z"
          fill="url(#emerald_grad_facet_top)"
          opacity="0.85"
        />
        {/* Facet Top-Right */}
        <path
          d="M50 4 C50 28 64 42 88 50 L50 50 Z"
          fill="url(#emerald_grad_facet_right)"
          opacity="0.75"
        />
        {/* Facet Bottom-Left */}
        <path
          d="M12 50 C36 50 50 64 50 96 L50 50 Z"
          fill="url(#emerald_grad_facet_left)"
          opacity="0.9"
        />
        {/* Facet Bottom-Right */}
        <path
          d="M88 50 C64 50 50 64 50 96 L50 50 Z"
          fill="url(#emerald_grad_facet_bottom)"
          opacity="0.8"
        />
        {/* Specular Highlight Sheen */}
        <ellipse
          cx="43"
          cy="37"
          rx="15"
          ry="7.5"
          transform="rotate(-28 43 37)"
          fill="url(#emerald_specular)"
        />
        {/* Center Sparkle */}
        <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

interface SlideShowsProps {
  shows?: ShowCardData[];
  title?: string;
  footerNote?: string;
  className?: string;
}

export function SlideShows({
  shows = DEFAULT_SHOWS,
  title = "Шоу программы",
  footerNote = "Стоимость программы вне пакетов, оплачивается дополнительно",
  className = "",
}: SlideShowsProps) {
  return (
    <div
      className={`relative w-full aspect-[16/9] bg-white text-[#101010] select-none overflow-hidden font-cy ${className}`}
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      {/* 16:9 Inner Layout Container */}
      <div className="absolute inset-0 flex flex-col justify-between px-[5.2%] pt-[4.2%] pb-[3.2%]">
        {/* Header Title */}
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

        {/* 4 Shows Cards Grid */}
        <div className="w-full grid grid-cols-4 gap-[2.4vw] my-auto items-start">
          {shows.map((show) => {
            const resolvedImgSrc = getPublicUrl(show.image);
            return (
              <div
                key={show.id}
                className="flex flex-col items-center group transition-all duration-300"
              >
                {/* Image Frame with 3D Star on 4th item */}
                <div className="relative w-full aspect-[3/3.8] rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-visible bg-[#F0F0F5] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:scale-[1.02]">
                  {/* Rounded Inner Image */}
                  <div className="w-full h-full rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-gray-100">
                    <img
                      src={resolvedImgSrc}
                      alt={show.title.join(" ")}
                      className="w-full h-full object-cover object-center block"
                      loading="eager"
                      onError={(e) => {
                        // Fallback in case of absolute vs relative mismatch
                        const target = e.currentTarget;
                        if (!target.src.includes("/mega/")) {
                          target.src = `/mega${show.image}`;
                        }
                      }}
                    />
                  </div>

                  {/* Green 3D Star Badge for Card 4 (Soap Bubbles / Highlight) */}
                  {show.hasStar && (
                    <div className="absolute -top-[1.2vw] -right-[1.2vw] w-[4vw] h-[4vw] min-w-[32px] min-h-[32px] max-w-[64px] max-h-[64px] z-10 animate-pulse-slow">
                      <EmeraldStar3D className="w-full h-full" />
                    </div>
                  )}
                </div>

                {/* Title under photo */}
                <div
                  className="mt-[1.4vw] mb-[0.9vw] text-center text-[#5822E5] font-extrabold tracking-[-0.02em] leading-[1.18] flex flex-col items-center justify-center min-h-[3.2vw]"
                  style={{
                    fontSize: "clamp(13px, 1.65vw, 26px)",
                    fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {show.title.map((line, idx) => (
                    <span key={idx} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </div>

                {/* Yellow Price Badge Pill */}
                <div className="flex justify-center">
                  <div
                    className="bg-[#FFC700] hover:bg-[#FFD000] text-black font-black rounded-full px-[1.8vw] py-[0.55vw] shadow-[0_2px_8px_rgba(255,199,0,0.35)] transition-transform duration-200 group-hover:scale-105 inline-flex items-center justify-center whitespace-nowrap cursor-default"
                    style={{
                      fontSize: "clamp(12px, 1.45vw, 24px)",
                      fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                      fontWeight: 900,
                    }}
                  >
                    {show.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Disclaimer */}
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
