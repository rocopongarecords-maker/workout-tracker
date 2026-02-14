import { useMemo } from 'react';
import { Dumbbell, Calendar } from 'lucide-react';
import { getNextWorkout, getPendingWorkouts } from '../utils/getNextWorkout';
import { getClosestBadgeProgress } from '../utils/checkBadges';
import ProgressIndicator from './ProgressIndicator';

const Dashboard = ({ stats, completedWorkouts, onStartWorkout, onViewAllWorkouts, onOpenSettings, onViewBadges, onViewAnalytics, onViewMeasurements, onViewPrograms, onViewExercises, earnedBadges, currentView, setCurrentView, schedule, getWorkoutName: getWorkoutNameProp, programName, totalWeeks, getExercisesForDay, totalPRs, workoutHistory }) => {
  const nextWorkout = getNextWorkout(completedWorkouts, schedule);
  const nextExercises = nextWorkout && getExercisesForDay ? getExercisesForDay(nextWorkout.day) : null;

  // Get next 2-3 pending workouts for quick-pick
  const pendingGroups = useMemo(() => getPendingWorkouts(completedWorkouts, schedule), [completedWorkouts, schedule]);
  const upcomingOptions = useMemo(() => {
    const all = pendingGroups.flatMap(g => g.days);
    // Exclude the suggested workout and take next 2
    return all.filter(d => d.day !== nextWorkout?.day).slice(0, 2);
  }, [pendingGroups, nextWorkout]);

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

  const getBlockLabel = (block) => {
    if (block === 1) return 'Block 1 - Technique & Volume';
    if (block === 2) return 'Block 2 - Higher Effort';
    return '';
  };

  const navItems = [
    { label: 'Calendar', onClick: () => onViewAllWorkouts(), icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Analytics', onClick: onViewAnalytics, icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { label: 'Body', onClick: onViewMeasurements, icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg> },
    { label: 'Badges', onClick: onViewBadges, icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 8 12 8s5-4 7.5-4a2.5 2.5 0 0 1 0 5H18"/><path d="M18 9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/></svg>, badge: (earnedBadges || []).length },
    { label: 'Programs', onClick: onViewPrograms, icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
    { label: 'Exercises', onClick: onViewExercises, icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={onViewPrograms}
          className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl font-bold text-white">
            {programName || "Legs-Push-Pull Tracker"}
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mt-1">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <p className="text-slate-400 mt-1">
          Week {stats.currentWeek} of {totalWeeks || 16}
        </p>
      </div>

      {stats.allCompleted ? (
        <div className="glass-card-elevated border-green-500/30 p-8 text-center shadow-glow-green">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Program Complete!
          </h2>
          <p className="text-slate-400">
            Congratulations! You've completed all {totalWeeks || 16} weeks.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-card-elevated p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Suggested Workout
              </h2>
              <button
                onClick={() => onViewAllWorkouts()}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Pick different
              </button>
            </div>

            {nextWorkout ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Dumbbell size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {getWorkoutNameProp ? getWorkoutNameProp(nextWorkout.day) || nextWorkout.type : nextWorkout.type}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Day {nextWorkout.day}{nextWorkout.block ? ` • ${getBlockLabel(nextWorkout.block)}` : ''}
                    </p>
                  </div>
                </div>

                {/* Exercise preview */}
                {nextExercises && nextExercises.length > 0 && (
                  <div className="bg-black/20 rounded-lg px-3 py-2.5 space-y-1">
                    {nextExercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{ex.name}</span>
                        <span className="text-slate-500">{ex.sets}×{ex.reps}</span>
                      </div>
                    ))}
                    {nextExercises.length > 3 && (
                      <div className="text-[10px] text-slate-600 pt-0.5">
                        +{nextExercises.length - 3} more exercises
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => onStartWorkout(nextWorkout.day, nextWorkout.type, nextWorkout.block)}
                  className="w-full py-4 btn-primary flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Start Workout
                </button>

                {/* Upcoming alternative options */}
                {upcomingOptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Or jump to:</p>
                    {upcomingOptions.map(opt => (
                      <button
                        key={opt.day}
                        onClick={() => onStartWorkout(opt.day, opt.type, opt.block)}
                        className="w-full flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                      >
                        <div>
                          <span className="text-sm text-white font-semibold">
                            {getWorkoutNameProp ? getWorkoutNameProp(opt.day) || opt.type : opt.type}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">Day {opt.day}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    ))}
                    <p className="text-[10px] text-slate-600 italic">Jeff recommends following the sequence for optimal progression</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400">
                All workouts completed!
              </p>
            )}
          </div>

          <div className="glass-card p-6 animate-fade-in-up stagger-1">
            <ProgressIndicator
              percentage={stats.percentage}
              completed={stats.completed}
              total={stats.totalWorkouts}
            />
          </div>

          {/* Next badge progress */}
          {nextBadge && (
            <button
              onClick={onViewBadges}
              className="w-full glass-card-interactive p-4 animate-fade-in-up stagger-2"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{nextBadge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white truncate">{nextBadge.name}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums ml-2">{nextBadge.current}/{nextBadge.target}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${nextBadge.percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">{nextBadge.description}</p>
                </div>
              </div>
            </button>
          )}
        </>
      )}

      {/* Quick nav grid */}
      <div className="grid grid-cols-3 gap-3">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`py-4 glass-card-interactive text-white font-semibold flex items-center justify-center gap-2 relative animate-fade-in-up stagger-${i + 2}`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-2 right-3 w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow-amber">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="w-full py-3 glass-card-interactive text-slate-400 text-sm flex items-center justify-center gap-2 animate-fade-in-up stagger-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Settings
      </button>
    </div>
  );
};

export default Dashboard;
