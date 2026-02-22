import { calculateWorkoutVolume, getVolumeComparison } from '../utils/calculateVolume';
import { getBadge } from '../utils/checkBadges';

const WorkoutSummary = ({ dayNumber, workoutHistory, completedWorkouts, prsHit, newBadges, onContinue, getWorkoutName }) => {
  const history = workoutHistory[dayNumber];
  if (!history) return null;

  const workoutName = getWorkoutName ? (getWorkoutName(dayNumber) || history.workoutType) : history.workoutType;

  const totalVolume = calculateWorkoutVolume(history.exercises);
  const totalSetsCompleted = (history.exercises || []).reduce((sum, ex) => {
    return sum + (ex.userSets || []).filter(s => s.completed).length;
  }, 0);
  const totalExercises = (history.exercises || []).length;

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };
  const durationStr = formatDuration(history.duration);

  const comparison = getVolumeComparison(
    history.workoutType, dayNumber, workoutHistory, completedWorkouts
  );

  let volumeDiff = null;
  let volumePct = null;
  if (comparison?.prevVolume) {
    volumeDiff = totalVolume - comparison.prevVolume;
    volumePct = comparison.prevVolume > 0 ? Math.round((volumeDiff / comparison.prevVolume) * 100) : 0;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center pt-4">
        <div className="text-5xl mb-4">
          {(prsHit || 0) > 0 ? '🏆' : '💪'}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Workout Complete!</h1>
        <p className="text-slate-400">{workoutName} — Day {dayNumber}</p>
      </div>

      <div className={`grid gap-3 ${durationStr ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {durationStr && (
          <div className="glass-card p-4 text-center animate-fade-in-up">
            <div className="stat-number text-2xl">{durationStr}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Duration</div>
          </div>
        )}
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
          <div className="stat-number text-2xl">{totalExercises}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Exercises</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-2">
          <div className="stat-number text-2xl">{totalSetsCompleted}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Sets</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-3">
          <div className="stat-number text-2xl">{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Volume (kg)</div>
        </div>
      </div>

      {volumeDiff !== null && (
        <div className={`glass-card p-4 text-center ${volumeDiff >= 0 ? 'border-green-500/20 shadow-glow-green' : 'border-red-500/20'}`}>
          <div className={`text-lg font-bold ${volumeDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {volumeDiff >= 0 ? '+' : ''}{volumeDiff.toLocaleString()} kg ({volumePct >= 0 ? '+' : ''}{volumePct}%)
          </div>
          <div className="text-xs text-slate-400 mt-1">vs previous {workoutName}</div>
        </div>
      )}

      {(prsHit || 0) > 0 && (
        <div className="glass-card border-amber-500/30 p-4 text-center shadow-glow-amber">
          <div className="text-lg font-bold text-amber-400">
            🏆 {prsHit} Personal Record{prsHit > 1 ? 's' : ''} Today!
          </div>
        </div>
      )}

      {(newBadges || []).length > 0 && (
        <div className="glass-card border-amber-500/30 p-4 shadow-glow-amber">
          <div className="text-sm font-bold text-amber-400 mb-3 text-center">Badges Earned!</div>
          <div className="flex flex-wrap justify-center gap-3">
            {newBadges.map(id => {
              const badge = getBadge(id);
              if (!badge) return null;
              return (
                <div key={id} className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-2 border border-white/[0.08]">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-semibold text-white">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show workout notes if present */}
      {history.notes && (
        <div className="glass-card p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</div>
          <p className="text-sm text-slate-300">{history.notes}</p>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full py-4 btn-primary"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default WorkoutSummary;
