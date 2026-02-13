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
        <h2 className="text-xl font-bold text-white">Exercise Library</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
      />

      {/* Muscle filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMuscleFilter(null)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            !muscleFilter ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          All
        </button>
        {muscleGroups.map(m => (
          <button
            key={m}
            onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              muscleFilter === m ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
              className="bg-slate-800 rounded-xl overflow-hidden"
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
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg font-semibold hover:bg-blue-600 transition-colors"
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
                  {/* Muscles */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Muscles</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscles.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips from exerciseInfo if available */}
                  {info?.tips && (
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Tips</div>
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

                  {/* Mistakes */}
                  {info?.mistakes && (
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Common Mistakes</div>
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
