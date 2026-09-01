import React from "react";
import { getPublicUrl } from "./SlideShows";

export function SlideContacts() {
  const parkImg = getPublicUrl("/presentation/12.webp");

  return (
    <div
      className="relative w-full aspect-[16/9] bg-[#5822E5] text-white select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5822E5] via-[#4814D0] to-[#2B008A]" />
      <div className="absolute -right-[10vw] -bottom-[10vw] w-[40vw] h-[40vw] rounded-full bg-[#FF6022]/20 blur-[100px] pointer-events-none" />

      <div className="absolute inset-0 flex items-stretch justify-between px-[5.2%] py-[4.2%] gap-[3vw] z-10">
        {/* Left: Call to action & Configurator Link */}
        <div className="w-[55%] flex flex-col justify-between text-left">
          <div>
            <span className="bg-[#FFE600] text-black font-black text-[0.85vw] px-[1vw] py-[0.35vw] rounded-full uppercase tracking-wider shadow-lg">
              🎉 ОНЛАЙН-КОНФИГУРАТОР ПРАЗДНИКА
            </span>
            <h1
              className="text-white font-black tracking-[-0.03em] leading-[1.02] mt-[1vw]"
              style={{
                fontSize: "clamp(30px, 4.8vw, 76px)",
                fontWeight: 900,
              }}
            >
              Соберите свой идеальный праздник!
            </h1>
            <p className="text-white/80 font-medium text-[1.2vw] leading-relaxed mt-[1vw] max-w-[34vw]">
              Настройте пакет под себя за 2 минуты: выберите любимый квест, яркое шоу, мастер-класс и меню для гостей с мгновенным расчетом цены.
            </p>
          </div>

          <div className="space-y-[0.8vw]">
            <div className="flex items-center gap-[1vw]">
              <div className="w-[2.8vw] h-[2.8vw] rounded-2xl bg-white/10 flex items-center justify-center text-[1.4vw]">
                📍
              </div>
              <div>
                <span className="text-white/60 font-medium text-[0.75vw] block">Локация</span>
                <span className="text-white font-bold text-[1vw]">Москва, МЕГА Тёплый Стан</span>
              </div>
            </div>

            <div className="flex items-center gap-[1vw]">
              <div className="w-[2.8vw] h-[2.8vw] rounded-2xl bg-white/10 flex items-center justify-center text-[1.4vw]">
                📞
              </div>
              <div>
                <span className="text-white/60 font-medium text-[0.75vw] block">Банкетная служба</span>
                <span className="text-[#FFE600] font-black text-[1.2vw]">+7 (495) 120-40-50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Configurator QR Box & Mockup */}
        <div className="w-[45%] flex flex-col justify-center items-center">
          <div className="bg-white text-black rounded-[32px] p-[2vw] shadow-[0_24px_60px_rgba(0,0,0,0.35)] flex flex-col items-center text-center max-w-[24vw]">
            <div className="w-[12vw] h-[12vw] bg-[#F5F5FA] rounded-2xl p-[1vw] flex items-center justify-center border-2 border-dashed border-[#5822E5]/30">
              {/* Clean QR Graphic Placeholder */}
              <div className="w-full h-full bg-[#101010] rounded-xl flex items-center justify-center text-white font-mono text-[0.9vw] p-2 text-center">
                <span className="font-bold text-[#FFE600]">HELLO-PARK.IO</span>
              </div>
            </div>

            <h3 className="font-black text-[1.3vw] mt-[1vw] text-[#5822E5]">
              Открыть конфигуратор
            </h3>
            <p className="text-gray-500 font-medium text-[0.8vw] mt-[0.2vw]">
              Наведите камеру телефона для перехода к онлайн-бронированию
            </p>

            <a
              href="/mega/"
              className="mt-[1vw] w-full py-[0.7vw] rounded-full bg-[#FF6022] hover:bg-[#FF7338] text-white font-black text-[0.9vw] shadow-lg shadow-[#FF6022]/30 transition-all text-center block"
            >
              Перейти на сайт
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
