import { useCheckInStore } from '../../store/checkInStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTodaysHabits } from '../../hooks/useTodaysHabits';
import { todayStr } from '../../lib/dateUtils';
import { HabitCheckItem } from './HabitCheckItem';
import { ProgressRing } from './ProgressRing';

interface Props {
  person: 'me' | 'partner';
}

const COLORS = {
  me: {
    accent: 'green' as const,
    header: 'from-green-500 to-emerald-600',
    avatar: 'bg-green-100 text-green-700',
    divider: 'divide-green-50',
    allDone: 'bg-green-50 text-green-700',
  },
  partner: {
    accent: 'violet' as const,
    header: 'from-violet-500 to-purple-600',
    avatar: 'bg-violet-100 text-violet-700',
    divider: 'divide-violet-50',
    allDone: 'bg-violet-50 text-violet-700',
  },
};

export function PersonColumn({ person }: Props) {
  const todayHabits = useTodaysHabits(person);
  const toggleCheckIn = useCheckInStore((s) => s.toggleCheckIn);
  const settings = useSettingsStore((s) => s.settings);

  const name = person === 'me' ? settings.myName : settings.partnerName;
  const today = todayStr();
  const doneCount = todayHabits.filter((h) => h.checked).length;
  const total = todayHabits.length;
  const allDone = total > 0 && doneCount === total;
  const c = COLORS[person];

  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Coloured header */}
      <div className={`bg-gradient-to-br ${c.header} px-3 pt-3 pb-4`}>
        <div className="flex items-center justify-between">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full ${c.avatar} flex items-center justify-center text-sm font-bold`}>
            {initials}
          </div>
          {/* Progress ring */}
          {total > 0 && (
            <div className="relative">
              <ProgressRing done={doneCount} total={total} color={c.accent} size={52} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {doneCount}/{total}
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-white font-semibold text-base leading-tight">{name}</p>
        {total > 0 && (
          <p className="text-white/70 text-xs mt-0.5">
            {allDone ? 'All done!' : `${total - doneCount} remaining`}
          </p>
        )}
      </div>

      {/* Habit list */}
      <div className="bg-white divide-y divide-gray-100">
        {total === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No habits due today
          </div>
        ) : (
          todayHabits.map(({ habit, checked }) => (
            <HabitCheckItem
              key={habit.id}
              habit={habit}
              checked={checked}
              color={c.accent}
              onToggle={() => toggleCheckIn(habit.id, person, today)}
            />
          ))
        )}

        {allDone && (
          <div className={`px-4 py-3 text-center text-sm font-medium ${c.allDone}`}>
            🎉 Crushed it today!
          </div>
        )}
      </div>
    </div>
  );
}
