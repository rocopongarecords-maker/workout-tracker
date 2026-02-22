import { useState, useEffect } from 'react';
import { DEMO_COACHES } from '../data/demoCoaches';

const CoachDiscovery = ({ coach, onSelectCoach, onOpenChat, onBack }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const specialties = ['hypertrophy', 'strength', 'weightLoss', 'endurance', 'powerlifting', 'bodybuilding', 'rehabilitation', 'nutrition'];

  useEffect(() => {
    coach.loadCoaches(selectedSpecialty);
    coach.loadMyRelationship();
  }, [selectedSpecialty]);

  // Prepend demo coaches; filter real coaches to avoid duplicating demo IDs
  const allCoaches = [
    ...DEMO_COACHES.filter(d =>
      !selectedSpecialty || d.specialties.includes(selectedSpecialty)
    ),
    ...(coach.coaches || []).filter(c => !c.id?.startsWith('demo-')),
  ];

  const filteredCoaches = allCoaches.filter(c => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (c.authorName || '').toLowerCase().includes(q) ||
      (c.bio || '').toLowerCase().includes(q) ||
      (c.specialties || []).some(s => s.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Find a Coach</h1>
          <p className="text-xs text-slate-500">Connect with certified trainers</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-app-surface/50 rounded-xl border border-white/5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Search coaches..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Specialty filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setSelectedSpecialty(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedSpecialty ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-app-surface/50 text-slate-400 border border-white/5'
          }`}
        >All</button>
        {specialties.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSpecialty(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              selectedSpecialty === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-app-surface/50 text-slate-400 border border-white/5'
            }`}
          >{s}</button>
        ))}
      </div>

      {/* Active coaching */}
      {coach.myCoachRelationship && (
        <button
          onClick={() => onOpenChat(coach.myCoachRelationship.id)}
          className="w-full glass-card-interactive p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-white">Active Coaching</div>
              <div className="text-xs text-slate-500 capitalize">{coach.myCoachRelationship.status.replace(/_/g, ' ')}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
      )}

      {/* Results — demos always show; spinner only during Supabase load */}
      {filteredCoaches.length === 0 && !coach.loading ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No coaches found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coach.loading && filteredCoaches.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {filteredCoaches.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCoach(c.id)}
              className="w-full glass-card-interactive p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl w-12 h-12 bg-app-surface rounded-full flex items-center justify-center shrink-0">
                  {c.authorEmoji || '🏋️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white text-sm">{c.authorName || 'Coach'}</span>
                      {c.isDemo && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">Demo</span>
                      )}
                    </div>
                    {c.accepting_clients && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Available</span>
                    )}
                  </div>
                  {c.rating_count > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs text-white font-medium">{Number(c.avg_rating).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500">({c.rating_count})</span>
                      {c.experience_years > 0 && (
                        <span className="text-[10px] text-slate-500 ml-1">• {c.experience_years}yr exp</span>
                      )}
                    </div>
                  )}
                  {c.bio && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.bio}</p>
                  )}
                  {c.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.specialties.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachDiscovery;
