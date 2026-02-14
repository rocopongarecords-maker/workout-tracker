// Hyrox Preparation Program — 10 weeks, 4 days/week
// Block 1 (wk 1-4): Base building — strength + station familiarity
// Block 2 (wk 5-8): Race-specific intensity — heavier stations + intervals
// Block 3 (wk 9-10): Peaking — simulation workouts + taper
//
// Hyrox race format: 8 x 1km run + 8 functional stations
// Stations: Ski Erg, Sled Push, Sled Pull, Burpee Broad Jump,
//           Rowing, Farmers Carry, Sandbag Lunge, Wall Ball

export const hyroxData = {
  // =========================================================================
  // BLOCK 1 — Base Building (Weeks 1-4)
  // Focus: Build strength foundation, learn station movements, aerobic base
  // =========================================================================
  block1: {
    hyrox_strength: {
      name: "Strength & Stations",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "8-10", type: "primary", restTime: "2-3 min" },
        { name: "Romanian Deadlift", sets: 3, reps: "10-12", type: "primary", restTime: "2-3 min" },
        { name: "Barbell Bench Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Pull-Up", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Sled Push", sets: 3, reps: "20m", type: "station", restTime: "2 min", repType: "distance" },
        { name: "Wall Ball", sets: 3, reps: "15", type: "station", restTime: "90 sec" },
        { name: "Running", sets: 1, reps: "20 min", type: "conditioning", restTime: "0", repType: "duration" }
      ]
    },
    hyrox_endurance: {
      name: "Endurance & Conditioning",
      exercises: [
        { name: "Tempo Run", sets: 1, reps: "25 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Push-Up", sets: 3, reps: "15-20", type: "secondary", restTime: "60 sec" },
        { name: "Goblet Squat", sets: 3, reps: "15", type: "secondary", restTime: "60 sec" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", type: "isolation", restTime: "60 sec" },
        { name: "Burpee Broad Jump", sets: 3, reps: "8", type: "station", restTime: "90 sec" },
        { name: "Rowing Machine", sets: 1, reps: "10 min", type: "conditioning", restTime: "0", repType: "duration" }
      ]
    },
    hyrox_stations: {
      name: "Station Practice",
      exercises: [
        { name: "Ski Erg", sets: 3, reps: "2 min", type: "station", restTime: "90 sec", repType: "duration" },
        { name: "Sled Push", sets: 3, reps: "25m", type: "station", restTime: "90 sec", repType: "distance" },
        { name: "Sled Pull", sets: 3, reps: "25m", type: "station", restTime: "90 sec", repType: "distance" },
        { name: "Burpee Broad Jump", sets: 3, reps: "10", type: "station", restTime: "90 sec" },
        { name: "Rowing Machine", sets: 3, reps: "500m", type: "station", restTime: "90 sec", repType: "duration" },
        { name: "Farmers Carry", sets: 3, reps: "50m", type: "station", restTime: "90 sec", repType: "distance" },
        { name: "Sandbag Lunge", sets: 3, reps: "25m", type: "station", restTime: "90 sec" },
        { name: "Wall Ball", sets: 3, reps: "15", type: "station", restTime: "90 sec" }
      ]
    },
    hyrox_intervals: {
      name: "Intervals",
      exercises: [
        { name: "Interval Run", sets: 6, reps: "2 min", type: "primary", restTime: "90 sec", repType: "duration" },
        { name: "Wall Ball", sets: 3, reps: "12", type: "station", restTime: "60 sec" },
        { name: "Ski Erg", sets: 3, reps: "90 sec", type: "station", restTime: "60 sec", repType: "duration" },
        { name: "Dumbbell Walking Lunge", sets: 3, reps: "20", type: "secondary", restTime: "60 sec" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "10", type: "isolation", restTime: "60 sec" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 2 — Race-Specific Intensity (Weeks 5-8)
  // Focus: Heavier station loads, longer intervals, transition practice
  // =========================================================================
  block2: {
    hyrox_strength: {
      name: "Strength & Stations",
      exercises: [
        { name: "Back Squat", sets: 4, reps: "6-8", type: "primary", restTime: "2-3 min" },
        { name: "Deadlift", sets: 4, reps: "5-6", type: "primary", restTime: "3 min" },
        { name: "Dumbbell Incline Press", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Barbell Row", sets: 3, reps: "8-10", type: "secondary", restTime: "2 min" },
        { name: "Sled Push", sets: 4, reps: "25m", type: "station", restTime: "90 sec", repType: "distance" },
        { name: "Sled Pull", sets: 4, reps: "25m", type: "station", restTime: "90 sec", repType: "distance" },
        { name: "Farmers Carry", sets: 3, reps: "50m", type: "station", restTime: "90 sec", repType: "distance" }
      ]
    },
    hyrox_endurance: {
      name: "Endurance & Conditioning",
      exercises: [
        { name: "Tempo Run", sets: 1, reps: "30 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Sandbag Lunge", sets: 4, reps: "25m", type: "station", restTime: "60 sec" },
        { name: "Burpee Broad Jump", sets: 4, reps: "10", type: "station", restTime: "60 sec" },
        { name: "Push-Up", sets: 3, reps: "20", type: "secondary", restTime: "60 sec" },
        { name: "Bicycle Crunch", sets: 3, reps: "20", type: "isolation", restTime: "60 sec" },
        { name: "Rowing Machine", sets: 1, reps: "15 min", type: "conditioning", restTime: "0", repType: "duration" }
      ]
    },
    hyrox_stations: {
      name: "Station Practice",
      exercises: [
        { name: "Running", sets: 1, reps: "5 min", type: "warmup", restTime: "0", repType: "duration" },
        { name: "Ski Erg", sets: 4, reps: "3 min", type: "station", restTime: "60 sec", repType: "duration" },
        { name: "Sled Push", sets: 4, reps: "30m", type: "station", restTime: "60 sec", repType: "distance" },
        { name: "Sled Pull", sets: 4, reps: "30m", type: "station", restTime: "60 sec", repType: "distance" },
        { name: "Burpee Broad Jump", sets: 4, reps: "12", type: "station", restTime: "60 sec" },
        { name: "Rowing Machine", sets: 4, reps: "500m", type: "station", restTime: "60 sec", repType: "duration" },
        { name: "Farmers Carry", sets: 4, reps: "50m", type: "station", restTime: "60 sec", repType: "distance" },
        { name: "Sandbag Lunge", sets: 4, reps: "30m", type: "station", restTime: "60 sec" },
        { name: "Wall Ball", sets: 4, reps: "20", type: "station", restTime: "60 sec" }
      ]
    },
    hyrox_intervals: {
      name: "Intervals",
      exercises: [
        { name: "Interval Run", sets: 8, reps: "2 min", type: "primary", restTime: "60 sec", repType: "duration" },
        { name: "Ski Erg", sets: 4, reps: "2 min", type: "station", restTime: "45 sec", repType: "duration" },
        { name: "Wall Ball", sets: 4, reps: "15", type: "station", restTime: "45 sec" },
        { name: "Sled Push", sets: 3, reps: "25m", type: "station", restTime: "60 sec", repType: "distance" },
        { name: "Hanging Leg Raise", sets: 3, reps: "15", type: "isolation", restTime: "60 sec" }
      ]
    }
  },

  // =========================================================================
  // BLOCK 3 — Peaking & Taper (Weeks 9-10)
  // Focus: Race simulation, reduced volume, maintain intensity, freshness
  // =========================================================================
  block3: {
    hyrox_strength: {
      name: "Strength & Stations",
      exercises: [
        { name: "Back Squat", sets: 3, reps: "5", type: "primary", restTime: "3 min" },
        { name: "Romanian Deadlift", sets: 3, reps: "6-8", type: "primary", restTime: "2-3 min" },
        { name: "Barbell Bench Press", sets: 3, reps: "6-8", type: "secondary", restTime: "2 min" },
        { name: "Pull-Up", sets: 3, reps: "6-8", type: "secondary", restTime: "2 min" },
        { name: "Sled Push", sets: 2, reps: "25m", type: "station", restTime: "2 min", repType: "distance" },
        { name: "Farmers Carry", sets: 2, reps: "50m", type: "station", restTime: "2 min", repType: "distance" }
      ]
    },
    hyrox_endurance: {
      name: "Endurance & Conditioning",
      exercises: [
        { name: "Tempo Run", sets: 1, reps: "20 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Burpee Broad Jump", sets: 3, reps: "8", type: "station", restTime: "60 sec" },
        { name: "Wall Ball", sets: 3, reps: "12", type: "station", restTime: "60 sec" },
        { name: "Push-Up", sets: 2, reps: "15", type: "secondary", restTime: "60 sec" },
        { name: "Rowing Machine", sets: 1, reps: "10 min", type: "conditioning", restTime: "0", repType: "duration" }
      ]
    },
    hyrox_stations: {
      name: "Race Simulation",
      exercises: [
        { name: "Running", sets: 1, reps: "8 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Ski Erg", sets: 1, reps: "3 min", type: "station", restTime: "0", repType: "duration" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Sled Push", sets: 1, reps: "50m", type: "station", restTime: "0", repType: "distance" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Sled Pull", sets: 1, reps: "50m", type: "station", restTime: "0", repType: "distance" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Burpee Broad Jump", sets: 1, reps: "15", type: "station", restTime: "0" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Rowing Machine", sets: 1, reps: "1000m", type: "station", restTime: "0", repType: "duration" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Farmers Carry", sets: 1, reps: "100m", type: "station", restTime: "0", repType: "distance" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Sandbag Lunge", sets: 1, reps: "50m", type: "station", restTime: "0" },
        { name: "Running", sets: 1, reps: "5 min", type: "primary", restTime: "0", repType: "duration" },
        { name: "Wall Ball", sets: 1, reps: "30", type: "station", restTime: "0" }
      ]
    },
    hyrox_intervals: {
      name: "Intervals",
      exercises: [
        { name: "Interval Run", sets: 5, reps: "3 min", type: "primary", restTime: "90 sec", repType: "duration" },
        { name: "Ski Erg", sets: 3, reps: "2 min", type: "station", restTime: "60 sec", repType: "duration" },
        { name: "Wall Ball", sets: 3, reps: "10", type: "station", restTime: "60 sec" },
        { name: "Ab Wheel Rollout", sets: 2, reps: "10", type: "isolation", restTime: "60 sec" }
      ]
    }
  }
};
