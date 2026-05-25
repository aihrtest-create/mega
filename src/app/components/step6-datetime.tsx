import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Calendar, Clock, Users, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
  isWeekend,
} from "date-fns";
import { ru } from "date-fns/locale";

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const WEEKDAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function Step6DateTime() {
  const { state, updateState } = useWizard();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    let dayOfWeek = getDay(start);
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const padding = Array(dayOfWeek).fill(null);

    return [...padding, ...days];
  }, [currentMonth]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📅</span>
          Дата и время
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Когда состоится праздник?</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#E5E5E5]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h4 className="text-sm text-[#1A1A1A] capitalize">
            {format(currentMonth, "LLLL yyyy", { locale: ru })}
          </h4>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#E5E5E5]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_NAMES.map((d) => (
            <div key={d} className="text-center text-xs text-[#ABABAB] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;

            const isPast = isBefore(day, today);
            const isSelected = state.date && isSameDay(day, state.date);
            const isWeekendDay = isWeekend(day);

            return (
              <button
                key={day.toISOString()}
                disabled={isPast}
                onClick={() => updateState({ date: day, isWeekend: isWeekendDay })}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm transition-all ${
                  isSelected
                    ? "bg-[#FF6022] text-white shadow-md"
                    : isPast
                    ? "text-[#E5E5E5] cursor-not-allowed"
                    : isWeekendDay
                    ? "text-[#FF6022] hover:bg-[#FF6022]/5"
                    : "text-[#1A1A1A] hover:bg-[#F5F5F5]"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>

        {state.date && isWeekend(state.date) && (
          <div className="mt-3 bg-[#FF6022]/5 rounded-xl px-3 py-2 text-center border border-[#FF6022]/10">
            <p className="text-xs text-[#FF6022]">
              Выходной день — действуют выходные тарифы
            </p>
          </div>
        )}
      </div>

      {/* Time slots */}
      <div id="time-section" className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Время начала</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => updateState({ time })}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                state.time === time
                  ? "bg-[#FF6022] text-white shadow-md"
                  : "bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Guest count */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Количество гостей</h3>
        </div>

        <div className="space-y-3">
          {/* Children */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E5E5E5]">
            <div>
              <p className="text-sm text-[#1A1A1A]">Дети</p>
              <p className="text-xs text-[#ABABAB]">Именинник + друзья</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateState({
                    childrenCount: Math.max(1, state.childrenCount - 1),
                  })
                }
                className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg text-[#1A1A1A] w-8 text-center">
                {state.childrenCount}
              </span>
              <button
                onClick={() =>
                  updateState({ childrenCount: state.childrenCount + 1 })
                }
                className="w-8 h-8 rounded-full bg-[#FF6022] flex items-center justify-center text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Adults */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E5E5E5]">
            <div>
              <p className="text-sm text-[#1A1A1A]">Взрослые</p>
              <p className="text-xs text-[#ABABAB]">Родители и сопровождающие</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateState({
                    adultsCount: Math.max(0, state.adultsCount - 1),
                  })
                }
                className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg text-[#1A1A1A] w-8 text-center">
                {state.adultsCount}
              </span>
              <button
                onClick={() =>
                  updateState({ adultsCount: state.adultsCount + 1 })
                }
                className="w-8 h-8 rounded-full bg-[#FF6022] flex items-center justify-center text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}