import { useState, useEffect } from 'react';

const STORAGE_KEY = 'workout_tracker_data';

const initialData = {
  completedWorkouts: [],
  workoutHistory: {},
  startDate: null
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
      startDate: imported.startDate || null
    };
    setData(merged);
  };

  return {
    data,
    saveWorkout,
    markComplete,
    isCompleted,
    getWorkoutHistory,
    resetData,
    importData
  };
};