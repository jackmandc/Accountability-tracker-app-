import { useState } from 'react';
import type { Habit } from '../../types';

interface Props {
  habit: Habit;
  checked: boolean;
  onToggle: () => void;
}

export function HabitCheckItem({ habit, checked, onToggle }: Props) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div>
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none border-b border-gray-100 active:bg-gray-50 ${
          checked ? 'bg-green-50' : 'bg-white'
        }`}
        onClick={onToggle}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Mark ${habit.name} as ${checked ? 'incomplete' : 'complete'}`}
          className="w-5 h-5 rounded accent-green-600 cursor-pointer flex-shrink-0"
        />
        <span
          className={`flex-1 text-sm ${
            checked ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {habit.name}
        </span>
        {habit.notes && (
          <button
            aria-label="Show notes"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotes((v) => !v);
            }}
            className="text-gray-400 hover:text-gray-600 text-xs px-1"
          >
            ℹ
          </button>
        )}
      </div>
      {showNotes && habit.notes && (
        <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
          {habit.notes}
        </p>
      )}
    </div>
  );
}
