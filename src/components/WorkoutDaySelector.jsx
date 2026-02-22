import { useMemo, useState } from 'react';
import { calculateStreakWithFreeze } from '../utils/checkBadges';
import { getPendingWorkouts } from '../utils/getNextWorkout';

const WorkoutDaySelector = ({ schedule, completedWorkouts, nextDay, onSelectDay, onReviewDay, currentView, setCurrentView, getWorkoutName, programName }) => {
  const [showPending, setShowPending] = useState(false);
  const { frozenDays } = useMemo(
    () => calculateStreakWithFreeze(completedWorkouts, schedule),
    [completedWorkouts, schedule]
  );
  const frozenSet = useMemo(() => new Set(frozenDays), [frozenDays]);
  const pendingGroups = useMemo(() => getPendingWorkouts(completedWorkouts, schedule), [completedWorkouts, schedule]);

  const getStatusColor = (day) => {
    if (day.rest) return 'bg-white/[0.05] text-slate-500';
    if (frozenSet.has(day.day)) return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    if (completedWorkouts.includes(day.day)) return 'bg-green-500/20 text-green-400 border border-green-500/30';
    if (day.day === nextDay) return 'bg-blue-500/20 text-blue-400 border-2 border-blue-500 shadow-glow-blue';
    return 'bg-white/[0.08] text-slate-400';
  };

  const getWorkoutLabel = (type) => {
    const labels = {
      legs1: 'L1',
      legs2: 'L2',
      push1: 'P1',
      push2: 'P2',
      pull1: 'U1',
      pull2: 'U2',
      fullbody_a: 'FB-A',
      fullbody_b: 'FB-B',
      fullbody_c: 'FB-C',
      fullbody_d: 'FB-D',
      hyrox_strength: 'STR',
      hyrox_endurance: 'END',
      hyrox_stations: 'STA',
      hyrox_intervals: 'INT',
      rest: 'Rest'
    };
    if (labels[type]) return labels[type];
    if (type.length <= 3) return type;
    return type.slice(0, 3);
  };

  // Group schedule days by week
  const weekGroups = useMemo(() => {
    const groups = {};
    schedule.forEach(day => {
      const week = day.week || Math.ceil(day.day / 7);
      if (!groups[week]) groups[week] = { week, block: day.block, days: [] };
      groups[week].days.push(day);
    });
    return Object.values(groups).sort((a, b) => a.week - b.week);
  }, [schedule]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="btn-back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-white">All Workouts</h2>
        <button
          onClick={() => setCurrentView('programs')}
          className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] px-3 py-1.5 rounded-full transition-all max-w-[120px]"
        >
          <span className="truncate">{programName || 'Program'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Pending workouts toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPending(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            !showPending ? 'btn-primary' : 'bg-white/[0.05] text-slate-400'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setShowPending(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            showPending ? 'btn-primary' : 'bg-white/[0.05] text-slate-400'
          }`}
        >
          Pending ({pendingGroups.reduce((s, g) => s + g.days.length, 0)})
        </button>
      </div>

      {/* Pending workouts list */}
      {showPending && (
        <div className="space-y-4">
          {pendingGroups.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm">All workouts completed!</div>
          ) : (
            pendingGroups.map(group => (
              <div key={group.week}>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Week {group.week}
                </div>
                <div className="space-y-1.5">
                  {group.days.map(day => (
                    <button
                      key={day.day}
                      onClick={() => onSelectDay(day.day)}
                      className="w-full flex items-center justify-between p-3 glass-card-interactive text-left"
                    >
                      <div>
                        <span className="text-sm font-semibold text-white">
                          {getWorkoutName ? getWorkoutName(day.day) || day.type : day.type}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">Day {day.day}</span>
                        {day.block && (
                          <span className="text-xs text-slate-500 ml-1">· Block {day.block}</span>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar view */}
      {!showPending && (
        <>
          {/* Column headers: empty cell + 7 day names */}
          <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-1.5">
            <div />
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {weekGroups.map((group, groupIdx) => {
              const prevGroup = groupIdx > 0 ? weekGroups[groupIdx - 1] : null;
              const showDivider = prevGroup && prevGroup.block && group.block && prevGroup.block !== group.block;

              return (
                <div key={group.week}>
                  {showDivider && (
                    <div className="flex items-center gap-3 py-3 my-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                        Block {group.block}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                    </div>
                  )}
                  <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-1.5">
                    <div className="flex items-center justify-center">
                      <span className="text-[9px] font-bold text-slate-500 leading-none">
                        {group.week}
                      </span>
                    </div>

                    {group.days.map((day, dayIndex) => (
                      <button
                        key={`${group.week}-${dayIndex}`}
                        onClick={() => {
                          if (day.rest) return;
                          if (completedWorkouts.includes(day.day) && onReviewDay) {
                            onReviewDay(day.day);
                          } else {
                            onSelectDay(day.day);
                          }
                        }}
                        disabled={day.rest}
                        className={`
                          aspect-square rounded-xl flex items-center justify-center
                          text-xs font-semibold transition-all
                          ${getStatusColor(day)}
                          ${!day.rest ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed'}
                        `}
                        title={`Day ${day.day} - ${day.type}${frozenSet.has(day.day) ? ' (streak freeze)' : ''}`}
                      >
                        <div className="flex flex-col items-center">
                          {frozenSet.has(day.day) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 mb-0.5">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                          ) : (
                            <span className="text-[10px] opacity-60">{day.day}</span>
                          )}
                          <span className="text-xs">{getWorkoutLabel(day.type)}</span>
                        </div>
                      </button>
                    ))}

                    {Array.from({ length: Math.max(0, 7 - group.days.length) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 rounded-lg border border-green-500/30"></div>
              <span className="text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/20 rounded-lg border-2 border-blue-500"></div>
              <span className="text-slate-400">Next</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/[0.08] rounded-lg"></div>
              <span className="text-slate-400">Upcoming</span>
            </div>
            {frozenDays.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-slate-400">Streak Freeze</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDaySelector;
