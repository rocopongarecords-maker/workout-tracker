import { useMemo } from 'react';
import { getDefaultSchedule } from '../utils/getDefaultSchedule';
import { generateScheduleFromProgram } from '../utils/generateScheduleFromProgram';
import { workoutData } from '../data/workoutData';

/**
 * Returns the active program's schedule and exercise resolver.
 */
export const useActiveProgram = (activeProgram, customPrograms) => {
  return useMemo(() => {
    const programId = activeProgram || 'jeff_nippard_lpp';

    // Default Jeff Nippard program
    if (programId === 'jeff_nippard_lpp') {
      const schedule = getDefaultSchedule();

      const getExercisesForDay = (dayNumber) => {
        const dayData = schedule.find(d => d.day === dayNumber);
        if (!dayData || dayData.rest) return null;
        const blockKey = `block${dayData.block}`;
        return workoutData[blockKey]?.[dayData.type]?.exercises || null;
      };

      const getWorkoutName = (dayNumber) => {
        const dayData = schedule.find(d => d.day === dayNumber);
        if (!dayData || dayData.rest) return null;
        const blockKey = `block${dayData.block}`;
        return workoutData[blockKey]?.[dayData.type]?.name || dayData.type;
      };

      return {
        schedule,
        getExercisesForDay,
        getWorkoutName,
        programName: "Jeff Nippard's Legs-Push-Pull",
        isCustom: false,
        totalWeeks: 16
      };
    }

    // Custom program
    const program = (customPrograms || []).find(p => p.id === programId);
    if (!program) {
      // Fallback to default if custom program not found
      const schedule = getDefaultSchedule();
      const getExercisesForDay = (dayNumber) => {
        const dayData = schedule.find(d => d.day === dayNumber);
        if (!dayData || dayData.rest) return null;
        const blockKey = `block${dayData.block}`;
        return workoutData[blockKey]?.[dayData.type]?.exercises || null;
      };
      const getWorkoutName = (dayNumber) => {
        const dayData = schedule.find(d => d.day === dayNumber);
        if (!dayData || dayData.rest) return null;
        const blockKey = `block${dayData.block}`;
        return workoutData[blockKey]?.[dayData.type]?.name || dayData.type;
      };
      return {
        schedule,
        getExercisesForDay,
        getWorkoutName,
        programName: "Jeff Nippard's Legs-Push-Pull",
        isCustom: false,
        totalWeeks: 16
      };
    }

    const schedule = generateScheduleFromProgram(program);

    const getExercisesForDay = (dayNumber) => {
      const dayData = schedule.find(d => d.day === dayNumber);
      if (!dayData || dayData.rest) return null;
      return dayData.exercises;
    };

    const getWorkoutName = (dayNumber) => {
      const dayData = schedule.find(d => d.day === dayNumber);
      if (!dayData || dayData.rest) return null;
      return dayData.type;
    };

    return {
      schedule,
      getExercisesForDay,
      getWorkoutName,
      programName: program.name,
      isCustom: true,
      totalWeeks: program.weeks
    };
  }, [activeProgram, customPrograms]);
};
