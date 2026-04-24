//tests/hooks/useDashboardData.test.ts
import { renderHook } from '@testing-library/react-native';
import { useDashboardData } from '@/hooks/useDashboardData';

// Mockataan riippuvuudet
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
  }),
}));

jest.mock('@/hooks/useWorkEntries', () => ({
  useWorkEntries: jest.fn(),
}));

jest.mock('@/utils/timelineUtils', () => ({
  buildTimelineEntries: jest.fn(),
}));

import { useWorkEntries } from '@/hooks/useWorkEntries';
import { buildTimelineEntries } from '@/utils/timelineUtils';

describe('useDashboardData', () => {

  const mockEntries = [
    {
      id: '1',
      userId: 'u1',
      date: '2024-01-02',
      totalMinutes: 480,
      workload: 5,
      stress1: 6,
      stress2: 7,
      type: 'work',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // PERUSTILA
  // -------------------------
  it('palauttaa tyhjät arvot jos ei merkintöjä', () => {
    (useWorkEntries as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasEntries).toBe(false);
    expect(result.current.todayEntry).toBeNull();
    expect(result.current.weekSummary).toBeNull();
  });

  // -------------------------
  // DATAA ON
  // -------------------------
  it('asettaa hasEntries true kun dataa on', () => {
    (useWorkEntries as jest.Mock).mockReturnValue(mockEntries);

    (buildTimelineEntries as jest.Mock).mockReturnValue(mockEntries);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasEntries).toBe(true);
  });

  // -------------------------
  // TODAY ENTRY
  // -------------------------
  it('löytää tämän päivän merkinnän', () => {
    const today = new Date().toISOString().split('T')[0];

    const entries = [
      {
        ...mockEntries[0],
        date: today,
      },
    ];

    (useWorkEntries as jest.Mock).mockReturnValue(entries);
    (buildTimelineEntries as jest.Mock).mockReturnValue(entries);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.todayEntry).not.toBeNull();
    expect(result.current.todayEntry?.date).toBe(today);
  });

  // -------------------------
  // WEEK SUMMARY
  // -------------------------
  it('laskee weekSummary oikein', () => {
    (useWorkEntries as jest.Mock).mockReturnValue(mockEntries);

    (buildTimelineEntries as jest.Mock).mockReturnValue(mockEntries);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.weekSummary).not.toBeNull();
    expect(result.current.weekSummary?.hours).toBeGreaterThanOrEqual(0);
  });

  // -------------------------
  // TOTAL SUMMARY
  // -------------------------
  it('laskee totalSummary oikein', () => {
    (useWorkEntries as jest.Mock).mockReturnValue(mockEntries);

    (buildTimelineEntries as jest.Mock).mockReturnValue(mockEntries);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.totalSummary).not.toBeNull();
    expect(result.current.totalSummary?.goalDiff).toBeDefined();
  });

  // -------------------------
  // GOAL DIFF LOGIIKKA
  // -------------------------
  it('goalDiff on 0 jos tehty = tavoite', () => {
    const entries = [
      {
        id: '1',
        userId: 'u1',
        date: '2024-01-02',
        totalMinutes: 450, // 7.5h
        workload: 5,
        stress1: 5,
        stress2: 5,
        type: 'work',
      },
    ];

    (useWorkEntries as jest.Mock).mockReturnValue(entries);
    (buildTimelineEntries as jest.Mock).mockReturnValue(entries);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.totalSummary?.goalDiff).toBe(0);
  });

});