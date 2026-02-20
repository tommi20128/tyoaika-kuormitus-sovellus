// utils/dateUtils.ts

// Apufunktioita päivämäärien käsittelyyn
// Näitä käytetään mm. historia- ja etusivun näkymissä viikko- ja kuukausidatan laskemiseen ja muotoiluun

// Palauttaa ISO-viikon numeron annetulle päivämäärälle.
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

// Laskee annetun päivämäärän viikon aloitus- (maanantai) ja lopetuspäivän (sunnuntai).
export const getWeekRange = (date: Date) => {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
};

// Tarkistaa, onko annettu viikko tulevaisuudessa suhteessa tämän viikon maanantaihin.
export const isFutureWeek = (date: Date) => {
  const now = new Date();
  const thisWeekMonday = getWeekRange(now).monday;
  const targetMonday = getWeekRange(date).monday;

  return targetMonday > thisWeekMonday;
};

// Tarkistaa, onko annettu kuukausi tulevaisuudessa suhteessa nykyiseen kuukauteen.
export const isFutureMonth = (date: Date) => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const targetMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  return targetMonth > thisMonth;
};

// Lyhyt päivämäärä esim. 14.10.
export const formatShortDate = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
  });

// Muodostaa viikon labelin esim. "Viikko 42 (2024) 14.10. – 20.10."
export const formatWeekLabel = (
  weekNumber: number,
  year: number,
  monday: Date,
  sunday: Date
) => `Viikko ${weekNumber} (${year}) ${formatShortDate(monday)} – ${formatShortDate(sunday)}`;

// Pitkä päivämäärä (esim. 19.2.2026 Maanantai)
export const formatFullDate = (date: Date) => {
  const datePart = date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const weekday = date.toLocaleDateString('fi-FI', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${datePart} ${capitalizedWeekday}`;
};

// pitkä päivämäärä viikonpäivä ensin (esim. Maanantai 19.2.2026)
export const formatReverseFullDate = (date: Date) => {
  const datePart = date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const weekday = date.toLocaleDateString('fi-FI', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday} ${datePart}`;
};

// Kuukauden nimi ja vuosi esim. "Lokakuu 2024"
// Käytetään historia-sivun kuukausinäkymien labelinä
export const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    month: 'long',
    year: 'numeric',
  });
