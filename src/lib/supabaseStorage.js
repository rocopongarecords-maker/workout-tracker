import { supabase } from './supabase';

/**
 * Supabase data access layer.
 * All functions require an authenticated user.
 */

export const fetchAllData = async (userId) => {
  const [workouts, weights, skinfolds, badges, stats, programs] = await Promise.all([
    supabase.from('workout_data').select('*').eq('user_id', userId).order('day_number'),
    supabase.from('weight_log').select('*').eq('user_id', userId).order('date'),
    supabase.from('skinfold_log').select('*').eq('user_id', userId).order('date'),
    supabase.from('earned_badges').select('*').eq('user_id', userId),
    supabase.from('user_stats').select('*').eq('user_id', userId).single(),
    supabase.from('custom_programs').select('*').eq('user_id', userId)
  ]);

  // Build programData: { [programId]: { completedWorkouts, workoutHistory } }
  const programData = {};
  for (const w of (workouts.data || [])) {
    const pid = w.program_id || 'jeff_nippard_lpp';
    if (!programData[pid]) {
      programData[pid] = { completedWorkouts: [], workoutHistory: {} };
    }
    programData[pid].workoutHistory[w.day_number] = {
      date: w.date,
      workoutType: w.workout_type,
      block: w.block,
      exercises: w.exercises || []
    };
    if (w.completed) {
      programData[pid].completedWorkouts.push(w.day_number);
    }
  }

  // Ensure default program data exists
  if (!programData.jeff_nippard_lpp) {
    programData.jeff_nippard_lpp = { completedWorkouts: [], workoutHistory: {} };
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

  const customPrograms = (programs.data || []).map(p => p.program_data);
  const activeProgram = stats.data?.active_program || 'jeff_nippard_lpp';

  return {
    programData,
    activeProgram,
    startDate: null,
    earnedBadges,
    totalPRs: stats.data?.total_prs || 0,
    weightLog,
    skinfoldLog,
    customPrograms,
    schemaVersion: 2
  };
};

export const upsertWorkout = async (userId, dayNumber, workoutData, programId = 'jeff_nippard_lpp') => {
  const { error } = await supabase.from('workout_data').upsert({
    user_id: userId,
    day_number: dayNumber,
    program_id: programId,
    workout_type: workoutData.workoutType,
    block: workoutData.block || null,
    exercises: workoutData.exercises || [],
    date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,program_id,day_number' });
  return { error };
};

export const markWorkoutComplete = async (userId, dayNumber, programId = 'jeff_nippard_lpp') => {
  const { error } = await supabase.from('workout_data')
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('program_id', programId)
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

export const upsertCustomProgram = async (userId, program) => {
  const { error } = await supabase.from('custom_programs').upsert({
    user_id: userId,
    program_id: program.id,
    program_data: program,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,program_id' });
  return { error };
};

export const deleteCustomProgram = async (userId, programId) => {
  const promises = [
    supabase.from('custom_programs').delete()
      .eq('user_id', userId).eq('program_id', programId),
    supabase.from('workout_data').delete()
      .eq('user_id', userId).eq('program_id', programId)
  ];
  await Promise.all(promises);
};

/**
 * Import full localStorage data into Supabase.
 * Used for one-time migration when a user with existing local data signs in.
 */
export const importLocalDataToSupabase = async (userId, localData) => {
  const promises = [];

  // Workout data — iterate over all programs
  const programData = localData.programData || {};
  for (const [programId, pd] of Object.entries(programData)) {
    const wh = pd.workoutHistory || {};
    for (const [dayStr, workout] of Object.entries(wh)) {
      const dayNumber = Number(dayStr);
      const completed = (pd.completedWorkouts || []).includes(dayNumber);
      promises.push(
        supabase.from('workout_data').upsert({
          user_id: userId,
          day_number: dayNumber,
          program_id: programId,
          workout_type: workout.workoutType,
          block: workout.block || null,
          exercises: workout.exercises || [],
          completed,
          date: workout.date || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,program_id,day_number' })
      );
    }
  }

  // Custom programs
  if (localData.customPrograms?.length > 0) {
    for (const program of localData.customPrograms) {
      promises.push(
        supabase.from('custom_programs').upsert({
          user_id: userId,
          program_id: program.id,
          program_data: program,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,program_id' })
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

  // PR count & active program
  if (localData.totalPRs > 0 || localData.activeProgram) {
    promises.push(
      supabase.from('user_stats').upsert({
        user_id: userId,
        total_prs: localData.totalPRs || 0,
        active_program: localData.activeProgram || 'jeff_nippard_lpp',
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
