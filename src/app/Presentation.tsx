import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Zap, Layers, BarChart3, Smartphone, CheckCircle2 } from "lucide-react";

const slides = [
  {
    id: "intro",
    title: "Инновационный Конфигуратор Праздников",
    subtitle: "Увеличьте конверсию и средний чек с помощью интерактивного бронирования",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full mb-4">
          <Sparkles className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Будущее продаж <br />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Детских Праздников
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mt-6">
          Презентация нового цифрового продукта для менеджеров парков. Удобный, быстрый и прозрачный способ для клиентов собрать свой идеальный праздник.
        </p>
      </div>
    ),
  },
  {
    id: "step1",
    title: "Шаг 1: Вовлечение пользователя",
    subtitle: "Яркий стартовый экран, который продает эмоции",
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center h-full">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Простой старт</h2>
          <p className="text-lg text-gray-600">
            Пользователь начинает путь с ввода базовой информации: даты, времени и количества гостей. Никаких сложных форм — только легкий диалог.
          </p>
          <ul className="space-y-4 mt-8">
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="text-primary w-6 h-6" />
              <span>Минималистичный дизайн без отвлекающих факторов</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="text-primary w-6 h-6" />
              <span>Фокус на ключевом действии (Call to Action)</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="text-primary w-6 h-6" />
              <span>Адаптация под любые устройства</span>
            </li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-xl" />
          <img 
            src="/planner-park/screenshots/1-splash.webp" 
            alt="Splash Screen" 
            className="relative rounded-2xl shadow-2xl border border-gray-100 object-cover w-full h-auto aspect-[16/10]"
          />
        </div>
      </div>
    ),
  },
  {
    id: "step2",
    title: "Шаг 2: Выбор формата",
    subtitle: "Упакованные пакеты вместо сложного прайса",
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center h-full">
        <div className="order-2 md:order-1 relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
          <img 
            src="/planner-park/screenshots/2-base-package.webp" 
            alt="Base Packages" 
            className="relative rounded-2xl shadow-2xl border border-gray-100 object-cover w-full h-auto aspect-[16/10]"
          />
        </div>
        <div className="order-1 md:order-2 space-y-6">
          <h2 className="text-3xl font-bold">Структурированный выбор</h2>
          <p className="text-lg text-gray-600">
            Вместо того, чтобы заставлять клиента собирать праздник с нуля, мы предлагаем готовые форматы (пакеты), которые уже включают всё необходимое.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Layers className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold mb-1">Готовые пакеты</h4>
              <p className="text-sm text-gray-500">Упрощают принятие решения</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Zap className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className="font-semibold mb-1">Быстрый старт</h4>
              <p className="text-sm text-gray-500">Меньше отказов на старте</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "step3",
    title: "Шаг 3: Настройка и Upsale",
    subtitle: "Увеличение чека через прозрачные опции",
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center h-full">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Гибкая кастомизация</h2>
          <p className="text-lg text-gray-600">
            После выбора базового пакета, клиент может настроить его под себя: выбрать квесты, шоу, добавить аниматоров или торт. 
          </p>
          <div className="bg-gray-50 border-l-4 border-primary p-4 rounded-r-lg mt-6">
            <p className="text-gray-700 italic">
              "Плавающая панель с итоговой ценой всегда на виду. Клиент сразу видит, как добавление услуг влияет на стоимость, что повышает доверие."
            </p>
          </div>
          <ul className="space-y-3 mt-6">
            <li className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Прозрачный расчет цены</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Нативная продажа дополнительных услуг</span>
            </li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-3xl blur-xl" />
          <img 
            src="/planner-park/screenshots/3-package-selected.webp" 
            alt="Customization" 
            className="relative rounded-2xl shadow-2xl border border-gray-100 object-cover w-full h-auto aspect-[16/10]"
            style={{ objectPosition: 'top' }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "benefits",
    title: "Преимущества для бизнеса",
    subtitle: "Почему этот инструмент нужен вашему парку",
    content: (
      <div className="h-full flex flex-col justify-center">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Рост среднего чека</h3>
            <p className="text-gray-600">
              Визуальные подсказки и удобный интерфейс стимулируют клиентов добавлять больше дополнительных услуг.
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center"
          >
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Layers className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Разгрузка менеджеров</h3>
            <p className="text-gray-600">
              Менеджеры получают уже сформированные и оплаченные заявки, вместо того чтобы часами консультировать по телефону.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Mobile-First</h3>
            <p className="text-gray-600">
              80% клиентов бронируют с телефона. Наш конфигуратор идеально адаптирован под мобильные устройства.
            </p>
          </motion.div>
        </div>
      </div>
    ),
  }
];

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DR-construct</span>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          Слайд {currentSlide + 1} из {slides.length}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative max-w-7xl w-full mx-auto p-8 lg:p-12 flex flex-col">
        {currentSlide > 0 && (
          <div className="mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              key={`header-${currentSlide}`}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{slide.title}</h1>
              <p className="text-xl text-gray-500">{slide.subtitle}</p>
            </motion.div>
          </div>
        )}

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Controls */}
      <footer className="bg-white border-t border-gray-200 p-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            currentSlide === 0 
              ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
              : "text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            currentSlide === slides.length - 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-95"
          }`}
        >
          Далее
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
