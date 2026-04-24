import { format } from 'date-fns';
import { PersonColumn } from './PersonColumn';

export function TodayView() {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="p-4 space-y-4">
      <p className="text-center text-sm text-gray-500">{today}</p>
      <div className="flex gap-3">
        <PersonColumn person="me" />
        <PersonColumn person="partner" />
      </div>
    </div>
  );
}
