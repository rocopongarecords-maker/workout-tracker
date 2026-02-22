import { useState, useEffect } from 'react';

const MILESTONES = [3, 7, 14, 21, 30, 50, 100];

const MILESTONE_CONFIG = {
  3:   { emoji: '🔥', message: 'Three days strong!', sub: 'You\'re building a habit.' },
  7:   { emoji: '🔥', message: 'One week streak!', sub: 'Consistency is everything.' },
  14:  { emoji: '⚡', message: 'Two weeks straight!', sub: 'You\'re on fire.' },
  21:  { emoji: '💪', message: '21-day warrior!', sub: 'It takes 21 days to form a habit. Done.' },
  30:  { emoji: '🏆', message: '30-day legend!', sub: 'A full month of showing up.' },
  50:  { emoji: '🚀', message: '50-day streak!', sub: 'You\'re unstoppable.' },
  100: { emoji: '👑', message: '100 days!', sub: 'Elite consistency. Absolutely elite.' },
};

const STORAGE_KEY = 'streak_last_celebrated';

export const getLastCelebrated = () => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

export const setLastCelebrated = (streak) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(streak));
  } catch {}
};

// Returns the highest uncelebrated milestone the current streak hits, or null
export const getMilestoneToShow = (currentStreak) => {
  const lastCelebrated = getLastCelebrated();
  const hit = MILESTONES.filter(m => currentStreak >= m && m > lastCelebrated);
  return hit.length > 0 ? hit[hit.length - 1] : null;
};

const StreakCelebration = ({ milestone, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!milestone) return;
    setVisible(true);
    setLastCelebrated(milestone);

    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [milestone]);

  if (!visible || !milestone) return null;

  const config = MILESTONE_CONFIG[milestone] || { emoji: '🔥', message: `${milestone}-day streak!`, sub: 'Keep going!' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => { setVisible(false); onDone?.(); }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative animate-pr-pop flex flex-col items-center gap-2 text-center px-8">
        {/* Emoji */}
        <div
          className="text-7xl mb-1"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.7))' }}
        >
          {config.emoji}
        </div>

        {/* Streak number */}
        <div className="text-5xl font-black text-white tabular-nums">
          {milestone}
        </div>
        <div className="text-lg font-bold text-amber-400 uppercase tracking-widest -mt-1">
          day streak
        </div>

        {/* Message */}
        <div className="mt-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl px-8 py-4 shadow-2xl shadow-amber-500/30">
          <div className="text-2xl font-black text-white">{config.message}</div>
          <div className="text-amber-100 text-sm mt-1 font-medium">{config.sub}</div>
        </div>

        <div className="text-white/40 text-xs mt-3 font-medium">Tap to dismiss</div>
      </div>
    </div>
  );
};

export default StreakCelebration;
