import React from "react";
import { getPublicUrl } from "./SlideShows";

interface StepCardData {
  stepNumber: string;
  badge?: string;
  title: string;
  subtitle: string;
  image: string;
  borderColor?: string;
}

const DEFAULT_START_STEPS: StepCardData[] = [
  {
    stepNumber: "01",
    title: "Лис Рокки начинает\nФиджитал День Рождения",
    subtitle: "и знакомит всю команду",
    image: "/presentation/11.webp",
  },
  {
    stepNumber: "02",
    badge: "ТОЛЬКО В HELLO PARK",
    title: "Каждый ребёнок создаёт\nсвоего друга — аватара",
    subtitle: "проводник во вселенные Hello Park и\nдруг в миссиях команды",
    image: "/presentation/16.webp",
    borderColor: "#FF6022",
  },
  {
    stepNumber: "03",
    title: "Легенда игрового мира",
    subtitle: "и первое задание команде",
    image: "/presentation/20.webp",
  },
];

export function SlideStepsStart({
  title = "Как начинается\nприключение?",
  steps = DEFAULT_START_STEPS,
}: {
  title?: string;
  steps?: StepCardData[];
}) {
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
      {/* Title */}
      <h1
        style={{
          color: "#5822E5",
          fontWeight: 900,
          fontSize: "clamp(26px, 4vw, 64px)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          whiteSpace: "pre-line",
          margin: 0,
          marginBottom: "4%",
        }}
      >
        {title}
      </h1>

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
        {steps.map((step) => {
          const resolvedImg = getPublicUrl(step.image);
          return (
            <div
              key={step.stepNumber}
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#111",
                border: step.borderColor ? `3px solid ${step.borderColor}` : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              {/* Photo */}
              <img
                src={resolvedImg}
                alt={step.title}
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
                  if (!t.src.includes("/mega/")) t.src = `/mega${step.image}`;
                }}
              />

              {/* Bottom gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 75%)",
                }}
              />

              {/* Badge — inside card, mid-bottom area */}
              {step.badge && (
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
                      background: "#FF6022",
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
                    {step.badge}
                  </span>
                </div>
              )}

              {/* Text at bottom */}
              <div
                style={{
                  position: "relative",
                  zIndex: 5,
                  padding: "0 6% 7%",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(9px, 0.9vw, 15px)",
                    fontWeight: 700,
                    opacity: 0.75,
                    marginBottom: "0.25em",
                    letterSpacing: "0.01em",
                  }}
                >
                  {step.stepNumber}
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
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: "clamp(9px, 0.85vw, 14px)",
                    fontWeight: 500,
                    opacity: 0.8,
                    lineHeight: 1.3,
                    whiteSpace: "pre-line",
                  }}
                >
                  {step.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
