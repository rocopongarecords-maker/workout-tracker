import { useState } from 'react';
import { Hand, Heart, UserMinus, Flame, Trophy, Calendar } from 'lucide-react';

const MOTIVATION_PRESETS = [
  'Keep going!',
  'Nice streak!',
  "Let's train!",
  'So proud!',
  'Beast mode!',
  'Consistency is key!',
];

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Never';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

const FriendProfileScreen = ({ friend = {}, social = {}, onBack }) => {
  const [showMotivation, setShowMotivation] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [motivationSent, setMotivationSent] = useState(false);

  const { sendNudge, sendMotivation, removeFriend } = social;

  const handleNudge = async () => {
    try {
      await sendNudge?.(friend.id);
      setNudgeSent(true);
      setTimeout(() => setNudgeSent(false), 3000);
    } catch {}
  };

  const handleMotivation = async (message) => {
    try {
      await sendMotivation?.(friend.id, message);
      setShowMotivation(false);
      setMotivationSent(true);
      setTimeout(() => setMotivationSent(false), 3000);
    } catch {}
  };

  const handleRemove = async () => {
    try {
      await removeFriend?.(friend.id);
      onBack?.();
    } catch {}
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      {/* Profile Header */}
      <div className="text-center animate-fade-in-up">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
          style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
        >
          {friend.avatar_emoji || '👤'}
        </div>
        <h1 className="text-xl font-bold text-white">{friend.display_name || 'Friend'}</h1>
        {friend.friend_code && (
          <p className="text-xs font-mono text-slate-500 tracking-wider mt-1">{friend.friend_code}</p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div className="glass-card p-3 text-center">
          <Flame size={14} className="mx-auto mb-1 text-orange-400" />
          <div className="text-lg font-bold text-white">{friend.streak || 0}</div>
          <div className="text-[10px] text-slate-500 uppercase">Streak</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Trophy size={14} className="mx-auto mb-1 text-yellow-400" />
          <div className="text-lg font-bold text-white">{friend.longest_streak || 0}</div>
          <div className="text-[10px] text-slate-500 uppercase">Best</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Calendar size={14} className="mx-auto mb-1" style={{ color: 'rgb(var(--color-primary))' }} />
          <div className="text-sm font-bold text-white">{formatRelativeTime(friend.last_workout)}</div>
          <div className="text-[10px] text-slate-500 uppercase">Last</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Nudge */}
        <button
          onClick={handleNudge}
          disabled={nudgeSent}
          className="w-full glass-card-interactive p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
              <Hand size={18} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{nudgeSent ? 'Nudge Sent!' : 'Send Nudge'}</p>
              <p className="text-[10px] text-slate-500">Remind them to work out</p>
            </div>
          </div>
        </button>

        {/* Motivation */}
        <button
          onClick={() => setShowMotivation(!showMotivation)}
          disabled={motivationSent}
          className="w-full glass-card-interactive p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
              <Heart size={18} className="text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{motivationSent ? 'Motivation Sent!' : 'Send Motivation'}</p>
              <p className="text-[10px] text-slate-500">Encourage your friend</p>
            </div>
          </div>
        </button>

        {/* Motivation Presets */}
        {showMotivation && (
          <div className="grid grid-cols-2 gap-2 animate-fade-in-up">
            {MOTIVATION_PRESETS.map(msg => (
              <button
                key={msg}
                onClick={() => handleMotivation(msg)}
                className="py-2.5 px-3 rounded-xl text-xs font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'rgb(var(--bg-surface-light))', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                {msg}
              </button>
            ))}
          </div>
        )}

        {/* Remove Friend */}
        {!showRemoveConfirm ? (
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 transition-colors"
          >
            <UserMinus size={16} />
            Remove Friend
          </button>
        ) : (
          <div className="glass-card p-4 text-center" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <p className="text-sm text-white mb-3">Remove {friend.display_name || 'this friend'}?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendProfileScreen;
