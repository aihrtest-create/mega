import re

with open("src/app/components/step-shows.tsx", "r") as f:
    content = f.read()

premium_shows_str = """
export const PREMIUM_SHOWS = [
  { id: "neon_soap", name: "Шоу неоновых мыльных пузырей", price: 16000, surcharge: 4000, emoji: "🔮", desc: "Яркое неоновое шоу мыльных пузырей, светящихся в темноте. Волшебная атмосфера и потрясающие фотографии обеспечены!", gradient: "from-[#f857a6] to-[#ff5858]" },
  { id: "neon_paper", name: "Неоновое бумажное шоу", price: 18000, surcharge: 7000, emoji: "✨", desc: "Светящаяся в ультрафиолете бумага, зажигательная музыка и невероятные эмоции! Отличный выбор для крутой вечеринки.", gradient: "from-[#4facfe] to-[#00f2fe]" },
  { id: "ribbon", name: "Ленточное шоу", price: 18000, surcharge: 7000, emoji: "🎀", desc: "Километры ярких разноцветных лент, в которых можно купаться, прыгать и танцевать. Абсолютно безопасно и очень весело!", gradient: "from-[#fa709a] to-[#fee140]" },
  { id: "animals", name: "Фокус программа с животными", price: 35000, surcharge: 25000, emoji: "🐰", desc: "Удивительные фокусы и трюки с участием милых и дрессированных животных. Восторг для детей любого возраста!", gradient: "from-[#43e97b] to-[#38f9d7]" },
  { id: "illusionist", name: "Фокусник-иллюзионист", price: 30000, surcharge: 16000, emoji: "🎩", desc: "Настоящая магия и необъяснимые иллюзии от профессионального фокусника. Захватывающее представление для всей семьи.", gradient: "from-[#667eea] to-[#764ba2]" },
  { id: "cryo", name: "Крио-шоу с мороженым", price: 20000, surcharge: 5000, emoji: "🍦", desc: "Эффектное шоу с жидким азотом, где каждый участник сможет попробовать вкуснейшее крио-мороженое, приготовленное прямо на его глазах!", gradient: "from-[#89f7fe] to-[#66a6ff]" }
];

export const ALL_SHOWS = [...SHOWS, ...PREMIUM_SHOWS];
"""

# Insert PREMIUM_SHOWS after SHOWS
content = content.replace("];\n\nexport function StepShows() {", "];\n" + premium_shows_str + "\nexport function StepShows() {")

# Replace SHOWS.find with ALL_SHOWS.find
content = content.replace("SHOWS.find", "ALL_SHOWS.find")

# Replace the grid rendering block
grid_block_pattern = r"\{/\* Grid of Shows \*/\}.*?\{\/\* Info Popup Modal \*/\}"
grid_replacement = """{/* Grid of Shows */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SHOWS.map((show) => {
          const isSelected = state.shows.includes(show.id);
          return (
            <motion.div
              key={show.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleShow(show.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient Placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${show.gradient} flex items-center justify-center`}>
                {(show as any).image ? (
                  <ImageWithFallback src={getPublicUrl((show as any).image)} alt={show.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{show.emoji}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top details: Button + Checkmark */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(show.id);
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

              {/* Bottom pill-like panel like location cards */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{show.name}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   {state.packageType === "exclusive" && (state.shows.length === 0 || state.shows[0] === show.id) 
                     ? (show.surcharge ? `Доплата ${show.surcharge.toLocaleString("ru-RU")} ₽` : "Включено") 
                     : `${show.price.toLocaleString("ru-RU")} ₽`}
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-4 mt-8">
        <Star className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Премиум-шоу</h3>
      </div>
      
      {/* Grid of Premium Shows */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PREMIUM_SHOWS.map((show) => {
          const isSelected = state.shows.includes(show.id);
          return (
            <motion.div
              key={show.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleShow(show.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient Placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${show.gradient} flex items-center justify-center`}>
                {(show as any).image ? (
                  <ImageWithFallback src={getPublicUrl((show as any).image)} alt={show.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{show.emoji}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top details: Button + Checkmark */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(show.id);
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

              {/* Bottom pill-like panel like location cards */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{show.name}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   {state.packageType === "exclusive" && (state.shows.length === 0 || state.shows[0] === show.id) 
                     ? (show.surcharge ? `Доплата ${show.surcharge.toLocaleString("ru-RU")} ₽` : "Включено") 
                     : `${show.price.toLocaleString("ru-RU")} ₽`}
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.shows.length > 0 && (isCustom || state.packageType === "exclusive" && state.shows.length > 1) && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022]">
            Выбрано платных: {isCustom ? state.shows.length : state.shows.length - 1} шоу ={" "}
            <span className="text-base font-semibold">
              {getTotalShowsPrice().toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {/* Info Popup Modal */}"""

content = re.sub(grid_block_pattern, grid_replacement, content, flags=re.DOTALL)

with open("src/app/components/step-shows.tsx", "w") as f:
    f.write(content)

