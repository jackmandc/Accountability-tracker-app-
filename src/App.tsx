import { useEffect, useState } from 'react';
import type { ActiveView } from './types';
import { TabBar } from './components/layout/TabBar';
import { PageHeader } from './components/layout/PageHeader';
import { TodayView } from './components/today/TodayView';
import { HistoryView } from './components/history/HistoryView';
import { PartnerView } from './components/partner/PartnerView';
import { HabitManager } from './components/habits/HabitManager';
import { SettingsView } from './components/settings/SettingsView';
import { useSettingsStore } from './store/settingsStore';
import { scheduleLocalNotification } from './lib/notificationUtils';

const VIEW_TITLES: Record<ActiveView, string> = {
  today: 'Today',
  history: 'History',
  partner: 'Comparison',
  habits: 'Manage Habits',
  settings: 'Settings',
};

function App() {
  const [view, setView] = useState<ActiveView>('today');
  const settings = useSettingsStore((s) => s.settings);

  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      scheduleLocalNotification(settings.notificationTime);
    }
  }, [settings.notificationsEnabled, settings.notificationTime]);

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col max-w-lg mx-auto">
      <PageHeader title={VIEW_TITLES[view]} transparent={view === 'today'} />
      <main className="flex-1 overflow-y-auto pb-20">
        {view === 'today' && <TodayView />}
        {view === 'history' && <HistoryView />}
        {view === 'partner' && <PartnerView />}
        {view === 'habits' && <HabitManager />}
        {view === 'settings' && <SettingsView />}
      </main>
      <TabBar active={view} onChange={setView} />
    </div>
  );
}

export default App;
