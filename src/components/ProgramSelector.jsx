const DEFAULT_PROGRAM = {
  id: 'jeff_nippard_lpp',
  name: "Jeff Nippard's Legs-Push-Pull",
  description: '16-week evidence-based program with 6 training days per week. Block 1 focuses on technique & volume, Block 2 on higher effort.',
  weeks: 16,
  daysPerWeek: 6,
  isDefault: true
};

const ProgramSelector = ({ programs, activeProgram, onSelectProgram, onCreateProgram, onDeleteProgram, onBack }) => {
  const allPrograms = [DEFAULT_PROGRAM, ...(programs || [])];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Programs</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Choose a training program or create your own custom program.
      </p>

      {/* Program cards */}
      <div className="space-y-3">
        {allPrograms.map(program => {
          const isActive = (activeProgram || 'jeff_nippard_lpp') === program.id;

          return (
            <div
              key={program.id}
              className={`rounded-xl border-2 overflow-hidden transition-colors ${
                isActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{program.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
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
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Switch to This
                    </button>
                  )}
                  {program.isCustom && (
                    <button
                      onClick={() => onDeleteProgram(program.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
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

      {/* Create new */}
      <button
        onClick={onCreateProgram}
        className="w-full py-4 bg-slate-800 text-blue-400 rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-slate-700"
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
