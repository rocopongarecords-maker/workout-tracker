import { useState, useEffect } from 'react';
import { DEMO_COACHES, getDemoRelationship, setDemoRelationship } from '../data/demoCoaches';

const CoachProfile = ({ coachId, coach, userId, onOpenQuestionnaire, onOpenChat, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const isDemo = coachId?.startsWith('demo-');
  const demoRelId = `demo-rel-${coachId}`;

  useEffect(() => {
    if (isDemo) {
      const demoCoach = DEMO_COACHES.find(c => c.id === coachId);
      setProfile(demoCoach || null);
      return;
    }
    (async () => {
      const loaded = await coach.loadCoachProfile(coachId);
      setProfile(loaded);
      await coach.loadRatings(coachId);
      await coach.loadMyRelationship();
    })();
  }, [coachId]);

  if (!profile && coach.loading && !isDemo) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const demoAlreadyConnected = isDemo && !!getDemoRelationship(coachId);

  const handleRequest = async () => {
    if (isDemo) {
      setDemoRelationship(coachId, { id: demoRelId, coachId, status: 'questionnaire_pending' });
      setRequestSent(true);
      onOpenQuestionnaire(coachId, demoRelId);
      return;
    }
    const success = await coach.requestCoaching(coachId);
    if (success) setRequestSent(true);
  };

  return (
    <div className="space-y-4">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      {/* Header */}
      <div className="glass-card p-6 text-center">
        <div className="text-5xl mb-3">{profile.authorEmoji || '🏋️'}</div>
        <h2 className="text-xl font-bold text-white">{profile.authorName || 'Coach'}</h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          {profile.rating_count > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-white">{Number(profile.avg_rating).toFixed(1)}</span>
              <span className="text-xs text-slate-500">({profile.rating_count} reviews)</span>
            </div>
          )}
          {profile.experience_years > 0 && (
            <span className="text-xs text-slate-400">{profile.experience_years} years exp</span>
          )}
        </div>
        {profile.accepting_clients ? (
          <div className="inline-flex items-center gap-1 mt-3 text-xs text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Accepting new clients
          </div>
        ) : (
          <div className="text-xs text-slate-500 mt-3">Not accepting clients</div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About</h3>
          <p className="text-sm text-slate-300">{profile.bio}</p>
        </div>
      )}

      {/* Specialties */}
      {profile.specialties?.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map(s => (
              <span key={s} className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full capitalize font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {profile.certifications?.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Certifications</h3>
          <div className="space-y-2">
            {profile.certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-blue-400 text-xs">✦</span>
                <span className="text-sm text-slate-300">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-lg font-bold text-white">{profile.active_clients || 0}</div>
          <div className="text-[10px] text-slate-500">Clients</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-lg font-bold text-white">{profile.rating_count || 0}</div>
          <div className="text-[10px] text-slate-500">Reviews</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-sm font-bold text-white truncate">{profile.pricing_info || 'Free'}</div>
          <div className="text-[10px] text-slate-500">Pricing</div>
        </div>
      </div>

      {/* Reviews */}
      {coach.ratings.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Reviews</h3>
          <div className="space-y-3">
            {coach.ratings.slice(0, 5).map(r => (
              <div key={r.id} className="bg-white/[0.05] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-xs ${i <= r.rating ? 'text-yellow-400' : 'text-slate-600'}`}>★</span>
                    ))}
                  </div>
                  {r.created_at && <span className="text-[10px] text-slate-600">{r.created_at.slice(0, 10)}</span>}
                </div>
                {r.review && <p className="text-xs text-slate-400">{r.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(requestSent || coach.myCoachRelationship || demoAlreadyConnected) ? (
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span className="text-sm font-medium">{requestSent ? 'Request Sent' : 'Already Connected'}</span>
          </div>
          {(coach.myCoachRelationship || demoAlreadyConnected) && (
            <button
              onClick={() => onOpenChat(isDemo ? demoRelId : coach.myCoachRelationship.id)}
              className="mt-3 w-full py-2.5 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >Open Chat</button>
          )}
        </div>
      ) : profile.accepting_clients ? (
        <button
          onClick={handleRequest}
          disabled={coach.loading && !isDemo}
          className="w-full py-4 btn-primary flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Request Coaching
        </button>
      ) : null}
    </div>
  );
};

export default CoachProfile;
