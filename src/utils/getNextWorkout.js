import { schedule } from '../data/schedule';

export const getNextWorkout = (completedWorkouts) => {
  const nextWorkout = schedule.find(day => !day.rest && !completedWorkouts.includes(day.day));
  return nextWorkout || null;
};

export const getWorkoutByDay = (dayNumber) => {
  return schedule.find(day => day.day === dayNumber) || null;
};