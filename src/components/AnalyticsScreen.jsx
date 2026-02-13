import { useMemo } from 'react';
import { calculate1RM } from '../utils/calculate1RM';
import { calculateWorkoutVolume } from '../utils/calculateVolume';
import SimpleLineChart from './charts/SimpleLineChart';
import SimpleBarChart from './charts/SimpleBarChart';

const TRACKED_LIFTS = [
  { name: 'Back Squat', color: '#ef4444' },
  { name: 'Barbell Bench Press', color: '#3b82f6' },
  { name: 'Deadlift', color: '#22c55e' },
  { name: 'Military Press', color: '#a855f7' }
];

const AnalyticsScreen = ({ workoutHistory, completedWorkouts, onBack, schedule }) => {
  // ── 1RM Trends ──
  const rmTrends = useMemo(() => {
    const trends = {};
    TRACKED_LIFTS.forEach(lift => { trends[lift.name] = []; });

    const sortedDays = [...completedWorkouts].sort((a, b) => a - b);

    for (const day of sortedDays) {
      const workout = workoutHistory[day];
      if (!workout?.exercises) continue;

      for (const ex of workout.exercises) {
        if (!trends[ex.name]) continue;
        const bestSet = (ex.userSets || [])
          .filter(s => s.completed)
          .reduce((best, set) => {
            const rm = calculate1RM(set.weight, set.reps);
            const bestRm = best ? calculate1RM(best.weight, best.reps) : 0;
            return rm > bestRm ? set : best;
          }, null);

        if (bestSet) {
          const rm = calculate1RM(bestSet.weight, bestSet.reps);
          if (rm > 0) {
            trends[ex.name].push({
              value: rm,
              label: `D${day}`,
              day
            });
          }
        }
      }
    }

    return trends;
  }, [workoutHistory, completedWorkouts]);

  // ── Weekly Volume ──
  const weeklyVolume = useMemo(() => {
    const volumeByWeek = {};

    for (const day of completedWorkouts) {
      const workout = workoutHistory[day];
      if (!workout?.exercises) continue;

      const scheduleDay = schedule.find(s => s.day === day);
      const week = scheduleDay?.week || 0;
      if (!week) continue;

      const vol = calculateWorkoutVolume(workout.exercises);
      volumeByWeek[week] = (volumeByWeek[week] || 0) + vol;
    }

    const weeks = Object.keys(volumeByWeek).sort((a, b) => a - b);
    return weeks.map(w => ({
      value: volumeByWeek[w],
      label: `W${w}`,
      color: Number(w) <= 8 ? '#3b82f6' : '#a855f7'
    }));
  }, [workoutHistory, completedWorkouts]);

  // ── Consistency ──
  const consistency = useMemo(() => {
    const sorted = [...completedWorkouts].sort((a, b) => a - b);

    let currentStreak = sorted.length > 0 ? 1 : 0;
    let maxStreak = currentStreak;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    }

    // Perfect weeks
    const weekCounts = {};
    for (const day of completedWorkouts) {
      const s = schedule.find(d => d.day === day);
      if (s && !s.rest) {
        weekCounts[s.week] = (weekCounts[s.week] || 0) + 1;
      }
    }
    const perfectWeeks = Object.values(weekCounts).filter(c => c >= 6).length;

    return {
      currentStreak: sorted.length > 0 ? (() => {
        // Current streak from the latest completed day going backwards
        let streak = 1;
        for (let i = sorted.length - 1; i > 0; i--) {
          if (sorted[i] === sorted[i - 1] + 1) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      })() : 0,
      longestStreak: maxStreak,
      perfectWeeks,
      totalWorkouts: completedWorkouts.length
    };
  }, [completedWorkouts]);

  const activeLift = TRACKED_LIFTS.find(l => rmTrends[l.name].length >= 2) || TRACKED_LIFTS[0];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-slate-400 text-sm">Track your progress over time</p>
      </div>

      {/* Consistency Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{consistency.currentStreak}</div>
          <div className="text-xs text-slate-400 mt-1">Current Streak</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{consistency.longestStreak}</div>
          <div className="text-xs text-slate-400 mt-1">Longest Streak</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{consistency.perfectWeeks}</div>
          <div className="text-xs text-slate-400 mt-1">Perfect Weeks</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{consistency.totalWorkouts}</div>
          <div className="text-xs text-slate-400 mt-1">Total Workouts</div>
        </div>
      </div>

      {/* 1RM Trends */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Estimated 1RM Trends</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {TRACKED_LIFTS.map(lift => {
            const hasData = rmTrends[lift.name].length >= 2;
            return (
              <span
                key={lift.name}
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  hasData ? 'opacity-100' : 'opacity-40'
                }`}
                style={{ backgroundColor: `${lift.color}20`, color: lift.color }}
              >
                {lift.name.replace('Barbell ', '')}
                {hasData && ` ${rmTrends[lift.name][rmTrends[lift.name].length - 1].value}kg`}
              </span>
            );
          })}
        </div>

        {TRACKED_LIFTS.map(lift => {
          if (rmTrends[lift.name].length < 2) return null;
          return (
            <div key={lift.name} className="mb-4 last:mb-0">
              <SimpleLineChart
                data={rmTrends[lift.name]}
                color={lift.color}
                label={lift.name}
                height={140}
              />
            </div>
          );
        })}

        {TRACKED_LIFTS.every(l => rmTrends[l.name].length < 2) && (
          <div className="text-center text-slate-500 text-sm py-6">
            Complete more workouts to see 1RM trends
          </div>
        )}
      </div>

      {/* Weekly Volume */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Weekly Volume</h2>
        <div className="text-xs text-slate-500 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Block 1
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1 ml-3"></span> Block 2
        </div>
        <SimpleBarChart
          data={weeklyVolume}
          label="Total Volume (kg)"
          height={160}
        />
      </div>
    </div>
  );
};

export default AnalyticsScreen;
