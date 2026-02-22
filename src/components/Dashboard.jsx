import { useMemo, useState, useEffect } from 'react';
import { Dumbbell, Play } from 'lucide-react';
import { getNextWorkout } from '../utils/getNextWorkout';
import { getClosestBadgeProgress } from '../utils/checkBadges';
import ProgressIndicator from './ProgressIndicator';
import StreakCelebration, { getMilestoneToShow } from './StreakCelebration';

const Dashboard = ({ stats, completedWorkouts, onStartWorkout, onViewAllWorkouts, onOpenSettings, onViewBadges, onViewAnalytics, onViewMeasurements, onViewPrograms, onViewExercises, earnedBadges, currentView, setCurrentView, schedule, getWorkoutName: getWorkoutNameProp, programName, totalWeeks, getExercisesForDay, totalPRs, workoutHistory, onLogFreeWorkout }) => {
  const nextWorkout = getNextWorkout(completedWorkouts, schedule);

  const [streakMilestone, setStreakMilestone] = useState(null);

  const nextBadge = useMemo(() => {
    return getClosestBadgeProgress({
      completedWorkouts,
      workoutHistory: workoutHistory || {},
      earnedBadges,
      totalPRs: totalPRs || 0,
      schedule,
      weightLog: []
    });
  }, [completedWorkouts, workoutHistory, earnedBadges, totalPRs, schedule]);

  // Calculate streak from workout history
  const streakData = useMemo(() => {
    const history = workoutHistory || {};
    const dates = Object.values(history)
      .map(w => w.date)
      .filter(Boolean)
      .map(d => d.split('T')[0])
      .sort()
      .reverse();

    const uniqueDates = [...new Set(dates)];
    if (uniqueDates.length === 0) return { current: 0, best: 0 };

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(checkStr)) {
        currentStreak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }

    let bestStreak = 0;
    let tempStreak = 1;
    const sortedDates = [...uniqueDates].sort();
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    return { current: currentStreak, best: bestStreak };
  }, [workoutHistory]);

  // Trigger streak celebration when a milestone is hit
  useEffect(() => {
    if (streakData.current === 0) return;
    const milestone = getMilestoneToShow(streakData.current);
    if (milestone) setStreakMilestone(milestone);
  }, [streakData.current]);

  // Calculate total volume from history
  const totalVolume = useMemo(() => {
    const history = workoutHistory || {};
    let vol = 0;
    Object.values(history).forEach(w => {
      (w.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(s => {
          if (s.weight && s.reps) vol += s.weight * s.reps;
        });
      });
    });
    return vol;
  }, [workoutHistory]);

  // Get recent workouts (last 3)
  const recentWorkouts = useMemo(() => {
    const history = workoutHistory || {};
    return Object.entries(history)
      .map(([day, data]) => ({ day: parseInt(day), ...data }))
      .filter(w => w.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [workoutHistory]);

  const formatVolume = (vol) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(0)}k`;
    return vol.toString();
  };

  const navItems = [
    { label: 'Schedule', onClick: () => onViewAllWorkouts(), icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Analytics', onClick: onViewAnalytics, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { label: 'Body', onClick: onViewMeasurements, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg> },
    { label: 'Badges', onClick: onViewBadges, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 8 12 8s5-4 7.5-4a2.5 2.5 0 0 1 0 5H18"/><path d="M18 9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/></svg> },
    { label: 'Exercises', onClick: onViewExercises, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
    { label: 'Programs', onClick: onViewPrograms, icon: <Dumbbell size={20} /> },
    { label: 'Coaching', onClick: () => setCurrentView('coach-discovery'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  ];

  return (
    <>
    <StreakCelebration
      milestone={streakMilestone}
      onDone={() => setStreakMilestone(null)}
    />
    <div className="space-y-4">
      {/* 1. Program Header Card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="ZW Logo" className="w-9 h-9 rounded-lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">
              {programName || "Legs-Push-Pull Tracker"}
            </h1>
            <p className="text-sm text-slate-400">
              Week {stats.currentWeek} of {totalWeeks || 16}
            </p>
          </div>
          <button
            onClick={onViewPrograms}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgb(var(--bg-surface-light))',
              color: 'rgb(var(--color-primary))',
            }}
          >
            Switch
          </button>
        </div>
      </div>

      {/* 2. Streak Card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <div
            className="text-4xl"
            style={{
              filter: streakData.current > 0 ? 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.5))' : 'none'
            }}
          >
            {streakData.current > 0 ? '🔥' : '❄️'}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="stat-number text-3xl">{streakData.current}</span>
              <span className="text-sm font-medium text-slate-400">day streak</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Best: {streakData.best} days
            </p>
          </div>
        </div>
      </div>

      {/* 3. Progress Card */}
      <div className="glass-card p-4">
        <ProgressIndicator
          percentage={stats.percentage}
          completed={stats.completed}
          total={stats.totalWorkouts}
        />
      </div>

      {/* 4. Next Workout Card */}
      {stats.allCompleted ? (
        <div className="glass-card p-6 text-center" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white mb-1">Program Complete!</h2>
          <p className="text-sm text-slate-400">
            Congratulations! You've completed all {totalWeeks || 16} weeks.
          </p>
        </div>
      ) : nextWorkout ? (
        <button
          onClick={() => onStartWorkout(nextWorkout.day, nextWorkout.type, nextWorkout.block)}
          className="w-full glass-card-interactive p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium mb-1" style={{ color: 'rgb(var(--color-primary))' }}>
                Next Workout
              </p>
              <h3 className="text-lg font-bold text-white truncate">
                {getWorkoutNameProp ? getWorkoutNameProp(nextWorkout.day) || nextWorkout.type : nextWorkout.type}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Day {nextWorkout.day} • Week {stats.currentWeek}
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))' }}
            >
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        </button>
      ) : null}

      {/* 5. Quick Nav Grid */}
      <div className="grid grid-cols-3 gap-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="glass-card-interactive py-4 flex flex-col items-center gap-1.5"
          >
            <span style={{ color: 'rgb(var(--color-primary))' }}>{item.icon}</span>
            <span className="text-xs font-medium text-slate-400">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 6. Badge Progress Card */}
      {nextBadge && (
        <button onClick={onViewBadges} className="w-full glass-card-interactive p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl flex-shrink-0">{nextBadge.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white truncate">Next: {nextBadge.name}</span>
                <span className="text-[10px] text-slate-400 tabular-nums ml-2">{nextBadge.current}/{nextBadge.target} • {nextBadge.percentage}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${nextBadge.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </button>
      )}

      {/* 7. Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <span style={{ color: 'rgb(var(--color-primary))' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </span>
          <div className="stat-number text-lg">{stats.completed}</div>
          <div className="text-[10px] text-slate-500 uppercase">Workouts</div>
        </div>
        <div className="glass-card p-3 text-center">
          <span style={{ color: 'rgb(var(--color-primary))' }}>
            <Dumbbell size={14} className="mx-auto mb-1" />
          </span>
          <div className="stat-number text-lg">{formatVolume(totalVolume)}</div>
          <div className="text-[10px] text-slate-500 uppercase">Volume</div>
        </div>
        <div className="glass-card p-3 text-center">
          <span style={{ color: 'rgb(var(--color-primary))' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </span>
          <div className="stat-number text-lg">{totalPRs || 0}</div>
          <div className="text-[10px] text-slate-500 uppercase">PRs</div>
        </div>
      </div>

      {/* 8. Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Recent Workouts</h2>
            <button onClick={onViewAllWorkouts} className="text-xs font-medium" style={{ color: 'rgb(var(--color-primary))' }}>
              See All
            </button>
          </div>
          <div className="space-y-2">
            {recentWorkouts.map((w, i) => {
              const name = getWorkoutNameProp ? getWorkoutNameProp(w.day) || w.workoutType : w.workoutType;
              const date = w.date ? new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
              const duration = w.duration ? `${Math.round(w.duration / 60)}min` : '';
              const vol = (w.exercises || []).reduce((acc, ex) =>
                acc + (ex.sets || []).reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0), 0
              );
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'rgba(var(--border-color), 0.05)' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-[10px] text-slate-500">{date}{duration ? ` • ${duration}` : ''}</p>
                  </div>
                  {vol > 0 && (
                    <span className="text-xs font-semibold text-slate-400">{formatVolume(vol)} kg</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Dashboard;
