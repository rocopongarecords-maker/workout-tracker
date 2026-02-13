import { workoutData } from '../data/workoutData';
import { calculateWorkoutVolume, getVolumeComparison } from '../utils/calculateVolume';

const WorkoutSummary = ({ dayNumber, workoutHistory, completedWorkouts, prsHit, onContinue }) => {
  const history = workoutHistory[dayNumber];
  if (!history) return null;

  const blockKey = `block${history.block}`;
  const workoutInfo = workoutData[blockKey]?.[history.workoutType];
  const workoutName = workoutInfo?.name || history.workoutType;

  const totalVolume = calculateWorkoutVolume(history.exercises);
  const totalSetsCompleted = (history.exercises || []).reduce((sum, ex) => {
    return sum + (ex.userSets || []).filter(s => s.completed).length;
  }, 0);
  const totalExercises = (history.exercises || []).length;

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

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalExercises}</div>
          <div className="text-xs text-slate-400 mt-1">Exercises</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalSetsCompleted}</div>
          <div className="text-xs text-slate-400 mt-1">Sets</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Volume (kg)</div>
        </div>
      </div>

      {volumeDiff !== null && (
        <div className={`rounded-xl p-4 text-center ${volumeDiff >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
          <div className={`text-lg font-bold ${volumeDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {volumeDiff >= 0 ? '+' : ''}{volumeDiff.toLocaleString()} kg ({volumePct >= 0 ? '+' : ''}{volumePct}%)
          </div>
          <div className="text-xs text-slate-400 mt-1">vs previous {workoutName}</div>
        </div>
      )}

      {(prsHit || 0) > 0 && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-amber-400">
            🏆 {prsHit} Personal Record{prsHit > 1 ? 's' : ''} Today!
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default WorkoutSummary;
