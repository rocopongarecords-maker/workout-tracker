// Hyrox Preparation Schedule — 10 weeks, 70 days
// 4 training days per week + 3 rest days
// Block 1 (wk 1-4): Base building
// Block 2 (wk 5-8): Race-specific intensity
// Block 3 (wk 9-10): Peaking & taper
//
// Weekly pattern:
//   Day 1: Strength & Stations
//   Day 2: Rest
//   Day 3: Endurance & Conditioning
//   Day 4: Rest
//   Day 5: Station Practice
//   Day 6: Intervals
//   Day 7: Rest

export const hyroxSchedule = [
  // ===== BLOCK 1 — Base Building =====

  // Week 1
  { day: 1, week: 1, block: 1, type: 'hyrox_strength', rest: false },
  { day: 2, week: 1, block: 1, type: 'rest', rest: true },
  { day: 3, week: 1, block: 1, type: 'hyrox_endurance', rest: false },
  { day: 4, week: 1, block: 1, type: 'rest', rest: true },
  { day: 5, week: 1, block: 1, type: 'hyrox_stations', rest: false },
  { day: 6, week: 1, block: 1, type: 'hyrox_intervals', rest: false },
  { day: 7, week: 1, block: 1, type: 'rest', rest: true },

  // Week 2
  { day: 8, week: 2, block: 1, type: 'hyrox_strength', rest: false },
  { day: 9, week: 2, block: 1, type: 'rest', rest: true },
  { day: 10, week: 2, block: 1, type: 'hyrox_endurance', rest: false },
  { day: 11, week: 2, block: 1, type: 'rest', rest: true },
  { day: 12, week: 2, block: 1, type: 'hyrox_stations', rest: false },
  { day: 13, week: 2, block: 1, type: 'hyrox_intervals', rest: false },
  { day: 14, week: 2, block: 1, type: 'rest', rest: true },

  // Week 3
  { day: 15, week: 3, block: 1, type: 'hyrox_strength', rest: false },
  { day: 16, week: 3, block: 1, type: 'rest', rest: true },
  { day: 17, week: 3, block: 1, type: 'hyrox_endurance', rest: false },
  { day: 18, week: 3, block: 1, type: 'rest', rest: true },
  { day: 19, week: 3, block: 1, type: 'hyrox_stations', rest: false },
  { day: 20, week: 3, block: 1, type: 'hyrox_intervals', rest: false },
  { day: 21, week: 3, block: 1, type: 'rest', rest: true },

  // Week 4
  { day: 22, week: 4, block: 1, type: 'hyrox_strength', rest: false },
  { day: 23, week: 4, block: 1, type: 'rest', rest: true },
  { day: 24, week: 4, block: 1, type: 'hyrox_endurance', rest: false },
  { day: 25, week: 4, block: 1, type: 'rest', rest: true },
  { day: 26, week: 4, block: 1, type: 'hyrox_stations', rest: false },
  { day: 27, week: 4, block: 1, type: 'hyrox_intervals', rest: false },
  { day: 28, week: 4, block: 1, type: 'rest', rest: true },

  // ===== BLOCK 2 — Race-Specific Intensity =====

  // Week 5
  { day: 29, week: 5, block: 2, type: 'hyrox_strength', rest: false },
  { day: 30, week: 5, block: 2, type: 'rest', rest: true },
  { day: 31, week: 5, block: 2, type: 'hyrox_endurance', rest: false },
  { day: 32, week: 5, block: 2, type: 'rest', rest: true },
  { day: 33, week: 5, block: 2, type: 'hyrox_stations', rest: false },
  { day: 34, week: 5, block: 2, type: 'hyrox_intervals', rest: false },
  { day: 35, week: 5, block: 2, type: 'rest', rest: true },

  // Week 6
  { day: 36, week: 6, block: 2, type: 'hyrox_strength', rest: false },
  { day: 37, week: 6, block: 2, type: 'rest', rest: true },
  { day: 38, week: 6, block: 2, type: 'hyrox_endurance', rest: false },
  { day: 39, week: 6, block: 2, type: 'rest', rest: true },
  { day: 40, week: 6, block: 2, type: 'hyrox_stations', rest: false },
  { day: 41, week: 6, block: 2, type: 'hyrox_intervals', rest: false },
  { day: 42, week: 6, block: 2, type: 'rest', rest: true },

  // Week 7
  { day: 43, week: 7, block: 2, type: 'hyrox_strength', rest: false },
  { day: 44, week: 7, block: 2, type: 'rest', rest: true },
  { day: 45, week: 7, block: 2, type: 'hyrox_endurance', rest: false },
  { day: 46, week: 7, block: 2, type: 'rest', rest: true },
  { day: 47, week: 7, block: 2, type: 'hyrox_stations', rest: false },
  { day: 48, week: 7, block: 2, type: 'hyrox_intervals', rest: false },
  { day: 49, week: 7, block: 2, type: 'rest', rest: true },

  // Week 8
  { day: 50, week: 8, block: 2, type: 'hyrox_strength', rest: false },
  { day: 51, week: 8, block: 2, type: 'rest', rest: true },
  { day: 52, week: 8, block: 2, type: 'hyrox_endurance', rest: false },
  { day: 53, week: 8, block: 2, type: 'rest', rest: true },
  { day: 54, week: 8, block: 2, type: 'hyrox_stations', rest: false },
  { day: 55, week: 8, block: 2, type: 'hyrox_intervals', rest: false },
  { day: 56, week: 8, block: 2, type: 'rest', rest: true },

  // ===== BLOCK 3 — Peaking & Taper =====

  // Week 9
  { day: 57, week: 9, block: 3, type: 'hyrox_strength', rest: false },
  { day: 58, week: 9, block: 3, type: 'rest', rest: true },
  { day: 59, week: 9, block: 3, type: 'hyrox_endurance', rest: false },
  { day: 60, week: 9, block: 3, type: 'rest', rest: true },
  { day: 61, week: 9, block: 3, type: 'hyrox_stations', rest: false },
  { day: 62, week: 9, block: 3, type: 'hyrox_intervals', rest: false },
  { day: 63, week: 9, block: 3, type: 'rest', rest: true },

  // Week 10
  { day: 64, week: 10, block: 3, type: 'hyrox_strength', rest: false },
  { day: 65, week: 10, block: 3, type: 'rest', rest: true },
  { day: 66, week: 10, block: 3, type: 'hyrox_endurance', rest: false },
  { day: 67, week: 10, block: 3, type: 'rest', rest: true },
  { day: 68, week: 10, block: 3, type: 'hyrox_stations', rest: false },
  { day: 69, week: 10, block: 3, type: 'hyrox_intervals', rest: false },
  { day: 70, week: 10, block: 3, type: 'rest', rest: true }
];
