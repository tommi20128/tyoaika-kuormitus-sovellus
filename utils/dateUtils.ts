// utils/dateUtils.ts

// Apufunktioita päivämäärien käsittelyyn
// Näitä käytetään mm. historia- ja etusivun näkymissä viikko- ja kuukausidatan laskemiseen ja muotoiluun

// HUOM!
// ISO-viikkojen laskenta perustuu siihen, että viikon vuosi määräytyy torstain mukaan.
// Tästä syystä kalenterivuosi ja ISO-vuosi voivat erota toisistaan.

export const getMondayOfISOWeek = (week: number, year: number): Date => {

  // ISO viikkojen logiikka:
  const simple = new Date(year, 0, 1 + (week - 1) * 7);

  const dayOfWeek = simple.getDay();

  const diff = simple.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  return new Date(simple.setDate(diff));
};

// --------------------------------------------------
// Palauttaa ISO-viikon numeron annetulle päivämäärälle.
// --------------------------------------------------
export const getISOWeekNumber = (date: Date): number => {

  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

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

// --------------------------------------------------
// Palauttaa ISO-viikon VUODEN (voi olla eri kuin kalenterivuosi)
// --------------------------------------------------
export const getISOWeekYear = (date: Date): number => {

  // Suojaus virheelliselle päivälle
  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);

  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));

  return temp.getFullYear();
};

// Palauttaa päivämäärän muodossa YYYY-MM-DD (local time)
export const getLocalDateString = (date: Date): string => {

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// --------------------------------------------------
// PARSII YYYY-MM-DD STRINGIN TURVALLISESTI
// EI käytä new Date(string) koska se voi aiheuttaa timezone-bugeja
// --------------------------------------------------
export const parseLocalDate = (dateString: string): Date => {

  // Suojaus tyhjälle tai virheelliselle arvolle
  if (!dateString) {
    throw new Error('Invalid date string');
  }

  const [year, month, day] = dateString.split('-').map(Number);

  // HUOM: month - 1 koska Date käyttää 0-indeksointia kuukausissa
  return new Date(year, month - 1, day);
};

// --------------------------------------------------
// Laskee annetun päivämäärän viikon aloitus- (maanantai) ja lopetuspäivän (sunnuntai).
// --------------------------------------------------
export const getWeekRange = (date: Date) => {

  // Suojaus virheelliselle päivälle
  if (!date || isNaN(date.getTime())) {
    const now = new Date();
    date = now;
  }

  // Kopioidaan päivämäärä ja asetetaan aika päivän alkuun
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // getDay(): 0 = sunnuntai, 1 = maanantai, ..., 6 = lauantai
  const day = d.getDay();

  // Lasketaan montako päivää pitää siirtää maanantaihin
  const diffToMonday = (day + 6) % 7;

  // Siirrytään maanantaihin
  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);

  // Sunnuntai = maanantai + 6 päivää
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
};

// --------------------------------------------------
// Tarkistaa, onko annettu viikko nykyinen viikko
// --------------------------------------------------
export const isCurrentWeek = (week: number, year: number) => {
  const now = new Date();

  return (
    week === getISOWeekNumber(now) &&
    year === getISOWeekYear(now)
  );
};

// --------------------------------------------------
// Tarkistaa, onko annettu päivämäärä nykyisessä kuukaudessa
// --------------------------------------------------
export const isCurrentMonth = (date: Date) => {
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

// --------------------------------------------------
// Tarkistaa, onko annettu viikko tulevaisuudessa suhteessa tämän viikon maanantaihin.
// --------------------------------------------------
export const isFutureWeek = (date: Date) => {
  const now = new Date();
  const thisWeekMonday = getWeekRange(now).monday;
  const targetMonday = getWeekRange(date).monday;

  return targetMonday > thisWeekMonday;
};

// --------------------------------------------------
// Tarkistaa, onko annettu kuukausi tulevaisuudessa suhteessa nykyiseen kuukauteen.
// --------------------------------------------------
export const isFutureMonth = (date: Date) => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const targetMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  return targetMonth > thisMonth;
};

// --------------------------------------------------
// Lyhyt päivämäärä esim. 14.10.
// --------------------------------------------------
export const formatShortDate = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
  });

// --------------------------------------------------
// Muodostaa viikon labelin esim. "Viikko 42 (2024) 14.10. – 20.10."
// --------------------------------------------------
export const formatWeekLabel = (
  weekNumber: number,
  year: number,
  monday: Date,
  sunday: Date
) => `Viikko ${weekNumber} (${year}) ${formatShortDate(monday)} – ${formatShortDate(sunday)}`;

// --------------------------------------------------
// Pitkä päivämäärä (esim. 19.2.2026 Maanantai)
// --------------------------------------------------
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

// --------------------------------------------------
// pitkä päivämäärä viikonpäivä ensin (esim. Maanantai 19.2.2026)
// --------------------------------------------------
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

// -------------------------
// Kuukauden nimi ja vuosi esim. "Lokakuu 2024"
// Käytetään historia-sivun kuukausinäkymien labelinä
// -------------------------
export const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('fi-FI', {
    month: 'long',
    year: 'numeric',
  });
