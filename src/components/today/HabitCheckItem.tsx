import { useState } from 'react';
import type { Habit } from '../../types';

interface Props {
  habit: Habit;
  checked: boolean;
  onToggle: () => void;
  color: 'green' | 'violet';
}

export function HabitCheckItem({ habit, checked, onToggle, color }: Props) {
  const [showNotes, setShowNotes] = useState(false);

  const ringColor = color === 'green'
    ? 'border-green-500 bg-green-500'
    : 'border-violet-500 bg-violet-500';
  const ringUnchecked = color === 'green'
    ? 'border-green-300'
    : 'border-violet-300';

  return (
    <div>
      <div
        className={`flex items-center gap-3 px-3 py-3 cursor-pointer select-none transition-colors active:opacity-70 ${
          checked ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={onToggle}
      >
        {/* Custom circular checkbox */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
            checked ? `${ringColor} border-transparent` : ringUnchecked
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Mark ${habit.name} as ${checked ? 'incomplete' : 'complete'}`}
          className="sr-only"
        />

        <span className={`flex-1 text-sm font-medium transition-all duration-200 ${
          checked ? 'line-through text-gray-400' : 'text-gray-800'
        }`}>
          {habit.name}
        </span>

        {habit.notes && (
          <button
            aria-label="Show notes"
            onClick={(e) => { e.stopPropagation(); setShowNotes((v) => !v); }}
            className="text-gray-300 hover:text-gray-500 transition-colors p-1 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
          </button>
        )}
      </div>

      {showNotes && habit.notes && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100 italic">
          {habit.notes}
        </div>
      )}
    </div>
  );
}
