import { isWeekend } from "date-fns";

/**
 * Проверяет, является ли дата официальным праздничным/выходным днем в РФ на 2026 год.
 * Включает новогодние каникулы, майские праздники и праздничные переносы.
 */
export function isRussianHoliday2026(dateInput: Date | string | number | null | undefined): boolean {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return false;

  const year = date.getFullYear();
  if (year !== 2026) return false;

  const month = date.getMonth(); // 0-индексируемый: 0 = Январь, 1 = Февраль, и т.д.
  const day = date.getDate();

  // Январь: 1-8 (Новогодние каникулы и Рождество)
  if (month === 0 && day >= 1 && day <= 8) return true;

  // Февраль: 23 (День защитника Отечества)
  if (month === 1 && day === 23) return true;

  // Март: 8 (Международный женский день), 9 (перенос с 8 марта)
  if (month === 2 && (day === 8 || day === 9)) return true;

  // Май: 1-4 (Праздник Весны и Труда), 8-11 (День Победы)
  if (month === 4) {
    if (day >= 1 && day <= 4) return true;
    if (day >= 8 && day <= 11) return true;
  }

  // Июнь: 12 (День России)
  if (month === 5 && day === 12) return true;

  // Ноябрь: 4 (День народного единства)
  if (month === 10 && day === 4) return true;

  // Декабрь: 31 (перенесенный выходной день)
  if (month === 11 && day === 31) return true;

  return false;
}

/**
 * Проверяет, является ли день выходным (суббота/воскресенье) ИЛИ официальным праздником в РФ на 2026 год.
 */
export function isWeekendOrHoliday2026(dateInput: Date | string | number | null | undefined): boolean {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return false;

  return isWeekend(date) || isRussianHoliday2026(date);
}
