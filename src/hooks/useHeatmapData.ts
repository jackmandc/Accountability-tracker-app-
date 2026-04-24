import { useMemo } from 'react';
import { useHabitStore } from '../store/habitStore';
import { useCheckInStore } from '../store/checkInStore';
import { getLast90Days, getMonWeekStart } from '../lib/dateUtils';
import { isDueToday } from '../lib/habitUtils';
import type { HeatmapDay } from '../types';

export function useHeatmapData(person: 'me' | 'partner'): HeatmapDay[] {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const days = getLast90Days();

    return days.map((dateStr) => {
      const weekStart = getMonWeekStart(dateStr);
      const weekCheckIns = checkIns.filter((c) => {
        const ws = getMonWeekStart(c.date);
        return c.person === person && ws === weekStart;
      });

      const dueHabits = habits.filter(
        (h) =>
          !h.archivedAt &&
          (h.owner === person || h.owner === 'both') &&
          dateStr >= h.createdAt &&
          isDueToday(h, dateStr, weekCheckIns)
      );

      const completed = dueHabits.filter((h) =>
        checkIns.some(
          (c) => c.habitId === h.id && c.person === person && c.date === dateStr
        )
      ).length;

      const total = dueHabits.length;
      const rate = total === 0 ? 0 : completed / total;

      return { date: dateStr, total, completed, rate };
    });
  }, [habits, checkIns, person]);
}
