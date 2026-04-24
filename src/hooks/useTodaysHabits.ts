import { useMemo } from 'react';
import { useHabitStore } from '../store/habitStore';
import { useCheckInStore } from '../store/checkInStore';
import { isDueToday, isCheckedIn } from '../lib/habitUtils';
import { todayStr, getMonWeekStart } from '../lib/dateUtils';
import type { Habit } from '../types';

export interface TodayHabit {
  habit: Habit;
  checked: boolean;
}

export function useTodaysHabits(person: 'me' | 'partner'): TodayHabit[] {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const today = todayStr();
    const weekStart = getMonWeekStart(today);

    const weekCheckIns = checkIns.filter((c) => {
      const ws = getMonWeekStart(c.date);
      return c.person === person && ws === weekStart;
    });

    return habits
      .filter((h) => {
        if (h.archivedAt) return false;
        if (h.owner !== person && h.owner !== 'both') return false;
        return isDueToday(h, today, weekCheckIns);
      })
      .map((habit) => ({
        habit,
        checked: isCheckedIn(habit.id, person, today, checkIns),
      }));
  }, [habits, checkIns, person]);
}
