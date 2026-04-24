//tests/hooks/useHistoryData.test.ts
// Mockit ENSIN
jest.mock('@/hooks/useWorkEntries', () => ({
  useWorkEntries: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
  }),
}));

jest.mock('@/utils/holidayUtils', () => ({
  getHolidayForDate: jest.fn(),
}));

import { getHolidayForDate } from '@/utils/holidayUtils';
import { useHistoryData } from "@/hooks/useHistoryData";
import { useWorkEntries } from "@/hooks/useWorkEntries";
import { getLocalDateString } from '@/utils/dateUtils';
import { act, renderHook } from "@testing-library/react-native";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-03'));
});

afterAll(() => {
  jest.useRealTimers();
});

it('palauttaa oletusarvot', () => {
  (useWorkEntries as jest.Mock).mockReturnValue([]);

  const { result } = renderHook(() => useHistoryData());

  expect(result.current.view).toBe('week');
  expect(result.current.weekEntries).toEqual([]);
});

it('suodattaa vain valitun viikon entryt', () => {
  const entries = [
    { date: '2024-01-02', totalMinutes: 100 }, // viikko 1
    { date: '2024-02-02', totalMinutes: 200 }, // eri viikko
  ];

  (useWorkEntries as jest.Mock).mockReturnValue(entries);

  const { result } = renderHook(() => useHistoryData());

  expect(result.current.weekEntries.length).toBe(1);
});

it('siirtyy edelliseen viikkoon', () => {
  const { result } = renderHook(() => useHistoryData());

  const initialWeek = result.current.weekNumber;

  act(() => {
    result.current.goToPreviousWeek();
  });

  expect(result.current.weekNumber).not.toBe(initialWeek);
});

it('resetoi nykyiseen viikkoon', () => {
  const { result } = renderHook(() => useHistoryData());

  act(() => {
    result.current.goToPreviousWeek();
    result.current.goToCurrentWeek();
  });

  expect(result.current.selectedWeek).toBeNull();
});

it('suodattaa kuukauden entryt oikein', () => {
  const entries = [
    { date: '2024-01-02', totalMinutes: 100 },
    { date: '2024-02-02', totalMinutes: 200 },
  ];

  (useWorkEntries as jest.Mock).mockReturnValue(entries);

  const { result } = renderHook(() => useHistoryData());

  expect(result.current.monthEntries.length).toBeGreaterThan(0);
});

it('muuttaa kuukautta offsetilla', () => {
  const { result } = renderHook(() => useHistoryData());

  act(() => {
    result.current.setMonthOffset(-1);
  });

  expect(result.current.monthOffset).toBe(-1);
});

it('valitsee viikon ja vaihtaa view weekiksi', () => {
  const { result } = renderHook(() => useHistoryData());

  act(() => {
    result.current.selectWeek(5);
  });

  expect(result.current.view).toBe('week');
  expect(result.current.selectedWeek?.week).toBe(5);
});



it('lisää pyhäpäivän jos ei entryä', () => {
  (useWorkEntries as jest.Mock).mockReturnValue([]);

  (getHolidayForDate as jest.Mock).mockImplementation((date) => {
  const iso = date.toISOString().split('T')[0];

  if (iso === '2024-01-02') {
    return { name: 'Holiday' };
  }

  return null;
});

  const { result } = renderHook(() => useHistoryData());

  const holidayEntry = result.current.weekEntries.find(
    e => e.type === 'holiday'
  );

  expect(holidayEntry).toBeDefined();
});

it('ei lisää pyhäpäivää jos entry jo olemassa', () => {
  const entries = [
    { date: '2024-01-02', totalMinutes: 100 },
  ];

  (useWorkEntries as jest.Mock).mockReturnValue(entries);

  (getHolidayForDate as jest.Mock).mockImplementation((date) => {
  const iso = getLocalDateString(date);

  if (iso === '2024-01-02') {
    return { name: 'Holiday' };
  }

  return null;
});

  const { result } = renderHook(() => useHistoryData());

  const holidays = result.current.weekEntries.filter(
    e => e.type === 'holiday'
  );

  expect(holidays.length).toBe(0);
});