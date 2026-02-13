import { useState, useEffect, useCallback, useMemo } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import * as db from '../lib/supabaseStorage';

const STORAGE_KEY = 'workout_tracker_data';

const initialData = {
  programData: {
    jeff_nippard_lpp: {
      completedWorkouts: [],
      workoutHistory: {}
    }
  },
  activeProgram: 'jeff_nippard_lpp',
  startDate: null,
  earnedBadges: [],
  totalPRs: 0,
  weightLog: [],
  skinfoldLog: [],
  customPrograms: [],
  onboardingComplete: false,
  schemaVersion: 2
};

// One-time migration: v1 (flat completedWorkouts/workoutHistory) → v2 (programData namespaced)
const migrateSchema = (stored) => {
  if (!stored.schemaVersion || stored.schemaVersion < 2) {
    const programId = stored.activeProgram || 'jeff_nippard_lpp';
    stored.programData = {
      [programId]: {
        completedWorkouts: stored.completedWorkouts || [],
        workoutHistory: stored.workoutHistory || {}
      }
    };
    stored.schemaVersion = 2;
    delete stored.completedWorkouts;
    delete stored.workoutHistory;
  }
  if (!stored.programData) {
    stored.programData = { jeff_nippard_lpp: { completedWorkouts: [], workoutHistory: {} } };
  }
  if (!stored.customPrograms) stored.customPrograms = [];
  if (!stored.activeProgram) stored.activeProgram = 'jeff_nippard_lpp';
  return stored;
};

const loadLocal = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialData;
    return migrateSchema(JSON.parse(stored));
  } catch {
    return initialData;
  }
};

const saveLocal = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Helper: update the active program's workout data within state
const updateProgramData = (state, updater) => {
  const programId = state.activeProgram || 'jeff_nippard_lpp';
  const current = state.programData?.[programId] || { completedWorkouts: [], workoutHistory: {} };
  return {
    ...state,
    programData: {
      ...state.programData,
      [programId]: updater(current)
    }
  };
};

