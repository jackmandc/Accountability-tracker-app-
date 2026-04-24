import type { Habit, CheckIn } from '../types';
import { getDayOfWeek, getMonWeekStart, getLast90Days, todayStr } from './dateUtils';

export function isDueToday(
  habit: Habit,
  dateStr: string,
  checkInsThisWeek: CheckIn[]
): boolean {
  const dow = getDayOfWeek(dateStr); // 0=Sun, 6=Sat
  const { type, daysPerWeek } = habit.frequency;

  if (type === 'daily') return true;
  if (type === 'weekdays') return dow >= 1 && dow <= 5;
  if (type === 'weekends') return dow === 0 || dow === 6;
  if (type === 'x_per_week') {
    const target = daysPerWeek ?? 1;
    const doneThisWeek = checkInsThisWeek.filter(
      (c) => c.habitId === habit.id
    ).length;
    return doneThisWeek < target;
  }
  return false;
}

export function isCheckedIn(
  habitId: string,
  person: 'me' | 'partner',
  dateStr: string,
  checkIns: CheckIn[]
): boolean {
  return checkIns.some(
    (c) => c.habitId === habitId && c.person === person && c.date === dateStr
  );
}

export function getCurrentStreak(
  habitId: string,
  person: 'me' | 'partner',
  habits: Habit[],
  checkIns: CheckIn[]
): number {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return 0;

  const days = getLast90Days().reverse(); // most recent first
  let streak = 0;

  for (const day of days) {
    // Skip days where the habit didn't exist yet
    if (day < habit.createdAt) break;
    // For x_per_week skip non-applicable days (just check if there's any checkin that day)
    const checked = checkIns.some(
      (c) => c.habitId === habitId && c.person === person && c.date === day
    );
    // For non-daily frequencies, we need to know if the habit was due that day
    // Simplified: for streaks, count any day a check-in exists for daily habits
    // For others, only penalise if due and not done
    const weekStart = getMonWeekStart(day);
    const weekCheckIns = checkIns.filter((c) => {
      const ws = getMonWeekStart(c.date);
      return c.person === person && ws === weekStart;
    });
    const due = isDueToday(habit, day, weekCheckIns);

    if (!due) continue; // skip days habit wasn't due
    if (checked) {
      streak++;
    } else {
      // Only break streak for days up to and including today
      if (day <= todayStr()) break;
    }
  }

  return streak;
}

export function getBestStreak(
  habitId: string,
  person: 'me' | 'partner',
  habits: Habit[],
  checkIns: CheckIn[]
): number {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return 0;

  const days = getLast90Days();
  let current = 0;
  let best = 0;

  for (const day of days) {
    if (day < habit.createdAt) continue;
    const weekStart = getMonWeekStart(day);
    const weekCheckIns = checkIns.filter((c) => {
      const ws = getMonWeekStart(c.date);
      return c.person === person && ws === weekStart;
    });
    const due = isDueToday(habit, day, weekCheckIns);
    if (!due) continue;

    const checked = checkIns.some(
      (c) => c.habitId === habitId && c.person === person && c.date === day
    );
    if (checked) {
      current++;
      if (current > best) best = current;
    } else {
      if (day <= todayStr()) current = 0;
    }
  }

  return best;
}

export function getOverallStreak(
  person: 'me' | 'partner',
  habits: Habit[],
  checkIns: CheckIn[]
): number {
  const active = habits.filter((h) => !h.archivedAt);
  if (active.length === 0) return 0;

  const days = getLast90Days().reverse();
  let streak = 0;

  for (const day of days) {
    const weekStart = getMonWeekStart(day);
    const weekCheckIns = checkIns.filter((c) => {
      const ws = getMonWeekStart(c.date);
      return c.person === person && ws === weekStart;
    });

    const dueHabits = active.filter(
      (h) => !h.archivedAt && day >= h.createdAt && isDueToday(h, day, weekCheckIns)
    );
    if (dueHabits.length === 0) continue;

    const allDone = dueHabits.every((h) =>
      checkIns.some(
        (c) => c.habitId === h.id && c.person === person && c.date === day
      )
    );

    if (allDone) {
      streak++;
    } else {
      if (day <= todayStr()) break;
    }
  }

  return streak;
}

export function getOverallBestStreak(
  person: 'me' | 'partner',
  habits: Habit[],
  checkIns: CheckIn[]
): number {
  const active = habits.filter((h) => !h.archivedAt);
  if (active.length === 0) return 0;

  const days = getLast90Days();
  let current = 0;
  let best = 0;

  for (const day of days) {
    const weekStart = getMonWeekStart(day);
    const weekCheckIns = checkIns.filter((c) => {
      const ws = getMonWeekStart(c.date);
      return c.person === person && ws === weekStart;
    });

    const dueHabits = active.filter(
      (h) => !h.archivedAt && day >= h.createdAt && isDueToday(h, day, weekCheckIns)
    );
    if (dueHabits.length === 0) continue;

    const allDone = dueHabits.every((h) =>
      checkIns.some(
        (c) => c.habitId === h.id && c.person === person && c.date === day
      )
    );

    if (allDone) {
      current++;
      if (current > best) best = current;
    } else {
      if (day <= todayStr()) current = 0;
    }
  }

  return best;
}
