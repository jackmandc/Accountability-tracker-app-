import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CheckIn } from '../types';
import { CHECKIN_STORE_KEY } from '../lib/storageKeys';

interface CheckInStore {
  checkIns: CheckIn[];
  toggleCheckIn: (habitId: string, person: 'me' | 'partner', date: string) => void;
  getCheckInsForDate: (date: string) => CheckIn[];
  getCheckInsForPersonInWeek: (person: 'me' | 'partner', habitId: string, weekStart: string) => CheckIn[];
}

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      checkIns: [],

      toggleCheckIn: (habitId, person, date) => {
        const existing = get().checkIns.find(
          (c) => c.habitId === habitId && c.person === person && c.date === date
        );
        if (existing) {
          set((state) => ({
            checkIns: state.checkIns.filter((c) => c.id !== existing.id),
          }));
        } else {
          set((state) => ({
            checkIns: [
              ...state.checkIns,
              {
                id: crypto.randomUUID(),
                habitId,
                person,
                date,
                completedAt: new Date().toISOString(),
              },
            ],
          }));
        }
      },

      getCheckInsForDate: (date) =>
        get().checkIns.filter((c) => c.date === date),

      getCheckInsForPersonInWeek: (person, habitId, weekStart) => {
        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 7);
        return get().checkIns.filter((c) => {
          if (c.habitId !== habitId || c.person !== person) return false;
          const d = new Date(c.date);
          return d >= start && d < end;
        });
      },
    }),
    { name: CHECKIN_STORE_KEY }
  )
);
