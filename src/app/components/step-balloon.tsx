import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

export function StepBalloon() {
  const { state, updateState, nextStep } = useWizard();

  const handleSelect = (choice: "balloon" | "pinata") => {
    updateState({ balloonChoice: choice });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-16"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex flex-col items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md">🎈</span>
          Выберите финал
        </h1>
        <p className="text-base font-bold text-[#747474] leading-relaxed max-w-[320px] mx-auto">
          Шар-сюрприз или Пиньята будут предоставлены ребенку в конце дня рождения
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Карточка: Шар-сюрприз */}
        <div
          onClick={() => handleSelect("balloon")}
          className={`relative aspect-[4/5] sm:h-[280px] w-full rounded-[24px] overflow-hidden transition-all cursor-pointer group bg-white ${
            state.balloonChoice === "balloon" ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <ImageWithFallback src={getPublicUrl("/activities/surprise_balloon_new.webp")} alt="Шар-сюрприз" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
            <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
               <span className="text-[10px] font-bold text-[#FF6022] uppercase tracking-wide">Входит в пакет</span>
            </div>

            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                state.balloonChoice === "balloon" ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
            }`}>
               <Check className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
             <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">Шар-сюрприз</h4>
          </div>
        </div>

        {/* Карточка: Пиньята */}
        <div
          onClick={() => handleSelect("pinata")}
          className={`relative aspect-[4/5] sm:h-[280px] w-full rounded-[24px] overflow-hidden transition-all cursor-pointer group bg-white ${
            state.balloonChoice === "pinata" ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <ImageWithFallback src={getPublicUrl("/activities/pinata_new.webp")} alt="Пиньята" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
            <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
               <span className="text-[10px] font-bold text-[#FF6022] uppercase tracking-wide">Входит в пакет</span>
            </div>

            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                state.balloonChoice === "pinata" ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
            }`}>
               <Check className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
             <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">Пиньята</h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
