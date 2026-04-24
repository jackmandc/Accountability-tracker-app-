import type { ActiveView } from '../../types';

interface Props {
  active: ActiveView;
  onChange: (view: ActiveView) => void;
}

const tabs: { view: ActiveView; label: string; icon: string }[] = [
  { view: 'today', label: 'Today', icon: '✓' },
  { view: 'history', label: 'History', icon: '📅' },
  { view: 'partner', label: 'Partner', icon: '👥' },
  { view: 'habits', label: 'Habits', icon: '+' },
  { view: 'settings', label: 'Settings', icon: '⚙' },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 safe-area-bottom">
      {tabs.map(({ view, label, icon }) => (
        <button
          key={view}
          onClick={() => onChange(view)}
          aria-label={label}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
            active === view
              ? 'text-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
