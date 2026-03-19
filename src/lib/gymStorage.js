import { supabase } from './supabase';

/**
 * Gym data access layer.
 * Handles gym discovery, home gym, check-ins, and gym leaderboards.
 */

// ── Discovery ──

export const fetchAllGyms = async () => {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .order('name');

  return { data: data || [], error };
};

export const searchGyms = async (query) => {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(20);

  return { data: data || [], error };
};

// ── Home Gym ──

export const fetchHomeGym = async (userId) => {
  const { data: userGym, error } = await supabase
    .from('user_gyms')
    .select('gym_id')
    .eq('user_id', userId)
    .eq('is_home_gym', true)
    .single();

  if (error || !userGym) return { data: null, error };

  const { data: gym, error: gymError } = await supabase
    .from('gyms')
    .select('*')
    .eq('id', userGym.gym_id)
    .single();

  return { data: gym, error: gymError };
};

export const setHomeGym = async (userId, gymId) => {
  // Clear existing home gym
  await supabase
    .from('user_gyms')
    .update({ is_home_gym: false })
    .eq('user_id', userId);

  // Upsert new home gym
  const { data, error } = await supabase
    .from('user_gyms')
    .upsert({
      user_id: userId,
      gym_id: gymId,
      is_home_gym: true
    }, { onConflict: 'user_id,gym_id' })
    .select()
    .single();

  return { data, error };
};

// ── Check-ins ──

export const checkIn = async (userId, gymId, workoutDay, lat, lon, verified) => {
  const { data, error } = await supabase
    .from('gym_checkins')
    .insert({
      user_id: userId,
      gym_id: gymId,
      workout_day: workoutDay,
      latitude: lat || null,
      longitude: lon || null,
      verified: verified || false
    })
    .select()
    .single();

  return { data, error };
};

// ── Leaderboard ──

export const fetchGymLeaderboard = async (gymId) => {
  const { data, error } = await supabase
    .from('gym_checkins')
    .select('user_id')
    .eq('gym_id', gymId);

  if (error) return { data: [], error };

  // Aggregate check-in counts per user
  const countMap = {};
  for (const row of (data || [])) {
    countMap[row.user_id] = (countMap[row.user_id] || 0) + 1;
  }

  // Sort by count descending, top 10
  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const userIds = sorted.map(([uid]) => uid);
  if (userIds.length === 0) return { data: [], error: null };

  // Enrich with profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', userIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const leaderboard = sorted.map(([uid, count]) => {
    const profile = profileMap[uid];
    return {
      userId: uid,
      checkinCount: count,
      displayName: profile?.display_name || 'Unknown',
      avatarEmoji: profile?.avatar_emoji || null
    };
  });

  return { data: leaderboard, error: null };
};
