import { useState, useEffect } from 'react';
import { workoutData } from '../data/workoutData';
import { getWorkoutByDay } from '../utils/getNextWorkout';
import { getPreviousWorkout, getLastCompletedWorkoutForType } from '../utils/getPreviousWorkout';
import ExerciseCard from './ExerciseCard';

const WorkoutScreen = ({ dayNumber, workoutType, block, onSave, onComplete, onCancel, workoutHistory, completedWorkouts }) => {
  const [exercises, setExercises] = useState([]);
  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    const dayData = getWorkoutByDay(dayNumber);
    if (dayData) {
      const blockKey = `block${block}`;
      const workoutInfo = workoutData[blockKey][workoutType];
      
      const initialExercises = workoutInfo.exercises.map(ex => ({
        ...ex,
        sets: [],
        completed: false
      }));
      
      setExercises(initialExercises);
      
      const lastCompleted = getLastCompletedWorkoutForType(workoutType, workoutHistory, completedWorkouts);
      setLastWorkout(lastCompleted);
    }
  }, [dayNumber, workoutType, block, workoutHistory, completedWorkouts]);

  const handleExerciseChange = (exerciseName, newSets) => {
    setExercises(prev => prev.map(ex => 
      ex.name === exerciseName 
        ? { ...ex, sets: newSets }
        : ex
    ));
  };

  const handleSave = () => {
    onSave(dayNumber, {
      workoutType,
      block,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets
      }))
    });
  };

  const handleComplete = () => {
    handleSave();
    onComplete(dayNumber);
  };

  const getPreviousWeight = (exerciseName) => {
    if (!lastWorkout) return null;
    
    const exercise = lastWorkout.exercises?.find(ex => ex.name === exerciseName);
    if (!exercise || !exercise.sets || exercise.sets.length === 0) return null;
    
    return exercise.sets[exercise.sets.length - 1]?.weight || null;
  };

  const isComplete = exercises.every(ex => ex.completed);

  return (
    <div className="space-y-6 pb-24">
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
          Day {dayNumber} • Block {block}
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          {workoutType.replace('legs', 'Legs').replace('push', 'Push').replace('pull', 'Pull').toUpperCase()}
        </h1>
        <p className="text-slate-400">
          {exercises.length} exercises
        </p>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            onChange={handleExerciseChange}
            previousWeight={getPreviousWeight(exercise.name)}
          />
        ))}
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