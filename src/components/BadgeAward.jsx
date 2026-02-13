import { useEffect } from 'react';
import { getBadge } from '../utils/checkBadges';
import { tierColors } from '../data/badges';

const BadgeAward = ({ badgeIds, onDone }) => {
  const badgesToShow = (badgeIds || []).map(getBadge).filter(Boolean);

  useEffect(() => {
    if (badgesToShow.length === 0) return;
    const timer = setTimeout(() => {
      onDone();
    }, 3000);
    return () => clearTimeout(timer);
  }, [badgeIds]);

  if (badgesToShow.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onDone}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative text-center animate-badge-pop">
        <div className="text-6xl mb-4">
          {badgesToShow[0].icon}
        </div>
        <div className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">
          Badge Earned!
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {badgesToShow[0].name}
        </div>
        <div className="text-sm text-slate-400 mb-4">
          {badgesToShow[0].description}
        </div>
        {badgesToShow.length > 1 && (
          <div className="text-xs text-slate-500">
            +{badgesToShow.length - 1} more badge{badgesToShow.length > 2 ? 's' : ''}
          </div>
        )}
        <div className="mt-6 text-xs text-slate-600">Tap to dismiss</div>
      </div>
    </div>
  );
};

export default BadgeAward;
