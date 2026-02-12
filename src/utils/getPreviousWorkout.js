export const getPreviousWorkout = (exerciseName, workoutHistory, completedWorkouts) => {
  const sortedCompletedDays = [...completedWorkouts].sort((a, b) => b - a);

  for (const dayNumber of sortedCompletedDays) {
    const workout = workoutHistory[dayNumber];
    if (workout && workout.exercises) {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise && exercise.userSets && exercise.userSets.length > 0) {
        return exercise.userSets[exercise.userSets.length - 1].weight;
      }
    }
  }

  return null;
};

export const getLastCompletedWorkoutForType = (workoutType, workoutHistory, completedWorkouts) => {
  const sortedCompletedDays = [...completedWorkouts].sort((a, b) => b - a);

  for (const dayNumber of sortedCompletedDays) {
    const workout = workoutHistory[dayNumber];
    if (workout && workout.workoutType === workoutType) {
      return workout;
    }
  }

  return null;
};