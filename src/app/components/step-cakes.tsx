import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Cake, Info, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

export const CAKES = [
  
  {
    "id": "cake_2",
    "name": "Торт 2",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_4.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_3",
    "name": "Торт 3",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_5.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_4",
    "name": "Торт 4",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_6.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_5",
    "name": "Торт 5",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_7.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_6",
    "name": "Торт 6",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_8.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_7",
    "name": "Торт 7",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_9.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_8",
    "name": "Торт 8",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_10.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_9",
    "name": "Торт 9",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_11.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_10",
    "name": "Торт 10",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_12.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_11",
    "name": "Торт 11",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_13.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_12",
    "name": "Торт 12",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p2_14.webp",
    "price": "8 400 ₽"
  },
  
  {
    "id": "cake_14",
    "name": "Торт 14",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_16.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_15",
    "name": "Торт 15",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_17.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_16",
    "name": "Торт 16",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_18.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_17",
    "name": "Торт 17",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_19.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_18",
    "name": "Торт 18",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_20.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_19",
    "name": "Торт 19",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_21.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_20",
    "name": "Торт 20",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_22.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_21",
    "name": "Торт 21",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_23.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_22",
    "name": "Торт 22",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_24.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_23",
    "name": "Торт 23",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_25.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_24",
    "name": "Торт 24",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_26.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_25",
    "name": "Торт 25",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_27.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "cake_26",
    "name": "Торт 26",
    "emoji": "🎂",
    "desc": "Авторский торт 2 кг. Прекрасный вариант для вашего праздника!",
    "gradient": "from-white to-white",
    "image": "/cakes/image_p3_28.webp",
    "price": "8 400 ₽"
  },
  {
    "id": "own_cake",
    "name": "Свой торт",
    "emoji": "🎁",
    "desc": "Принесите свой торт! К стоимости пакета прибавляется сервировка и подача.",
    "gradient": "from-white to-white",
    "image": "",
    "price": "+2 000 ₽"
  }
];

const FILLINGS = [
  { id: "filling_1", name: "Лаванда-Ягодный микс", image: "/fillings/filling_1.webp", kkal: "256 Ккал", desc: "Белки 5.4г, жиры 12.5г, углеводы 30г" },
  { id: "filling_2", name: "Кокос-Малина", image: "/fillings/filling_2.webp", kkal: "284 Ккал", desc: "Белки 5.7г, жиры 15.7г, углеводы 30г" },
  { id: "filling_3", name: "Красный бархат", image: "/fillings/filling_3.webp", kkal: "280 Ккал", desc: "Белки 4.2г, жиры 16.7г, углеводы 28г" },
  { id: "filling_4", name: "Фисташка-Клубника", image: "/fillings/filling_4.webp", kkal: "273 Ккал", desc: "Белки 6г, жиры 14.8г, углеводы 28.8г" },
  { id: "filling_5", name: "Ванильный", image: "/fillings/filling_5.webp", kkal: "350 Ккал", desc: "Белки 5.3г, жиры 22.8г, углеводы 31.6г" },
  { id: "filling_6", name: "Сникерс", image: "/fillings/filling_6.webp", kkal: "316 Ккал", desc: "Белки 6.2г, жиры 20.3г, углеводы 27г" },
  { id: "filling_7", name: "Миндаль-Вишня", image: "/fillings/filling_7.webp", kkal: "306 Ккал", desc: "Белки 6.81г, жиры 18.03г, углеводы 26.70г" },
];


