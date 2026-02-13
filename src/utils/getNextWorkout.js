export const getNextWorkout = (completedWorkouts, schedule) => {
  const nextWorkout = schedule.find(day => !day.rest && !completedWorkouts.includes(day.day));
  return nextWorkout || null;
};

export const getWorkoutByDay = (dayNumber, schedule) => {
  return schedule.find(day => day.day === dayNumber) || null;
};
