import { UserPlus, Hand, Heart } from 'lucide-react';

const typeConfig = {
  friend_request: { Icon: UserPlus, color: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.15)' },
  nudge: { Icon: Hand, color: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.15)' },
  motivation: { Icon: Heart, color: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.15)' },
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

const NotificationsScreen = ({ social = {}, onBack }) => {
  const {
    notifications = [],
    markAllRead,
    acceptFriendRequest,
    declineFriendRequest,
  } = social;

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        {hasUnread && (
          <button
            onClick={() => markAllRead?.()}
            className="text-xs font-medium"
            style={{ color: 'rgb(var(--color-primary))' }}
          >
            Mark all read
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold text-white">Notifications</h1>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-sm font-medium text-white mb-1">No notifications</p>
          <p className="text-xs text-slate-500">You're all caught up</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.motivation;
            const { Icon } = config;
            const isFriendRequest = notif.type === 'friend_request';

            return (
              <div
                key={notif.id || i}
                className="glass-card p-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon size={18} style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">{notif.sender_name || 'Someone'}</span>
                          {notif.sender_emoji ? ` ${notif.sender_emoji}` : ''}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {notif.message || (
                            notif.type === 'friend_request' ? 'sent you a friend request' :
                            notif.type === 'nudge' ? 'nudged you to work out' :
                            'sent you motivation'
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-600">{formatRelativeTime(notif.created_at)}</span>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(var(--color-primary))' }} />
                        )}
                      </div>
                    </div>

                    {/* Friend request actions */}
                    {isFriendRequest && notif.status !== 'accepted' && notif.status !== 'declined' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => acceptFriendRequest?.(notif.request_id || notif.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest?.(notif.request_id || notif.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/10"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;
