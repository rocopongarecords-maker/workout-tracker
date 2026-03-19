import { useState, useCallback, useMemo } from 'react';
import * as league from '../lib/leagueStorage';

/**
 * React hook for league features: membership, standings, XP tracking, and tier progression.
 */

// Tier thresholds: XP needed to promote from this tier
const TIER_THRESHOLDS = {
  bronze: 50,
  silver: 100,
  gold: 200,
  platinum: 400,
  diamond: Infinity
};

// Tier display data
const TIER_DATA = {
  bronze: { emoji: '\uD83E\uDD49', color: '#CD7F32' },
  silver: { emoji: '\uD83E\uDD48', color: '#C0C0C0' },
  gold: { emoji: '\uD83E\uDD47', color: '#FFD700' },
  platinum: { emoji: '\uD83D\uDC8E', color: '#9BB8ED' },
  diamond: { emoji: '\u2B50', color: '#B400D0' }
};

// Tier order for promotion
const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

// XP constants
export const XP_PER_SET = 1;
export const XP_PER_WORKOUT = 10;
export const XP_PER_PR = 5;

export const useLeague = (user) => {
  const [myMembership, setMyMembership] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // ── Computed ──

  const currentTier = useMemo(() => {
    const tierName = myMembership?.league || 'bronze';
    return {
      name: tierName,
      ...(TIER_DATA[tierName] || TIER_DATA.bronze)
    };
  }, [myMembership]);

  const weeklyXP = useMemo(() => {
    return myMembership?.weekly_xp || 0;
  }, [myMembership]);

  const promotionProgress = useMemo(() => {
    const tierName = myMembership?.league || 'bronze';
    const threshold = TIER_THRESHOLDS[tierName];
    if (threshold === Infinity) return 1; // Diamond — max tier
    const xp = myMembership?.weekly_xp || 0;
    return Math.min(1, xp / threshold);
  }, [myMembership]);

  const xpToPromotion = useMemo(() => {
    const tierName = myMembership?.league || 'bronze';
    const threshold = TIER_THRESHOLDS[tierName];
    if (threshold === Infinity) return 0;
    const xp = myMembership?.weekly_xp || 0;
    return Math.max(0, threshold - xp);
  }, [myMembership]);

  // ── Actions ──

  const fetchMyLeague = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await league.fetchMyLeague(userId);
      if (fetchError) throw fetchError;
      setMyMembership(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchLeagueStandings = useCallback(async (tierName) => {
    const tier = tierName || myMembership?.league || 'bronze';
    setLoading(true);
    try {
      const { data, error: fetchError } = await league.fetchLeagueStandings(tier);
      if (fetchError) throw fetchError;
      setStandings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [myMembership]);

  const addXP = useCallback(async (xpAmount) => {
    if (!userId || !myMembership) return false;
    setLoading(true);
    try {
      const newXP = (myMembership.weekly_xp || 0) + xpAmount;
      let newLeague = myMembership.league;

      // Check for promotion
      const threshold = TIER_THRESHOLDS[newLeague];
      if (threshold !== Infinity && newXP >= threshold) {
        const currentIndex = TIER_ORDER.indexOf(newLeague);
        if (currentIndex < TIER_ORDER.length - 1) {
          newLeague = TIER_ORDER[currentIndex + 1];
        }
      }

      const { data, error: err } = await league.updateLeagueXP(userId, newXP, newLeague);
      if (err) throw err;
      setMyMembership(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, myMembership]);

  return {
    // State
    myMembership,
    standings,
    loading,
    error,

    // Computed
    currentTier,
    weeklyXP,
    promotionProgress,
    xpToPromotion,

    // Tier data (static)
    tierData: TIER_DATA,
    tierThresholds: TIER_THRESHOLDS,

    // Actions
    fetchMyLeague,
    fetchLeagueStandings,
    addXP
  };
};
