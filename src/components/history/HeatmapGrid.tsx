import { useHeatmapData } from '../../hooks/useHeatmapData';
import { HeatmapCell } from './HeatmapCell';

interface Props {
  person: 'me' | 'partner';
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function HeatmapGrid({ person }: Props) {
  const days = useHeatmapData(person);

  // Pad so grid starts on a Monday
  const firstDay = days[0] ? new Date(days[0].date + 'T00:00:00') : new Date();
  // getDay(): 0=Sun,1=Mon; we want Mon=0
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon, 6=Sun
  const padded = [...Array(startDow).fill(null), ...days];

  // Chunk into columns of 7 (weeks)
  const weeks: (typeof days[0] | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7) as (typeof days[0] | null)[]);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="w-4 h-4 flex items-center justify-center text-xs text-gray-400">
              {d}
            </div>
          ))}
        </div>
        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, di) => {
              const day = week[di];
              return day ? (
                <HeatmapCell key={day.date} day={day} />
              ) : (
                <div key={di} className="w-4 h-4" />
              );
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <span>Less</span>
        {['bg-gray-200', 'bg-green-200', 'bg-green-400', 'bg-green-500', 'bg-green-700'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
