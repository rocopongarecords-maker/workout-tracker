import { supabase } from './supabase';

/**
 * Activity feed data access layer.
 * Handles fetching and posting social activity items.
 */

// ── Feed ──

export const fetchFeed = async (friendIds) => {
  if (!friendIds || friendIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .in('user_id', friendIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return { data: [], error };

  // Enrich with profiles
  const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
  if (userIds.length === 0) return { data: data || [], error: null };

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', userIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const enriched = (data || []).map(a => {
    const profile = profileMap[a.user_id];
    return {
      ...a,
      authorName: profile?.display_name || 'Unknown',
      authorEmoji: profile?.avatar_emoji || null
    };
  });

  return { data: enriched, error: null };
};

// ── Post Activity ──

export const postActivity = async (userId, type, payload) => {
  const { data, error } = await supabase
    .from('activity_feed')
    .insert({
      user_id: userId,
      type,
      payload: payload || {}
    })
    .select()
    .single();

  return { data, error };
};
