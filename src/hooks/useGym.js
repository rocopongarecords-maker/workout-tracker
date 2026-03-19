import { useState, useCallback } from 'react';
import * as gym from '../lib/gymStorage';

/**
 * React hook for gym features: discovery, home gym, check-ins, and leaderboards.
 */

// Haversine distance calculation (returns km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const NEARBY_RADIUS_KM = 10;

export const useGym = (user) => {
  const [nearbyGyms, setNearbyGyms] = useState([]);
  const [homeGym, setHomeGymState] = useState(null);
  const [gymLeaderboard, setGymLeaderboard] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // ── Discovery ──

  const fetchNearbyGyms = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await gym.fetchAllGyms();
      if (fetchError) throw fetchError;

      // Client-side filtering by distance
      const nearby = (data || [])
        .map(g => ({
          ...g,
          distance: g.latitude && g.longitude
            ? haversineDistance(lat, lon, g.latitude, g.longitude)
            : null
        }))
        .filter(g => g.distance !== null && g.distance <= NEARBY_RADIUS_KM)
        .sort((a, b) => a.distance - b.distance);

      setNearbyGyms(nearby);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllGyms = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await gym.fetchAllGyms();
      if (fetchError) throw fetchError;
      setNearbyGyms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGyms = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchError } = await gym.searchGyms(query);
      if (fetchError) throw fetchError;
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Home Gym ──

  const fetchHomeGym = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await gym.fetchHomeGym(userId);
      if (fetchError) throw fetchError;
      setHomeGymState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const setHomeGym = useCallback(async (gymId) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await gym.setHomeGym(userId, gymId);
      if (err) throw err;
      await fetchHomeGym();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchHomeGym]);

  // ── Check-ins ──

  const checkIn = useCallback(async (gymId, workoutDay, lat, lon, verified) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error: err } = await gym.checkIn(userId, gymId, workoutDay, lat, lon, verified);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Leaderboard ──

  const fetchGymLeaderboard = useCallback(async (gymId) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await gym.fetchGymLeaderboard(gymId);
      if (fetchError) throw fetchError;
      setGymLeaderboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    nearbyGyms,
    homeGym,
    gymLeaderboard,
    searchResults,
    loading,
    error,

    // Discovery
    fetchNearbyGyms,
    fetchAllGyms,
    searchGyms,

    // Home Gym
    fetchHomeGym,
    setHomeGym,

    // Check-ins
    checkIn,

    // Leaderboard
    fetchGymLeaderboard
  };
};
