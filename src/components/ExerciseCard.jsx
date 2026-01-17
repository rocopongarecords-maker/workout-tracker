import { useState } from 'react';
import SetTracker from './SetTracker';

const ExerciseCard = ({ exercise, onChange, previousWorkout }) => {
  // Initialize sets directly in useState callback - runs only once on mount
  const [sets, setSets] = useState(() => {
    const initialSets = [];
    for (let i = 1; i <= exercise.sets; i++) {
      initialSets.push({
        setNumber: i,
        weight: previousWorkout?.weight || '',
        reps: '',
        completed: false
      });
    }
    return initialSets;
  });

  // Helper function to parse target reps for pre-filling
  const getTargetReps = () => {
    const repsStr = exercise.reps;
    // If it's a single number (e.g., "5"), return it
    if (!repsStr.includes('-')) return repsStr;
    // If it's a range (e.g., "6-8"), return first number
    return repsStr.split('-')[0];
  };

  const targetReps = getTargetReps();

  const handleSetChange = (setNumber, field, value) => {
    setSets(prev => prev.map(set =>
      set.setNumber === setNumber
        ? { ...set, [field]: value }
        : set
    ));

    onChange(exercise.name, sets.map(set =>
      set.setNumber === setNumber
        ? { ...set, [field]: value }
        : set
    ));
  };

  const completedSetsCount = sets.filter(set => set.completed).length;
  const totalSets = exercise.sets;

  return (
    <div className="bg-slate-800 rounded-xl p-4 mb-4">
      {/* Exercise Name */}
      <h3 className="text-lg font-semibold text-white mb-3">
        {exercise.superset && <span className="text-purple-400 mr-2">A1</span>}
        {exercise.name}
      </h3>

      {/* Target Section */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
        <div className="text-sm text-slate-400">
          <strong className="text-white">Target:</strong> {exercise.sets} sets × {exercise.reps} reps
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Rest: {exercise.restTime}
        </div>
        {previousWorkout && previousWorkout.weight && (
          <div className="text-xs text-slate-500 mt-2">
            Last: {previousWorkout.weight} kg × {previousWorkout.reps} reps (Day {previousWorkout.dayNumber})
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="border-t border-slate-700 my-4"></div>

      {/* Completed Section */}
      <div className="text-sm font-semibold text-blue-400 mb-3">
        What You Completed
      </div>

      {/* Set Trackers */}
      <div className="space-y-3">
        {sets.map(set => (
          <SetTracker
            key={set.setNumber}
            setNumber={set.setNumber}
            weight={set.weight}
            reps={set.reps}
            targetReps={targetReps}
            completed={set.completed}
            onChange={handleSetChange}
          />
        ))}
      </div>

      {/* Exercise Progress Bar */}
      {totalSets > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">
              Sets Completed
            </span>
            <span className="text-white font-semibold">
              {completedSetsCount}/{totalSets}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedSetsCount / totalSets) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;