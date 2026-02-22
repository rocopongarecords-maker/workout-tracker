import { supabase } from './supabase';

/**
 * Coach data access layer.
 * Handles coach discovery, client relationships, questionnaires, chat, and ratings.
 */

// ── Discovery ──

export const fetchCoaches = async (specialty) => {
  let query = supabase
    .from('coach_profiles')
    .select('*')
    .eq('accepting_clients', true)
    .order('avg_rating', { ascending: false });

  if (specialty) {
    query = query.contains('specialties', [specialty]);
  }

  const { data, error } = await query;
  return { data: data || [], error };
};

export const fetchCoachProfile = async (coachId) => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .select('*')
    .eq('id', coachId)
    .single();

  return { data, error };
};

// ── Client Actions ──

export const requestCoaching = async (coachId, clientId) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .insert({
      coach_id: coachId,
      client_id: clientId,
      status: 'pending'
    })
    .select()
    .single();

  return { data, error };
};

export const submitQuestionnaire = async (relationshipId, answers) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .update({
      questionnaire_answers: answers,
      status: 'questionnaire_completed'
    })
    .eq('id', relationshipId)
    .select()
    .single();

  return { data, error };
};

export const fetchMyCoachRelationship = async (clientId) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .select('*')
    .eq('client_id', clientId)
    .order('started_at', { ascending: false })
    .limit(1);

  return { data: data?.[0] || null, error };
};

// ── Coach Actions ──

export const fetchMyCoachProfile = async (userId) => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

export const createCoachProfile = async (userId, profileData) => {
  // Mark user as coach
  await supabase
    .from('profiles')
    .update({ is_coach: true })
    .eq('id', userId);

  const { data, error } = await supabase
    .from('coach_profiles')
    .insert({
      user_id: userId,
      ...profileData
    })
    .select()
    .single();

  return { data, error };
};

export const updateCoachProfile = async (coachId, updates) => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .update(updates)
    .eq('id', coachId)
    .select()
    .single();

  return { data, error };
};

export const fetchMyClients = async (coachProfileId) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .select('*')
    .eq('coach_id', coachProfileId)
    .order('started_at', { ascending: false });

  return { data: data || [], error };
};

export const updateClientStatus = async (relationshipId, status) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .update({ status })
    .eq('id', relationshipId)
    .select()
    .single();

  return { data, error };
};

export const assignProgram = async (relationshipId, programId) => {
  const { data, error } = await supabase
    .from('coach_clients')
    .update({
      assigned_program_id: programId,
      status: 'active'
    })
    .eq('id', relationshipId)
    .select()
    .single();

  return { data, error };
};

// ── Questionnaire ──

export const fetchQuestionnaire = async (coachId) => {
  const { data, error } = await supabase
    .from('coach_questionnaires')
    .select('*')
    .eq('coach_id', coachId)
    .single();

  return { data, error };
};

export const saveQuestionnaire = async (coachId, questions) => {
  const { data, error } = await supabase
    .from('coach_questionnaires')
    .upsert({
      coach_id: coachId,
      questions
    }, { onConflict: 'coach_id' })
    .select()
    .single();

  return { data, error };
};

// ── Chat ──

export const fetchMessages = async (relationshipId) => {
  const { data, error } = await supabase
    .from('coach_messages')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: true });

  return { data: data || [], error };
};

export const sendMessage = async (relationshipId, senderId, message, messageType = 'text') => {
  const { data, error } = await supabase
    .from('coach_messages')
    .insert({
      relationship_id: relationshipId,
      sender_id: senderId,
      message,
      message_type: messageType
    })
    .select()
    .single();

  return { data, error };
};

export const markMessagesRead = async (relationshipId, userId) => {
  const { error } = await supabase
    .from('coach_messages')
    .update({ read: true })
    .eq('relationship_id', relationshipId)
    .neq('sender_id', userId)
    .eq('read', false);

  return { error };
};

export const fetchUnreadCount = async (userId) => {
  // Get relationships where user is a client
  const { data: clientRels } = await supabase
    .from('coach_clients')
    .select('id')
    .eq('client_id', userId);

  // Get relationships where user is a coach
  const { data: coachProfile } = await supabase
    .from('coach_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  let coachRels = [];
  if (coachProfile) {
    const { data } = await supabase
      .from('coach_clients')
      .select('id')
      .eq('coach_id', coachProfile.id);
    coachRels = data || [];
  }

  const allRelIds = [...(clientRels || []), ...coachRels].map(r => r.id);
  if (allRelIds.length === 0) return { count: 0 };

  let total = 0;
  for (const relId of allRelIds) {
    const { count } = await supabase
      .from('coach_messages')
      .select('*', { count: 'exact', head: true })
      .eq('relationship_id', relId)
      .neq('sender_id', userId)
      .eq('read', false);
    total += count || 0;
  }

  return { count: total };
};

// ── Ratings ──

export const fetchRatings = async (coachId) => {
  const { data, error } = await supabase
    .from('coach_ratings')
    .select('*')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
};

export const rateCoach = async (coachId, clientId, rating, review) => {
  const { data, error } = await supabase
    .from('coach_ratings')
    .upsert({
      coach_id: coachId,
      client_id: clientId,
      rating,
      review: review || null
    }, { onConflict: 'coach_id,client_id' })
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

// ── Realtime Subscription ──

export const subscribeToMessages = (relationshipId, onMessage) => {
  const channel = supabase
    .channel(`coach_messages_${relationshipId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'coach_messages',
        filter: `relationship_id=eq.${relationshipId}`
      },
      (payload) => {
        onMessage(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
