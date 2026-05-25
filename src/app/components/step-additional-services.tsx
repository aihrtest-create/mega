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
    image: "/activities/photographer.png",
  },
  {
    id: "aqua",
    name: "Hello Аквагрим",
    price: 7000,
    duration: "60 мин",
    extra: "10 человек",
    desc: 'Профессиональный аквагримёр создаст яркие рисунки на лицах детей — бабочки, супергерои, тигры и всё что пожелает маленький гость.',
    gradient: "from-[#fbc2eb] to-[#a6c1ee]",
    image: "/activities/aquagrim.png",
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
      {/* Title */}
      <div className="mb-8 pl-1">
        <h2 className="text-[34px] font-black text-[#5C28B6] leading-[1.1] tracking-tight">
          Дополнительные услуги
        </h2>
      </div>

      {/* Grid of Services — Stacked vertically */}
      <div className="flex flex-col gap-10 mb-8">
        {SERVICES.map((service) => {
          const isSelected = state.additionalServices.includes(service.id);
          return (
            <motion.div
              key={service.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleService(service.id)}
              className="flex flex-col cursor-pointer group"
            >
              {/* Image Container with Badges */}
              <div className="relative">
                <div className={`relative aspect-[16/10] w-full rounded-[36px] overflow-hidden border-[4px] transition-all duration-300 ${
                  isSelected 
                    ? "border-[#FF6022] shadow-[0_12px_24px_rgba(255,96,34,0.15)] scale-[1.01]" 
                    : "border-transparent shadow-md hover:shadow-lg"
                }`}>
                  <ImageWithFallback
                    src={getPublicUrl(service.image)}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Top Left/Right overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfo(service.id);
                      }}
                      className="bg-white/95 backdrop-blur-md text-[#5C28B6] hover:bg-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Подробнее
                    </button>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30" 
                          : "bg-white/40 backdrop-blur-md text-transparent border border-white/60"
                    }`}>
                       <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Overlapping Badges at Bottom Right */}
                <div className="absolute bottom-[-16px] right-6 flex gap-2.5 z-20">
                  {/* Pink Badge */}
                  <div className="w-16 h-16 rounded-full bg-[#f83e81] text-white flex flex-col items-center justify-center text-center shadow-lg transform translate-y-2">
                    <span className="text-[14px] font-black leading-none">60</span>
                    <span className="text-[9px] font-bold leading-none mt-0.5">минут</span>
                  </div>
                  {/* Green Badge */}
                  <div className="w-16 h-16 rounded-full bg-[#00f05e] text-black flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-[14px] font-black leading-none">{service.id === 'photo' ? '40-50' : '10'}</span>
                    <span className="text-[9px] font-bold leading-none mt-0.5">{service.id === 'photo' ? 'фото' : 'человек'}</span>
                  </div>
                </div>
              </div>

              {/* Text Section Below Image */}
              <div className="mt-4 pl-2 flex flex-col items-start">
                <h3 className="text-[20px] font-black text-[#5C28B6] tracking-tight leading-tight transition-colors group-hover:text-[#4A1E96]">
                  {service.name}
                </h3>
                <div className="inline-block bg-[#ffc202] text-black text-[13px] font-black px-5 py-1.5 rounded-full mt-2 shadow-sm">
                  {service.price.toLocaleString("ru-RU")}₽
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.additionalServices.length > 0 && (
        <div className="bg-[#5C28B6]/5 rounded-3xl p-4 mb-6 text-center border border-[#5C28B6]/15">
          <p className="text-sm text-[#5C28B6] font-medium">
            Выбрано: {state.additionalServices.length} услуги ={" "}
            <span className="text-base font-extrabold">
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedInfo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative z-10"
            >
              <div className="relative shrink-0">
                <div className={`aspect-[16/10] w-full bg-gradient-to-br ${selectedDetails.gradient} flex items-center justify-center`}>
                  <ImageWithFallback src={getPublicUrl(selectedDetails.image)} alt={selectedDetails.name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto overscroll-contain">
                <h3 className="text-2xl font-black text-[#5C28B6] mb-1">{selectedDetails.name}</h3>
                <p className="text-[13px] text-[#FF6022] font-black mb-3">{selectedDetails.duration} · {selectedDetails.extra}</p>
                <p className="text-[#747474] text-sm leading-relaxed mb-6 font-medium">{selectedDetails.desc}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isSelected = state.additionalServices.includes(selectedDetails.id);
                      if (!isSelected) {
                        updateState({ additionalServices: [...state.additionalServices, selectedDetails.id] });
                      }
                      setSelectedInfo(null);
                    }}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-center transition-all ${
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
                      className="py-3.5 px-4 rounded-2xl font-bold text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
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
