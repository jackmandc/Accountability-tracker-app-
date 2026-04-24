import type { Frequency, FrequencyType } from '../../types';

interface Props {
  value: Frequency;
  onChange: (f: Frequency) => void;
}

const OPTIONS: { type: FrequencyType; label: string }[] = [
  { type: 'daily', label: 'Every day' },
  { type: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { type: 'weekends', label: 'Weekends (Sat–Sun)' },
  { type: 'x_per_week', label: 'X days/week' },
];

export function FrequencyPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      {OPTIONS.map(({ type, label }) => (
        <label key={type} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="frequency"
            value={type}
            checked={value.type === type}
            onChange={() => onChange({ type, daysPerWeek: type === 'x_per_week' ? (value.daysPerWeek ?? 3) : undefined })}
            className="accent-green-600"
          />
          <span className="text-sm text-gray-700">{label}</span>
          {type === 'x_per_week' && value.type === 'x_per_week' && (
            <input
              type="number"
              min={1}
              max={6}
              value={value.daysPerWeek ?? 3}
              onChange={(e) =>
                onChange({ type, daysPerWeek: Math.min(6, Math.max(1, Number(e.target.value))) })
              }
              className="w-14 border border-gray-300 rounded px-2 py-0.5 text-sm"
              aria-label="Days per week"
            />
          )}
        </label>
      ))}
    </div>
  );
}
