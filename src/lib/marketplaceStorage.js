import { supabase } from './supabase';

/**
 * Marketplace data access layer.
 * Handles program discovery, subscriptions, ratings, invites, and feeds.
 */

export const fetchFeaturedPrograms = async (category, difficulty) => {
  let query = supabase
    .from('marketplace_programs')
    .select('*')
    .eq('visibility', 'public')
    .order('subscriber_count', { ascending: false })
    .limit(50);

  if (category) {
    query = query.eq('category', category);
  }
  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;
  return { data: data || [], error };
};

export const searchPrograms = async (query) => {
  const { data, error } = await supabase
    .from('marketplace_programs')
    .select('*')
    .eq('visibility', 'public')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('subscriber_count', { ascending: false })
    .limit(30);

  return { data: data || [], error };
};

export const subscribeToProgram = async (userId, programId) => {
  const { data, error } = await supabase
    .from('program_subscriptions')
    .upsert({
      user_id: userId,
      program_id: programId
    }, { onConflict: 'user_id,program_id' });

  return { data, error };
};

export const unsubscribeFromProgram = async (userId, programId) => {
  const { error } = await supabase
    .from('program_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('program_id', programId);

  return { error };
};

export const fetchMySubscriptions = async (userId) => {
  const { data, error } = await supabase
    .from('program_subscriptions')
    .select('*')
    .eq('user_id', userId);

  return { data: data || [], error };
};

export const publishProgram = async (userId, program, description, category, difficulty, visibility) => {
  const { data, error } = await supabase
    .from('marketplace_programs')
    .insert({
      author_id: userId,
      program_data: program,
      name: program.name,
      description,
      category,
      difficulty,
      visibility,
      weeks: program.weeks,
      days_per_week: program.workoutDays.length,
      published_at: new Date().toISOString()
    })
    .select('id')
    .single();

  return { data: data?.id || null, error };
};

export const unpublishProgram = async (userId, marketplaceId) => {
  const { error } = await supabase
    .from('marketplace_programs')
    .delete()
    .eq('id', marketplaceId)
    .eq('author_id', userId);

  return { error };
};

export const fetchMyPublished = async (userId) => {
  const { data, error } = await supabase
    .from('marketplace_programs')
    .select('*')
    .eq('author_id', userId)
    .order('published_at', { ascending: false });

  return { data: data || [], error };
};

export const rateProgram = async (userId, programId, rating, review) => {
  const { data, error } = await supabase
    .from('program_ratings')
    .upsert({
      user_id: userId,
      program_id: programId,
      rating,
      review
    }, { onConflict: 'user_id,program_id' });

  return { data, error };
};

export const fetchRatings = async (programId) => {
  const { data, error } = await supabase
    .from('program_ratings')
    .select('*')
    .eq('program_id', programId)
    .order('created_at', { ascending: false })
    .limit(50);

  return { data: data || [], error };
};

export const createInvite = async (userId, programId, maxUses) => {
  const { data, error } = await supabase
    .from('program_invites')
    .insert({
      program_id: programId,
      created_by: userId,
      max_uses: maxUses
    })
    .select('*')
    .single();

  return { data, error };
};

export const resolveInvite = async (token) => {
  // Fetch the invite by token
  const { data: invite, error: inviteError } = await supabase
    .from('program_invites')
    .select('*')
    .eq('token', token)
    .single();

  if (inviteError || !invite) {
    return { data: null, error: inviteError || new Error('Invite not found') };
  }

  // Fetch the associated program
  const { data: program, error: programError } = await supabase
    .from('marketplace_programs')
    .select('*')
    .eq('id', invite.program_id)
    .single();

  if (programError || !program) {
    return { data: null, error: programError || new Error('Program not found') };
  }

  // Increment the uses counter
  const { error: updateError } = await supabase
    .from('program_invites')
    .update({ uses: invite.uses + 1 })
    .eq('id', invite.id);

  if (updateError) {
    return { data: null, error: updateError };
  }

  return { data: { invite, program }, error: null };
};

export const fetchProgramFeed = async (programId) => {
  const { data, error } = await supabase
    .from('program_feed')
    .select('*')
    .eq('program_id', programId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  return { data: data || [], error };
};

export const postToFeed = async (userId, programId, message) => {
  const { data, error } = await supabase
    .from('program_feed')
    .insert({
      program_id: programId,
      author_id: userId,
      message
    });

  return { data, error };
};

export const fetchCreatorAnalytics = async (userId) => {
  const { data: programs, error } = await supabase
    .from('marketplace_programs')
    .select('*')
    .eq('author_id', userId);

  if (error) {
    return { data: null, error };
  }

  const list = programs || [];
  const totalSubscribers = list.reduce((sum, p) => sum + (p.subscriber_count || 0), 0);
  const totalRatings = list.reduce((sum, p) => sum + (p.rating_count || 0), 0);

  // Weighted average: sum(avg_rating * rating_count) / totalRatings
  let averageRating = 0;
  if (totalRatings > 0) {
    const weightedSum = list.reduce(
      (sum, p) => sum + (p.avg_rating || 0) * (p.rating_count || 0),
      0
    );
    averageRating = weightedSum / totalRatings;
  }

  return {
    data: {
      totalSubscribers,
      totalRatings,
      averageRating,
      programs: list
    },
    error: null
  };
};

export const fetchProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji')
    .in('id', userIds);

  return { data: data || [], error };
};
