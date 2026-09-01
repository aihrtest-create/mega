import React from "react";
import { getPublicUrl } from "./SlideShows";

const HIGHLIGHTS = [
  "Космические миссии",
  "Интерактивные проекции",
  "Цифровые аватары",
  "Битва с Глоргом",
  "Финальная дискотека",
];

const CARDS = [
  {
    stepNumber: "01",
    title: "Лис Рокки —\nкапитан корабля",
    subtitle: "зовёт команду на межгалактическую миссию на Марсе",
    image: "/quests/space/01.webp",
  },
  {
    stepNumber: "02",
    badge: "ТОЛЬКО В HELLO PARK",
    title: "Испытания на невесомость\nи цифровые аватары",
    subtitle: "расшифровка сигналов с других планет через интерактивные проекции",
    image: "/quests/space/04.webp",
    borderColor: "#3B4DD4",
  },
  {
    stepNumber: "03",
    title: "Победить Глорга\nи спасти вечеринку",
    subtitle: "вернуть кристалл бесконечной энергии и устроить дискотеку",
    image: "/quests/space/02.webp",
  },
];

export function SlidePhygitalSpace() {
  return (
    <div
      className="w-full h-full bg-white text-[#101010] select-none overflow-hidden"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "5% 5.5% 4.5%",
        boxSizing: "border-box",
      }}
    >
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "3.5%" }}>
        <h1
          style={{
            color: "#3B4DD4",
            fontWeight: 900,
            fontSize: "clamp(24px, 3.8vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          «Космическое приключение»
        </h1>

        {/* Highlights strip */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4vw", justifyContent: "flex-end", maxWidth: "45%", alignItems: "center" }}>
          {HIGHLIGHTS.map((h) => (
            <span
              key={h}
              style={{
                background: "#EEF0FF",
                color: "#3B4DD4",
                fontWeight: 700,
                fontSize: "clamp(8px, 0.75vw, 12px)",
                padding: "0.3em 0.7em",
                borderRadius: "100px",
                border: "1px solid #C5CAF0",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "clamp(11px, 1.1vw, 18px)",
          fontWeight: 700,
          lineHeight: 1.35,
          color: "#101010",
          margin: 0,
          marginBottom: "3.5%",
          maxWidth: "68%",
        }}
      >
        Лис Рокки — капитан космического корабля! Дети отправляются в межгалактическую миссию: проходят испытания на невесомость, расшифровывают сигналы с других планет и спасают Вселенную.
      </p>

      {/* 3 Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2%",
          flex: 1,
          minHeight: 0,
        }}
      >
        {CARDS.map((card) => {
          const resolvedImg = getPublicUrl(card.image);
          return (
            <div
              key={card.stepNumber}
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#111",
                border: card.borderColor ? `3px solid ${card.borderColor}` : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <img
                src={resolvedImg}
                alt={card.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.src.includes("/mega/")) t.src = `/mega${card.image}`;
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 75%)",
                }}
              />

              {card.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "6%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <span
                    style={{
                      background: "#3B4DD4",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "clamp(8px, 0.8vw, 13px)",
                      padding: "0.3em 0.8em",
                      borderRadius: "100px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      display: "inline-block",
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
              )}

              <div
                style={{
                  position: "relative",
                  zIndex: 5,
                  padding: "0 6% 7%",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "clamp(9px, 0.9vw, 15px)", fontWeight: 700, opacity: 0.75, marginBottom: "0.25em" }}>
                  {card.stepNumber}
                </div>
                <div
                  style={{
                    fontSize: "clamp(13px, 1.5vw, 24px)",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    whiteSpace: "pre-line",
                    marginBottom: "0.3em",
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: "clamp(9px, 0.85vw, 14px)", fontWeight: 500, opacity: 0.8, lineHeight: 1.3 }}>
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: "2%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "clamp(8px, 0.75vw, 12px)", color: "#999", fontWeight: 600 }}>
          ⏱ 60 минут · до 10 детей · 1 ведущий
        </span>
        <span style={{ fontSize: "clamp(8px, 0.75vw, 12px)", color: "#3B4DD4", fontWeight: 700 }}>
          Входит в пакеты Премиум и Эксклюзив
        </span>
      </div>
    </div>
  );
}
