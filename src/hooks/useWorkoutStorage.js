import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import * as db from '../lib/supabaseStorage';

const STORAGE_KEY = 'workout_tracker_data';

const initialData = {
  completedWorkouts: [],
  workoutHistory: {},
  startDate: null,
  earnedBadges: [],
  totalPRs: 0,
  weightLog: [],
  skinfoldLog: [],
  customPrograms: [],
  activeProgram: 'jeff_nippard_lpp'
};

const loadLocal = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  } catch {
    return initialData;
  }
};

const saveLocal = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useWorkoutStorage = (user) => {
  const [data, setData] = useState(loadLocal);
  const [syncing, setSyncing] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  const isOnline = isSupabaseConfigured() && !!user;

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (!isOnline) return;

    const loadFromSupabase = async () => {
      setSyncing(true);
      try {
        const remoteData = await db.fetchAllData(user.id);

        // Check if user has local data that's not in Supabase
        const localData = loadLocal();
        const hasLocalData = localData.completedWorkouts.length > 0 ||
          Object.keys(localData.workoutHistory).length > 0;
        const hasRemoteData = remoteData.completedWorkouts.length > 0 ||
          Object.keys(remoteData.workoutHistory).length > 0;

        if (hasLocalData && !hasRemoteData) {
          setMigrationNeeded(true);
          // Keep local data for now, user will be prompted to migrate
        } else {
          setData(remoteData);
        }
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
        // Keep local data as fallback
      }
      setSyncing(false);
    };

    loadFromSupabase();
  }, [user?.id]);

  // Always save to localStorage as cache
  useEffect(() => {
    saveLocal(data);
  }, [data]);

  const migrateLocalData = useCallback(async () => {
    if (!isOnline) return;
    setSyncing(true);
    try {
      const localData = loadLocal();
      await db.importLocalDataToSupabase(user.id, localData);
      setMigrationNeeded(false);
    } catch (err) {
      console.error('Migration failed:', err);
    }
    setSyncing(false);
  }, [user?.id, isOnline]);

  const dismissMigration = useCallback(() => {
    setMigrationNeeded(false);
  }, []);

  const saveWorkout = useCallback((dayNumber, workoutData) => {
    setData(prev => {
      const next = {
        ...prev,
        workoutHistory: {
          ...prev.workoutHistory,
          [dayNumber]: {
            date: new Date().toISOString(),
            ...workoutData
          }
        }
      };
      return next;
    });

    // Sync to Supabase in background
    if (isOnline) {
      db.upsertWorkout(user.id, dayNumber, workoutData).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const markComplete = useCallback((dayNumber) => {
    setData(prev => ({
      ...prev,
      completedWorkouts: [...new Set([...prev.completedWorkouts, dayNumber])]
    }));

    if (isOnline) {
      db.markWorkoutComplete(user.id, dayNumber).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const isCompleted = useCallback((dayNumber) => {
    return data.completedWorkouts.includes(dayNumber);
  }, [data.completedWorkouts]);

  const getWorkoutHistory = useCallback((dayNumber) => {
    return data.workoutHistory[dayNumber];
  }, [data.workoutHistory]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialData);
    // Note: Supabase data is not deleted on reset — only local data
    // To fully delete from Supabase, user should use the delete account option
  }, []);

  const importData = useCallback((imported) => {
    const merged = {
      completedWorkouts: imported.completedWorkouts || [],
      workoutHistory: imported.workoutHistory || {},
      startDate: imported.startDate || null,
      earnedBadges: imported.earnedBadges || [],
      totalPRs: imported.totalPRs || 0,
      weightLog: imported.weightLog || [],
      skinfoldLog: imported.skinfoldLog || [],
      customPrograms: imported.customPrograms || [],
      activeProgram: imported.activeProgram || 'jeff_nippard_lpp'
    };
    setData(merged);

    if (isOnline) {
      db.importLocalDataToSupabase(user.id, merged).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const addBadges = useCallback((badgeIds) => {
    if (!badgeIds || badgeIds.length === 0) return;
    const newEntries = badgeIds.map(id => ({ id, earnedAt: new Date().toISOString() }));
    setData(prev => ({
      ...prev,
      earnedBadges: [...(prev.earnedBadges || []), ...newEntries]
    }));

    if (isOnline) {
      db.insertBadges(user.id, badgeIds).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const incrementPRs = useCallback((count = 1) => {
    setData(prev => {
      const newTotal = (prev.totalPRs || 0) + count;
      if (isOnline) {
        db.upsertPRCount(user.id, newTotal).catch(console.error);
      }
      return { ...prev, totalPRs: newTotal };
    });
  }, [user?.id, isOnline]);

  const saveWeight = useCallback((entry) => {
    setData(prev => ({
      ...prev,
      weightLog: [...(prev.weightLog || []), entry]
    }));

    if (isOnline) {
      db.insertWeight(user.id, entry).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const saveSkinfold = useCallback((entry) => {
    setData(prev => ({
      ...prev,
      skinfoldLog: [...(prev.skinfoldLog || []), entry]
    }));

    if (isOnline) {
      db.insertSkinfold(user.id, entry).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const saveCustomProgram = useCallback((program) => {
    setData(prev => {
      const existing = (prev.customPrograms || []);
      const updated = existing.find(p => p.id === program.id)
        ? existing.map(p => p.id === program.id ? program : p)
        : [...existing, program];
      return { ...prev, customPrograms: updated };
    });
  }, []);

  const deleteCustomProgram = useCallback((programId) => {
    setData(prev => ({
      ...prev,
      customPrograms: (prev.customPrograms || []).filter(p => p.id !== programId),
      activeProgram: prev.activeProgram === programId ? 'jeff_nippard_lpp' : prev.activeProgram
    }));
  }, []);

  const setActiveProgram = useCallback((programId) => {
    setData(prev => ({ ...prev, activeProgram: programId }));
  }, []);

  return {
    data,
    saveWorkout,
    markComplete,
    isCompleted,
    getWorkoutHistory,
    resetData,
    importData,
    addBadges,
    incrementPRs,
    saveWeight,
    saveSkinfold,
    saveCustomProgram,
    deleteCustomProgram,
    setActiveProgram,
    syncing,
    migrationNeeded,
    migrateLocalData,
    dismissMigration
  };
};
