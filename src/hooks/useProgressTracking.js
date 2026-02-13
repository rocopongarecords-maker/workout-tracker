import { useMemo } from 'react';

export const useProgressTracking = (completedWorkouts, schedule) => {
  const stats = useMemo(() => {
    const totalWorkouts = schedule.filter(day => !day.rest).length;
    const completed = completedWorkouts.filter(day => {
      const scheduleDay = schedule.find(s => s.day === day);
      return scheduleDay && !scheduleDay.rest;
    }).length;

    const nextWorkout = schedule.find(day => !day.rest && !completedWorkouts.includes(day.day));
    const nextDay = nextWorkout ? nextWorkout.day : null;

    const currentWeek = schedule.find(day => !day.rest && !completedWorkouts.includes(day.day))?.week || 1;

    const percentage = totalWorkouts > 0 ? Math.round((completed / totalWorkouts) * 100) : 0;

    const allCompleted = completed === totalWorkouts && totalWorkouts > 0;

    return {
      totalWorkouts,
      completed,
      percentage,
      nextDay,
      currentWeek,
      allCompleted
    };
  }, [completedWorkouts, schedule]);

  return stats;
};
