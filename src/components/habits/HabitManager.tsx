import { useState } from 'react';
import type { Habit } from '../../types';
import { useHabitStore } from '../../store/habitStore';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';

export function HabitManager() {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const archiveHabit = useHabitStore((s) => s.archiveHabit);

  const [editing, setEditing] = useState<Habit | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);

  const active = habits.filter((h) => !h.archivedAt);

  return (
    <div>
      <div className="px-4 py-3 border-b border-gray-100 flex justify-end">
        <button
          onClick={() => setAdding(true)}
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Add habit
        </button>
      </div>

      {active.length === 0 && !adding && (
        <div className="px-4 py-12 text-center text-gray-400 text-sm">
          No habits yet. Tap "Add habit" to get started.
        </div>
      )}

      {adding && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">New habit</h2>
          <HabitForm
            onSubmit={(data) => { addHabit(data); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {editing && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Edit habit</h2>
          <HabitForm
            initial={editing}
            onSubmit={(data) => { updateHabit(editing.id, data); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {active.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={() => { setEditing(habit); setAdding(false); }}
          onArchive={() => setConfirmArchive(habit.id)}
        />
      ))}

      {confirmArchive && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={() => setConfirmArchive(null)}>
          <div className="bg-white w-full rounded-t-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-700 text-center">Archive this habit? Its history will be kept.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmArchive(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => { archiveHabit(confirmArchive); setConfirmArchive(null); }}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
