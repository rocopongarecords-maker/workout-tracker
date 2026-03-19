import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, CheckCircle, Navigation } from 'lucide-react';

const GymScreen = ({ gym = {}, onNavigate }) => {
  const [searchText, setSearchText] = useState('');

  const {
    homeGym,
    nearbyGyms = [],
    loading = false,
    locationGranted = false,
    requestLocation,
    searchGyms,
  } = gym;

  useEffect(() => {
    if (!locationGranted && requestLocation) {
      requestLocation();
    }
  }, []);

  const filteredGyms = nearbyGyms.filter(g => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (g.name || '').toLowerCase().includes(q) ||
      (g.address || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Gyms</h1>
        <p className="text-xs text-slate-500">Find and check in to gyms near you</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-app-surface/50 rounded-xl border border-white/5">
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
            searchGyms?.(e.target.value);
          }}
          placeholder="Search gyms..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Home Gym */}
      {homeGym && (
        <div className="animate-fade-in-up">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Home Gym</h2>
          <button
            onClick={() => onNavigate?.('gym-detail', homeGym.id)}
            className="w-full glass-card-interactive p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(var(--color-primary), 0.2), rgba(var(--color-primary-light), 0.1))' }}
              >
                <MapPin size={20} style={{ color: 'rgb(var(--color-primary))' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate">{homeGym.name}</p>
                  {homeGym.verified && <CheckCircle size={12} className="text-green-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 truncate">{homeGym.address || 'No address'}</p>
                {homeGym.equipment_count > 0 && (
                  <p className="text-[10px] text-slate-600 mt-0.5">{homeGym.equipment_count} equipment items</p>
                )}
              </div>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(var(--color-primary), 0.15)', color: 'rgb(var(--color-primary))' }}
              >
                Home
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Nearby Gyms */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Nearby
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgb(var(--color-primary))', borderTopColor: 'transparent' }} />
          </div>
        ) : !locationGranted ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-4xl mb-3">📍</div>
            <p className="text-sm font-medium text-white mb-1">Location not available</p>
            <p className="text-xs text-slate-500 mb-4">Enable location to find gyms near you</p>
            <button
              onClick={() => requestLocation?.()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
            >
              <Navigation size={16} />
              Enable Location
            </button>
          </div>
        ) : filteredGyms.length === 0 ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-4xl mb-3">🏋️</div>
            <p className="text-sm font-medium text-white mb-1">No nearby gyms</p>
            <p className="text-xs text-slate-500">Try expanding your search area</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGyms.map((g, i) => (
              <button
                key={g.id || i}
                onClick={() => onNavigate?.('gym-detail', g.id)}
                className="w-full glass-card-interactive p-4 text-left animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
                  >
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-white truncate">{g.name}</p>
                      {g.verified && <CheckCircle size={12} className="text-green-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{g.address || 'No address'}</p>
                  </div>
                  {g.distance != null && (
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/5 text-slate-400 shrink-0">
                      {g.distance < 1 ? `${Math.round(g.distance * 1000)}m` : `${g.distance.toFixed(1)}km`}
                    </span>
                  )}
                  <ChevronRight size={14} className="text-slate-600 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymScreen;
