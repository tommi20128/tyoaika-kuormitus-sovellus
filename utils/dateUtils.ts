// utils/dateUtils.ts

// Apufunktioita päivämäärien käsittelyyn

// ISO viikon numero
export const getISOWeekNumber = (date: Date): number => {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);

  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

// ISO viikon alku ja loppu (maanantai ja sunnuntai)
export const getWeekRange = (date: Date) => {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
};

// Onko viikko tulevaisuudessa
export const isFutureWeek = (date: Date) => {
  const now = new Date();
  const thisWeekMonday = getWeekRange(now).monday;
  const targetMonday = getWeekRange(date).monday;

  return targetMonday > thisWeekMonday;
};

// Onko kuukausi tulevaisuudessa
export const isFutureMonth = (date: Date) => {
  const now = new Date();

  const thisMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const targetMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

  return targetMonth > thisMonth;
};

// Lyhyt päivämäärä
export const formatShortDate = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
  });

// Pitkä päivämäärä (esim. 19.2.2026 Maanantai)
export const formatFullDate = (date: Date) => {
  const datePart = date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const weekday = date.toLocaleDateString('fi-FI', {
    weekday: 'long',
  });

  // Muutetaan ensimmäinen kirjain isoksi
  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${datePart} ${capitalizedWeekday}`;
};

   // pitkä päivämäärä viikonpäivä ensin (esim. Maanantai 19.2.2026)
export const formatReverseFullDate = (date: Date) => {
  const datePart = date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const weekday = date.toLocaleDateString('fi-FI', {
    weekday: 'long',
  });

  // Muutetaan ensimmäinen kirjain isoksi
  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday} ${datePart}`;
};

// Kuukauden nimi ja vuosi
export const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    month: 'long',
    year: 'numeric',
  });
