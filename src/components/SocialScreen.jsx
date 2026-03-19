import { useState } from 'react';
import { Bell, UserPlus, Copy, Flame, ChevronRight, Trophy, Info } from 'lucide-react';
import ActivityFeedView from './ActivityFeedView';

const TIER_CONFIG = {
  bronze: { emoji: '🥉', color: '#CD7F32', name: 'Bronze' },
  silver: { emoji: '🥈', color: '#C0C0C0', name: 'Silver' },
  gold: { emoji: '🥇', color: '#FFD700', name: 'Gold' },
  platinum: { emoji: '💎', color: '#E5E4E2', name: 'Platinum' },
  diamond: { emoji: '💠', color: '#B9F2FF', name: 'Diamond' },
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Never';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const SocialScreen = ({ social = {}, league = {}, feed = {}, onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const tabs = ['Friends', 'League', 'Feed'];

  const {
    friends = [],
    friendRequests = [],
    profile = {},
    notifications = [],
    acceptFriendRequest,
    declineFriendRequest,
    copyFriendCode,
  } = social;

  const {
    currentTier = 'bronze',
    weeklyXP = 0,
    promotionThreshold = 100,
    standings = [],
    myRank,
  } = league;

  const { items: feedItems = [], loading: feedLoading = false } = feed;

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const sortedFriends = [...friends].sort((a, b) => (b.streak || 0) - (a.streak || 0));

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Social</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('notifications')}
            className="relative p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
          >
            <Bell size={18} className="text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate?.('add-friend')}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
          >
            <UserPlus size={18} style={{ color: 'rgb(var(--color-primary))' }} />
          </button>
        </div>
      </div>

      {/* Tab Segments */}
      <div
        className="flex rounded-xl p-1"
        style={{ backgroundColor: 'rgb(var(--bg-surface))' }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.toLowerCase();
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'text-white shadow-sm' : 'text-slate-500'
              }`}
              style={isActive ? { backgroundColor: 'rgb(var(--bg-surface-light))' } : {}}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* My Profile Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
              >
                {profile.avatar_emoji || '💪'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{profile.display_name || user?.email?.split('@')[0] || 'You'}</p>
                {profile.friend_code && (
                  <button
                    onClick={() => copyFriendCode?.(profile.friend_code)}
                    className="flex items-center gap-1.5 mt-1 group"
                  >
                    <span className="text-xs font-mono text-slate-400 tracking-wider">{profile.friend_code}</span>
                    <Copy size={12} className="text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pending Friend Requests */}
          {friendRequests.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Friend Requests ({friendRequests.length})
              </h2>
              <div className="space-y-2">
                {friendRequests.map(req => (
                  <div key={req.id} className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
                      >
                        {req.avatar_emoji || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{req.display_name || 'Unknown'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest?.(req.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest?.(req.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/10"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Friends ({sortedFriends.length})
            </h2>
            {sortedFriends.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-sm font-medium text-white mb-1">No friends yet</p>
                <p className="text-xs text-slate-500 mb-4">Share your friend code to connect</p>
                <button
                  onClick={() => onNavigate?.('add-friend')}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
                >
                  Add Friend
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedFriends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => onNavigate?.('friend-profile', friend)}
                    className="w-full glass-card-interactive p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
                      >
                        {friend.avatar_emoji || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{friend.display_name || 'Friend'}</p>
                        <p className="text-[10px] text-slate-500">{formatRelativeTime(friend.last_workout)}</p>
                      </div>
                      {(friend.streak || 0) > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}>
                          <Flame size={12} className="text-orange-400" />
                          <span className="text-xs font-semibold text-orange-400">{friend.streak}</span>
                        </div>
                      )}
                      <ChevronRight size={14} className="text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* League Tab */}
      {activeTab === 'league' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Current Tier Card */}
          {(() => {
            const tier = TIER_CONFIG[currentTier] || TIER_CONFIG.bronze;
            const nextTierKey = Object.keys(TIER_CONFIG)[Object.keys(TIER_CONFIG).indexOf(currentTier) + 1];
            const nextTier = nextTierKey ? TIER_CONFIG[nextTierKey] : null;
            const xpToGo = Math.max(0, promotionThreshold - weeklyXP);
            const progress = promotionThreshold > 0 ? Math.min(100, (weeklyXP / promotionThreshold) * 100) : 0;

            return (
              <div className="glass-card p-6 text-center">
                <div className="text-5xl mb-2">{tier.emoji}</div>
                <h2 className="text-lg font-bold" style={{ color: tier.color }}>{tier.name}</h2>
                <p className="text-xs text-slate-500 mb-4">League</p>

                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{weeklyXP} XP</span>
                    <span className="text-slate-500">{promotionThreshold} XP</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: tier.color }}
                    />
                  </div>
                  {nextTier && (
                    <p className="text-[10px] text-slate-500">
                      Next: {nextTier.name} · {xpToGo} XP to go
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* XP Info */}
          <div className="glass-card p-3 flex items-start gap-2">
            <Info size={14} className="text-slate-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              +1 per set, +10 per workout, +5 per PR · Resets Monday
            </p>
          </div>

          {/* Standings */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Standings
            </h2>
            {standings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-xs text-slate-500">Complete workouts to join the league</p>
              </div>
            ) : (
              <div className="glass-card divide-y" style={{ borderColor: 'rgba(var(--border-color), 0.05)' }}>
                {standings.slice(0, 30).map((entry, i) => {
                  const rank = i + 1;
                  const isMe = entry.user_id === user?.id || entry.is_me;
                  const rankColors = { 1: 'text-yellow-400', 2: 'text-slate-300', 3: 'text-amber-600' };
                  return (
                    <div
                      key={entry.user_id || i}
                      className={`flex items-center gap-3 px-4 py-3 ${isMe ? '' : ''}`}
                      style={isMe ? { backgroundColor: 'rgba(var(--color-primary), 0.08)' } : {}}
                    >
                      <span className={`w-6 text-center text-sm font-bold ${rankColors[rank] || 'text-slate-500'}`}>
                        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
                      >
                        {entry.avatar_emoji || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {entry.display_name || 'User'}
                          {isMe && (
                            <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(var(--color-primary), 0.2)', color: 'rgb(var(--color-primary))' }}>
                              YOU
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">{entry.xp || 0} XP</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="animate-fade-in-up">
          <ActivityFeedView feedItems={feedItems} loading={feedLoading} />
        </div>
      )}
    </div>
  );
};

export default SocialScreen;
