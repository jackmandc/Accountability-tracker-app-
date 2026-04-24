export type Owner = 'me' | 'partner' | 'both';
export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'x_per_week';
export type ActiveView = 'today' | 'history' | 'partner' | 'habits' | 'settings';

export interface Frequency {
  type: FrequencyType;
  daysPerWeek?: number; // 1–6, only when type === 'x_per_week'
}

export interface Habit {
  id: string;
  name: string;
  owner: Owner;
  frequency: Frequency;
  notes?: string;
  createdAt: string;    // "YYYY-MM-DD"
  archivedAt?: string;  // soft-delete
}

export interface CheckIn {
  id: string;
  habitId: string;
  person: 'me' | 'partner';
  date: string;         // "YYYY-MM-DD"
  completedAt: string;  // ISO timestamp
}

export interface Settings {
  myName: string;
  partnerName: string;
  notificationsEnabled: boolean;
  notificationTime: string; // "HH:MM"
}

export interface HeatmapDay {
  date: string;
  total: number;
  completed: number;
  rate: number; // 0–1
}
