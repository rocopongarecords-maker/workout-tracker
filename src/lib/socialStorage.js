import { supabase } from './supabase';

/**
 * Social data access layer.
 * Handles profiles, friendships, notifications, nudges, and streaks.
 */

// ── Profile ──

export const fetchMyProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateDisplayName = async (userId, name) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: name })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

export const updateAvatarEmoji = async (userId, emoji) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_emoji: emoji })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// ── Friends ──

export const fetchFriends = async (userId) => {
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  if (error) return { data: [], error };

  // Collect friend user IDs
  const friendIds = (data || []).map(f =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  );

  if (friendIds.length === 0) return { data: [], error: null };

  // Batch-fetch friend profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', friendIds);

  // Batch-fetch friend streaks
  const { data: streaks } = await supabase
    .from('user_streaks')
    .select('user_id, current_streak, longest_streak')
    .in('user_id', friendIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const streakMap = {};
  for (const s of (streaks || [])) {
    streakMap[s.user_id] = s;
  }

  const enriched = (data || []).map(f => {
    const friendId = f.requester_id === userId ? f.addressee_id : f.requester_id;
    const profile = profileMap[friendId];
    const streak = streakMap[friendId];
    return {
      ...f,
      friendId,
      friendName: profile?.display_name || 'Unknown',
      friendEmoji: profile?.avatar_emoji || null,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0
    };
  });

  return { data: enriched, error: null };
};

export const fetchPendingRequests = async (userId) => {
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .eq('status', 'pending')
    .eq('addressee_id', userId);

  if (error) return { data: [], error };

  const requesterIds = (data || []).map(r => r.requester_id);
  if (requesterIds.length === 0) return { data: [], error: null };

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', requesterIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const enriched = (data || []).map(r => {
    const profile = profileMap[r.requester_id];
    return {
      ...r,
      requesterName: profile?.display_name || 'Unknown',
      requesterEmoji: profile?.avatar_emoji || null
    };
  });

  return { data: enriched, error: null };
};

export const sendFriendRequest = async (userId, friendCode) => {
  // Look up profile by friend code
  const { data: targetProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('friend_code', friendCode)
    .single();

  if (lookupError || !targetProfile) {
    return { data: null, error: { message: 'No user found with that friend code.' } };
  }

  if (targetProfile.id === userId) {
    return { data: null, error: { message: 'You cannot add yourself as a friend.' } };
  }

  // Check for existing friendship
  const { data: existing } = await supabase
    .from('friendships')
    .select('id, status')
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${targetProfile.id}),and(requester_id.eq.${targetProfile.id},addressee_id.eq.${userId})`
    );

  if (existing && existing.length > 0) {
    const status = existing[0].status;
    if (status === 'accepted') {
      return { data: null, error: { message: 'You are already friends with this user.' } };
    }
    return { data: null, error: { message: 'A friend request already exists.' } };
  }

  // Insert friendship
  const { data, error } = await supabase
    .from('friendships')
    .insert({
      requester_id: userId,
      addressee_id: targetProfile.id,
      status: 'pending'
    })
    .select()
    .single();

  if (error) return { data: null, error };

  // Send notification
  await supabase
    .from('notifications')
    .insert({
      user_id: targetProfile.id,
      sender_id: userId,
      type: 'friend_request',
      payload: { friendship_id: data.id },
      read: false
    });

  return { data, error: null };
};

export const acceptFriendRequest = async (friendshipId) => {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .select()
    .single();

  return { data, error };
};

export const declineFriendRequest = async (friendshipId) => {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId);

  return { error };
};

export const removeFriend = async (friendshipId) => {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId);

  return { error };
};

// ── Notifications ──

export const fetchNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return { data: [], error };

  // Enrich with sender profiles
  const senderIds = [...new Set((data || []).map(n => n.sender_id).filter(Boolean))];
  if (senderIds.length === 0) return { data: data || [], error: null };

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', senderIds);

  const profileMap = {};
  for (const p of (profiles || [])) {
    profileMap[p.id] = p;
  }

  const enriched = (data || []).map(n => {
    const profile = profileMap[n.sender_id];
    return {
      ...n,
      senderName: profile?.display_name || 'Unknown',
      senderEmoji: profile?.avatar_emoji || null
    };
  });

  return { data: enriched, error: null };
};

export const markNotificationRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  return { error };
};

export const markAllNotificationsRead = async (userId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  return { error };
};

// ── Nudge & Motivation ──

export const sendNudge = async (fromUserId, toUserId) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: toUserId,
      sender_id: fromUserId,
      type: 'nudge',
      payload: {},
      read: false
    })
    .select()
    .single();

  return { data, error };
};

export const sendMotivation = async (fromUserId, toUserId, message) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: toUserId,
      sender_id: fromUserId,
      type: 'motivation',
      payload: { message },
      read: false
    })
    .select()
    .single();

  return { data, error };
};

// ── Streaks ──

export const updateStreak = async (userId, current, longest) => {
  const { data, error } = await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      current_streak: current,
      longest_streak: longest
    }, { onConflict: 'user_id' })
    .select()
    .single();

  return { data, error };
};

// ── Profile Enrichment ──

export const fetchProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return { data: [] };

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', userIds);

  return { data: data || [], error };
};
