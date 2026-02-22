import { useState, useCallback, useEffect, useRef } from 'react';
import * as coach from '../lib/coachStorage';

/**
 * React hook for coach features: discovery, relationships, questionnaires, chat, and ratings.
 */
export const useCoach = (user) => {
  const [coaches, setCoaches] = useState([]);
  const [myCoachProfile, setMyCoachProfile] = useState(null);
  const [myClients, setMyClients] = useState([]);
  const [myCoachRelationship, setMyCoachRelationship] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const unsubscribeRef = useRef(null);
  const userId = user?.id;

  // Helper: enrich items with profile info
  const enrichWithProfiles = useCallback(async (items, idField) => {
    if (!items || items.length === 0) return items;

    const userIds = [...new Set(items.map(item => item[idField]).filter(Boolean))];
    if (userIds.length === 0) return items;

    const { data: profiles } = await coach.fetchProfiles(userIds);
    const profileMap = {};
    for (const p of (profiles || [])) {
      profileMap[p.id] = p;
    }

    return items.map(item => {
      const profile = profileMap[item[idField]];
      return {
        ...item,
        authorName: profile?.display_name || 'Unknown',
        authorEmoji: profile?.avatar_emoji || null
      };
    });
  }, []);

  // ── Discovery ──

  const loadCoaches = useCallback(async (specialty) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await coach.fetchCoaches(specialty);
      if (fetchError) throw fetchError;
      const enriched = await enrichWithProfiles(data, 'user_id');
      setCoaches(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [enrichWithProfiles]);

  const loadCoachProfile = useCallback(async (coachId) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await coach.fetchCoachProfile(coachId);
      if (fetchError) throw fetchError;
      const enriched = await enrichWithProfiles([data], 'user_id');
      return enriched[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrichWithProfiles]);

  // ── Client Actions ──

  const requestCoaching = useCallback(async (coachId) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await coach.requestCoaching(coachId, userId);
      if (err) throw err;
      await loadMyRelationship();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const submitQuestionnaire = useCallback(async (relationshipId, answers) => {
    setLoading(true);
    try {
      const { error: err } = await coach.submitQuestionnaire(relationshipId, answers);
      if (err) throw err;
      await loadMyRelationship();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyRelationship = useCallback(async () => {
    if (!userId) return;
    const { data } = await coach.fetchMyCoachRelationship(userId);
    setMyCoachRelationship(data);
  }, [userId]);

  // ── Coach Actions ──

  const loadMyCoachProfile = useCallback(async () => {
    if (!userId) return;
    const { data } = await coach.fetchMyCoachProfile(userId);
    setMyCoachProfile(data);
  }, [userId]);

  const createCoachProfile = useCallback(async (profileData) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { data, error: err } = await coach.createCoachProfile(userId, profileData);
      if (err) throw err;
      setMyCoachProfile(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadMyClients = useCallback(async () => {
    if (!myCoachProfile) return;
    const { data } = await coach.fetchMyClients(myCoachProfile.id);
    const enriched = await enrichWithProfiles(data, 'client_id');
    setMyClients(enriched);
  }, [myCoachProfile, enrichWithProfiles]);

  const updateClientStatus = useCallback(async (relationshipId, status) => {
    setLoading(true);
    try {
      const { error: err } = await coach.updateClientStatus(relationshipId, status);
      if (err) throw err;
      await loadMyClients();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadMyClients]);

  const assignProgram = useCallback(async (relationshipId, programId) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await coach.assignProgram(relationshipId, programId);
      if (err) throw err;
      // Send system message
      await coach.sendMessage(relationshipId, userId, 'A new program has been assigned! Check your Programs tab.', 'program_update');
      await loadMyClients();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadMyClients]);

  // ── Questionnaire ──

  const loadQuestionnaire = useCallback(async (coachId) => {
    const { data } = await coach.fetchQuestionnaire(coachId);
    setQuestionnaire(data);
    return data;
  }, []);

  const saveQuestionnaire = useCallback(async (questions) => {
    if (!myCoachProfile) return false;
    setLoading(true);
    try {
      const { error: err } = await coach.saveQuestionnaire(myCoachProfile.id, questions);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [myCoachProfile]);

  // ── Chat ──

  const loadMessages = useCallback(async (relationshipId) => {
    const { data } = await coach.fetchMessages(relationshipId);
    setMessages(data);
  }, []);

  const sendMessage = useCallback(async (relationshipId, message, type = 'text') => {
    if (!userId) return false;
    try {
      const { error: err } = await coach.sendMessage(relationshipId, userId, message, type);
      if (err) throw err;
      await loadMessages(relationshipId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId, loadMessages]);

  const markRead = useCallback(async (relationshipId) => {
    if (!userId) return;
    await coach.markMessagesRead(relationshipId, userId);
    await loadUnreadCount();
  }, [userId]);

  const subscribeToMessages = useCallback((relationshipId) => {
    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    unsubscribeRef.current = coach.subscribeToMessages(relationshipId, (newMessage) => {
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });
  }, []);

  const unsubscribeFromMessages = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // ── Ratings ──

  const loadRatings = useCallback(async (coachId) => {
    const { data } = await coach.fetchRatings(coachId);
    const enriched = await enrichWithProfiles(data, 'client_id');
    setRatings(enriched);
  }, [enrichWithProfiles]);

  const rateCoach = useCallback(async (coachId, rating, review) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await coach.rateCoach(coachId, userId, rating, review);
      if (err) throw err;
      await loadRatings(coachId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadRatings]);

  // ── Unread Count ──

  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;
    const { count } = await coach.fetchUnreadCount(userId);
    setUnreadCount(count);
  }, [userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    // State
    coaches,
    myCoachProfile,
    myClients,
    myCoachRelationship,
    questionnaire,
    messages,
    ratings,
    loading,
    error,
    unreadCount,

    // Discovery
    loadCoaches,
    loadCoachProfile,

    // Client actions
    requestCoaching,
    submitQuestionnaire,
    loadMyRelationship,

    // Coach actions
    loadMyCoachProfile,
    createCoachProfile,
    loadMyClients,
    updateClientStatus,
    assignProgram,

    // Questionnaire
    loadQuestionnaire,
    saveQuestionnaire,

    // Chat
    loadMessages,
    sendMessage,
    markRead,
    subscribeToMessages,
    unsubscribeFromMessages,

    // Ratings
    loadRatings,
    rateCoach,

    // Unread
    loadUnreadCount
  };
};
