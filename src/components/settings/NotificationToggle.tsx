import { useSettingsStore } from '../../store/settingsStore';
import { requestNotificationPermission, scheduleLocalNotification, cancelScheduledNotification } from '../../lib/notificationUtils';

export function NotificationToggle() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  async function handleToggle() {
    if (!settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Please allow notifications in your browser settings.');
        return;
      }
      updateSettings({ notificationsEnabled: true });
      scheduleLocalNotification(settings.notificationTime);
    } else {
      updateSettings({ notificationsEnabled: false });
      cancelScheduledNotification();
    }
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateSettings({ notificationTime: e.target.value });
    if (settings.notificationsEnabled) {
      scheduleLocalNotification(e.target.value);
    }
  }

  const supported = 'Notification' in window;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Daily reminder</p>
          {!supported && (
            <p className="text-xs text-gray-400">Not supported in this browser</p>
          )}
        </div>
        <button
          onClick={handleToggle}
          disabled={!supported}
          aria-label={settings.notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
          } disabled:opacity-50`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.notificationsEnabled && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Reminder time</label>
          <input
            type="time"
            value={settings.notificationTime}
            onChange={handleTimeChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Notification time"
          />
        </div>
      )}
    </div>
  );
}
