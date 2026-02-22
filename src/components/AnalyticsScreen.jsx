import { useMemo, useState } from 'react';
import { calculate1RM } from '../utils/calculate1RM';
import { calculateWorkoutVolume } from '../utils/calculateVolume';
import { calculateStreakWithFreeze } from '../utils/checkBadges';
import { exerciseLibrary } from '../data/exerciseLibrary';
import SimpleLineChart from './charts/SimpleLineChart';
import SimpleBarChart from './charts/SimpleBarChart';

const ANALYTICS_TABS = ['Volume', 'Weight', 'PRs', 'Frequency', 'Muscles'];

const LIFT_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6', '#f97316'];

const AnalyticsScreen = ({ workoutHistory, completedWorkouts, onBack, schedule, weightLog }) => {
  const [selectedTab, setSelectedTab] = useState(0);

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

  // ── Muscle Distribution ──
  const muscleDistribution = useMemo(() => {
    const muscleCounts = {};

    for (const day of completedWorkouts) {
      const workout = workoutHistory[day];
      if (!workout?.exercises) continue;

      for (const ex of workout.exercises) {
        const libraryEntry = exerciseLibrary.find(e => e.name === ex.name);
        if (!libraryEntry) continue;

        const completedSets = (ex.userSets || []).filter(s => s.completed).length;
        for (const muscle of libraryEntry.muscles) {
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + completedSets;
        }
      }
    }

    return Object.entries(muscleCounts)
      .map(([muscle, count]) => ({ muscle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [workoutHistory, completedWorkouts]);

  // Max count for muscle distribution bar scaling
  const maxMuscleCount = muscleDistribution.length > 0 ? muscleDistribution[0].count : 1;

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-slate-400 text-sm">Track your progress over time</p>
      </div>

      {/* Tab Selector */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ANALYTICS_TABS.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedTab === index ? 'text-white' : 'text-slate-400'
            }`}
            style={
              selectedTab === index
                ? { background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-dark)))' }
                : { backgroundColor: 'rgb(var(--bg-surface-light))' }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Volume Tab ── */}
      {selectedTab === 0 && (
        <>
          {/* Consistency Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 text-center animate-fade-in-up">
              <div className="stat-number text-3xl">{consistency.totalWorkouts}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total Workouts</div>
            </div>
            <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
              <div className="stat-number text-3xl">{consistency.perfectWeeks}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Perfect Weeks</div>
            </div>
          </div>

          {/* Weekly Volume */}
          <div className="glass-card p-4 animate-fade-in-up stagger-2">
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
        </>
      )}

      {/* ── Weight Tab ── */}
      {selectedTab === 1 && (
        <>
          {weightTrendData.length >= 2 ? (
            <div className="glass-card p-4 animate-fade-in-up">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Body Weight Trend</h2>
              <SimpleLineChart
                data={weightTrendData}
                color="#f59e0b"
                label="Body Weight (kg)"
                height={140}
              />
            </div>
          ) : (
            <div className="glass-card p-6 animate-fade-in-up">
              <div className="text-center text-slate-500 text-sm">
                Log at least 2 weight entries to see your trend
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PRs Tab ── */}
      {selectedTab === 2 && (
        <div className="glass-card p-4 animate-fade-in-up">
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
      )}

      {/* ── Frequency Tab ── */}
      {selectedTab === 3 && (
        <>
          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 text-center animate-fade-in-up">
              <div className="stat-number text-3xl">{consistency.currentStreak}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Current Streak</div>
            </div>
            <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
              <div className="stat-number text-3xl">{consistency.longestStreak}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Longest Streak</div>
            </div>
          </div>

          {/* Streak freeze info */}
          {consistency.freezesUsed > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-amber-400/80 animate-fade-in-up stagger-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {consistency.freezesUsed} streak freeze{consistency.freezesUsed !== 1 ? 's' : ''} used
            </div>
          )}

          {/* Calendar Heatmap */}
          <div className="glass-card p-4 animate-fade-in-up stagger-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Activity Map</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-[3px]">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      let color = 'bg-white/[0.05]';
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
                <div className="w-3 h-3 rounded-sm bg-white/[0.05]" /> Rest
              </span>
            </div>
          </div>
        </>
      )}

      {/* ── Muscles Tab ── */}
      {selectedTab === 4 && (
        <div className="glass-card p-4 animate-fade-in-up">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Muscle Group Distribution</h2>

          {muscleDistribution.length > 0 ? (
            <div className="space-y-3">
              {muscleDistribution.map((entry, i) => (
                <div key={entry.muscle} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{entry.muscle}</span>
                    <span className="text-xs text-slate-500">{entry.count} sets</span>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(entry.count / maxMuscleCount) * 100}%`,
                        background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-dark)))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm py-6">
              Complete workouts to see muscle distribution
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsScreen;
