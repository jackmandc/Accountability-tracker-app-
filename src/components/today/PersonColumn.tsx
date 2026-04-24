import { useCheckInStore } from '../../store/checkInStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTodaysHabits } from '../../hooks/useTodaysHabits';
import { todayStr } from '../../lib/dateUtils';
import { HabitCheckItem } from './HabitCheckItem';

interface Props {
  person: 'me' | 'partner';
}

export function PersonColumn({ person }: Props) {
  const todayHabits = useTodaysHabits(person);
  const toggleCheckIn = useCheckInStore((s) => s.toggleCheckIn);
  const settings = useSettingsStore((s) => s.settings);

  const name = person === 'me' ? settings.myName : settings.partnerName;
  const today = todayStr();
  const doneCount = todayHabits.filter((h) => h.checked).length;

  return (
    <div className="flex-1 min-w-0 border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <span className="font-semibold text-gray-800 text-sm">{name}</span>
        {todayHabits.length > 0 && (
          <span className="text-xs text-gray-500">
            {doneCount}/{todayHabits.length}
          </span>
        )}
      </div>

      {todayHabits.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-400 text-sm">
          No habits due today
        </div>
      ) : doneCount === todayHabits.length ? (
        <>
          {todayHabits.map(({ habit, checked }) => (
            <HabitCheckItem
              key={habit.id}
              habit={habit}
              checked={checked}
              onToggle={() => toggleCheckIn(habit.id, person, today)}
            />
          ))}
          <div className="px-4 py-3 text-center text-green-600 text-sm font-medium bg-green-50">
            All done today! 🎉
          </div>
        </>
      ) : (
        todayHabits.map(({ habit, checked }) => (
          <HabitCheckItem
            key={habit.id}
            habit={habit}
            checked={checked}
            onToggle={() => toggleCheckIn(habit.id, person, today)}
          />
        ))
      )}
    </div>
  );
}
