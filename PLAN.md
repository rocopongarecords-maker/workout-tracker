# Workout Tracker PWA - Phased Improvement Plan

**Date:** 2025-02-12
**Scope:** Jeff Nippard's 16-week Legs-Push-Pull program tracker
**Current State:** Block 1 (weeks 1-8) fully functional. Several known gaps and improvement opportunities.

---

## Phase 1 — Complete the 16-Week Program (Data & Schedule)

> **Goal:** Make the app support the full 16-week program as designed.

### 1.1 Add Block 2 schedule (weeks 9-16)
- **File:** `src/data/schedule.js`
- Add days 57-112 for Block 2, weeks 9-16
- Same structure: 6 workout days + 1 rest day per week, using `block: 2`
- Block 2 exercises already exist in `workoutData.js` — no changes needed there

### 1.2 Fix `useProgressTracking` total calculations
- **File:** `src/hooks/useProgressTracking.js`
- Currently counts only 48 workout days (Block 1). After adding Block 2 schedule, it will automatically count 96 — verify this works correctly
- Ensure `currentWeek` properly advances into weeks 9-16

### 1.3 Fix `getPreviousWorkout` data access bug
- **File:** `src/utils/getPreviousWorkout.js`
- Line 8: `exercise.sets` should be `exercise.userSets` — the saved data uses `userSets`, not `sets`
- This function is exported but may be unused (only `getLastCompletedWorkoutForType` is imported in `WorkoutScreen`). Verify and fix or remove

---

## Phase 2 — Code Cleanup & Technical Debt

> **Goal:** Remove dead code and unused files to keep the codebase clean.

### 2.1 Remove unused CSS files
- **Files:** `src/App.css`, `src/index.css`
- These are Vite boilerplate, never imported. The app uses `src/styles/globals.css` exclusively
- Verify no imports reference them before deleting

### 2.2 Integrate `ProgressIndicator` or remove it
- **File:** `src/components/ProgressIndicator.jsx`
- Option A: Use it in `Dashboard.jsx` to replace the current progress grid (recommended — it's a nice circular SVG indicator)
- Option B: Delete it if the current grid layout is preferred
- Decision: Integrate into Dashboard as it provides a more visual progress representation

### 2.3 Remove `isDeload` references
- **Files:** `src/hooks/useProgressTracking.js`, `src/App.jsx`, `src/components/WorkoutDaySelector.jsx`
- Schedule never defines `isDeload` on any day, so all `day.isDeload` checks are dead code
- Remove deload legend item from `WorkoutDaySelector`
- If deload weeks should be supported in the future, add them as a separate Phase

---

## Phase 3 — UX Improvements

> **Goal:** Fix usability issues and improve the workout experience.

### 3.1 Auto-fill weights from previous workout
- **File:** `src/components/ExerciseCard.jsx`
- When `previousWorkout` data exists, pre-select the weight/reps dropdowns with the last used values instead of showing "Select"
- Users can still change values, but this saves time on every set

### 3.2 Superset visual grouping
- **Files:** `src/components/WorkoutScreen.jsx`, `src/components/ExerciseCard.jsx`
- Exercises with `superset: true` should be visually grouped (shared border, "Superset" label)
- Affects Pull #1 and Pull #2 in Block 1 which have A1/A2 pairings

### 3.3 Show rest time recommendation based on exercise type
- **File:** `src/components/ExerciseCard.jsx`
- Exercise data already has `restTime` (e.g., "3-4 min", "1-2 min")
- Display a visual cue on the timer when the user is within or past the recommended range
- Timer color changes: normal -> green (in range) -> yellow (past recommended)

### 3.4 Improve "Save & Next" button label clarity
- **File:** `src/components/ExerciseCard.jsx`
- Rename to "Save Set" (it saves the current set, not the exercise)
- Auto-scroll behavior already works correctly

### 3.5 Fix WorkoutScreen progress bar calculation
- **File:** `src/components/WorkoutScreen.jsx`
- Line 103: `ex.sets.length` tries to get length of a number (e.g., `4`), which is `undefined`
- Should use `Number(ex.sets)` or the `setsCount` approach used in `ExerciseCard`

---

## Phase 4 — New Features

> **Goal:** Add features that enhance long-term tracking and program value.

### 4.1 Workout history / review screen
- Show completed workouts with date, exercises, and weights used
- Accessible from Dashboard or WorkoutDaySelector (tap a completed day)
- Read-only view of saved `workoutHistory` data

### 4.2 Data export/import
- Export `localStorage` data as JSON file (download)
- Import JSON to restore data
- Prevents data loss if user clears browser data

### 4.3 Reset program functionality
- Add a "Reset Program" button in settings/dashboard
- Uses the existing `resetData()` function from `useWorkoutStorage`
- Requires confirmation dialog to prevent accidental resets

### 4.4 Volume tracking per muscle group
- Calculate total volume (sets x reps x weight) per workout type
- Show trends: "You lifted 5% more volume on Push #1 this week vs last week"
- Leverage existing `workoutHistory` data

---

## Phase 5 — Progressive Overload & Intelligence

> **Goal:** Make the app smarter about progression.

### 5.1 Progressive overload suggestions
- Based on previous workout data, suggest weight increases
- Simple rule: if user hit all target reps last time, suggest +2.5kg for compounds, +1kg for isolation
- Show as a subtle suggestion next to the weight dropdown

### 5.2 1RM tracking over time
- Track estimated 1RM for compound lifts across weeks
- Show a simple line chart of 1RM progression for key lifts (Squat, Bench, Deadlift)
- Uses the existing `calculate1RM` utility

### 5.3 Block transition summary
- When completing Block 1 (day 56), show a summary screen:
  - Strength gains (1RM changes)
  - Volume progression
  - Consistency stats
- Motivational bridge into Block 2

---

## Implementation Priority

| Phase | Effort | Impact | Priority |
|-------|--------|--------|----------|
| Phase 1 | Low | Critical | **Do first** |
| Phase 2 | Low | Medium | **Do second** |
| Phase 3 | Medium | High | **Do third** |
| Phase 4 | Medium | High | Do fourth |
| Phase 5 | High | Medium | Do last |

---

## Notes

- All changes should maintain the existing stack: React 18, Vite 5, Tailwind CSS, no TypeScript
- No new dependencies unless strictly necessary
- Test on mobile (PWA) after each phase — this is primarily a phone-based app
- Preserve backward compatibility with existing `localStorage` data
