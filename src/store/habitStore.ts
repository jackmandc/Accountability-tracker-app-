import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit } from '../types';
import { HABIT_STORE_KEY } from '../lib/storageKeys';
import { todayStr } from '../lib/dateUtils';

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, patch: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  archiveHabit: (id: string) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { ...habit, id: crypto.randomUUID(), createdAt: todayStr() },
          ],
        })),
      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),
      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archivedAt: new Date().toISOString() } : h
          ),
        })),
    }),
    { name: HABIT_STORE_KEY }
  )
);
