import { useState, useCallback } from 'react';
import * as activityFeed from '../lib/activityFeedStorage';
import * as social from '../lib/socialStorage';

/**
 * React hook for activity feed: fetching friend activities and posting own activities.
 *
 * Activity types:
 *   workout_completed, pr_set, badge_earned, streak_milestone,
 *   league_promotion, rest_day_logged
 */

export const ACTIVITY_TYPES = {
  WORKOUT_COMPLETED: 'workout_completed',
  PR_SET: 'pr_set',
  BADGE_EARNED: 'badge_earned',
  STREAK_MILESTONE: 'streak_milestone',
  LEAGUE_PROMOTION: 'league_promotion',
  REST_DAY_LOGGED: 'rest_day_logged'
};

export const useActivityFeed = (user) => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // ── Fetch Feed ──

  const fetchFeed = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Get friend IDs from friendships
      const { data: friendships, error: friendError } = await social.fetchFriends(userId);
      if (friendError) throw friendError;

      const friendIds = (friendships || []).map(f => f.friendId).filter(Boolean);

      // Include own activities in feed
      const allIds = [userId, ...friendIds];

      const { data, error: fetchError } = await activityFeed.fetchFeed(allIds);
      if (fetchError) throw fetchError;
      setFeedItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Post Activity ──

  const postActivity = useCallback(async (type, payload) => {
    if (!userId) return false;
    try {
      const { error: err } = await activityFeed.postActivity(userId, type, payload);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  return {
    // State
    feedItems,
    loading,
    error,

    // Actions
    fetchFeed,
    postActivity
  };
};
