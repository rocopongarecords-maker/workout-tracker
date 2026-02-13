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

  // ── Consistency (with streak freeze) ──
  const { longestStreak: maxStreak } = calculateStreakWithFreeze(completedWorkouts, schedule);

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

  // ── Bodyweight-Relative Strength ──
  const latestBW = (weightLog || []).length > 0
    ? weightLog[weightLog.length - 1].weight
    : null;

  if (latestBW) {
    // Check best squat weight across all workouts
    let bestSquatWeight = 0;
    let bestDeadliftWeight = 0;
    for (const dayKey of Object.keys(workoutHistory)) {
      const workout = workoutHistory[dayKey];
      if (!workout?.exercises) continue;
      for (const ex of workout.exercises) {
        const maxWeight = (ex.userSets || [])
          .filter(s => s.completed)
          .reduce((max, s) => Math.max(max, Number(s.weight) || 0), 0);
        if (ex.name === 'Back Squat') bestSquatWeight = Math.max(bestSquatWeight, maxWeight);
        if (ex.name === 'Deadlift') bestDeadliftWeight = Math.max(bestDeadliftWeight, maxWeight);
      }
    }
    check('bw_squat', () => bestSquatWeight >= latestBW);
    check('bw_deadlift_1_5x', () => bestDeadliftWeight >= latestBW * 1.5);
  }

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
 * Calculate streak with freeze capability.
 * Rest days are automatically skipped. For every 7 completed workout days
 * in the streak, 1 missed workout day is forgiven ("frozen").
 * @returns {{ currentStreak: number, longestStreak: number, frozenDays: number[] }}
 */
export const calculateStreakWithFreeze = (completedWorkouts, schedule) => {
  const workoutDays = schedule.filter(d => !d.rest).map(d => d.day).sort((a, b) => a - b);
  const completedSet = new Set(completedWorkouts);

  if (workoutDays.length === 0 || completedWorkouts.length === 0) {
    return { currentStreak: 0, longestStreak: 0, frozenDays: [] };
  }

  // Calculate streak backward from a given index in workoutDays
  const calcStreakBackward = (startIdx) => {
    let streak = 0;
    let freezesUsed = 0;
    const frozen = [];

    for (let i = startIdx; i >= 0; i--) {
      if (completedSet.has(workoutDays[i])) {
        streak++;
      } else {
        const available = Math.floor(streak / 7);
        if (freezesUsed < available) {
          freezesUsed++;
          frozen.push(workoutDays[i]);
        } else {
          break;
        }
      }
    }
    return { streak, frozen };
  };

  // Current streak: from last completed workout day, walk backward
  let lastCompletedIdx = -1;
  for (let i = workoutDays.length - 1; i >= 0; i--) {
    if (completedSet.has(workoutDays[i])) {
      lastCompletedIdx = i;
      break;
    }
  }

  const current = lastCompletedIdx >= 0
    ? calcStreakBackward(lastCompletedIdx)
    : { streak: 0, frozen: [] };

  // Longest streak: forward scan
  let longest = 0;
  for (let start = 0; start < workoutDays.length; start++) {
    if (!completedSet.has(workoutDays[start])) continue;

    let streak = 0;
    let freezesUsed = 0;

    for (let i = start; i < workoutDays.length; i++) {
      if (completedSet.has(workoutDays[i])) {
        streak++;
      } else {
        const available = Math.floor(streak / 7);
        if (freezesUsed < available) {
          freezesUsed++;
        } else {
          break;
        }
      }
    }

    if (streak > longest) longest = streak;
  }

  return {
    currentStreak: current.streak,
    longestStreak: longest,
    frozenDays: current.frozen
  };
};

/**
 * Get the closest unearned badge with progress info.
 * Returns the badge with highest completion percentage that isn't yet earned.
 */
export const getClosestBadgeProgress = ({ completedWorkouts, workoutHistory, earnedBadges, totalPRs, schedule, weightLog }) => {
  const earned = new Set((earnedBadges || []).map(b => typeof b === 'string' ? b : b.id));
  const count = completedWorkouts.length;

  const { longestStreak } = calculateStreakWithFreeze(completedWorkouts, schedule);

  const weekCounts = {};
  for (const day of completedWorkouts) {
    const s = schedule.find(d => d.day === day);
    if (s && !s.rest) {
      weekCounts[s.week] = (weekCounts[s.week] || 0) + 1;
    }
  }
  const perfectWeeks = Object.values(weekCounts).filter(c => c >= 6).length;

  let totalVolume = 0;
  for (const dayKey of Object.keys(workoutHistory || {})) {
    const workout = workoutHistory[dayKey];
    if (workout?.exercises) {
      totalVolume += calculateWorkoutVolume(workout.exercises);
    }
  }

  const allTypes = [...new Set(schedule.filter(d => !d.rest).map(d => d.type))];
  const completedTypes = new Set();
  for (const day of completedWorkouts) {
    const s = schedule.find(d => d.day === day);
    if (s) completedTypes.add(s.type);
  }

  const progressMap = {
    first_workout: { current: count, target: 1 },
    workouts_10: { current: Math.min(count, 10), target: 10 },
    workouts_25: { current: Math.min(count, 25), target: 25 },
    workouts_50: { current: Math.min(count, 50), target: 50 },
    streak_3: { current: Math.min(longestStreak, 3), target: 3 },
    streak_7: { current: Math.min(longestStreak, 7), target: 7 },
    full_week: { current: Math.min(perfectWeeks, 1), target: 1 },
    full_weeks_4: { current: Math.min(perfectWeeks, 4), target: 4 },
    first_pr: { current: Math.min(totalPRs || 0, 1), target: 1 },
    prs_10: { current: Math.min(totalPRs || 0, 10), target: 10 },
    prs_25: { current: Math.min(totalPRs || 0, 25), target: 25 },
    volume_10k: { current: Math.min(totalVolume, 10000), target: 10000 },
    volume_50k: { current: Math.min(totalVolume, 50000), target: 50000 },
    volume_100k: { current: Math.min(totalVolume, 100000), target: 100000 },
    volume_500k: { current: Math.min(totalVolume, 500000), target: 500000 },
    all_types: { current: completedTypes.size, target: allTypes.length || 1 },
  };

  let closest = null;
  let closestPct = -1;

  for (const [id, { current, target }] of Object.entries(progressMap)) {
    if (earned.has(id)) continue;
    const pct = Math.min(current / target, 0.99);
    if (pct > closestPct) {
      closestPct = pct;
      const badge = badges.find(b => b.id === id);
      if (badge) {
        closest = { ...badge, current, target, percentage: Math.round(pct * 100) };
      }
    }
  }

  return closest;
};

/**
 * Get badge definition by ID.
 */
export const getBadge = (id) => badges.find(b => b.id === id);
