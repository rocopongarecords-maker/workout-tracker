// Push/Pull/Legs 3-Day — 10 weeks, 3 days/week
// Block 1 (wk 1-5): Volume
// Block 2 (wk 6-10): Intensity

export const ppl3DayData = {
  // =========================================================================
  // BLOCK 1 — Volume (Weeks 1-5)
  // Focus: Higher reps, moderate weight, build work capacity
  // =========================================================================
  block1: {
    push: {
      name: "Push",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Dumbbell Seated Shoulder Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Cable Flye", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Rope Overhead Triceps Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Triceps Pushdown", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull: {
      name: "Pull",
      exercises: [
        { name: "Barbell Row", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Pull-Up", sets: 3, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Cable Seated Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Barbell Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Hammer Curl", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    legs: {
      name: "Legs",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Romanian Deadlift", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Leg Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Leg Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 4, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 2 — Intensity (Weeks 6-10)
  // Focus: Heavier compounds, lower reps, strength focus
  // =========================================================================
  block2: {
    push: {
      name: "Push",
      exercises: [
        { name: "Barbell Bench Press", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Overhead Press", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Cable Flye", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Close-Grip Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Triceps Pushdown", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull: {
      name: "Pull",
      exercises: [
        { name: "Barbell Row", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Weighted Pull-Up", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Cable Seated Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Barbell Curl", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Hammer Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    legs: {
      name: "Legs",
      exercises: [
        { name: "Back Squat", sets: 5, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Romanian Deadlift", sets: 4, reps: "6-8", type: "primary", restTime: "3 min" },
        { name: "Leg Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Leg Extension", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 4, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  }
};
