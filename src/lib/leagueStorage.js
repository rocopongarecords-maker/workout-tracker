import { supabase } from './supabase';

/**
 * League data access layer.
 * Handles league membership, standings, and XP tracking.
 */

// ── Membership ──

export const fetchMyLeague = async (userId) => {
  const { data, error } = await supabase
    .from('league_members')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Not found — create default membership
    const { data: newMember, error: insertError } = await supabase
      .from('league_members')
      .insert({
        user_id: userId,
        league: 'bronze',
        weekly_xp: 0
      })
      .select()
      .single();

    return { data: newMember, error: insertError };
  }

  return { data, error };
};

// ── Standings ──

export const fetchLeagueStandings = async (league) => {
  const { data, error } = await supabase
    .from('league_members')
    .select('*')
    .eq('league', league)
    .order('weekly_xp', { ascending: false })
    .limit(30);

  if (error) return { data: [], error };

  // Enrich with profiles
  const userIds = (data || []).map(m => m.user_id);
  if (userIds.length === 0) return { data: [], error: null };

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', userIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const enriched = (data || []).map(m => {
    const profile = profileMap[m.user_id];
    return {
      ...m,
      displayName: profile?.display_name || 'Unknown',
      avatarEmoji: profile?.avatar_emoji || null
    };
  });

  return { data: enriched, error: null };
};

// ── XP Update ──

export const updateLeagueXP = async (userId, weeklyXP, league) => {
  const { data, error } = await supabase
    .from('league_members')
    .upsert({
      user_id: userId,
      weekly_xp: weeklyXP,
      league
    }, { onConflict: 'user_id' })
    .select()
    .single();

  return { data, error };
};
