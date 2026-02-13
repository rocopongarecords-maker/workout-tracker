import { useState, useEffect } from 'react';

const STORAGE_KEY = 'workout_tracker_data';

const initialData = {
  completedWorkouts: [],
  workoutHistory: {},
  startDate: null,
  earnedBadges: [],
  totalPRs: 0,
  weightLog: [],
  skinfoldLog: []
};

export const useWorkoutStorage = () => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialData;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const saveWorkout = (dayNumber, workoutData) => {
    setData(prev => ({
      ...prev,
      workoutHistory: {
        ...prev.workoutHistory,
        [dayNumber]: {
          date: new Date().toISOString(),
          ...workoutData
        }
      }
    }));
  };

  const markComplete = (dayNumber) => {
    setData(prev => ({
      ...prev,
      completedWorkouts: [...new Set([...prev.completedWorkouts, dayNumber])]
    }));
  };

  const isCompleted = (dayNumber) => {
    return data.completedWorkouts.includes(dayNumber);
  };

  const getWorkoutHistory = (dayNumber) => {
    return data.workoutHistory[dayNumber];
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialData);
  };

  const importData = (imported) => {
    const merged = {
      completedWorkouts: imported.completedWorkouts || [],
      workoutHistory: imported.workoutHistory || {},
      startDate: imported.startDate || null,
      earnedBadges: imported.earnedBadges || [],
      totalPRs: imported.totalPRs || 0,
      weightLog: imported.weightLog || [],
      skinfoldLog: imported.skinfoldLog || []
    };
    setData(merged);
  };

  const addBadges = (badgeIds) => {
    if (!badgeIds || badgeIds.length === 0) return;
    setData(prev => ({
      ...prev,
      earnedBadges: [
        ...prev.earnedBadges,
        ...badgeIds.map(id => ({ id, earnedAt: new Date().toISOString() }))
      ]
    }));
  };

  const incrementPRs = (count = 1) => {
    setData(prev => ({
      ...prev,
      totalPRs: (prev.totalPRs || 0) + count
    }));
  };

  const saveWeight = (entry) => {
    setData(prev => ({
      ...prev,
      weightLog: [...(prev.weightLog || []), entry]
    }));
  };

  const saveSkinfold = (entry) => {
    setData(prev => ({
      ...prev,
      skinfoldLog: [...(prev.skinfoldLog || []), entry]
    }));
  };

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
    saveSkinfold
  };
};