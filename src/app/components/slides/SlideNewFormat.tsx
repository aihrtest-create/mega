import React from "react";
import { getPublicUrl } from "./SlideShows";

export function SlideNewFormat({
  title = "Новый\nформат\nпраздника",
  subtitle = "Ваш ребенок отправляется в приключение, которое создано специально для него и его гостей",
  image = "/presentation/56.webp",
}: {
  title?: string;
  subtitle?: string;
  image?: string;
}) {
  const resolvedImg = getPublicUrl(image);

  return (
    <div
      className="w-full h-full bg-white text-[#101010] select-none overflow-hidden"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "6% 5.5% 5%",
        boxSizing: "border-box",
        gap: "5%",
      }}
    >
      {/* Left: Text */}
      <div
        style={{
          flex: "0 0 42%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "#5822E5",
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 80px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
            margin: 0,
            marginBottom: "6%",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#101010",
            fontWeight: 800,
            fontSize: "clamp(13px, 1.6vw, 26px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right: Photo */}
      <div
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          background: "#e0e0e0",
        }}
      >
        <img
          src={resolvedImg}
          alt="Новый формат праздника"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          onError={(e) => {
            const t = e.currentTarget;
            if (!t.src.includes("/mega/")) t.src = `/mega${image}`;
          }}
        />
      </div>
    </div>
  );
}
