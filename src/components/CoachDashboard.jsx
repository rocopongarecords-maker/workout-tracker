import { useState, useEffect } from 'react';

const CoachDashboard = ({ coach, userId, onOpenChat, onBuildProgram, onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSetup, setShowSetup] = useState(false);

  // Setup form state
  const [bio, setBio] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [certifications, setCertifications] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [pricingInfo, setPricingInfo] = useState('');
  const [maxClients, setMaxClients] = useState(10);
  const [saving, setSaving] = useState(false);

  const specialties = ['hypertrophy', 'strength', 'weightLoss', 'endurance', 'powerlifting', 'bodybuilding', 'rehabilitation', 'nutrition'];

  useEffect(() => {
    coach.loadMyCoachProfile();
  }, []);

  useEffect(() => {
    if (coach.myCoachProfile) {
      coach.loadMyClients();
    }
  }, [coach.myCoachProfile]);

  const filteredClients = (coach.myClients || []).filter(c => {
    if (selectedFilter === 'all') return true;
    return c.status === selectedFilter;
  });

  const statusCounts = {
    all: (coach.myClients || []).length,
    pending: (coach.myClients || []).filter(c => c.status === 'pending').length,
    active: (coach.myClients || []).filter(c => c.status === 'active').length,
    questionnaire_completed: (coach.myClients || []).filter(c => c.status === 'questionnaire_completed').length,
  };

  const handleCreateProfile = async () => {
    setSaving(true);
    const certs = certifications.split(',').map(s => s.trim()).filter(Boolean);
    await coach.createCoachProfile({
      bio,
      specialties: selectedSpecialties,
      certifications: certs,
      experience_years: experienceYears,
      pricing_info: pricingInfo,
      max_clients: maxClients
    });
    setSaving(false);
    setShowSetup(false);
  };

  const statusColors = {
    pending: 'bg-orange-500/20 text-orange-400',
    questionnaire_sent: 'bg-blue-500/20 text-blue-400',
    questionnaire_completed: 'bg-purple-500/20 text-purple-400',
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-white/[0.05] text-slate-400',
    ended: 'bg-red-500/20 text-red-400',
  };

  const statusLabels = {
    pending: 'Pending',
    questionnaire_sent: 'Q Sent',
    questionnaire_completed: 'Q Done',
    active: 'Active',
    paused: 'Paused',
    ended: 'Ended',
  };

  // Setup form
  if (!coach.myCoachProfile && !showSetup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-white">Coach Dashboard</h1>
        </div>

        <div className="glass-card p-8 text-center space-y-4">
          <div className="text-5xl">🏋️‍♂️</div>
          <h2 className="text-xl font-bold text-white">Become a Coach</h2>
          <p className="text-sm text-slate-400">Create your profile to start accepting clients and building custom programs.</p>
          <button
            onClick={() => setShowSetup(true)}
            className="w-full py-3 btn-primary flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Create Coach Profile
          </button>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSetup(false)} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-white">Create Coach Profile</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">About You</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell clients about yourself..."
              rows={3}
              className="w-full bg-app-surface/50 text-white text-sm px-4 py-3 rounded-xl outline-none resize-none border border-white/5 focus:border-blue-500/30 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialties(prev =>
                    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                  )}
                  className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium transition-all ${
                    selectedSpecialties.includes(s)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-app-surface/50 text-slate-400 border border-white/5'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Experience: {experienceYears} years</label>
            <input type="range" min={0} max={30} value={experienceYears} onChange={e => setExperienceYears(parseInt(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Certifications</label>
            <input
              value={certifications}
              onChange={e => setCertifications(e.target.value)}
              placeholder="e.g., NASM-CPT, CSCS (comma separated)"
              className="w-full bg-app-surface/50 text-white text-sm px-4 py-2.5 rounded-xl outline-none border border-white/5 focus:border-blue-500/30 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Pricing Info</label>
            <input
              value={pricingInfo}
              onChange={e => setPricingInfo(e.target.value)}
              placeholder="e.g., Free, $50/month"
              className="w-full bg-app-surface/50 text-white text-sm px-4 py-2.5 rounded-xl outline-none border border-white/5 focus:border-blue-500/30 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Max Clients: {maxClients}</label>
            <input type="range" min={1} max={50} value={maxClients} onChange={e => setMaxClients(parseInt(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <button
            onClick={handleCreateProfile}
            disabled={!bio || selectedSpecialties.length === 0 || saving}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
              bio && selectedSpecialties.length > 0 && !saving
                ? 'btn-primary'
                : 'bg-app-surface text-slate-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : 'Create Profile'}
          </button>
        </div>
      </div>
    );
  }

  // Coach dashboard
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-bold text-white">Coach Dashboard</h1>
      </div>

      {/* Profile summary */}
      {coach.myCoachProfile && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Your Coach Profile</div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span>{coach.myCoachProfile.active_clients}/{coach.myCoachProfile.max_clients} clients</span>
                {coach.myCoachProfile.rating_count > 0 && (
                  <span>★ {Number(coach.myCoachProfile.avg_rating).toFixed(1)}</span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${coach.myCoachProfile.accepting_clients ? 'text-green-400' : 'text-slate-500'}`}>
              <div className={`w-2 h-2 rounded-full ${coach.myCoachProfile.accepting_clients ? 'bg-green-400' : 'bg-app-surface-light'}`} />
              {coach.myCoachProfile.accepting_clients ? 'Active' : 'Paused'}
            </div>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['all', 'pending', 'active', 'questionnaire_completed'].map(f => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedFilter === f
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-app-surface/50 text-slate-400 border border-white/5'
            }`}
          >
            {f === 'all' ? 'All' : statusLabels[f] || f}
            {statusCounts[f] > 0 && (
              <span className={`text-[10px] px-1.5 rounded-full ${selectedFilter === f ? 'bg-blue-500/30' : 'bg-white/[0.08]'}`}>
                {statusCounts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Clients list */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-sm">No clients yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map(client => (
            <div key={client.id} className="glass-card p-4 space-y-3">
              <button
                onClick={() => onOpenChat(client.id)}
                className="w-full flex items-start gap-3 text-left"
              >
                <div className="text-2xl w-10 h-10 bg-app-surface rounded-full flex items-center justify-center shrink-0">
                  {client.authorEmoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{client.authorName || 'Client'}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[client.status] || 'bg-white/[0.05] text-slate-400'}`}>
                      {statusLabels[client.status] || client.status}
                    </span>
                  </div>
                  {client.started_at && (
                    <div className="text-[10px] text-slate-500 mt-0.5">Since {client.started_at.slice(0, 10)}</div>
                  )}
                </div>
              </button>

              {/* Actions */}
              {client.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => coach.updateClientStatus(client.id, 'questionnaire_sent')}
                    className="flex-1 py-2 text-xs font-medium bg-blue-500/15 text-blue-400 rounded-lg hover:bg-blue-500/25 transition-colors"
                  >Send Questionnaire</button>
                  <button
                    onClick={() => coach.updateClientStatus(client.id, 'ended')}
                    className="flex-1 py-2 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >Decline</button>
                </div>
              )}

              {client.status === 'questionnaire_completed' && (
                <button
                  onClick={onBuildProgram}
                  className="w-full py-2 text-xs font-medium btn-primary rounded-lg flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  Build Program
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
