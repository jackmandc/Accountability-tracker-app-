import { format, startOfWeek, eachDayOfInterval, subDays, isSameDay, parseISO } from 'date-fns';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplay(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function getDayOfWeek(dateStr: string): number {
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  return parseISO(dateStr).getDay();
}

export function getMonWeekStart(dateStr: string): string {
  const d = parseISO(dateStr);
  const start = startOfWeek(d, { weekStartsOn: 1 }); // Monday
  return formatDateStr(start);
}

export function getLast90Days(): string[] {
  const today = new Date();
  const start = subDays(today, 89);
  return eachDayOfInterval({ start, end: today }).map(formatDateStr);
}

export function isSameDayStr(a: string, b: string): boolean {
  return isSameDay(parseISO(a), parseISO(b));
}

export function getWeekDatesFrom(weekStartStr: string): string[] {
  const start = parseISO(weekStartStr);
  return eachDayOfInterval({ start, end: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000) }).map(formatDateStr);
}

export function getMonthDates(year: number, month: number): string[] {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return eachDayOfInterval({ start, end }).map(formatDateStr);
}

export function getCurrentMonthDates(): string[] {
  const now = new Date();
  return getMonthDates(now.getFullYear(), now.getMonth());
}

export function getCurrentWeekDates(): string[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  return eachDayOfInterval({
    start: weekStart,
    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
  }).map(formatDateStr);
}
