import { useState, useCallback } from 'react';
import * as mp from '../lib/marketplaceStorage';

/**
 * React hook for marketplace features: browsing, subscribing, publishing,
 * rating, invites, and program feeds.
 */
export const useMarketplace = (user) => {
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [myPublished, setMyPublished] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feed, setFeed] = useState([]);
  const [creatorAnalytics, setCreatorAnalytics] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // Helper: enrich items with author profile info (display_name, avatar_emoji)
  const enrichWithProfiles = useCallback(async (items, idField) => {
    if (!items || items.length === 0) return items;

    // For builtin items, tag them directly
    const enriched = items.map(item => ({ ...item }));

    // Collect unique user IDs from non-builtin items
    const userIds = [...new Set(
      enriched
        .filter(item => !item.is_builtin)
        .map(item => item[idField])
        .filter(Boolean)
    )];

    if (userIds.length === 0) {
      return enriched.map(item =>
        item.is_builtin ? { ...item, authorName: 'ZWAR', authorEmoji: null } : item
      );
    }

    const { data: profiles } = await mp.fetchProfiles(userIds);
    const profileMap = {};
    for (const p of (profiles || [])) {
      profileMap[p.id] = p;
    }

    return enriched.map(item => {
      if (item.is_builtin) {
        return { ...item, authorName: 'ZWAR', authorEmoji: null };
      }
      const profile = profileMap[item[idField]];
      return {
        ...item,
        authorName: profile?.display_name || 'Unknown',
        authorEmoji: profile?.avatar_emoji || null
      };
    });
  }, []);

  const loadFeatured = useCallback(async (category, difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await mp.fetchFeaturedPrograms(category, difficulty);
      if (fetchError) throw fetchError;
      const enriched = await enrichWithProfiles(data, 'author_id');
      setFeaturedPrograms(enriched);
    } catch (err) {
      console.error('Failed to load featured programs:', err);
      setError(err.message || 'Failed to load featured programs');
    }
    setLoading(false);
  }, [enrichWithProfiles]);

  const search = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: searchError } = await mp.searchPrograms(query);
      if (searchError) throw searchError;
      const enriched = await enrichWithProfiles(data, 'author_id');
      setSearchResults(enriched);
    } catch (err) {
      console.error('Failed to search programs:', err);
      setError(err.message || 'Failed to search programs');
    }
    setLoading(false);
  }, [enrichWithProfiles]);

  const subscribe = useCallback(async (program, saveCustomProgram) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: subError } = await mp.subscribeToProgram(userId, program.id);
      if (subError) throw subError;

      // Create a local custom program from the marketplace program's data
      const localProgram = {
        ...program.program_data,
        marketplace_id: program.id
      };
      saveCustomProgram(localProgram);
    } catch (err) {
      console.error('Failed to subscribe to program:', err);
      setError(err.message || 'Failed to subscribe to program');
    }
    setLoading(false);
  }, [userId]);

  const unsubscribe = useCallback(async (programId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: unsubError } = await mp.unsubscribeFromProgram(userId, programId);
      if (unsubError) throw unsubError;
    } catch (err) {
      console.error('Failed to unsubscribe from program:', err);
      setError(err.message || 'Failed to unsubscribe from program');
    }
    setLoading(false);
  }, [userId]);

  const publish = useCallback(async (program, description, category, difficulty, visibility) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: id, error: pubError } = await mp.publishProgram(
        userId, program, description, category, difficulty, visibility
      );
      if (pubError) throw pubError;
      return id;
    } catch (err) {
      console.error('Failed to publish program:', err);
      setError(err.message || 'Failed to publish program');
    }
    setLoading(false);
  }, [userId]);

  const unpublish = useCallback(async (marketplaceId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: unpubError } = await mp.unpublishProgram(userId, marketplaceId);
      if (unpubError) throw unpubError;
    } catch (err) {
      console.error('Failed to unpublish program:', err);
      setError(err.message || 'Failed to unpublish program');
    }
    setLoading(false);
  }, [userId]);

  const rate = useCallback(async (programId, rating, review) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: rateError } = await mp.rateProgram(userId, programId, rating, review);
      if (rateError) throw rateError;
    } catch (err) {
      console.error('Failed to rate program:', err);
      setError(err.message || 'Failed to rate program');
    }
    setLoading(false);
  }, [userId]);

  const loadRatings = useCallback(async (programId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await mp.fetchRatings(programId);
      if (fetchError) throw fetchError;
      const enriched = await enrichWithProfiles(data, 'user_id');
      setRatings(enriched);
    } catch (err) {
      console.error('Failed to load ratings:', err);
      setError(err.message || 'Failed to load ratings');
    }
    setLoading(false);
  }, [enrichWithProfiles]);

  const createInvite = useCallback(async (programId, maxUses) => {
    if (!userId) return null;
    setLoading(true);
    setError(null);
    try {
      const { data, error: inviteError } = await mp.createInvite(userId, programId, maxUses);
      if (inviteError) throw inviteError;
      return data;
    } catch (err) {
      console.error('Failed to create invite:', err);
      setError(err.message || 'Failed to create invite');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const resolveInvite = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: resolveError } = await mp.resolveInvite(token);
      if (resolveError) throw resolveError;

      // Enrich the program with its author profile
      const enriched = await enrichWithProfiles([data.program], 'author_id');
      return { invite: data.invite, program: enriched[0] };
    } catch (err) {
      console.error('Failed to resolve invite:', err);
      setError(err.message || 'Failed to resolve invite');
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrichWithProfiles]);

  const loadFeed = useCallback(async (programId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: feedError } = await mp.fetchProgramFeed(programId);
      if (feedError) throw feedError;
      const enriched = await enrichWithProfiles(data, 'author_id');
      setFeed(enriched);
    } catch (err) {
      console.error('Failed to load feed:', err);
      setError(err.message || 'Failed to load feed');
    }
    setLoading(false);
  }, [enrichWithProfiles]);

  const postToFeed = useCallback(async (programId, message) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: postError } = await mp.postToFeed(userId, programId, message);
      if (postError) throw postError;
      // Reload feed after posting
      const { data, error: feedError } = await mp.fetchProgramFeed(programId);
      if (!feedError) {
        const enriched = await enrichWithProfiles(data, 'author_id');
        setFeed(enriched);
      }
    } catch (err) {
      console.error('Failed to post to feed:', err);
      setError(err.message || 'Failed to post to feed');
    }
    setLoading(false);
  }, [userId, enrichWithProfiles]);

  const loadCreatorAnalytics = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: analyticsError } = await mp.fetchCreatorAnalytics(userId);
      if (analyticsError) throw analyticsError;
      setCreatorAnalytics(data);
    } catch (err) {
      console.error('Failed to load creator analytics:', err);
      setError(err.message || 'Failed to load creator analytics');
    }
    setLoading(false);
  }, [userId]);

  const loadMyPublished = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await mp.fetchMyPublished(userId);
      if (fetchError) throw fetchError;
      setMyPublished(data);
    } catch (err) {
      console.error('Failed to load published programs:', err);
      setError(err.message || 'Failed to load published programs');
    }
    setLoading(false);
  }, [userId]);

  const loadMySubscriptions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await mp.fetchMySubscriptions(userId);
      if (fetchError) throw fetchError;
      setMySubscriptions(data);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      setError(err.message || 'Failed to load subscriptions');
    }
    setLoading(false);
  }, [userId]);

  return {
    featuredPrograms,
    searchResults,
    myPublished,
    mySubscriptions,
    ratings,
    feed,
    creatorAnalytics,
    selectedProgram,
    setSelectedProgram,
    loading,
    error,
    loadFeatured,
    search,
    subscribe,
    unsubscribe,
    publish,
    unpublish,
    rate,
    loadRatings,
    createInvite,
    resolveInvite,
    loadFeed,
    postToFeed,
    loadCreatorAnalytics,
    loadMyPublished,
    loadMySubscriptions
  };
};
