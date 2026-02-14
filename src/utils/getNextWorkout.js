export const getNextWorkout = (completedWorkouts, schedule) => {
  const nextWorkout = schedule.find(day => !day.rest && !completedWorkouts.includes(day.day));
  return nextWorkout || null;
};

export const getWorkoutByDay = (dayNumber, schedule) => {
  return schedule.find(day => day.day === dayNumber) || null;
};

/**
 * Returns all non-rest, non-completed workouts grouped by week.
 */
export const getPendingWorkouts = (completedWorkouts, schedule) => {
  const pending = schedule.filter(day => !day.rest && !completedWorkouts.includes(day.day));
  const grouped = {};
  for (const day of pending) {
    const week = day.week || Math.ceil(day.day / 7);
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(day);
  }
  return Object.entries(grouped).map(([week, days]) => ({
    week: Number(week),
    days
  }));
};
