// utils/holidayUtils.ts
import Holidays from 'date-holidays';

// Luodaan yksi instanssi (ei joka kutsulla uudestaan)
const hd = new Holidays('FI');

// -------------------------
// Tarkistaa onko päivä pyhäpäivä
// -------------------------
export const getHolidayForDate = (date: Date) => {

  const result = hd.isHoliday(date);

  if (!result) return null;

  return result[0];
};

// -------------------------
// Palauttaa pyhäpäivän nimen
// -------------------------
export const getHolidayName = (date: Date): string | null => {
  const holiday = getHolidayForDate(date);

  return holiday ? holiday.name : null;
};

// -------------------------
// Tarkistaa onko päivä pyhä
// -------------------------
export const isHoliday = (date: Date): boolean => {
  return getHolidayForDate(date) !== null;
};

// -------------------------
// Muodostaa "Kortti"-merkinnän
// -------------------------
export const getHolidayEntryNote = (date: Date): string | null => {
  const holiday = getHolidayForDate(date);

  if (!holiday) return null;

  return `Pyhäpäivä: ${holiday.name}`;
};