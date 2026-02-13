import { calculate1RM } from './calculate1RM';

/**
 * Check if a set is a personal record for the given exercise.
 * Compares against all previous workout history.
 * Returns { isPR: bool, type: 'weight'|'1rm'|null, value: number|null }
 */
export const detectPR = (exerciseName, weight, reps, workoutHistory) => {
  const w = Number(weight);
  const r = Number(reps);
  if (!w || !r) return { isPR: false, type: null, value: null };

  const current1RM = calculate1RM(w, r);
  let best1RM = 0;
  let bestWeight = 0;

  for (const dayKey of Object.keys(workoutHistory)) {
    const workout = workoutHistory[dayKey];
    if (!workout?.exercises) continue;

    const exercise = workout.exercises.find(ex => ex.name === exerciseName);
    if (!exercise?.userSets) continue;

    for (const set of exercise.userSets) {
      if (!set.completed) continue;
      const setW = Number(set.weight) || 0;
      const setR = Number(set.reps) || 0;
      if (setW > bestWeight) bestWeight = setW;
      const set1RM = calculate1RM(setW, setR);
      if (set1RM > best1RM) best1RM = set1RM;
    }
  }

  if (current1RM > best1RM && best1RM > 0) {
    return { isPR: true, type: '1rm', value: current1RM };
  }
  if (w > bestWeight && bestWeight > 0) {
    return { isPR: true, type: 'weight', value: w };
  }

  return { isPR: false, type: null, value: null };
};
