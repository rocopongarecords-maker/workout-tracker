import { calculate1RM } from '../utils/calculate1RM';
import { getVolumeComparison } from '../utils/calculateVolume';

const WorkoutReview = ({ dayNumber, workoutHistory, completedWorkouts, onBack, onEdit, getWorkoutName }) => {
  const history = workoutHistory[dayNumber];

  if (!history) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="text-center text-slate-400 py-12">
          No data recorded for this workout yet.
        </div>
      </div>
    );
  }

  const workoutName = getWorkoutName ? (getWorkoutName(dayNumber) || history.workoutType) : history.workoutType;
  const completedDate = history.date ? new Date(history.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  }) : 'Unknown date';

  const totalVolume = (history.exercises || []).reduce((total, ex) => {
    if (ex.skipped) return total;
    return total + (ex.userSets || []).reduce((sum, set) => {
      const w = Number(set.weight) || 0;
      const r = Number(set.reps) || 0;
      return sum + (w * r);
    }, 0);
  }, 0);

  const totalSetsCompleted = (history.exercises || []).reduce((sum, ex) => {
    return sum + (ex.userSets || []).filter(s => s.completed).length;
  }, 0);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        {onEdit && (
          <button
            onClick={onEdit}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Edit Workout
          </button>
        )}
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">{workoutName}</h1>
        <p className="text-slate-400 text-sm">
          Day {dayNumber}{history.block ? ` — Block ${history.block}` : ''}
        </p>
        <p className="text-slate-500 text-xs mt-1">
          {completedDate}
          {history.duration > 0 && (() => {
            const h = Math.floor(history.duration / 3600);
            const m = Math.floor((history.duration % 3600) / 60);
            const dur = h > 0 ? `${h}h ${m}m` : `${m}m`;
            return ` · ${dur}`;
          })()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center animate-fade-in-up">
          <div className="stat-number text-2xl">{totalSetsCompleted}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Sets Completed</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
          <div className="stat-number text-2xl">{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total Volume (kg)</div>
        </div>
      </div>

      {(() => {
        const comparison = completedWorkouts
          ? getVolumeComparison(history.workoutType, dayNumber, workoutHistory, completedWorkouts)
          : null;
        if (!comparison || !comparison.prevVolume) return null;
        const diff = totalVolume - comparison.prevVolume;
        const pct = comparison.prevVolume > 0 ? Math.round((diff / comparison.prevVolume) * 100) : 0;
        return (
          <div className={`glass-card p-4 text-center ${diff >= 0 ? 'border-green-500/20 shadow-glow-green' : 'border-red-500/20'}`}>
            <div className={`text-lg font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {diff >= 0 ? '+' : ''}{diff.toLocaleString()} kg ({pct >= 0 ? '+' : ''}{pct}%)
            </div>
            <div className="text-xs text-slate-400 mt-1">vs previous {history.workoutType} (Day {comparison.prevDay})</div>
          </div>
        );
      })()}

      {/* Workout Notes */}
      {history.notes && (
        <div className="glass-card p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</div>
          <p className="text-sm text-slate-300">{history.notes}</p>
        </div>
      )}

      <div className="space-y-4">
        {(history.exercises || []).map((exercise, idx) => {
          // Skipped exercise
          if (exercise.skipped) {
            return (
              <div key={idx} className="glass-card p-4 border-amber-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-400 line-through">{exercise.name}</h3>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                    SKIPPED
                  </span>
                </div>
              </div>
            );
          }

          const sets = exercise.userSets || [];
          const completedSets = sets.filter(s => s.completed);
          const bestSet = completedSets.reduce((best, set) => {
            const w = Number(set.weight) || 0;
            const r = Number(set.reps) || 0;
            const bestW = Number(best?.weight) || 0;
            const bestR = Number(best?.reps) || 0;
            return (w * r) > (bestW * bestR) ? set : best;
          }, completedSets[0]);

          const est1RM = bestSet ? calculate1RM(Number(bestSet.weight), Number(bestSet.reps)) : null;

          return (
            <div key={idx} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{exercise.name}</h3>
                  {exercise.substituted && exercise.originalName && (
                    <span className="text-[10px] text-purple-400">Substituted for {exercise.originalName}</span>
                  )}
                </div>
                {est1RM > 0 && (
                  <span className="text-xs text-slate-400">Est 1RM: {est1RM} kg</span>
                )}
              </div>

              {sets.length > 0 ? (
                <div className="space-y-1">
                  {sets.map((set, sIdx) => (
                    <div
                      key={sIdx}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
                        set.completed ? 'bg-teal-900/30 text-white' : 'bg-white/[0.05] text-slate-500'
                      }`}
                    >
                      <span className="text-slate-400 text-xs w-12">Set {set.setNumber || sIdx + 1}</span>
                      <span className="font-semibold">{set.weight || '—'} kg</span>
                      <span className="text-slate-400">x</span>
                      <span className="font-semibold">{set.reps || '—'} reps</span>
                      {set.completed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="w-[14px]" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No sets recorded</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutReview;
