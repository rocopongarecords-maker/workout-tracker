import { badges, badgeCategories, tierColors } from '../data/badges';

const BadgeScreen = ({ earnedBadges, onBack }) => {
  const earnedIds = new Set((earnedBadges || []).map(b => b.id));

  const getEarnedDate = (badgeId) => {
    const entry = (earnedBadges || []).find(b => b.id === badgeId);
    if (!entry?.earnedAt) return null;
    return new Date(entry.earnedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  const totalEarned = (earnedBadges || []).length;
  const totalBadges = badges.length;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Badges</h1>
        <p className="text-slate-400 text-sm">
          {totalEarned}/{totalBadges} earned
        </p>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-3 max-w-xs mx-auto">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all"
            style={{ width: `${(totalEarned / totalBadges) * 100}%` }}
          />
        </div>
      </div>

      {badgeCategories.map(category => {
        const categoryBadges = badges.filter(b => b.category === category.id);
        return (
          <div key={category.id}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {categoryBadges.map(badge => {
                const isEarned = earnedIds.has(badge.id);
                const colors = tierColors[badge.tier];
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl p-3 text-center border-2 transition-all ${
                      isEarned
                        ? `${colors.bg} ${colors.border}`
                        : 'bg-slate-800/50 border-slate-700/50 opacity-40'
                    }`}
                  >
                    <div className={`text-3xl mb-2 ${isEarned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className={`text-xs font-semibold mb-1 ${isEarned ? 'text-white' : 'text-slate-500'}`}>
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {isEarned ? getEarnedDate(badge.id) : badge.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeScreen;
