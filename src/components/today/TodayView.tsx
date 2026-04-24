import { format } from 'date-fns';
import { PersonColumn } from './PersonColumn';
import { useTodaysHabits } from '../../hooks/useTodaysHabits';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function OverallBar() {
  const meHabits = useTodaysHabits('me');
  const partnerHabits = useTodaysHabits('partner');
  const total = meHabits.length + partnerHabits.length;
  const done = meHabits.filter((h) => h.checked).length + partnerHabits.filter((h) => h.checked).length;
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-white/80">
        <span>Combined progress</span>
        <span>{done}/{total} habits</span>
      </div>
      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function TodayView() {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 px-5 pt-5 pb-8">
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{today}</p>
        <h2 className="text-white text-2xl font-bold mt-1 mb-4">{greeting()} 👋</h2>
        <OverallBar />
      </div>

      {/* Columns — pulled up to overlap the header */}
      <div className="flex gap-3 px-4 -mt-4 flex-1">
        <PersonColumn person="me" />
        <PersonColumn person="partner" />
      </div>

      <div className="h-4" />
    </div>
  );
}
