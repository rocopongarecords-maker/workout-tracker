// Beginner Strength — 8 weeks, 3 days/week
// Block 1 (wk 1-4): Learning Phase
// Block 2 (wk 5-8): Strength Phase

export const beginnerStrengthData = {
  // =========================================================================
  // BLOCK 1 — Learning Phase (Weeks 1-4)
  // Focus: Master compound movements, build base strength
  // =========================================================================
  block1: {
    strength_a: {
      name: "Strength A",
      exercises: [
        { name: "Back Squat", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Barbell Bench Press", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Barbell Row", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Dumbbell Lateral Raise", sets: 2, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Plank", sets: 3, reps: "30 sec", type: "isolation", restTime: "1 min" }
      ]
    },
    strength_b: {
      name: "Strength B",
      exercises: [
        { name: "Back Squat", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Overhead Press", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Deadlift", sets: 3, reps: "8", type: "primary", restTime: "3-4 min" },
        { name: "Lat Pulldown", sets: 2, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    strength_c: {
      name: "Strength C",
      exercises: [
        { name: "Back Squat", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Cable Seated Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Barbell Curl", sets: 2, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Rope Overhead Triceps Extension", sets: 2, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 2 — Strength Phase (Weeks 5-8)
  // Focus: Progressive overload, heavier compounds
  // =========================================================================
  block2: {
    strength_a: {
      name: "Strength A",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Bench Press", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Row", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Plank", sets: 3, reps: "45 sec", type: "isolation", restTime: "1 min" }
      ]
    },
    strength_b: {
      name: "Strength B",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Overhead Press", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Deadlift", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Lat Pulldown", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    strength_c: {
      name: "Strength C",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Cable Seated Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Barbell Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Rope Overhead Triceps Extension", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    }
  }
};
