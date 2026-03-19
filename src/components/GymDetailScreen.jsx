import { CheckCircle, MapPin, Home, LogIn } from 'lucide-react';

const EQUIPMENT_CATEGORIES = {
  'Free Weights': ['Dumbbells', 'Barbells', 'Kettlebells', 'Weight Plates', 'EZ Curl Bar'],
  'Machines': ['Cable Machine', 'Smith Machine', 'Leg Press', 'Chest Press', 'Lat Pulldown', 'Leg Curl', 'Leg Extension'],
  'Cardio': ['Treadmill', 'Rowing Machine', 'Stationary Bike', 'Elliptical', 'Stairmaster'],
  'Other': ['Pull-Up Bar', 'Dip Station', 'Resistance Bands', 'TRX', 'Battle Ropes', 'Plyo Box'],
};

const AMENITY_ICONS = {
  shower: '🚿',
  locker: '🔐',
  wifi: '📶',
  sauna: '♨️',
  parking: '🅿️',
  towels: '🧴',
  shop: '🏪',
  cafe: '☕',
};

const GymDetailScreen = ({ gymData = {}, gymId, onBack }) => {
  const {
    getGymById,
    checkIn,
    setHomeGym,
    homeGym,
    getGymLeaderboard,
  } = gymData;

  const gym = getGymById?.(gymId) || {};
  const leaderboard = getGymLeaderboard?.(gymId) || [];
  const isHome = homeGym?.id === gymId;

  // Group equipment by category
  const groupedEquipment = {};
  (gym.equipment || []).forEach(item => {
    let placed = false;
    for (const [cat, items] of Object.entries(EQUIPMENT_CATEGORIES)) {
      if (items.some(e => item.toLowerCase().includes(e.toLowerCase()))) {
        if (!groupedEquipment[cat]) groupedEquipment[cat] = [];
        groupedEquipment[cat].push(item);
        placed = true;
        break;
      }
    }
    if (!placed) {
      if (!groupedEquipment['Other']) groupedEquipment['Other'] = [];
      groupedEquipment['Other'].push(item);
    }
  });

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

      {/* Gym Header Card */}
      <div className="glass-card p-6 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(var(--color-primary), 0.2), rgba(var(--color-primary-light), 0.1))' }}
          >
            <MapPin size={24} style={{ color: 'rgb(var(--color-primary))' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-white">{gym.name || 'Gym'}</h1>
              {gym.verified && <CheckCircle size={14} className="text-green-400" />}
              {isHome && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(var(--color-primary), 0.15)', color: 'rgb(var(--color-primary))' }}>
                  Home
                </span>
              )}
            </div>
            {gym.chain && (
              <p className="text-xs text-slate-400 mt-0.5">{gym.chain}</p>
            )}
            <p className="text-xs text-slate-500 mt-0.5">{gym.address || 'No address available'}</p>
            {gym.distance != null && (
              <p className="text-[10px] text-slate-600 mt-1">
                {gym.distance < 1 ? `${Math.round(gym.distance * 1000)}m away` : `${gym.distance.toFixed(1)}km away`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <button
          onClick={() => checkIn?.(gymId)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
        >
          <LogIn size={16} />
          Check In
        </button>
        <button
          onClick={() => setHomeGym?.(gymId)}
          disabled={isHome}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            isHome ? 'text-slate-500 cursor-not-allowed' : 'text-white'
          }`}
          style={{
            backgroundColor: 'rgb(var(--bg-surface-light))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Home size={16} />
          {isHome ? 'Your Home Gym' : 'Set as Home'}
        </button>
      </div>

      {/* Equipment Section */}
      {Object.keys(groupedEquipment).length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Equipment</h2>
          <div className="space-y-3">
            {Object.entries(groupedEquipment).map(([category, items]) => (
              <div key={category}>
                <p className="text-[10px] text-slate-500 uppercase mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1.5 rounded-full text-slate-300"
                      style={{ backgroundColor: 'rgb(var(--bg-surface-light))', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities Section */}
      {gym.amenities?.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {gym.amenities.map(amenity => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-slate-300"
                style={{ backgroundColor: 'rgb(var(--bg-surface-light))', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span>{AMENITY_ICONS[amenity.toLowerCase()] || '✓'}</span>
                <span className="capitalize">{amenity}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gym Regulars Leaderboard */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Gym Regulars</h2>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 glass-card">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-xs text-slate-500">No check-ins yet. Be the first!</p>
          </div>
        ) : (
          <div className="glass-card divide-y" style={{ borderColor: 'rgba(var(--border-color), 0.05)' }}>
            {leaderboard.slice(0, 10).map((entry, i) => {
              const rank = i + 1;
              const rankColors = { 1: 'text-yellow-400', 2: 'text-slate-300', 3: 'text-amber-600' };
              return (
                <div key={entry.user_id || i} className="flex items-center gap-3 px-4 py-3">
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
                    <p className="text-sm font-medium text-white truncate">{entry.display_name || 'User'}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tabular-nums">
                    {entry.checkin_count || 0} check-ins
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDetailScreen;