export function StepCakes() {
  const { state, updateState, isExp } = useWizard();
  const [bottomSheetCake, setBottomSheetCake] = useState<string | null>(null);

  const openBottomSheet = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setBottomSheetCake(id);
  };

  const bottomSheetDetails = CAKES.find(mc => mc.id === bottomSheetCake);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        {/* Дополнительные услуги label */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6022]/10 to-[#FF8A00]/10 text-[#FF6022] text-[13px] font-bold px-4 py-2 rounded-full border border-[#FF6022]/20">
            <span>✨</span> Дополнительные услуги
          </div>
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎂</span>
          Праздничный торт
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Выберите идеальный торт
        </p>
      </div>



      <div className="flex items-center gap-2 mb-4">
        <Cake className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Тематические торты</h3>
      </div>

      {/* Grid of Cakes */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {CAKES.map((mc) => {
          const isSelected = state.cakeChoice === mc.id;
          
          if (isExp) {
            return (
              <motion.div
                key={mc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (mc.id === "own_cake") {
                    updateState({ cakeChoice: "own_cake", fillingChoice: null });
                  } else {
                    openBottomSheet(mc.id);
                  }
                }}
                className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                  isSelected
                    ? "scale-[1.02]"
                    : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                }`}
                style={{
                  borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                  borderWidth: isSelected ? "2px" : "1px",
                  boxShadow: isSelected 
                    ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                    : undefined
                }}
              >
                {/* Image container */}
                <div className="relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                  {mc.id === "own_cake" ? (
                    <span className="text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 leading-none">🎂</span>
                  ) : (
                    <ImageWithFallback 
                      src={getPublicUrl((mc as any).image)} 
                      alt={mc.name} 
                      className="w-[85%] h-[85%] object-contain object-bottom group-hover:scale-[1.05] transition-all duration-500" 
                    />
                  )}
                </div>

                <div className="p-2 pt-2.5 flex flex-col flex-1">
                  <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                    {mc.name}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                    <span className="text-[11px] text-[#FF6022] font-black">
                      {mc.id === "own_cake" ? "+2 000 ₽" : `${mc.price.replace(" ₽", "")}`}
                    </span>

                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={mc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (mc.id === "own_cake") {
                  // Свой торт — сразу выбрать, без начинки
                  updateState({ cakeChoice: "own_cake", fillingChoice: null });
                } else {
                  openBottomSheet(mc.id);
                }
              }}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient Placeholder */}
              {mc.id === "own_cake" ? (
                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white pb-12`}>
                  <span className="text-[120px] sm:text-[140px] filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 leading-none">🎂</span>
                </div>
              ) : (
                <div className={`absolute inset-0 flex items-end justify-center bg-black overflow-hidden pb-[50px]`}>
                  {(mc as any).image ? (
                    <ImageWithFallback 
                      src={getPublicUrl((mc as any).image)} 
                      alt={mc.name} 
                      className="w-full h-full object-contain object-bottom group-hover:scale-[1.05] transition-all duration-700" 
                    />
                  ) : (
                    <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{mc.emoji}</span>
                  )}
                </div>
              )}
              {mc.id !== "own_cake" && <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />}

              {/* Top details: Checkmark */}
              <div className="absolute top-2 right-2 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom pill-like panel */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{mc.name}</h4>
                  <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                    {mc.id === "own_cake" ? "+2 000 ₽" : `${mc.price} • 2 кг`}
                  </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.cakeChoice && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022] flex flex-col">
            <span>Выбран: <span className="font-semibold">{CAKES.find(c => c.id === state.cakeChoice)?.name}</span></span>
            {state.cakeChoice === "own_cake" 
              ? <span className="text-xs opacity-80 mt-0.5">+2 000 ₽ за сервировку и подачу</span>
              : state.fillingChoice && <span className="text-xs opacity-80 mt-0.5">Начинка: {FILLINGS.find(f => f.id === state.fillingChoice)?.name}</span>
            }
          </p>
        </div>
      )}



      {/* Bottom Sheet Modal (Variant 3) */}
      <AnimatePresence>
        {bottomSheetCake && bottomSheetDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[90] bg-black/50 backdrop-blur-md"
              onClick={() => setBottomSheetCake(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] flex flex-col pb-safe"
            >
              <div className="w-12 h-1.5 bg-[#E5E5E5] rounded-full mx-auto mt-4 mb-2" />
              <div className="px-5 pb-8 pt-2 overflow-y-auto overscroll-contain">
                <div className="mb-5 flex flex-col items-center text-center">
                   <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight mb-2">Выберите начинку</h3>
                   <p className="text-xs font-semibold text-[#747474] bg-[#F5F5F5] px-3 py-1.5 rounded-full">
                     Опция для: {bottomSheetDetails.name} <span className="mx-1">•</span> <span className="text-[#FF6022]">{bottomSheetDetails.price} • 2 кг</span>
                   </p>
                </div>
                
                <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory -mx-5 px-5 select-none no-scrollbar">
                   {FILLINGS.map((fill) => (
                      <div key={fill.id} onClick={() => updateState({ fillingChoice: fill.id })} className={`shrink-0 w-[140px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer snap-start ${state.fillingChoice === fill.id ? 'border-[#FF6022] bg-[#FF6022]/5 shadow-sm' : 'border-[#E5E5E5] bg-white'}`}>
                         <div className="aspect-square bg-white flex items-center justify-center relative p-1 object-cover">
                            <img src={getPublicUrl(fill.image)} className="w-full h-full object-cover mix-blend-multiply rounded-xl" alt={fill.name}/>
                         </div>
                         <div className="p-2.5">
                            <p className="text-xs font-bold text-[#1A1A1A] leading-[1.1] mb-1">{fill.name}</p>
                            <p className="text-[10px] text-[#FF6022] font-semibold">{fill.kkal}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="flex gap-3 mt-4">
                  {state.cakeChoice === bottomSheetDetails.id && (
                     <button
                        onClick={() => {
                           updateState({ cakeChoice: null, fillingChoice: null });
                           setBottomSheetCake(null);
                        }}
                        className="py-3.5 px-6 rounded-xl font-medium text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                     >
                       Убрать
                     </button>
                  )}
                  <button
                    onClick={() => {
                      updateState({ cakeChoice: bottomSheetCake });
                      setBottomSheetCake(null);
                    }}
                    disabled={!state.fillingChoice}
                    className="flex-1 bg-[#FF6022] text-white py-3.5 rounded-xl font-medium shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                  >
                    {state.fillingChoice ? "Сохранить выбор" : "Выберите начинку"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
