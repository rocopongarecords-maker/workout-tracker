import { calculate1RM } from '../utils/calculate1RM';
import { getVolumeComparison } from '../utils/calculateVolume';

const WorkoutReview = ({ dayNumber, workoutHistory, completedWorkouts, onBack, onEdit, getWorkoutName }) => {
  const history = workoutHistory[dayNumber];

  if (!history) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-colors"
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
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalSetsCompleted}</div>
          <div className="text-xs text-slate-400 mt-1">Sets Completed</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Total Volume (kg)</div>
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
          <div className={`rounded-xl p-4 text-center ${diff >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
            <div className={`text-lg font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {diff >= 0 ? '+' : ''}{diff.toLocaleString()} kg ({pct >= 0 ? '+' : ''}{pct}%)
            </div>
            <div className="text-xs text-slate-400 mt-1">vs previous {history.workoutType} (Day {comparison.prevDay})</div>
          </div>
        );
      })()}

      <div className="space-y-4">
        {(history.exercises || []).map((exercise, idx) => {
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
            <div key={idx} className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{exercise.name}</h3>
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
                        set.completed ? 'bg-green-900/20 text-white' : 'bg-slate-700/30 text-slate-500'
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
