import { useState } from 'react';
import type { HeatmapDay } from '../../types';
import { formatDisplay } from '../../lib/dateUtils';

interface Props {
  day: HeatmapDay;
}

function rateToColor(rate: number, total: number): string {
  if (total === 0) return 'bg-gray-100';
  if (rate === 0) return 'bg-gray-200';
  if (rate < 0.34) return 'bg-green-200';
  if (rate < 0.67) return 'bg-green-400';
  if (rate < 1) return 'bg-green-500';
  return 'bg-green-700';
}

export function HeatmapCell({ day }: Props) {
  const [tooltip, setTooltip] = useState(false);
  const color = rateToColor(day.rate, day.total);

  return (
    <div
      className="relative"
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
      onTouchStart={() => setTooltip(true)}
      onTouchEnd={() => setTooltip(false)}
    >
      <div className={`w-4 h-4 rounded-sm ${color} cursor-pointer`} />
      {tooltip && (
        <div className="absolute z-10 bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
          {formatDisplay(day.date)}: {day.completed}/{day.total}
        </div>
      )}
    </div>
  );
}
