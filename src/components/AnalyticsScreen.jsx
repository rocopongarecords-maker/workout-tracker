import { useMemo } from 'react';
import { calculate1RM } from '../utils/calculate1RM';
import { calculateWorkoutVolume } from '../utils/calculateVolume';
import { calculateStreakWithFreeze } from '../utils/checkBadges';
import SimpleLineChart from './charts/SimpleLineChart';
import SimpleBarChart from './charts/SimpleBarChart';

const LIFT_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6', '#f97316'];

const AnalyticsScreen = ({ workoutHistory, completedWorkouts, onBack, schedule, weightLog }) => {
  // ── Dynamic Lift Detection ──
  const trackedLifts = useMemo(() => {
    const exerciseCounts = {};

    for (const day of completedWorkouts) {
      const workout = workoutHistory[day];
      if (!workout?.exercises) continue;

      for (const ex of workout.exercises) {
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
            exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
          }
        }
      }
    }

    return Object.entries(exerciseCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name], i) => ({ name, color: LIFT_COLORS[i % LIFT_COLORS.length] }));
  }, [workoutHistory, completedWorkouts]);

  // ── 1RM Trends ──
  const rmTrends = useMemo(() => {
    const trends = {};
    trackedLifts.forEach(lift => { trends[lift.name] = []; });

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
  }, [workoutHistory, completedWorkouts, trackedLifts]);

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

  // ── Consistency (with streak freeze) ──
  const consistency = useMemo(() => {
    const { currentStreak, longestStreak, frozenDays } = calculateStreakWithFreeze(completedWorkouts, schedule);

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
      currentStreak,
      longestStreak,
      perfectWeeks,
      totalWorkouts: completedWorkouts.length,
      freezesUsed: frozenDays.length
    };
  }, [completedWorkouts, schedule]);

  // ── Calendar Heatmap ──
  const heatmapData = useMemo(() => {
    return schedule.map(day => ({
      day: day.day,
      week: day.week,
      rest: day.rest,
      completed: completedWorkouts.includes(day.day),
      type: day.type
    }));
  }, [schedule, completedWorkouts]);

  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }
    return weeks;
  }, [heatmapData]);

  // ── Body Weight Trend (Phase 15) ──
  const weightTrendData = useMemo(() => {
    if (!weightLog || weightLog.length === 0) return [];
    return weightLog.slice(-20).map((entry) => ({
      value: entry.weight,
      label: new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    }));
  }, [weightLog]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
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
        <div className="glass-card p-4 text-center animate-fade-in-up">
          <div className="stat-number text-3xl">{consistency.currentStreak}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Current Streak</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
          <div className="stat-number text-3xl">{consistency.longestStreak}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Longest Streak</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-2">
          <div className="stat-number text-3xl">{consistency.perfectWeeks}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Perfect Weeks</div>
        </div>
        <div className="glass-card p-4 text-center animate-fade-in-up stagger-3">
          <div className="stat-number text-3xl">{consistency.totalWorkouts}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total Workouts</div>
        </div>
      </div>

      {/* Streak freeze info */}
      {consistency.freezesUsed > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-amber-400/80 animate-fade-in-up stagger-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {consistency.freezesUsed} streak freeze{consistency.freezesUsed !== 1 ? 's' : ''} used
        </div>
      )}

      {/* Calendar Heatmap */}
      <div className="glass-card p-4 animate-fade-in-up stagger-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Activity Map</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day) => {
                  let color = 'bg-white/5';
                  if (!day.rest) {
                    color = day.completed ? 'bg-green-500 shadow-sm shadow-green-500/30' : 'bg-white/10';
                  }
                  return (
                    <div
                      key={day.day}
                      className={`w-3 h-3 rounded-sm ${color}`}
                      title={`Day ${day.day} — ${day.rest ? 'Rest' : day.type}${day.completed ? ' (done)' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500" /> Done
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/10" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/5" /> Rest
          </span>
        </div>
      </div>

      {/* Body Weight Trend */}
      {weightTrendData.length >= 2 && (
        <div className="glass-card p-4 animate-fade-in-up stagger-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Body Weight Trend</h2>
          <SimpleLineChart
            data={weightTrendData}
            color="#f59e0b"
            label="Body Weight (kg)"
            height={140}
          />
        </div>
      )}

      {/* 1RM Trends */}
      <div className="glass-card p-4 animate-fade-in-up stagger-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Estimated 1RM Trends</h2>

        {trackedLifts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {trackedLifts.map(lift => {
              const hasData = rmTrends[lift.name]?.length >= 2;
              return (
                <span
                  key={lift.name}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    hasData ? 'opacity-100' : 'opacity-40'
                  }`}
                  style={{ backgroundColor: `${lift.color}15`, color: lift.color }}
                >
                  {lift.name.replace('Barbell ', '')}
                  {hasData && ` ${rmTrends[lift.name][rmTrends[lift.name].length - 1].value}kg`}
                </span>
              );
            })}
          </div>
        )}

        {trackedLifts.map(lift => {
          if (!rmTrends[lift.name] || rmTrends[lift.name].length < 2) return null;
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

        {trackedLifts.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-6">
            Complete more workouts to see 1RM trends
          </div>
        )}
      </div>

      {/* Weekly Volume */}
      <div className="glass-card p-4 animate-fade-in-up stagger-7">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Weekly Volume</h2>
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
