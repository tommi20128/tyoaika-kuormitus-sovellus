// utils/timelineUtils.ts

import { DailyWorkEntry } from '@/types';
import { getHolidayForDate } from './holidayUtils';

// -------------------------
// Muotoilee päivämäärän turvallisesti (ei UTC-bugia)
// -------------------------
const formatDate = (d: Date) =>
  d.toLocaleDateString('sv-SE'); // YYYY-MM-DD

// -------------------------
// Rakentaa täydellisen päivälistan (timeline)
//
// Tämä on koko sovelluksen ydin:
// - lisää puuttuvat arkipäivät
// - lisää pyhäpäivät (7.5h)
// - lisää tyhjät päivät (0h)
// - EI sisällä viikonloppuja
//
// Säännöt:
// 1. Työkirjaus voittaa aina
// 2. Pyhäpäivä = 7.5h jos ei kirjausta
// 3. Normaali päivä ilman kirjausta = 0h
// -------------------------
export const buildTimelineEntries = (
  entries: DailyWorkEntry[],
  start: Date,
  end: Date,
  dailyTargetHours: number
): DailyWorkEntry[] => {

  const result: DailyWorkEntry[] = [];

  // Map nopeaan hakuun (date → entry)
  const entryMap = new Map(
    entries.map(e => [e.date, e])
  );

  const iterator = new Date(start);

  while (iterator <= end) {

    const day = iterator.getDay();

    // Skipataan viikonloput (su=0, la=6)
    if (day === 0 || day === 6) {
      iterator.setDate(iterator.getDate() + 1);
      continue;
    }

    const dateStr = formatDate(iterator);

    const existing = entryMap.get(dateStr);

    // -------------------------
    // 1. Jos käyttäjän kirjaus löytyy
    // -------------------------
    if (existing) {
      result.push({
        ...existing,
        type: 'work', // varmistetaan type UI:ta varten
      });

    } else {

      const holiday = getHolidayForDate(iterator);

      // -------------------------
      // 2. Pyhäpäivä (ei kirjausta)
      // -------------------------
      if (holiday) {
        result.push({
          date: dateStr,
          totalMinutes: dailyTargetHours * 60,
          workload: undefined,
          stress1: undefined,
          stress2: undefined,
          type: 'holiday',
          note: holiday.name,

          // Nämä ei ole oikeaa Firestore-dataa
          id: '',
          userId: '',
        });

        // -------------------------
        // 3. Normaali tyhjä päivä
        // -------------------------
      } else {
        result.push({
          date: dateStr,
          totalMinutes: 0,
          workload: undefined,
          stress1: undefined,
          stress2: undefined,
          type: 'empty',
          note: 'Ei merkintöjä',

          id: '',
          userId: '',
        });
      }
    }

    iterator.setDate(iterator.getDate() + 1);
  }

  return result;
};