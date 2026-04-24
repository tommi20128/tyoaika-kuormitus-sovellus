// tests/utils/workUtils.test.ts

import { sumMinutes, average } from '@/utils/workUtils';
import { buildTimelineEntries } from '@/utils/timelineUtils';
import { getWeekRange } from '@/utils/dateUtils';

describe('workUtils', () => {

  // -------------------------
  // sumMinutes
  // -------------------------
  describe('sumMinutes', () => {
    it('laskee minuuttien summan oikein', () => {
      const data = [
        { totalMinutes: 60 },
        { totalMinutes: 30 },
        { totalMinutes: 90 },
      ] as any;

      expect(sumMinutes(data)).toBe(180);
    });

    it('palauttaa 0 tyhjälle taulukolle', () => {
      expect(sumMinutes([])).toBe(0);
    });
  });

  // -------------------------
  // average
  // -------------------------
  describe('average', () => {
    it('laskee keskiarvon oikein', () => {
      expect(average([2, 4, 6])).toBe(4);
    });

    it('palauttaa 0 jos ei arvoja', () => {
      expect(average([])).toBe(0);
    });
  });
});

describe('timelineUtils', () => {

  const DAILY_TARGET_HOURS = 7.5;

  // -------------------------
  // buildTimelineEntries
  // -------------------------
  describe('buildTimelineEntries', () => {

    it('lisää työpäivän oikein', () => {
      const entries = [
        {
          id: '1',
          userId: 'u1',
          date: '2024-01-02',
          totalMinutes: 480,
          type: 'work',
        },
      ] as any;

      const result = buildTimelineEntries(
        entries,
        new Date('2024-01-02'),
        new Date('2024-01-02'),
        DAILY_TARGET_HOURS
      );

      expect(result.length).toBe(1);
      expect(result[0].totalMinutes).toBe(480);
      expect(result[0].type).toBe('work');
    });

    it('lisää tyhjän päivän (0 min) jos ei merkintää', () => {
      const result = buildTimelineEntries(
        [],
        new Date('2024-01-03'), // keskiviikko
        new Date('2024-01-03'),
        DAILY_TARGET_HOURS
      );

      expect(result.length).toBe(1);
      expect(result[0].type).toBe('empty');
      expect(result[0].totalMinutes).toBe(0);
    });

    it('lisää pyhäpäivän 7.5h jos ei merkintää', () => {
      // HUOM: valitse päivä joka on varmasti pyhä (esim. 1.1.)
      const result = buildTimelineEntries(
        [],
        new Date('2024-01-01'),
        new Date('2024-01-01'),
        DAILY_TARGET_HOURS
      );

      expect(result.length).toBe(1);
      expect(result[0].type).toBe('holiday');
      expect(result[0].totalMinutes).toBe(450); // 7.5h
    });

    it('ei lisää viikonloppuja', () => {
      const result = buildTimelineEntries(
        [],
        new Date('2024-01-06'), // lauantai
        new Date('2024-01-07'), // sunnuntai
        DAILY_TARGET_HOURS
      );

      expect(result.length).toBe(0);
    });
  });
});

describe('dateUtils', () => {

  // -------------------------
  // getWeekRange
  // -------------------------
  describe('getWeekRange', () => {
    it('palauttaa maanantain ja sunnuntain oikein', () => {
      const { monday, sunday } = getWeekRange(new Date('2024-01-03')); // keskiviikko

      expect(monday.getDay()).toBe(1); // maanantai
      expect(sunday.getDay()).toBe(0); // sunnuntai
    });

    it('maanantai on ennen sunnuntaita', () => {
      const { monday, sunday } = getWeekRange(new Date());

      expect(monday.getTime()).toBeLessThanOrEqual(sunday.getTime());
    });
  });
});
