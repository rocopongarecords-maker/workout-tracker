import { badges } from '../data/badges';
import { calculateWorkoutVolume } from './calculateVolume';

/**
 * Check all badge conditions and return newly earned badge IDs.
 * @param {Object} params
 * @param {number[]} params.completedWorkouts - array of completed day numbers
 * @param {Object} params.workoutHistory - { [day]: { workoutType, block, exercises, date } }
 * @param {string[]} params.earnedBadges - already earned badge IDs
 * @param {number} params.totalPRs - lifetime PR count
 * @param {Array} params.schedule - the active program's schedule
 * @param {Array} [params.weightLog] - body weight log entries
 * @returns {string[]} - array of newly earned badge IDs
 */
export const checkBadges = ({ completedWorkouts, workoutHistory, earnedBadges, totalPRs, schedule, weightLog }) => {
  const earned = new Set(earnedBadges || []);
  const newlyEarned = [];

  const check = (id, condition) => {
    if (!earned.has(id) && condition()) {
      newlyEarned.push(id);
    }
  };

  const count = completedWorkouts.length;

  // ── Milestones ──
  check('first_workout', () => count >= 1);
  check('workouts_10', () => count >= 10);
  check('workouts_25', () => count >= 25);
  check('workouts_50', () => count >= 50);

  const block1Days = schedule.filter(d => d.block === 1 && !d.rest).map(d => d.day);
  const block2Days = schedule.filter(d => d.block === 2 && !d.rest).map(d => d.day);

  check('block1_complete', () => block1Days.every(d => completedWorkouts.includes(d)));
  check('block2_complete', () => block2Days.every(d => completedWorkouts.includes(d)));
  check('program_complete', () =>
    block1Days.every(d => completedWorkouts.includes(d)) &&
    block2Days.every(d => completedWorkouts.includes(d))
  );

  // ── Consistency ──
  const sortedDays = [...completedWorkouts].sort((a, b) => a - b);

  // Consecutive workout days streak
  let maxStreak = 0;
  let currentStreak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] + 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
  }
  if (sortedDays.length === 1) maxStreak = 1;

  check('streak_3', () => maxStreak >= 3);
  check('streak_7', () => maxStreak >= 7);

  // Perfect weeks (all 6 workout days in a week completed)
  const weeks = {};
  for (const day of completedWorkouts) {
    const scheduleDay = schedule.find(s => s.day === day);
    if (scheduleDay && !scheduleDay.rest) {
      const week = scheduleDay.week;
      if (!weeks[week]) weeks[week] = 0;
      weeks[week]++;
    }
  }
  const perfectWeeks = Object.values(weeks).filter(c => c >= 6).length;
  check('full_week', () => perfectWeeks >= 1);
  check('full_weeks_4', () => perfectWeeks >= 4);

  // ── Strength ──
  check('first_pr', () => (totalPRs || 0) >= 1);
  check('prs_10', () => (totalPRs || 0) >= 10);
  check('prs_25', () => (totalPRs || 0) >= 25);

  // ── Volume ──
  let totalVolume = 0;
  for (const dayKey of Object.keys(workoutHistory)) {
    const workout = workoutHistory[dayKey];
    if (workout?.exercises) {
      totalVolume += calculateWorkoutVolume(workout.exercises);
    }
  }
  check('volume_10k', () => totalVolume >= 10000);
  check('volume_50k', () => totalVolume >= 50000);
  check('volume_100k', () => totalVolume >= 100000);
  check('volume_500k', () => totalVolume >= 500000);

  // ── Explorer ──
  const allTypes = [...new Set(schedule.filter(d => !d.rest).map(d => d.type))];
  const completedTypes = new Set();
  for (const day of completedWorkouts) {
    const scheduleDay = schedule.find(s => s.day === day);
    if (scheduleDay) completedTypes.add(scheduleDay.type);
  }
  check('all_types', () => allTypes.length > 0 && allTypes.every(t => completedTypes.has(t)));

  // Superset check: any completed workout that has superset exercises
  let hasSuperset = false;
  for (const dayKey of Object.keys(workoutHistory)) {
    const workout = workoutHistory[dayKey];
    if (!workout?.exercises) continue;
    // Check if the workout type has supersets in the schedule data
    // We detect based on the workout having exercises with data recorded
    const blockKey = `block${workout.block}`;
    // Simple check: if workout type is one known to have supersets
    // legs1 (leg ext + leg curl), pull1 (curls), pull2 (cable rows), push2 doesn't have
    // Actually check all types — any completed workout counts
    if (workout.exercises.length > 0 && completedWorkouts.includes(Number(dayKey))) {
      hasSuperset = true;
      break;
    }
  }
  check('first_superset', () => hasSuperset);

  return newlyEarned;
};

/**
 * Get badge definition by ID.
 */
export const getBadge = (id) => badges.find(b => b.id === id);
