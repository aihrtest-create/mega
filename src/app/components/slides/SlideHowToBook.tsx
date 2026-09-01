import React from "react";
import { getPublicUrl } from "./SlideShows";

interface HowToBookStep {
  number: number;
  text: string;
  pills?: { label: string; color: string; textColor?: string }[];
  subitems?: string[];
}

const DEFAULT_STEPS: HowToBookStep[] = [
  {
    number: 1,
    text: "Выбрать один из трёх праздничных пакетов:",
    pills: [
      { label: "Базовый", color: "#FFC700", textColor: "#000" },
      { label: "Премиум", color: "#EF5299", textColor: "#fff" },
      { label: "Эксклюзив", color: "#5822E5", textColor: "#fff" },
    ],
  },
  {
    number: 2,
    text: "Запланировать удобную\nдату и время",
  },
  {
    number: 3,
    text: "Добавить дополнительные\nуслуги при желании",
  },
  {
    number: 4,
    text: "Определиться с форматом\nпраздничного обеда:",
    subitems: [
      "выбрать меню от партнера за доплату",
      "организовать самостоятельно",
    ],
  },
];

export function SlideHowToBook({
  leftTitle = "Как отметить\nдень рождения?",
  rightTitle = "Индивидуальный\nпраздник",
  rightSubtitle = "Соберите свой вариант праздника с индивидуальным наполнением",
  rightNote = "* Подробности уточняйте у менеджера",
  steps = DEFAULT_STEPS,
  cakeImage = "/presentation/ChatGPT_Image_May_15__2026__10_15_47_AM.webp",
}: {
  leftTitle?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  rightNote?: string;
  steps?: HowToBookStep[];
  cakeImage?: string;
}) {
  const resolvedCake = getPublicUrl(cakeImage);

  return (
    <div
      className="w-full h-full bg-white text-[#101010] select-none overflow-hidden"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
        display: "flex",
        flexDirection: "row",
        padding: "6% 6% 5%",
        boxSizing: "border-box",
        gap: "4%",
      }}
    >
      {/* Left Half */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <h1
          style={{
            color: "#5822E5",
            fontWeight: 900,
            fontSize: "clamp(22px, 3.5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
            margin: 0,
            marginBottom: "6%",
          }}
        >
          {leftTitle}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "4%" }}>
          {steps.map((s) => (
            <div key={s.number} style={{ display: "flex", alignItems: "flex-start", gap: "3.5%" }}>
              {/* Purple circle number */}
              <div
                style={{
                  width: "clamp(20px, 2.2vw, 36px)",
                  height: "clamp(20px, 2.2vw, 36px)",
                  minWidth: "clamp(20px, 2.2vw, 36px)",
                  borderRadius: "50%",
                  background: "#5822E5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "clamp(9px, 0.9vw, 15px)",
                  marginTop: "0.15em",
                  flexShrink: 0,
                }}
              >
                {s.number}
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "clamp(11px, 1.2vw, 20px)",
                    lineHeight: 1.3,
                    whiteSpace: "pre-line",
                    color: "#101010",
                  }}
                >
                  {s.text}
                </p>

                {/* Package pills */}
                {s.pills && (
                  <div style={{ display: "flex", gap: "2%", marginTop: "4%", flexWrap: "wrap" }}>
                    {s.pills.map((pill) => (
                      <span
                        key={pill.label}
                        style={{
                          background: pill.color,
                          color: pill.textColor || "#000",
                          fontWeight: 900,
                          fontSize: "clamp(10px, 1.05vw, 17px)",
                          padding: "0.3em 1em",
                          borderRadius: "100px",
                          display: "inline-block",
                        }}
                      >
                        {pill.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sub-bullets */}
                {s.subitems && (
                  <ul style={{ margin: "4% 0 0", paddingLeft: "1.2em", listStyle: "disc" }}>
                    {s.subitems.map((sub, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "clamp(9px, 0.95vw, 15px)",
                          color: "#444",
                          fontWeight: 500,
                          lineHeight: 1.35,
                        }}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Half */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h2
          style={{
            color: "#5822E5",
            fontWeight: 900,
            fontSize: "clamp(22px, 3.5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
            margin: 0,
            marginBottom: "4%",
          }}
        >
          {rightTitle}
        </h2>

        <p
          style={{
            fontSize: "clamp(11px, 1.15vw, 19px)",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#101010",
            margin: 0,
            marginBottom: "2%",
          }}
        >
          {rightSubtitle}
        </p>

        <p
          style={{
            fontSize: "clamp(9px, 0.85vw, 14px)",
            color: "#999",
            fontWeight: 500,
            margin: 0,
            marginBottom: "4%",
          }}
        >
          {rightNote}
        </p>

        {/* 3D Cake */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <img
            src={resolvedCake}
            alt="3D торт"
            style={{
              maxWidth: "75%",
              maxHeight: "100%",
              objectFit: "contain",
              objectPosition: "bottom",
              display: "block",
            }}
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.src.includes("/mega/")) t.src = `/mega${cakeImage}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
