import { Dumbbell, TrendingUp, Award, Flame, Crown } from 'lucide-react';

const typeConfig = {
  workout_completed: { verb: 'completed a workout', color: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.15)', Icon: Dumbbell },
  pr_set: { verb: 'set a new PR', color: 'rgb(250, 204, 21)', bg: 'rgba(250, 204, 21, 0.15)', Icon: TrendingUp },
  badge_earned: { verb: 'earned a badge', color: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.15)', Icon: Award },
  streak_milestone: { verb: 'hit a streak milestone', color: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.15)', Icon: Flame },
  league_promotion: { verb: 'got promoted', color: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.15)', Icon: Crown },
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ActivityFeedView = ({ feedItems = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgb(var(--color-primary))', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📡</div>
        <p className="text-sm font-medium text-white mb-1">No activity yet</p>
        <p className="text-xs text-slate-500">Activity from you and your friends will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedItems.map((item, i) => {
        const config = typeConfig[item.type] || typeConfig.workout_completed;
        const { Icon } = config;
        return (
          <div
            key={item.id || i}
            className="glass-card p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: config.bg }}
              >
                <Icon size={18} style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{item.user_name || item.display_name || 'Someone'}</span>
                  {' '}{config.verb}
                </p>
                {item.payload && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {typeof item.payload === 'string' ? item.payload : item.payload.details || item.payload.workout_name || item.payload.badge_name || ''}
                  </p>
                )}
                <p className="text-[10px] text-slate-600 mt-1">{formatRelativeTime(item.created_at)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeedView;
