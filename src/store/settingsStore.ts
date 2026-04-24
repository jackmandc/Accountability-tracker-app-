import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';
import { SETTINGS_KEY } from '../lib/storageKeys';

interface SettingsStore {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        myName: 'Me',
        partnerName: 'Partner',
        notificationsEnabled: false,
        notificationTime: '08:00',
      },
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    { name: SETTINGS_KEY }
  )
);
