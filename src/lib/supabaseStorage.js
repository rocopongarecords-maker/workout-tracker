import { supabase } from './supabase';

/**
 * Supabase data access layer.
 * All functions require an authenticated user.
 */

export const fetchAllData = async (userId) => {
  const [workouts, weights, skinfolds, badges, stats] = await Promise.all([
    supabase.from('workout_data').select('*').eq('user_id', userId).order('day_number'),
    supabase.from('weight_log').select('*').eq('user_id', userId).order('date'),
    supabase.from('skinfold_log').select('*').eq('user_id', userId).order('date'),
    supabase.from('earned_badges').select('*').eq('user_id', userId),
    supabase.from('user_stats').select('*').eq('user_id', userId).single()
  ]);

  // Build the same shape as localStorage data
  const completedWorkouts = (workouts.data || [])
    .filter(w => w.completed)
    .map(w => w.day_number);

  const workoutHistory = {};
  for (const w of (workouts.data || [])) {
    workoutHistory[w.day_number] = {
      date: w.date,
      workoutType: w.workout_type,
      block: w.block,
      exercises: w.exercises || []
    };
  }

  const earnedBadges = (badges.data || []).map(b => ({
    id: b.badge_id,
    earnedAt: b.earned_at
  }));

  const weightLog = (weights.data || []).map(w => ({
    date: w.date,
    weight: Number(w.weight_kg)
  }));

  const skinfoldLog = (skinfolds.data || []).map(s => ({
    date: s.date,
    protocol: s.protocol,
    sex: s.sex,
    age: s.age,
    sites: s.sites,
    bf: Number(s.bf_percent)
  }));

  return {
    completedWorkouts,
    workoutHistory,
    startDate: null,
    earnedBadges,
    totalPRs: stats.data?.total_prs || 0,
    weightLog,
    skinfoldLog
  };
};

export const upsertWorkout = async (userId, dayNumber, workoutData) => {
  const { error } = await supabase.from('workout_data').upsert({
    user_id: userId,
    day_number: dayNumber,
    workout_type: workoutData.workoutType,
    block: workoutData.block,
    exercises: workoutData.exercises || [],
    date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,day_number' });
  return { error };
};

export const markWorkoutComplete = async (userId, dayNumber) => {
  const { error } = await supabase.from('workout_data')
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('day_number', dayNumber);
  return { error };
};

export const insertWeight = async (userId, entry) => {
  const { error } = await supabase.from('weight_log').insert({
    user_id: userId,
    date: entry.date,
    weight_kg: entry.weight
  });
  return { error };
};

export const insertSkinfold = async (userId, entry) => {
  const { error } = await supabase.from('skinfold_log').insert({
    user_id: userId,
    date: entry.date,
    protocol: entry.protocol,
    sex: entry.sex,
    age: entry.age,
    sites: entry.sites,
    bf_percent: entry.bf
  });
  return { error };
};

export const insertBadges = async (userId, badgeIds) => {
  const rows = badgeIds.map(id => ({
    user_id: userId,
    badge_id: id,
    earned_at: new Date().toISOString()
  }));
  const { error } = await supabase.from('earned_badges').insert(rows);
  return { error };
};

export const upsertPRCount = async (userId, totalPRs) => {
  const { error } = await supabase.from('user_stats').upsert({
    user_id: userId,
    total_prs: totalPRs,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  return { error };
};

/**
 * Import full localStorage data into Supabase.
 * Used for one-time migration when a user with existing local data signs in.
 */
export const importLocalDataToSupabase = async (userId, localData) => {
  const promises = [];

  // Workout data
  if (localData.workoutHistory) {
    for (const [dayStr, workout] of Object.entries(localData.workoutHistory)) {
      const dayNumber = Number(dayStr);
      const completed = (localData.completedWorkouts || []).includes(dayNumber);
      promises.push(
        supabase.from('workout_data').upsert({
          user_id: userId,
          day_number: dayNumber,
          workout_type: workout.workoutType,
          block: workout.block,
          exercises: workout.exercises || [],
          completed,
          date: workout.date || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,day_number' })
      );
    }
  }

  // Badges
  if (localData.earnedBadges?.length > 0) {
    for (const badge of localData.earnedBadges) {
      promises.push(
        supabase.from('earned_badges').upsert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: badge.earnedAt || new Date().toISOString()
        }, { onConflict: 'user_id,badge_id' })
      );
    }
  }

  // PR count
  if (localData.totalPRs > 0) {
    promises.push(
      supabase.from('user_stats').upsert({
        user_id: userId,
        total_prs: localData.totalPRs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    );
  }

  // Weight log
  if (localData.weightLog?.length > 0) {
    const weightRows = localData.weightLog.map(w => ({
      user_id: userId,
      date: w.date,
      weight_kg: w.weight
    }));
    promises.push(supabase.from('weight_log').insert(weightRows));
  }

  // Skinfold log
  if (localData.skinfoldLog?.length > 0) {
    const skinfoldRows = localData.skinfoldLog.map(s => ({
      user_id: userId,
      date: s.date,
      protocol: s.protocol,
      sex: s.sex,
      age: s.age,
      sites: s.sites,
      bf_percent: s.bf
    }));
    promises.push(supabase.from('skinfold_log').insert(skinfoldRows));
  }

  await Promise.all(promises);
};
