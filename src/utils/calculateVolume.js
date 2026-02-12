export const calculateWorkoutVolume = (exercises) => {
  if (!exercises) return 0;
  return exercises.reduce((total, ex) => {
    return total + (ex.userSets || []).reduce((sum, set) => {
      if (!set.completed) return sum;
      const w = Number(set.weight) || 0;
      const r = Number(set.reps) || 0;
      return sum + (w * r);
    }, 0);
  }, 0);
};

export const getVolumeComparison = (workoutType, currentDayNumber, workoutHistory, completedWorkouts) => {
  const sortedDays = [...completedWorkouts]
    .filter(d => d !== currentDayNumber)
    .sort((a, b) => b - a);

  for (const dayNumber of sortedDays) {
    const workout = workoutHistory[dayNumber];
    if (workout && workout.workoutType === workoutType) {
      const prevVolume = calculateWorkoutVolume(workout.exercises);
      return { prevVolume, prevDay: dayNumber };
    }
  }

  return null;
};