export const useWorkoutStorage = (user) => {
  const [rawData, setRawData] = useState(loadLocal);
  const [syncing, setSyncing] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  const isOnline = isSupabaseConfigured() && !!user;

  // Expose data with active program's completedWorkouts/workoutHistory at top level
  const data = useMemo(() => {
    const programId = rawData.activeProgram || 'jeff_nippard_lpp';
    const pd = rawData.programData?.[programId] || { completedWorkouts: [], workoutHistory: {} };
    return {
      ...rawData,
      completedWorkouts: pd.completedWorkouts,
      workoutHistory: pd.workoutHistory
    };
  }, [rawData]);

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (!isOnline) return;

    const loadFromSupabase = async () => {
      setSyncing(true);
      try {
        const remoteData = await db.fetchAllData(user.id);
        const migrated = migrateSchema(remoteData);

        const localData = loadLocal();
        const localPd = localData.programData?.[localData.activeProgram] || {};
        const hasLocalData = (localPd.completedWorkouts?.length > 0) ||
          Object.keys(localPd.workoutHistory || {}).length > 0;

        const remotePd = migrated.programData?.[migrated.activeProgram] || {};
        const hasRemoteData = (remotePd.completedWorkouts?.length > 0) ||
          Object.keys(remotePd.workoutHistory || {}).length > 0;

        if (hasLocalData && !hasRemoteData) {
          setMigrationNeeded(true);
        } else {
          setRawData(migrated);
        }
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
      }
      setSyncing(false);
    };

    loadFromSupabase();
  }, [user?.id]);

  // Always save to localStorage as cache
  useEffect(() => {
    saveLocal(rawData);
  }, [rawData]);

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
    setRawData(prev => {
      const programId = prev.activeProgram;
      return updateProgramData(prev, (pd) => ({
        ...pd,
        workoutHistory: {
          ...pd.workoutHistory,
          [dayNumber]: { date: new Date().toISOString(), ...workoutData }
        }
      }));
    });

    if (isOnline) {
      db.upsertWorkout(user.id, dayNumber, workoutData, rawData.activeProgram).catch(console.error);
    }
  }, [user?.id, isOnline, rawData.activeProgram]);

  const markComplete = useCallback((dayNumber) => {
    setRawData(prev => updateProgramData(prev, (pd) => ({
      ...pd,
      completedWorkouts: [...new Set([...pd.completedWorkouts, dayNumber])]
    })));

    if (isOnline) {
      db.markWorkoutComplete(user.id, dayNumber, rawData.activeProgram).catch(console.error);
    }
  }, [user?.id, isOnline, rawData.activeProgram]);

  const isCompleted = useCallback((dayNumber) => {
    return data.completedWorkouts.includes(dayNumber);
  }, [data.completedWorkouts]);

  const getWorkoutHistory = useCallback((dayNumber) => {
    return data.workoutHistory[dayNumber];
  }, [data.workoutHistory]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRawData(initialData);
  }, []);

  const importData = useCallback((imported) => {
    const migrated = migrateSchema({ ...imported });
    const merged = {
      programData: migrated.programData || initialData.programData,
      activeProgram: migrated.activeProgram || 'jeff_nippard_lpp',
      startDate: migrated.startDate || null,
      earnedBadges: migrated.earnedBadges || [],
      totalPRs: migrated.totalPRs || 0,
      weightLog: migrated.weightLog || [],
      skinfoldLog: migrated.skinfoldLog || [],
      customPrograms: migrated.customPrograms || [],
      schemaVersion: 2
    };
    setRawData(merged);

    if (isOnline) {
      db.importLocalDataToSupabase(user.id, merged).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const addBadges = useCallback((badgeIds) => {
    if (!badgeIds || badgeIds.length === 0) return;
    const newEntries = badgeIds.map(id => ({ id, earnedAt: new Date().toISOString() }));
    setRawData(prev => ({
      ...prev,
      earnedBadges: [...(prev.earnedBadges || []), ...newEntries]
    }));

    if (isOnline) {
      db.insertBadges(user.id, badgeIds).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const incrementPRs = useCallback((count = 1) => {
    setRawData(prev => {
      const newTotal = (prev.totalPRs || 0) + count;
      if (isOnline) {
        db.upsertPRCount(user.id, newTotal).catch(console.error);
      }
      return { ...prev, totalPRs: newTotal };
    });
  }, [user?.id, isOnline]);

  const saveWeight = useCallback((entry) => {
    setRawData(prev => ({
      ...prev,
      weightLog: [...(prev.weightLog || []), entry]
    }));

    if (isOnline) {
      db.insertWeight(user.id, entry).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const saveSkinfold = useCallback((entry) => {
    setRawData(prev => ({
      ...prev,
      skinfoldLog: [...(prev.skinfoldLog || []), entry]
    }));

    if (isOnline) {
      db.insertSkinfold(user.id, entry).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const saveCustomProgram = useCallback((program) => {
    setRawData(prev => {
      const existing = (prev.customPrograms || []);
      const updated = existing.find(p => p.id === program.id)
        ? existing.map(p => p.id === program.id ? program : p)
        : [...existing, program];
      const programData = { ...prev.programData };
      if (!programData[program.id]) {
        programData[program.id] = { completedWorkouts: [], workoutHistory: {} };
      }
      return { ...prev, customPrograms: updated, programData };
    });

    if (isOnline) {
      db.upsertCustomProgram(user.id, program).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const deleteCustomProgram = useCallback((programId) => {
    setRawData(prev => {
      const programData = { ...prev.programData };
      delete programData[programId];
      return {
        ...prev,
        customPrograms: (prev.customPrograms || []).filter(p => p.id !== programId),
        activeProgram: prev.activeProgram === programId ? 'jeff_nippard_lpp' : prev.activeProgram,
        programData
      };
    });

    if (isOnline) {
      db.deleteCustomProgram(user.id, programId).catch(console.error);
    }
  }, [user?.id, isOnline]);

  const markOnboardingComplete = useCallback(() => {
    setRawData(prev => ({ ...prev, onboardingComplete: true }));
  }, []);

  const setActiveProgram = useCallback((programId) => {
    setRawData(prev => {
      const programData = { ...prev.programData };
      if (!programData[programId]) {
        programData[programId] = { completedWorkouts: [], workoutHistory: {} };
      }
      return { ...prev, activeProgram: programId, programData };
    });
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
    markOnboardingComplete,
    syncing,
    migrationNeeded,
    migrateLocalData,
    dismissMigration
  };
};
