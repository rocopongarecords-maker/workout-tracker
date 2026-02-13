/**
 * Convert a custom program into a linear schedule array
 * compatible with the format in schedule.js.
 *
 * @param {Object} program - Custom program from ProgramBuilder
 * @returns {Array} schedule entries
 */
export const generateScheduleFromProgram = (program) => {
  const schedule = [];
  let dayCounter = 1;

  for (let week = 1; week <= program.weeks; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const workoutDay = program.workoutDays.find(d => d.dayOfWeek === dow);
      if (workoutDay) {
        schedule.push({
          day: dayCounter,
          type: workoutDay.name,
          block: null,
          rest: false,
          week,
          programId: program.id,
          exercises: workoutDay.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            type: ex.type || 'isolation',
            restTime: ex.restTime || '1-2 min',
            category: ex.type === 'primary' ? 'primary' : 'isolation'
          }))
        });
      } else {
        schedule.push({
          day: dayCounter,
          type: 'rest',
          block: null,
          rest: true,
          week,
          programId: program.id,
          exercises: null
        });
      }
      dayCounter++;
    }
  }

  return schedule;
};
