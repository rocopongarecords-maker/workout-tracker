import { useState, useEffect, useRef } from 'react';
import { getLastCompletedWorkoutForType } from '../utils/getPreviousWorkout';
import ExerciseCard from './ExerciseCard';

const WorkoutScreen = ({ dayNumber, workoutType, block, editing, onSave, onComplete, onCancel, workoutHistory, completedWorkouts, onPR, getExercisesForDay, getWorkoutName }) => {
  const [exercises, setExercises] = useState([]);
  const [lastWorkout, setLastWorkout] = useState(null);
  const exerciseRefs = useRef([]);

  const scrollToNext = (exerciseIndex, setNumber, totalSets) => {
    setTimeout(() => {
      if (setNumber < totalSets) {
        // More sets in this exercise — scroll to same card (it re-renders with next set visible)
        const el = exerciseRefs.current[exerciseIndex];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // All sets done — scroll to next exercise
        const nextIndex = exerciseIndex + 1;
        if (nextIndex < exercises.length) {
          const el = exerciseRefs.current[nextIndex];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);
  };

  useEffect(() => {
    const exerciseList = getExercisesForDay(dayNumber);
    if (exerciseList) {
      const savedHistory = editing ? workoutHistory[dayNumber] : null;

      const initialExercises = exerciseList.map(ex => {
        if (savedHistory?.exercises) {
          const savedEx = savedHistory.exercises.find(s => s.name === ex.name);
          if (savedEx?.userSets?.length > 0) {
            return { ...ex, userSets: savedEx.userSets, completed: false };
          }
        }
        return { ...ex, userSets: [], completed: false };
      });

      setExercises(initialExercises);

      const lastCompleted = getLastCompletedWorkoutForType(workoutType, workoutHistory, completedWorkouts);
      setLastWorkout(lastCompleted);
    }
  }, [dayNumber, workoutType, block, editing]);

  const handleExerciseChange = (exerciseName, newSets) => {
    setExercises(prev => prev.map(ex =>
      ex.name === exerciseName
        ? { ...ex, userSets: newSets }
        : ex
    ));
  };

  const getPreviousWorkoutDetails = (exerciseName) => {
    if (!lastWorkout) return null;

    const exercise = lastWorkout.exercises?.find(ex => ex.name === exerciseName);
    if (!exercise || !exercise.userSets || exercise.userSets.length === 0) return null;

    const lastSet = exercise.userSets[exercise.userSets.length - 1];

    return {
      weight: lastSet?.weight || null,
      reps: lastSet?.reps || null,
      dayNumber: lastWorkout.dayNumber || null
    };
  };

  const handleSave = () => {
    onSave(dayNumber, {
      workoutType,
      block,
      exercises: exercises.map(ex => ({
        name: ex.name,
        userSets: ex.userSets
      }))
    });
  };

  const handleComplete = () => {
    handleSave();
    onComplete(dayNumber);
  };

  const isComplete = exercises.every(ex => ex.completed);

  const totalSets = exercises.reduce((sum, ex) => sum + Number(ex.sets), 0);
  const completedSets = exercises.reduce((sum, ex) =>
    sum + ex.userSets.filter(s => s.completed).length, 0
  );
  const completedExercises = exercises.filter(ex =>
    ex.userSets.length === Number(ex.sets) && ex.userSets.every(s => s.completed)
  ).length;

  return (
    <div className="space-y-6 pb-24">
      {totalSets > 0 && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">
            Workout Progress
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold text-white">
                {completedSets}/{totalSets}
              </div>
              <div className="text-xs text-slate-500">
                Sets
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${(completedSets / totalSets) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {completedExercises}/{exercises.length} exercises complete
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6" />
            <path d="M9 6h12" />
          </svg>
          Back
        </button>
        <div className="text-sm text-slate-400">
          Day {dayNumber}{block ? ` • Block ${block}` : ''}
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          {getWorkoutName ? getWorkoutName(dayNumber) || workoutType : workoutType}
        </h1>
        <p className="text-slate-400">
          {exercises.length} exercises
        </p>
      </div>

      <div className="space-y-4">
        {(() => {
          const groups = [];
          let i = 0;
          while (i < exercises.length) {
            if (exercises[i].superset) {
              const group = [];
              while (i < exercises.length && exercises[i].superset) {
                group.push({ exercise: exercises[i], originalIndex: i });
                i++;
              }
              groups.push({ type: 'superset', items: group });
            } else {
              groups.push({ type: 'single', exercise: exercises[i], originalIndex: i });
              i++;
            }
          }

          return groups.map((group, gIdx) => {
            if (group.type === 'superset') {
              return (
                <div key={`superset-${gIdx}`} className="border-2 border-purple-500/40 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    Superset
                  </div>
                  {group.items.map(({ exercise, originalIndex }) => (
                    <div
                      key={originalIndex}
                      ref={(el) => (exerciseRefs.current[originalIndex] = el)}
                    >
                      <ExerciseCard
                        exercise={exercise}
                        exerciseIndex={originalIndex}
                        onChange={handleExerciseChange}
                        previousWorkout={getPreviousWorkoutDetails(exercise.name)}
                        onSave={(exerciseName, sets) => {
                          setExercises(prev => prev.map(ex =>
                            ex.name === exerciseName
                              ? { ...ex, userSets: sets }
                              : ex
                          ));
                        }}
                        scrollToNext={scrollToNext}
                        workoutHistory={workoutHistory}
                        onPR={onPR}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={group.originalIndex}
                ref={(el) => (exerciseRefs.current[group.originalIndex] = el)}
              >
                <ExerciseCard
                  exercise={group.exercise}
                  exerciseIndex={group.originalIndex}
                  onChange={handleExerciseChange}
                  previousWorkout={getPreviousWorkoutDetails(group.exercise.name)}
                  onSave={(exerciseName, sets) => {
                    setExercises(prev => prev.map(ex =>
                      ex.name === exerciseName
                        ? { ...ex, userSets: sets }
                        : ex
                    ));
                  }}
                  scrollToNext={scrollToNext}
                  workoutHistory={workoutHistory}
                />
              </div>
            );
          });
        })()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 safe-area-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleComplete}
            className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
              isComplete
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutScreen;
