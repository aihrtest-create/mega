import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Info, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const SERVICES = [
  {
    id: "photo",
    name: "Hello Фотограф",
    price: 7000,
    duration: "60 мин",
    extra: "40–50 фото",
    desc: 'Профессиональный фотограф запечатлеет самые яркие моменты праздника. В комплект входит 40–50 обработанных фотографий, которые останутся на память навсегда.',
    gradient: "from-[#d4fc79] to-[#96e6a1]",
    image: "/activities/mini_disco.webp",
  },
  {
    id: "aqua",
    name: "Hello Аквагрим",
    price: 7000,
    duration: "60 мин",
    extra: "10 человек",
    desc: 'Профессиональный аквагримёр создаст яркие рисунки на лицах детей — бабочки, супергерои, тигры и всё что пожелает маленький гость.',
    gradient: "from-[#fbc2eb] to-[#a6c1ee]",
    image: "/activities/mini_disco.webp",
  },
];

export function StepAdditionalServices() {
  const { state, updateState } = useWizard();
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const selectedDetails = SERVICES.find(s => s.id === selectedInfo);

  const toggleService = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = state.additionalServices;
    if (current.includes(id)) {
      updateState({ additionalServices: current.filter((m) => m !== id) });
    } else {
      updateState({ additionalServices: [...current, id] });
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📸</span>
          Дополнительные услуги
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Выберите дополнительные услуги для праздника
        </p>
      </div>

      {/* Grid of Services — 2 columns to match standard style */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SERVICES.map((service) => {
          const isSelected = state.additionalServices.includes(service.id);
          return (
            <motion.div
              key={service.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleService(service.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                <ImageWithFallback
                  src={getPublicUrl(service.image)}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top: Info button + Checkmark */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(service.id);
                  }}
                  className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                >
                  <Info className="w-3.5 h-3.5" />
                  Подробнее
                </button>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom pill panel */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[60px]">
                <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{service.name}</h4>
                <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                  {service.price.toLocaleString("ru-RU")} ₽ · {service.extra}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.additionalServices.length > 0 && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022]">
            Выбрано: {state.additionalServices.length} услуги ={" "}
            <span className="text-base font-semibold">
              {state.additionalServices.reduce((acc, id) => {
                const s = SERVICES.find(x => x.id === id);
                return acc + (s?.price || 0);
              }, 0).toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {/* Info Popup Modal */}
      <AnimatePresence>
        {selectedInfo && selectedDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedInfo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto relative z-10"
            >
              <div className="relative shrink-0">
                <div className={`aspect-[4/5] max-h-[40vh] w-full bg-gradient-to-br ${selectedDetails.gradient} flex items-center justify-center`}>
                  <ImageWithFallback src={getPublicUrl(selectedDetails.image)} alt={selectedDetails.name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto overscroll-contain">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{selectedDetails.name}</h3>
                <p className="text-[13px] text-[#FF6022] font-bold mb-3">{selectedDetails.duration} · {selectedDetails.extra}</p>
                <p className="text-[#747474] text-sm leading-relaxed mb-6">{selectedDetails.desc}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isSelected = state.additionalServices.includes(selectedDetails.id);
                      if (!isSelected) {
                        updateState({ additionalServices: [...state.additionalServices, selectedDetails.id] });
                      }
                      setSelectedInfo(null);
                    }}
                    className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                      state.additionalServices.includes(selectedDetails.id)
                        ? "bg-[#F5F5F5] text-[#747474]"
                        : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                    }`}
                  >
                    {state.additionalServices.includes(selectedDetails.id) ? "Добавлено" : "Добавить в праздник"}
                  </button>

                  {state.additionalServices.includes(selectedDetails.id) && (
                    <button
                      onClick={() => {
                        updateState({ additionalServices: state.additionalServices.filter(id => id !== selectedDetails.id) });
                        setSelectedInfo(null);
                      }}
                      className="py-3.5 px-4 rounded-xl font-medium text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      Убрать
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
    </>
  );
}
