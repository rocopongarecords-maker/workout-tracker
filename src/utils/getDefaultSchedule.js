import { schedule as rawSchedule } from '../data/schedule';

/**
 * Returns the Jeff Nippard LPP schedule in the unified format.
 * exercises is null — resolved at render time from workoutData.
 */
export const getDefaultSchedule = () => {
  return rawSchedule.map(entry => ({
    ...entry,
    programId: 'jeff_nippard_lpp',
    exercises: null
  }));
};
