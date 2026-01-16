export const workoutData = {
  block1: {
    legs1: {
      name: "Legs #1",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Deadlift", sets: 2, reps: "8", type: "primary", restTime: "3-4 min" },
        { name: "Barbell Hip Thrust", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Dumbbell Walking Lunge", sets: 2, reps: "20", type: "secondary", restTime: "2-3 min" },
        { name: "Leg Extension", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 3, reps: "10", type: "isolation", restTime: "1-2 min" }
      ]
    },
    legs2: {
      name: "Legs #2",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "4", type: "primary", restTime: "3-4 min" },
        { name: "Front Squat", sets: 3, reps: "6-8", type: "primary", restTime: "3-4 min" },
        { name: "Cable Pull Through", sets: 3, reps: "20", type: "secondary", restTime: "2-3 min" },
        { name: "Single-Leg Leg Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Single-Leg Leg Extension", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Swiss Ball Single-Leg Leg Curl", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    push1: {
      name: "Push #1",
      exercises: [
        { name: "Barbell Bench Press", sets: 3, reps: "4", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Seated Shoulder Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Weighted Dip", sets: 3, reps: "6-10", type: "secondary", restTime: "2-3 min" },
        { name: "Low-to-High Cable Flye", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Isolateral Skull Crusher", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "6", type: "isolation", restTime: "1-2 min" }
      ]
    },
    push2: {
      name: "Push #2",
      exercises: [
        { name: "Close-Grip Bench Press", sets: 3, reps: "6", type: "primary", restTime: "3-4 min" },
        { name: "Military Press", sets: 3, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Pec Deck", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Cable Lateral Raise", sets: 3, reps: "8", type: "isolation", restTime: "1-2 min" },
        { name: "Cable Triceps Kickback", sets: 3, reps: "20", type: "isolation", restTime: "1-2 min" },
        { name: "Bicycle Crunch", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull1: {
      name: "Pull #1",
      exercises: [
        { name: "1-Arm Lat Pull-In", sets: 2, reps: "15-20", type: "isolation", restTime: "1-2 min" },
        { name: "Pull-Up", sets: 4, reps: "6-8", type: "primary", restTime: "3-4 min" },
        { name: "Pendlay Row", sets: 3, reps: "8-10", type: "primary", restTime: "3-4 min" },
        { name: "Machine High Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Seated Face Pull", sets: 3, reps: "20", type: "isolation", restTime: "1-2 min" },
        { name: "Reverse-Grip EZ-Bar Curl (A1)", sets: 3, reps: "20", type: "isolation", restTime: "1-2 min", superset: true },
        { name: "Supinated EZ-Bar Curl (A2)", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min", superset: true },
        { name: "Dumbbell Preacher Curl", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull2: {
      name: "Pull #2",
      exercises: [
        { name: "Neutral-Grip Pulldown", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Cable Seated Elbows-Out Row (A1)", sets: 3, reps: "10", type: "secondary", restTime: "2-3 min", superset: true },
        { name: "Cable Seated Row (A2)", sets: 3, reps: "10", type: "secondary", restTime: "2-3 min", superset: true },
        { name: "Kneeling Straight-Arm Cable Pull-Over", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Snatch-Grip Barbell Shrug", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Cable Reverse Flye", sets: 3, reps: "20", type: "isolation", restTime: "1-2 min" },
        { name: "Single-Arm Cable Curl", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Hammer Curl", sets: 3, reps: "8", type: "isolation", restTime: "1-2 min" }
      ]
    }
  },
  block2: {
    legs1: {
      name: "Legs #1",
      exercises: [
        { name: "Tempo Back Squat", sets: 4, reps: "6", type: "primary", restTime: "3-4 min" },
        { name: "Romanian Deadlift", sets: 3, reps: "8", type: "primary", restTime: "3-4 min" },
        { name: "Pause Barbell Hip Thrust", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Reverse Lunge", sets: 3, reps: "10", type: "secondary", restTime: "2-3 min" },
        { name: "Enhanced-Eccentric Leg Extension", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Lying Leg Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    legs2: {
      name: "Legs #2",
      exercises: [
        { name: "Deadlift", sets: 3, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Front Squat", sets: 3, reps: "6", type: "primary", restTime: "3-4 min" },
        { name: "Round-Back 45° Hyperextension", sets: 3, reps: "12-15", type: "secondary", restTime: "2-3 min" },
        { name: "Single-Leg Leg Press", sets: 3, reps: "12", type: "secondary", restTime: "2-3 min" },
        { name: "Single-Leg Leg Extension", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Seated Leg Curl", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Standing Calf Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    push1: {
      name: "Push #1",
      exercises: [
        { name: "Pause Barbell Bench Press", sets: 4, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Standing Dumbbell Shoulder Press", sets: 3, reps: "8", type: "secondary", restTime: "2-3 min" },
        { name: "Weighted Dip", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Cable Flye", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Barbell Floor Skull Crusher", sets: 3, reps: "8-10", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "8", type: "isolation", restTime: "1-2 min" }
      ]
    },
    push2: {
      name: "Push #2",
      exercises: [
        { name: "Close-Grip Bench Press", sets: 3, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Military Press", sets: 3, reps: "5", type: "primary", restTime: "3-4 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Pec Deck", sets: 3, reps: "12", type: "isolation", restTime: "1-2 min" },
        { name: "Egyptian Lateral Raise", sets: 3, reps: "10", type: "isolation", restTime: "1-2 min" },
        { name: "Rope Overhead Triceps Extension", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Hanging Leg Raise", sets: 3, reps: "10-15", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull1: {
      name: "Pull #1",
      exercises: [
        { name: "Supinated Pulldown", sets: 4, reps: "8-10", type: "primary", restTime: "3-4 min" },
        { name: "Chest-Supported T-Bar Row", sets: 4, reps: "8", type: "primary", restTime: "3-4 min" },
        { name: "Seal Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2-3 min" },
        { name: "Machine High Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Seated Face Pull", sets: 3, reps: "15-20", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell One-Arm Row", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Dumbbell Supinated Curl", sets: 3, reps: "10-12", type: "isolation", restTime: "1-2 min" }
      ]
    },
    pull2: {
      name: "Pull #2",
      exercises: [
        { name: "Neutral-Grip Pull-Up", sets: 4, reps: "6-8", type: "primary", restTime: "3-4 min" },
        { name: "Kneeling Straight-Arm Cable Pull-Over", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" },
        { name: "Single-Arm Pulldown", sets: 3, reps: "10-12", type: "secondary", restTime: "2-3 min" },
        { name: "Low-to-High Reverse Flye", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", type: "isolation", restTime: "1-2 min" },
        { name: "Dumbbell Hammer Curl", sets: 3, reps: "10", type: "isolation", restTime: "1-2 min" },
        { name: "High Cable Curl", sets: 3, reps: "12-15", type: "isolation", restTime: "1-2 min" }
      ]
    }
  }
};