// Upper/Lower Split — 10 weeks, 4 days/week
// Block 1 (wk 1-5): Hypertrophy
// Block 2 (wk 6-10): Strength

export const upperLowerData = {
  // =========================================================================
  // BLOCK 1 — Hypertrophy (Weeks 1-5)
  // =========================================================================
  block1: {
    upper_a: {
      name: "Upper A - Horizontal",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Barbell Row", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Cable Seated Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Rope Overhead Triceps Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Hammer Curl", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    lower_a: {
      name: "Lower A - Quad Focus",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Romanian Deadlift", sets: 3, reps: "10-12", type: "primary", restTime: "2-3 min" },
        { name: "Leg Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Leg Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 4, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    upper_b: {
      name: "Upper B - Vertical",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Pull-Up", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Dumbbell Flat Bench Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Triceps Pushdown", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Barbell Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    lower_b: {
      name: "Lower B - Hip Focus",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "6-8", type: "primary", restTime: "3-4 min" },
        { name: "Bulgarian Split Squat", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Barbell Hip Thrust", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Lying Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Walking Lunge", sets: 3, reps: "12", type: "secondary", restTime: "2 min" },
        { name: "Seated Calf Raise", sets: 4, reps: "15-20", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 2 — Strength (Weeks 6-10)
  // =========================================================================
  block2: {
    upper_a: {
      name: "Upper A - Horizontal",
      exercises: [
        { name: "Barbell Bench Press", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Row", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Cable Seated Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Close-Grip Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Hammer Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    lower_a: {
      name: "Lower A - Quad Focus",
      exercises: [
        { name: "Back Squat", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Romanian Deadlift", sets: 4, reps: "6-8", type: "primary", restTime: "3 min" },
        { name: "Leg Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Leg Extension", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 4, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    upper_b: {
      name: "Upper B - Vertical",
      exercises: [
        { name: "Overhead Press", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Weighted Pull-Up", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Flat Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Lat Pulldown", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Triceps Pushdown", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Barbell Curl", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" }
      ]
    },
    lower_b: {
      name: "Lower B - Hip Focus",
      exercises: [
        { name: "Deadlift", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Bulgarian Split Squat", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Barbell Hip Thrust", sets: 4, reps: "6-8", type: "secondary", restTime: "2-3 min" },
        { name: "Lying Leg Curl", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Walking Lunge", sets: 3, reps: "10", type: "secondary", restTime: "2 min" },
        { name: "Seated Calf Raise", sets: 4, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  }
};
