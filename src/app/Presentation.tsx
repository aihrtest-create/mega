import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Home,
  Printer,
  Grid,
} from "lucide-react";
import { SlideCover } from "./components/slides/SlideCover";
import { SlideNewFormat } from "./components/slides/SlideNewFormat";
import { SlideStepsStart } from "./components/slides/SlideStepsStart";
import { SlideStepsContinue } from "./components/slides/SlideStepsContinue";
import { SlidePackages } from "./components/slides/SlidePackages";
import { SlideHowToBook } from "./components/slides/SlideHowToBook";
import { SlidePhygitalVoxels } from "./components/slides/SlidePhygitalVoxels";
import { SlidePhygitalSpace } from "./components/slides/SlidePhygitalSpace";
import { SlideClassicQuests } from "./components/slides/SlideClassicQuests";
import { SlideShows } from "./components/slides/SlideShows";
import { SlideMasterclasses } from "./components/slides/SlideMasterclasses";
import { SlideActivities } from "./components/slides/SlideActivities";
import { SlideCatering } from "./components/slides/SlideCatering";
import { SlideContacts } from "./components/slides/SlideContacts";

export interface SlideDefinition {
  id: string;
  title: string;
  category: string;
  component: React.ReactNode;
}

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 14 Complete Image-First Presentation Slides
  const slides: SlideDefinition[] = [
    {
      id: "cover",
      title: "Обложка",
      category: "Титул",
      component: <SlideCover key="slide-cover" />,
    },
    {
      id: "new-format",
      title: "Новый формат праздника",
      category: "Концепция",
      component: <SlideNewFormat key="slide-new-format" />,
    },
    {
      id: "steps-start",
      title: "Как начинается приключение?",
      category: "Шаги 01-03",
      component: <SlideStepsStart key="slide-steps-start" />,
    },
    {
      id: "steps-continue",
      title: "Как продолжается приключение",
      category: "Шаги 04-06",
      component: <SlideStepsContinue key="slide-steps-continue" />,
    },
    {
      id: "packages",
      title: "Пакеты праздника",
      category: "Тарифы",
      component: <SlidePackages key="slide-packages" />,
    },
    {
      id: "how-to-book",
      title: "Как отметить день рождения",
      category: "Организация",
      component: <SlideHowToBook key="slide-how-to-book" />,
    },
    {
      id: "voxels",
      title: "Квест «Мир Вокселей»",
      category: "Фиджитал",
      component: <SlidePhygitalVoxels key="slide-voxels" />,
    },
    {
      id: "space",
      title: "«Космическое приключение»",
      category: "Фиджитал",
      component: <SlidePhygitalSpace key="slide-space" />,
    },
    {
      id: "classic-quests",
      title: "Классические квесты",
      category: "Сюжеты",
      component: <SlideClassicQuests key="slide-classic-quests" />,
    },
    {
      id: "shows",
      title: "Шоу программы",
      category: "Шоу",
      component: <SlideShows key="slide-shows" />,
    },
    {
      id: "masterclasses",
      title: "Мастер-классы",
      category: "Творчество",
      component: <SlideMasterclasses key="slide-masterclasses" />,
    },
    {
      id: "activities",
      title: "Дополнительные активности",
      category: "Развлечения",
      component: <SlideActivities key="slide-activities" />,
    },
    {
      id: "catering",
      title: "Праздничный кейтеринг",
      category: "Еда & Торты",
      component: <SlideCatering key="slide-catering" />,
    },
    {
      id: "contacts",
      title: "Контакты и бронирование",
      category: "Финал",
      component: <SlideContacts key="slide-contacts" />,
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        setIsGridOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length]);

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "presentation");
    url.searchParams.set("slide", slides[currentSlide].id);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#0A0A10] text-white flex flex-col font-cy select-none overflow-x-hidden ${
        isFullscreen ? "p-0" : "p-3 sm:p-5 md:p-6"
      }`}
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', sans-serif",
      }}
    >
      {/* Top Header Bar */}
      {!isFullscreen && (
        <header className="max-w-[1600px] w-full mx-auto mb-3 flex items-center justify-between gap-4 px-2">
          {/* Logo & Navigation to Configurator */}
          <div className="flex items-center gap-3">
            <a
              href="/mega/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition-all active:scale-95 text-white no-underline text-xs font-bold"
            >
              <Home className="w-3.5 h-3.5 text-[#FF6022]" />
              <span>Конфигуратор</span>
            </a>

            <div className="hidden sm:flex items-center gap-2 text-white/40 text-xs">
              <span>/</span>
              <span className="text-white/80 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                Презентация для клиентов
              </span>
            </div>
          </div>

          {/* Center: Slide indicator */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <span className="text-[#FFE600] font-black">{currentSlide + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{slides.length}</span>
            <span className="ml-1 text-white/50 hidden md:inline">({slide.title})</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Grid Overview Button */}
            <button
              onClick={() => setIsGridOpen(!isGridOpen)}
              title="Все слайды (G)"
              className={`p-2 rounded-xl transition-all active:scale-95 text-xs font-bold flex items-center gap-1.5 ${
                isGridOpen ? "bg-[#5822E5] text-white" : "bg-white/10 hover:bg-white/15 text-white/80"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Слайды</span>
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              title="Скопировать ссылку на слайд"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 text-white/80"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Print / Export to PDF */}
            <button
              onClick={handlePrint}
              title="Печать всей презентации в PDF"
              className="hidden sm:flex p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 text-white/80"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Выйти из полноэкранного режима (Esc)" : "На весь экран (F)"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5822E5] hover:bg-[#6833F5] text-white font-extrabold text-xs shadow-lg shadow-[#5822E5]/30 transition-all active:scale-95"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Свернуть</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">На весь экран</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Grid Modal Selector */}
      <AnimatePresence>
        {isGridOpen && !isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-[1600px] w-full mx-auto mb-4 bg-white/5 border border-white/15 rounded-2xl p-4 backdrop-blur-xl z-20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlide(idx);
                      setIsGridOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left transition-all border ${
                      isActive
                        ? "bg-[#5822E5] border-[#FFE600] text-white shadow-lg"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-white/70"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#FFE600] block mb-0.5">
                      Слайд {idx + 1}
                    </span>
                    <span className="text-xs font-bold line-clamp-1 block">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide Presentation Canvas (Strict 16:9 Aspect Ratio) */}
      <main className="flex-1 flex items-center justify-center relative max-w-[1600px] w-full mx-auto my-auto">
        <div
          className={`w-full relative shadow-[0_24px_80px_rgba(0,0,0,0.65)] rounded-[20px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden border border-white/10 transition-all ${
            isFullscreen
              ? "h-screen max-w-none rounded-none border-none shadow-none flex items-center justify-center bg-black"
              : ""
          }`}
        >
          {/* Inner 16:9 Aspect Ratio Box */}
          <div className="w-full aspect-[16/9] relative bg-white overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {slide.component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fullscreen Floating Controls */}
          {isFullscreen && (
            <>
              <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                <span className="text-[#FFE600]">{currentSlide + 1}</span>
                <span className="text-white/40">/</span>
                <span>{slides.length}</span>
                <span className="text-white/70 ml-1">({slide.title})</span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-white transition-all"
                title="Свернуть (Esc)"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Hover Arrows on Canvas */}
          <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20">
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-xl active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20">
            {currentSlide < slides.length - 1 && (
              <button
                onClick={nextSlide}
                className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-xl active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Control Bar & Thumbnail Strip */}
      {!isFullscreen && (
        <footer className="max-w-[1600px] w-full mx-auto mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                currentSlide === 0
                  ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 shadow-md"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl font-black text-xs transition-all ${
                currentSlide === slides.length - 1
                  ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                  : "bg-[#FF6022] hover:bg-[#FF7338] text-white shadow-lg shadow-[#FF6022]/30 active:scale-95"
              }`}
            >
              <span>Далее</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Slide Strip (1-14) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  title={`${idx + 1}. ${s.title}`}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-[#5822E5] text-[#FFE600] shadow-md shadow-[#5822E5]/50 scale-110 border border-[#FFE600]/60"
                      : "bg-white/5 hover:bg-white/10 text-white/60 border border-white/10"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Hotkeys */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-white/40">
            <span>Клавиши:</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">
              →
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">
              F (Full)
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">
              G (Grid)
            </kbd>
          </div>
        </footer>
      )}

      {/* Print Styles for PDF Export (Clean 16:9 Landscape page breaks) */}
      <style>{`
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          header, footer, nav, button {
            display: none !important;
          }
          .font-cy {
            font-family: 'Cy Grotesk', 'Gilroy', sans-serif !important;
          }
          @page {
            size: 1920px 1080px landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
