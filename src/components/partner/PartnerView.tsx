import { useState } from 'react';
import { ComparisonCard } from './ComparisonCard';

export function PartnerView() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <div className="p-4 space-y-4">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              period === p
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            This {p}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <ComparisonCard person="me" period={period} />
        <ComparisonCard person="partner" period={period} />
      </div>
    </div>
  );
}
