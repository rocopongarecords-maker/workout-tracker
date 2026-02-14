import { exerciseInfo } from '../data/exerciseInfo';

const ExerciseInfoModal = ({ exerciseName, onClose }) => {
  const info = exerciseInfo[exerciseName];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {info ? (
          <div className="space-y-5">
            {info.imageUrl && (
              <div className="rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={`${import.meta.env.BASE_URL}${info.imageUrl}`}
                  alt={exerciseName}
                  className="w-full h-48 object-contain"
                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                />
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Muscle Groups</h4>
              <div className="flex flex-wrap gap-2">
                {info.muscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500/15 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Form Tips</h4>
              <div className="space-y-2">
                {info.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-green-400 flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Common Mistakes</h4>
              <div className="space-y-2">
                {info.mistakes.map((mistake, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No information available for this exercise yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseInfoModal;
