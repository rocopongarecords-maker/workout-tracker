// 5/3/1 Strength — 12 weeks, 4 days/week
// Block 1 (wk 1-4): "5s" Phase
// Block 2 (wk 5-8): "3s" Phase
// Block 3 (wk 9-12): "5/3/1" Phase
//
// Based on Wendler's 5/3/1 with Boring But Big (BBB) supplemental work

export const fiveThreeOneData = {
  // =========================================================================
  // BLOCK 1 — "5s" Phase (Weeks 1-4)
  // Focus: Sets of 5, moderate intensity, BBB at 50-60%
  // =========================================================================
  block1: {
    ohp_day: {
      name: "OHP Day",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Overhead Press (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "90 sec" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Triceps Pushdown", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    deadlift_day: {
      name: "Deadlift Day",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Deadlift (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "2 min" },
        { name: "Barbell Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    bench_day: {
      name: "Bench Day",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Barbell Bench Press (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "90 sec" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2 min" },
        { name: "Barbell Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    squat_day: {
      name: "Squat Day",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "5-6", type: "primary", restTime: "3-4 min" },
        { name: "Back Squat (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "2 min" },
        { name: "Leg Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 2 — "3s" Phase (Weeks 5-8)
  // Focus: Sets of 3, higher intensity, BBB at 60%
  // =========================================================================
  block2: {
    ohp_day: {
      name: "OHP Day",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "3-5", type: "primary", restTime: "3-4 min" },
        { name: "Overhead Press (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "90 sec" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Close-Grip Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    deadlift_day: {
      name: "Deadlift Day",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "3-5", type: "primary", restTime: "3-4 min" },
        { name: "Deadlift (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "2 min" },
        { name: "Pendlay Row", sets: 3, reps: "6-8", type: "secondary", restTime: "2-3 min" },
        { name: "Lying Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    bench_day: {
      name: "Bench Day",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "3-5", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Bench Press (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "90 sec" },
        { name: "Dumbbell Flat Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Hammer Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Cable Reverse Flye", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    squat_day: {
      name: "Squat Day",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "3-5", type: "primary", restTime: "3-4 min" },
        { name: "Back Squat (BBB)", sets: 5, reps: "10", type: "secondary", restTime: "2 min" },
        { name: "Leg Extension", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Calf Raise", sets: 3, reps: "15-20", type: "isolation", restTime: "1-2 min" },
        { name: "Bicycle Crunch", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 3 — "5/3/1" Phase (Weeks 9-12)
  // Focus: Peak intensity, heavy singles/triples, reduced BBB volume
  // =========================================================================
  block3: {
    ohp_day: {
      name: "OHP Day",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "1-5", type: "primary", restTime: "3-4 min" },
        { name: "Overhead Press (BBB)", sets: 5, reps: "8", type: "secondary", restTime: "90 sec" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Isolateral Skull Crusher", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15-20", type: "isolation", restTime: "1-2 min" }
      ]
    },
    deadlift_day: {
      name: "Deadlift Day",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "1-5", type: "primary", restTime: "4-5 min" },
        { name: "Deadlift (BBB)", sets: 5, reps: "8", type: "secondary", restTime: "2 min" },
        { name: "Barbell Row", sets: 4, reps: "6-8", type: "secondary", restTime: "2-3 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    bench_day: {
      name: "Bench Day",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "1-5", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Bench Press (BBB)", sets: 5, reps: "8", type: "secondary", restTime: "90 sec" },
        { name: "Incline Barbell Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Barbell Curl", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    squat_day: {
      name: "Squat Day",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "1-5", type: "primary", restTime: "4-5 min" },
        { name: "Back Squat (BBB)", sets: 5, reps: "8", type: "secondary", restTime: "2 min" },
        { name: "Leg Extension", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 4, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  }
};
