# Workout Tracker PWA - Phased Improvement Plan

**Date:** 2025-02-12
**Scope:** Jeff Nippard's 16-week Legs-Push-Pull program tracker
**Current State:** Block 1 (weeks 1-8) fully functional. Several known gaps and improvement opportunities.
**Vision:** Full-stack webapp with Supabase backend, user accounts, hosted on Vercel — ready for public launch.

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

## Phase 6 — Supabase Backend & Database

> **Goal:** Replace localStorage with a real database. Data persists across devices, survives browser clears, and enables multi-user support.

### 6.1 Supabase project setup
- Create Supabase project (free tier is sufficient to start)
- Add `@supabase/supabase-js` dependency
- Create `src/lib/supabase.js` client with environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Add `.env.local` to `.gitignore` (never commit keys)

### 6.2 Database schema design
- Migrate the localStorage structure to relational tables:

```sql
-- Users (managed by Supabase Auth, extended with profile)
create table profiles (
  id uuid references auth.users primary key,
  display_name text,
  created_at timestamptz default now(),
  start_date date
);

-- Completed workouts
create table completed_workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  day_number int not null,
  workout_type text not null,       -- 'legs1', 'push2', etc.
  block int not null,               -- 1 or 2
  completed_at timestamptz default now(),
  unique(user_id, day_number)
);

-- Individual exercise sets (the actual tracked data)
create table exercise_sets (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references completed_workouts(id) on delete cascade,
  exercise_name text not null,
  set_number int not null,
  weight numeric,                   -- in kg
  reps int,
  rest_time int,                    -- seconds
  completed boolean default false,
  created_at timestamptz default now()
);
```

### 6.3 Row-Level Security (RLS)
- Enable RLS on all tables
- Policy: users can only read/write their own data
- `profiles`: users can read/update their own profile
- `completed_workouts`: users can CRUD their own workouts
- `exercise_sets`: users can CRUD sets belonging to their own workouts

### 6.4 Data access layer
- Create `src/lib/database.js` with functions:
  - `fetchCompletedWorkouts(userId)` — replaces reading `data.completedWorkouts`
  - `fetchWorkoutHistory(userId, dayNumber)` — replaces `data.workoutHistory[day]`
  - `saveWorkout(userId, dayNumber, workoutData)` — inserts workout + sets
  - `markComplete(userId, dayNumber)` — inserts into `completed_workouts`
  - `fetchPreviousWorkoutForType(userId, workoutType)` — replaces `getLastCompletedWorkoutForType`
- These replace the localStorage calls in `useWorkoutStorage`

### 6.5 Refactor `useWorkoutStorage` hook
- New version reads/writes from Supabase instead of localStorage
- Add loading states (`isLoading`, `isSaving`)
- Add error handling with user-facing error messages
- **Offline fallback:** Keep localStorage as a write-ahead cache. When offline, save to localStorage. When back online, sync to Supabase. This preserves PWA functionality

### 6.6 Data migration utility
- One-time migration for existing users: read localStorage data and bulk-insert into Supabase
- Show migration prompt on first login if localStorage has data
- After successful migration, clear localStorage flag (keep backup)

---

## Phase 7 — Authentication & User Accounts

> **Goal:** Users can sign up, log in, and access their workout data from any device.

### 7.1 Supabase Auth setup
- Enable email/password auth in Supabase dashboard
- Enable Google OAuth provider (most gym-goers have Google accounts)
- Optional: Apple Sign-In for iOS PWA users
- Configure redirect URLs for the hosted domain

### 7.2 Auth UI components
- **`src/components/AuthScreen.jsx`** — Login/signup form
  - Email + password fields
  - "Sign in with Google" button
  - Toggle between login and sign-up modes
  - Password reset flow (Supabase handles the email)
- **`src/components/AuthGuard.jsx`** — Wrapper that checks auth state
  - If not logged in → show `AuthScreen`
  - If logged in → render the app
  - Handle loading state while checking session

### 7.3 Auth context/hook
- Create `src/hooks/useAuth.js`
  - `user` — current user object (null if logged out)
  - `loading` — true while checking initial session
  - `signIn(email, password)` / `signInWithGoogle()`
  - `signUp(email, password)`
  - `signOut()`
  - `resetPassword(email)`
- Subscribe to `onAuthStateChange` for session persistence

### 7.4 Update App routing
- **File:** `src/App.jsx`
- Add `'auth'` to the view states
- Wrap app in auth check: unauthenticated users see login, authenticated users see the app
- Pass `user.id` to all data-fetching hooks

### 7.5 User profile & settings screen
- **`src/components/SettingsScreen.jsx`**
  - Display name (editable)
  - Email (read-only, from Supabase Auth)
  - Program start date picker
  - Sign out button
  - Reset program (with confirmation)
  - Export data as JSON
- Add settings icon/link to Dashboard header

### 7.6 Session management
- Auto-refresh tokens (Supabase handles this)
- Remember session across browser restarts
- Handle expired sessions gracefully (redirect to login)

---

## Phase 8 — Production Hosting & Launch

> **Goal:** Deploy to production with a real domain, proper CI/CD, and everything needed for users to start using it.

### 8.1 Move from GitHub Pages to Vercel
- **Why Vercel over GH Pages:**
  - Environment variables support (needed for Supabase keys)
  - Automatic preview deployments per PR
  - Better SPA routing (no 404 hack needed)
  - Edge network for global performance
  - Free tier is generous
