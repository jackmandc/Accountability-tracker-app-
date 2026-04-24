import { useMemo } from 'react';
import { useHabitStore } from '../../store/habitStore';
import { useCheckInStore } from '../../store/checkInStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getOverallStreak } from '../../lib/habitUtils';
import { isDueToday } from '../../lib/habitUtils';
import { getCurrentWeekDates, getCurrentMonthDates, getMonWeekStart, todayStr } from '../../lib/dateUtils';

interface Props {
  person: 'me' | 'partner';
  period: 'week' | 'month';
}

export function ComparisonCard({ person, period }: Props) {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);
  const settings = useSettingsStore((s) => s.settings);
  const name = person === 'me' ? settings.myName : settings.partnerName;
  const streak = getOverallStreak(person, habits, checkIns);

  const stats = useMemo(() => {
    const dates = period === 'week' ? getCurrentWeekDates() : getCurrentMonthDates();
    let totalDue = 0;
    let totalDone = 0;

    for (const dateStr of dates) {
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

      totalDue += dueHabits.length;
      totalDone += dueHabits.filter((h) =>
        checkIns.some(
          (c) => c.habitId === h.id && c.person === person && c.date === dateStr
        )
      ).length;
    }

    const rate = totalDue === 0 ? 0 : Math.round((totalDone / totalDue) * 100);
    return { totalDue, totalDone, rate };
  }, [habits, checkIns, person, period]);

  // Per-habit breakdown for today
  const today = todayStr();
  const todayWeekStart = getMonWeekStart(today);
  const todayWeekCheckIns = checkIns.filter((c) => {
    const ws = getMonWeekStart(c.date);
    return c.person === person && ws === todayWeekStart;
  });
  const todayHabits = habits.filter(
    (h) =>
      !h.archivedAt &&
      (h.owner === person || h.owner === 'both') &&
      today >= h.createdAt &&
      isDueToday(h, today, todayWeekCheckIns)
  );

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-gray-800">{name}</h2>

      <div className="text-center">
        <div className="text-4xl font-bold text-green-600">{stats.rate}%</div>
        <div className="text-xs text-gray-400">completion rate</div>
      </div>

      <div className="flex justify-around text-center text-sm">
        <div>
          <div className="font-semibold text-orange-500">{streak}</div>
          <div className="text-xs text-gray-400">day streak</div>
        </div>
        <div>
          <div className="font-semibold text-gray-700">{stats.totalDone}/{stats.totalDue}</div>
          <div className="text-xs text-gray-400">done</div>
        </div>
      </div>

      {todayHabits.length > 0 && (
        <div className="border-t border-gray-100 pt-2 space-y-1">
          <p className="text-xs text-gray-400 font-medium">Today</p>
          {todayHabits.map((h) => {
            const done = checkIns.some(
              (c) => c.habitId === h.id && c.person === person && c.date === today
            );
            return (
              <div key={h.id} className="flex items-center gap-2 text-xs">
                <span className={done ? 'text-green-500' : 'text-gray-300'}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? 'line-through text-gray-400' : 'text-gray-700'}>
                  {h.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
