import re

with open("src/app/components/step-shows.tsx", "r") as f:
    content = f.read()

shows_pattern = r"export const SHOWS = \[.*?\];"
shows_replacement = """export const SHOWS = [
  { id: "soap", name: "Шоу мыльных пузырей", price: 14000, surcharge: 0, emoji: "🫧", desc: "Самое популярное, незабываемое красочное шоу, вызывающее незабываемые впечатления у детей и взрослых! В ходе шоу гостей ожидает: • гусеница из пузырей • разноцветная радуга • погружение в гигнатский мыльный пузырь • целый рой из пузырей разного размера", gradient: "from-[#a1c4fd] to-[#c2e9fb]", image: "/shows/soap.png" },
  { id: "paper", name: "Бумажное шоу", price: 15000, surcharge: 0, emoji: "🎊", desc: "Невероятное шоу, которое превращает обычные танцы в безудержное веселье с огромным количеством бумаги. В ходе шоу гостей ожидает: • популярная музыка, воздушные пушки, целое море белой бумаги • интересные конкурсы и танцевальные баттлы • безудержное веселье • увлекательные игры", gradient: "from-[#ffecd2] to-[#fcb69f]", image: "/shows/paper.png" },
  { id: "tesla", name: "Тесла-шоу", price: 15000, surcharge: 0, emoji: "⚡", desc: "Научно-развлекательное представление, вдохновлённое изобретениями Николы Теслы. Оно превращает сложные физические явления в зрелищные эксперименты, создаёт атмосферу научно-фантастического праздника. В ходе шоу гостей ожидает: • демонстрация молний до 50 см на катушке Тесла • управление ручными молниями • зажигание люмиесцентных ламп • зажигание лампочки с помощью катушки Тесла", gradient: "from-[#a18cd1] to-[#fbc2eb]", image: "/shows/science.png" },
  { id: "professor", name: "Чокнутый профессор", price: 14000, surcharge: 0, emoji: "🧪", desc: "Это не просто занудный урок физики или химии, а интересная и захватывающая наука в действии. В ходе шоу гостей ожидает: • эксперимент «Яйцо в колбе» • настоящая дымовая завеса • игра «Жидкое или твёрдое?» • исчезновение предметов * Все эксперименты проводятся профессиональнообученными людьми и полностью безопасны для детей", gradient: "from-[#d4fc79] to-[#96e6a1]", image: "/shows/neon.png" }
];

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

content = re.sub(shows_pattern, shows_replacement, content, flags=re.DOTALL)

# Update finding logic
content = content.replace("SHOWS.find", "ALL_SHOWS.find")

# Add the premium grid logic
grid_pattern = r"\{/\* Grid of Shows \*/\}.*?\{state\.shows\.length > 0"
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
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{getShowName(show)}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   {state.packageType === "exclusive" && (state.shows.length === 0 || state.shows[0] === show.id) 
                     ? (getShowSurcharge(show.id) > 0 ? `Доплата ${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽` : "Включено") 
                     : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
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
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{getShowName(show)}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   {state.packageType === "exclusive" && (state.shows.length === 0 || state.shows[0] === show.id) 
                     ? (getShowSurcharge(show.id) > 0 ? `Доплата ${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽` : "Включено") 
                     : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.shows.length > 0"""

content = re.sub(grid_pattern, grid_replacement, content, flags=re.DOTALL)

with open("src/app/components/step-shows.tsx", "w") as f:
    f.write(content)