- Connect GitHub repo to Vercel
- Set build command: `npm run build`
- Set output directory: `dist`
- Remove `base: '/workout-tracker/'` from `vite.config.js` (Vercel serves from root `/`)
- Remove `gh-pages` dependency and deploy script

### 8.2 Environment variables
- Set in Vercel dashboard (not in code):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Create `.env.example` in repo with placeholder values for dev reference
- Update Supabase redirect URLs to point to Vercel domain

### 8.3 Custom domain
- Register a domain (e.g., `lpptracker.com` or similar)
- Configure DNS in Vercel
- Update Supabase allowed redirect URLs
- Update PWA manifest `start_url` and icon paths for new domain

### 8.4 Update PWA configuration
- **File:** `vite.config.js`
- Remove `/workout-tracker/` base path from all icon `src` paths
- Update `start_url` to `/`
- Verify service worker works with new hosting (Vercel serves proper headers)
- Test install-to-homescreen on iOS and Android

### 8.5 SEO & meta tags
- **File:** `index.html`
- Add proper `<title>`, `<meta description>`, Open Graph tags
- Add `og:image` (create a social share image)
- Add `robots.txt` and basic `sitemap.xml`

### 8.6 Landing page (optional but recommended)
- Simple hero section for non-authenticated users:
  - "Track Jeff Nippard's Legs-Push-Pull program"
  - Feature highlights (progress tracking, rest timers, 1RM calculation)
  - "Get Started" → sign up
- Can be the same `AuthScreen` but styled as a landing page

### 8.7 CI/CD pipeline
- Vercel auto-deploys on push to `main`
- Optional: add a GitHub Actions workflow for lint/test before merge
- Branch preview deployments for testing PRs

### 8.8 Error monitoring & analytics (lightweight)
- Add basic error boundary component to catch React crashes
- Optional: Supabase has built-in analytics in the dashboard (API calls, auth events)
- No heavy analytics SDK needed at launch — keep it simple

---

## Phase 9 — Launch Polish & Production Hardening

> **Goal:** Final touches before sharing the link with real users.

### 9.1 Loading states & skeleton UI
- Add loading spinners/skeletons while Supabase data loads
- Smooth transitions between auth states
- Empty states: "No workouts completed yet — start your first one!"

### 9.2 Offline mode with sync
- Full offline support: save workouts to localStorage when offline
- When back online, sync pending workouts to Supabase
- Show "Offline" indicator in the header
- Queue system: store pending operations and replay them on reconnect

### 9.3 Responsive design audit
- Test on iPhone SE (smallest common screen)
- Test on iPad (tablet layout)
- Test on desktop (max-width container already exists)
- Fix any overflow or touch-target issues

### 9.4 Performance optimization
- Lazy-load non-critical components (WorkoutDaySelector, SettingsScreen)
- Optimize Supabase queries (only fetch what's needed)
- Ensure service worker caches the app shell properly
- Target < 3s first meaningful paint on 3G

### 9.5 Legal & compliance
- Privacy policy page (what data is collected, Supabase stores it, etc.)
- Terms of service (basic)
- Cookie consent not needed if no tracking cookies (Supabase session uses localStorage)
- Credit Jeff Nippard's program appropriately (link to his content)

### 9.6 Launch checklist
- [ ] All 16 weeks of workouts functional
- [ ] Sign up, log in, log out all work
- [ ] Google OAuth works
- [ ] Data syncs across devices (phone + desktop)
- [ ] PWA installs on iOS and Android
- [ ] Offline mode works (save workout without internet)
- [ ] Password reset email sends correctly
- [ ] Custom domain with HTTPS
- [ ] No console errors in production
- [ ] Lighthouse PWA score > 90
- [ ] Tested with real workout data (do a workout end-to-end)

---

## Implementation Priority

| Phase | Effort | Impact | Priority |
|-------|--------|--------|----------|
| Phase 1 | Low | Critical | **Do first** — app can't track full program without it |
| Phase 2 | Low | Medium | **Do second** — clean foundation before adding features |
| Phase 3 | Medium | High | **Do third** — makes the app pleasant to use daily |
| Phase 4 | Medium | High | Do fourth — adds real value for tracking progress |
| Phase 5 | High | Medium | Do fifth — smart features that differentiate the app |
| Phase 6 | High | Critical | **Do sixth** — Supabase backend, required before auth |
| Phase 7 | High | Critical | **Do seventh** — auth and user accounts |
| Phase 8 | Medium | Critical | **Do eighth** — hosting, domain, go live |
| Phase 9 | Medium | High | **Do ninth** — polish and harden for real users |

---

## Tech Stack (Final)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite 5 | No TypeScript, plain JSX |
| Styling | Tailwind CSS 3.4 | Dark theme, slate palette |
| Icons | Lucide React | Already in use |
| Backend | Supabase (PostgreSQL) | Free tier, hosted |
| Auth | Supabase Auth | Email/password + Google OAuth |
| Hosting | Vercel | Free tier, auto-deploy from GitHub |
| PWA | vite-plugin-pwa (Workbox) | Offline-first, installable |
| Domain | Custom (TBD) | Registered separately |

---

## Notes

- Plain JavaScript (JSX) throughout — no TypeScript migration planned
- Supabase free tier: 500MB database, 50k monthly active users, 5GB bandwidth — more than enough
- Vercel free tier: 100GB bandwidth, automatic HTTPS, unlimited deploys
- Keep localStorage as offline fallback even after Supabase migration (PWA must work without internet)
- Test on mobile after every phase — this is a gym app, used on phones
- Preserve backward compatibility: existing localStorage users get migration path to Supabase
