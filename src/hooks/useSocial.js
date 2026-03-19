import { useState, useCallback } from 'react';
import * as social from '../lib/socialStorage';

/**
 * React hook for social features: friends, notifications, nudges, streaks, and profiles.
 */
export const useSocial = (user) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // ── Profile ──

  const fetchMyProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await social.fetchMyProfile(userId);
      if (fetchError) throw fetchError;
      setMyProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateDisplayName = useCallback(async (name) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { data, error: err } = await social.updateDisplayName(userId, name);
      if (err) throw err;
      setMyProfile(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateAvatarEmoji = useCallback(async (emoji) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { data, error: err } = await social.updateAvatarEmoji(userId, emoji);
      if (err) throw err;
      setMyProfile(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Friends ──

  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await social.fetchFriends(userId);
      if (fetchError) throw fetchError;
      setFriends(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const sendFriendRequest = useCallback(async (friendCode) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await social.sendFriendRequest(userId, friendCode);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const acceptFriendRequest = useCallback(async (friendshipId) => {
    setLoading(true);
    try {
      const { error: err } = await social.acceptFriendRequest(friendshipId);
      if (err) throw err;
      await fetchFriends();
      await fetchPendingRequests();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const declineFriendRequest = useCallback(async (friendshipId) => {
    setLoading(true);
    try {
      const { error: err } = await social.declineFriendRequest(friendshipId);
      if (err) throw err;
      await fetchPendingRequests();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFriend = useCallback(async (friendshipId) => {
    setLoading(true);
    try {
      const { error: err } = await social.removeFriend(friendshipId);
      if (err) throw err;
      await fetchFriends();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    if (!userId) return;
    const { data, error: fetchError } = await social.fetchPendingRequests(userId);
    if (!fetchError) setPendingRequests(data);
  }, [userId]);

  // ── Notifications ──

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    const { data, error: fetchError } = await social.fetchNotifications(userId);
    if (!fetchError) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  }, [userId]);

  const markNotificationRead = useCallback(async (notificationId) => {
    try {
      const { error: err } = await social.markNotificationRead(notificationId);
      if (err) throw err;
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return false;
    try {
      const { error: err } = await social.markAllNotificationsRead(userId);
      if (err) throw err;
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  // ── Nudge & Motivation ──

  const sendNudge = useCallback(async (toUserId) => {
    if (!userId) return false;
    try {
      const { error: err } = await social.sendNudge(userId, toUserId);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  const sendMotivation = useCallback(async (toUserId, message) => {
    if (!userId) return false;
    try {
      const { error: err } = await social.sendMotivation(userId, toUserId, message);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  // ── Streaks ──

  const updateStreak = useCallback(async (current, longest) => {
    if (!userId) return false;
    try {
      const { error: err } = await social.updateStreak(userId, current, longest);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  // ── Refresh All ──

  const refreshAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([
        fetchMyProfile(),
        fetchFriends(),
        fetchPendingRequests(),
        fetchNotifications()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchMyProfile, fetchFriends, fetchPendingRequests, fetchNotifications]);

  return {
    // State
    friends,
    pendingRequests,
    notifications,
    myProfile,
    unreadCount,
    loading,
    error,

    // Profile
    fetchMyProfile,
    updateDisplayName,
    updateAvatarEmoji,

    // Friends
    fetchFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    fetchPendingRequests,

    // Notifications
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,

    // Nudge & Motivation
    sendNudge,
    sendMotivation,

    // Streaks
    updateStreak,

    // Refresh
    refreshAll
  };
};
