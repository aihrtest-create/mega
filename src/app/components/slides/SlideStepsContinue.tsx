import React from "react";
import { getPublicUrl } from "./SlideShows";

interface StepCardData {
  stepNumber: string;
  title: string;
  subtitle: string;
  image: string;
}

const DEFAULT_CONTINUE_STEPS: StepCardData[] = [
  {
    stepNumber: "04",
    title: "Миссии в игровом мире",
    subtitle: "каждый ход команды приносит очки",
    image: "/presentation/21.webp",
  },
  {
    stepNumber: "05",
    title: "Большой финал и победа команды",
    subtitle: "эмоции, которые помнят месяцами",
    image: "/presentation/19.webp",
  },
  {
    stepNumber: "06",
    title: "Праздничная комната как продолжение истории",
    subtitle: "торт, свеча и главный герой дня",
    image: "/presentation/03.webp",
  },
];

export function SlideStepsContinue({
  topTag = "ПРИКЛЮЧЕНИЕ • ПРОДОЛЖЕНИЕ",
  title = "Как продолжается приключение",
  steps = DEFAULT_CONTINUE_STEPS,
}: {
  topTag?: string;
  title?: string;
  steps?: StepCardData[];
}) {
  return (
    <div
      className="relative w-full aspect-[16/9] bg-white text-[#101010] select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between px-[5.2%] pt-[3.8%] pb-[3.6%]">
        {/* Header with Top Tag */}
        <div className="w-full flex flex-col items-start">
          <span className="text-[#FF6022] font-black tracking-widest text-[0.85vw] uppercase mb-[0.3vw]">
            {topTag}
          </span>
          <h1
            className="text-[#101010] font-black tracking-[-0.03em] leading-[1.05]"
            style={{
              fontSize: "clamp(28px, 4.2vw, 66px)",
              fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
              fontWeight: 900,
            }}
          >
            {title}
          </h1>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="w-full grid grid-cols-3 gap-[2.4vw] my-auto items-stretch h-[72%]">
          {steps.map((step) => {
            const resolvedImg = getPublicUrl(step.image);
            return (
              <div
                key={step.stepNumber}
                className="relative rounded-[22px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.08)] bg-gray-100 flex flex-col justify-end group transition-all duration-300 hover:scale-[1.015]"
              >
                {/* Background Photo */}
                <img
                  src={resolvedImg}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover object-center block"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("/mega/")) {
                      target.src = `/mega${step.image}`;
                    }
                  }}
                />

                {/* Soft Gradient Overlay at Bottom of Card in Vibrant Pink/Red/Orange for Clear Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF4081]/95 via-[#FF4081]/70 via-40% to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10 p-[1.8vw] text-white flex flex-col justify-end text-left">
                  {/* Step Number in Soft Gold/White */}
                  <span
                    className="text-[#FFE0B2] font-black text-[1.4vw] tracking-wider leading-none mb-[0.4vw]"
                    style={{ fontWeight: 900 }}
                  >
                    {step.stepNumber}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-white font-black tracking-[-0.02em] leading-[1.15]"
                    style={{
                      fontSize: "clamp(13px, 1.45vw, 24px)",
                      fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className="text-white/90 font-medium tracking-normal leading-[1.25] mt-[0.4vw]"
                    style={{
                      fontSize: "clamp(10px, 0.95vw, 15px)",
                    }}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
