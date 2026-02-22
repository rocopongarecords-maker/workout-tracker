import { Home, Users, Play, BarChart3, User } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: Home, views: ['dashboard'] },
  { id: 'community', label: 'Community', icon: Users, views: ['coach-discovery', 'coach-profile', 'coach-chat', 'coach-questionnaire', 'coach-dashboard'] },
  { id: 'selector', label: 'Start', icon: Play, views: ['selector', 'workout', 'review', 'summary', 'free-workout'] },
  { id: 'analytics', label: 'Progress', icon: BarChart3, views: ['analytics', 'measurements'] },
  { id: 'settings', label: 'Profile', icon: User, views: ['settings'] },
];

const TabBar = ({ currentView, onSelectTab }) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
      style={{ backgroundColor: 'rgb(var(--bg-surface))' }}
    >
      <div
        className="border-t"
        style={{ borderColor: 'rgba(var(--border-color), 0.08)' }}
      >
        <div className="max-w-lg mx-auto flex">
          {tabs.map(tab => {
            const isActive = tab.views.includes(currentView) || tab.id === currentView;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 transition-colors"
                style={{
                  color: isActive
                    ? 'rgb(var(--color-primary))'
                    : 'rgb(var(--text-tertiary))',
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
