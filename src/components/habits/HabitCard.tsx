import type { Habit } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  habit: Habit;
  onEdit: () => void;
  onArchive: () => void;
}

function frequencyLabel(habit: Habit): string {
  const { type, daysPerWeek } = habit.frequency;
  if (type === 'daily') return 'Daily';
  if (type === 'weekdays') return 'Weekdays';
  if (type === 'weekends') return 'Weekends';
  if (type === 'x_per_week') return `${daysPerWeek}x/week`;
  return '';
}

function ownerBadgeClass(owner: Habit['owner']): string {
  if (owner === 'me') return 'bg-blue-100 text-blue-700';
  if (owner === 'partner') return 'bg-purple-100 text-purple-700';
  return 'bg-green-100 text-green-700';
}

export function HabitCard({ habit, onEdit, onArchive }: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const ownerLabel =
    habit.owner === 'me'
      ? settings.myName
      : habit.owner === 'partner'
      ? settings.partnerName
      : 'Both';

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{habit.name}</p>
        <div className="flex gap-2 mt-0.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${ownerBadgeClass(habit.owner)}`}>
            {ownerLabel}
          </span>
          <span className="text-xs text-gray-400">{frequencyLabel(habit)}</span>
        </div>
        {habit.notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{habit.notes}</p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          aria-label={`Edit ${habit.name}`}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ✏
        </button>
        <button
          onClick={onArchive}
          aria-label={`Archive ${habit.name}`}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
