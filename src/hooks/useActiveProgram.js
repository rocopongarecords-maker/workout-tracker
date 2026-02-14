import { useMemo } from 'react';
import { getDefaultSchedule } from '../utils/getDefaultSchedule';
import { generateScheduleFromProgram } from '../utils/generateScheduleFromProgram';
import { workoutData } from '../data/workoutData';
import { fullBodyData } from '../data/fullBodyData';
import { fullBodySchedule } from '../data/fullBodySchedule';
import { hyroxData } from '../data/hyroxData';
import { hyroxSchedule } from '../data/hyroxSchedule';

/**
 * Helper to create resolvers for a built-in program with block-based data.
 */
const createBuiltInResolvers = (schedule, data) => {
  const getExercisesForDay = (dayNumber) => {
    const dayData = schedule.find(d => d.day === dayNumber);
    if (!dayData || dayData.rest) return null;
    const blockKey = `block${dayData.block}`;
    return data[blockKey]?.[dayData.type]?.exercises || null;
  };

  const getWorkoutName = (dayNumber) => {
    const dayData = schedule.find(d => d.day === dayNumber);
    if (!dayData || dayData.rest) return null;
    const blockKey = `block${dayData.block}`;
    return data[blockKey]?.[dayData.type]?.name || dayData.type;
  };

  return { getExercisesForDay, getWorkoutName };
};

/**
 * Returns the active program's schedule and exercise resolver.
 */
export const useActiveProgram = (activeProgram, customPrograms) => {
  return useMemo(() => {
    const programId = activeProgram || 'jeff_nippard_lpp';

    // Default Jeff Nippard LPP program
    if (programId === 'jeff_nippard_lpp') {
      const schedule = getDefaultSchedule();
      const { getExercisesForDay, getWorkoutName } = createBuiltInResolvers(schedule, workoutData);
      return {
        schedule,
        getExercisesForDay,
        getWorkoutName,
        programName: "Jeff Nippard's Legs-Push-Pull",
        isCustom: false,
        totalWeeks: 16
      };
    }

    // Jeff Nippard Full Body program
    if (programId === 'jeff_nippard_fullbody') {
      const { getExercisesForDay, getWorkoutName } = createBuiltInResolvers(fullBodySchedule, fullBodyData);
      return {
        schedule: fullBodySchedule,
        getExercisesForDay,
        getWorkoutName,
        programName: "Jeff Nippard's Full Body",
        isCustom: false,
        totalWeeks: 12
      };
    }

    // Hyrox Preparation program
    if (programId === 'hyrox_prep') {
      const { getExercisesForDay, getWorkoutName } = createBuiltInResolvers(hyroxSchedule, hyroxData);
      return {
        schedule: hyroxSchedule,
        getExercisesForDay,
        getWorkoutName,
        programName: "Hyrox Race Prep",
        isCustom: false,
        totalWeeks: 10
      };
    }

    // Custom program
    const program = (customPrograms || []).find(p => p.id === programId);
    if (!program) {
      // Fallback to default if custom program not found
      const schedule = getDefaultSchedule();
      const { getExercisesForDay, getWorkoutName } = createBuiltInResolvers(schedule, workoutData);
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
