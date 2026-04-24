import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { NotificationToggle } from './NotificationToggle';

export function SettingsView() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="p-4 space-y-6">
      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Names</h2>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Your name</label>
          <input
            type="text"
            value={settings.myName}
            onChange={(e) => updateSettings({ myName: e.target.value || 'Me' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Your name"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Partner's name</label>
          <input
            type="text"
            value={settings.partnerName}
            onChange={(e) => updateSettings({ partnerName: e.target.value || 'Partner' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Partner's name"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Notifications</h2>
        <NotificationToggle />
      </section>

      <section className="bg-white rounded-xl border border-red-200 p-4">
        <h2 className="text-sm font-semibold text-red-600 mb-2">Danger zone</h2>
        <p className="text-xs text-gray-400 mb-3">This will delete all habits and check-in history.</p>
        <button
          onClick={() => setConfirmReset(true)}
          className="w-full py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
        >
          Reset all data
        </button>
      </section>

      {confirmReset && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={() => setConfirmReset(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-700 text-center font-medium">Reset all data?</p>
            <p className="text-xs text-gray-400 text-center">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
