import { useState, useMemo } from 'react';
import { exerciseLibrary, muscleGroups } from '../data/exerciseLibrary';
import { exerciseInfo } from '../data/exerciseInfo';

const ExerciseLibrary = ({ onBack, onSelectExercise }) => {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  const filtered = useMemo(() => {
    let list = exerciseLibrary;
    if (muscleFilter) {
      list = list.filter(e => e.muscles.includes(muscleFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q));
    }
    return list;
  }, [search, muscleFilter]);

  const toggleExpand = (name) => {
    setExpandedExercise(prev => prev === name ? null : name);
  };

  const categoryLabel = (cat) => cat === 'compound' ? 'Compound' : 'Isolation';
  const categoryColor = (cat) => cat === 'compound' ? 'text-blue-400' : 'text-emerald-400';

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-white">Exercise Library</h2>
        <div className="w-16" />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/[0.08] focus:border-blue-500/50 outline-none"
      />

      {/* Muscle filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMuscleFilter(null)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            !muscleFilter ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/25' : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]'
          }`}
        >
          All
        </button>
        {muscleGroups.map(m => (
          <button
            key={m}
            onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              muscleFilter === m ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/25' : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500">
        {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Exercise list */}
      <div className="space-y-2">
        {filtered.map(exercise => {
          const info = exerciseInfo[exercise.name];
          const isExpanded = expandedExercise === exercise.name;

          return (
            <div
              key={exercise.name}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(exercise.name)}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{exercise.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase ${categoryColor(exercise.category)}`}>
                      {categoryLabel(exercise.category)}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{exercise.equipment}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onSelectExercise && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExercise(exercise);
                      }}
                      className="px-3 py-1 btn-primary text-xs"
                    >
                      Add
                    </button>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Muscles</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscles.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-white/[0.05] text-slate-300 text-xs rounded-full border border-white/[0.08]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {info?.tips && (
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Tips</div>
                      <ul className="space-y-1">
                        {info.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-blue-400 mt-0.5">*</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {info?.mistakes && (
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Common Mistakes</div>
                      <ul className="space-y-1">
                        {info.mistakes.map((m, i) => (
                          <li key={i} className="text-xs text-red-400/80 flex gap-2">
                            <span className="text-red-400 mt-0.5">!</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No exercises found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
