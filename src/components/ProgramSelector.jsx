const BUILT_IN_PROGRAMS = [
  {
    id: 'jeff_nippard_lpp',
    name: "16-Week Legs-Push-Pull",
    description: '16-week evidence-based program with 6 training days per week. Block 1 focuses on technique & volume, Block 2 on higher effort.',
    weeks: 16,
    daysPerWeek: 6,
    isDefault: true
  },
  {
    id: 'jeff_nippard_fullbody',
    name: "Full Body Program",
    description: '12-week full body program, 4 days per week. Each session hits all major muscle groups. Block 1: volume, Block 2: intensity.',
    weeks: 12,
    daysPerWeek: 4,
    isDefault: true
  },
  {
    id: 'hyrox_prep',
    name: "Hyrox Race Prep",
    description: '10-week Hyrox preparation program. Combines strength training with race-specific stations (Ski Erg, Sled Push/Pull, Wall Ball, etc.).',
    weeks: 10,
    daysPerWeek: 4,
    isDefault: true
  }
];

const ProgramSelector = ({ programs, activeProgram, onSelectProgram, onCreateProgram, onDeleteProgram, onBrowseMarketplace, onBack }) => {
  const allPrograms = [...BUILT_IN_PROGRAMS, ...(programs || [])];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-white">Programs</h2>
        <div className="w-16" />
      </div>

      <p className="text-xs text-slate-500">
        Choose a training program or create your own custom program.
      </p>

      {/* Program cards */}
      <div className="space-y-3">
        {allPrograms.map((program, i) => {
          const isActive = (activeProgram || 'jeff_nippard_lpp') === program.id;

          return (
            <div
              key={program.id}
              className={`glass-card overflow-hidden transition-all animate-fade-in-up stagger-${i + 1} ${
                isActive
                  ? 'border-blue-500/30 shadow-glow-blue'
                  : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{program.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold rounded-full shadow-sm shadow-blue-500/25">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    {program.description && (
                      <p className="text-xs text-slate-400 mt-1">{program.description}</p>
                    )}
                    <div className="flex gap-3 mt-2">
                      <span className="text-[10px] text-slate-500">
                        {program.weeks} weeks
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {program.daysPerWeek || program.workoutDays?.length || '?'} days/week
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {!isActive && (
                    <button
                      onClick={() => onSelectProgram(program.id)}
                      className="flex-1 py-2 btn-primary text-sm"
                    >
                      Switch to This
                    </button>
                  )}
                  {program.isCustom && (
                    <button
                      onClick={() => onDeleteProgram(program.id)}
                      className="px-3 py-2 btn-danger text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Browse marketplace */}
      {onBrowseMarketplace && (
        <button
          onClick={onBrowseMarketplace}
          className="w-full py-4 glass-card overflow-hidden flex items-center gap-3 px-4 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
          </div>
          <div className="text-left flex-1">
            <span className="text-sm font-semibold text-white block">Browse Marketplace</span>
            <span className="text-[10px] text-slate-400">Discover programs from the community</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      )}

      {/* Create new */}
      <button
        onClick={onCreateProgram}
        className="w-full py-4 glass-card-interactive text-blue-400 font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create Custom Program
      </button>
    </div>
  );
};

export default ProgramSelector;
