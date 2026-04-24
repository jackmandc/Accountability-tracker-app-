import { useState } from 'react';
import type { Habit, Owner, Frequency } from '../../types';
import { FrequencyPicker } from './FrequencyPicker';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  initial?: Partial<Habit>;
  onSubmit: (data: Omit<Habit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function HabitForm({ initial, onSubmit, onCancel }: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const [name, setName] = useState(initial?.name ?? '');
  const [owner, setOwner] = useState<Owner>(initial?.owner ?? 'me');
  const [frequency, setFrequency] = useState<Frequency>(
    initial?.frequency ?? { type: 'daily' }
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }
    onSubmit({ name: name.trim(), owner, frequency, notes: notes.trim() || undefined });
  }

  const ownerOptions: { value: Owner; label: string }[] = [
    { value: 'me', label: settings.myName },
    { value: 'partner', label: settings.partnerName },
    { value: 'both', label: 'Both of us' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Habit name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="e.g. Morning run"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Habit name"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Who is this for?</label>
        <div className="flex gap-2">
          {ownerOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOwner(value)}
              className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                owner === value
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
        <FrequencyPicker value={frequency} onChange={setFrequency} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details or motivation..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          aria-label="Notes"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          {initial?.id ? 'Save changes' : 'Add habit'}
        </button>
      </div>
    </form>
  );
}
