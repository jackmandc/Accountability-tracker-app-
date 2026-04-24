import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useHabitStore } from '../../store/habitStore';
import { useCheckInStore } from '../../store/checkInStore';
import { getOverallStreak, getOverallBestStreak } from '../../lib/habitUtils';
import { StreakBadge } from './StreakBadge';
import { HeatmapGrid } from './HeatmapGrid';

export function HistoryView() {
  const [person, setPerson] = useState<'me' | 'partner'>('me');
  const settings = useSettingsStore((s) => s.settings);
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  const current = getOverallStreak(person, habits, checkIns);
  const best = getOverallBestStreak(person, habits, checkIns);
  const name = person === 'me' ? settings.myName : settings.partnerName;

  return (
    <div className="p-4 space-y-4">
      {/* Person tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['me', 'partner'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPerson(p)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              person === p
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p === 'me' ? settings.myName : settings.partnerName}
          </button>
        ))}
      </div>

      <StreakBadge current={current} best={best} />

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">{name}'s last 90 days</h2>
        <HeatmapGrid person={person} />
      </div>
    </div>
  );
}
