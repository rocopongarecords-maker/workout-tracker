import { useMemo } from 'react';
import { calculateStreakWithFreeze } from '../utils/checkBadges';

const WorkoutDaySelector = ({ schedule, completedWorkouts, nextDay, onSelectDay, onReviewDay, currentView, setCurrentView }) => {
  const { frozenDays } = useMemo(
    () => calculateStreakWithFreeze(completedWorkouts, schedule),
    [completedWorkouts, schedule]
  );
  const frozenSet = useMemo(() => new Set(frozenDays), [frozenDays]);

  const getStatusColor = (day) => {
    if (day.rest) return 'bg-white/5 text-slate-500';
    if (frozenSet.has(day.day)) return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    if (completedWorkouts.includes(day.day)) return 'bg-green-500/20 text-green-400 border border-green-500/30';
    if (day.day === nextDay) return 'bg-blue-500/20 text-blue-400 border-2 border-blue-500 shadow-glow-blue';
    return 'bg-white/10 text-slate-400';
  };

  const getWorkoutLabel = (type) => {
    const labels = {
      legs1: 'L1',
      legs2: 'L2',
      push1: 'P1',
      push2: 'P2',
      pull1: 'U1',
      pull2: 'U2',
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
        <div className="w-16" />
      </div>

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
          // Insert block divider before the first week of a new block
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
                {/* Week label */}
                <div className="flex items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-600 leading-none">
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

                {/* Fill remaining cells if week has fewer than 7 days */}
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
          <div className="w-4 h-4 bg-white/10 rounded-lg"></div>
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
    </div>
  );
};

export default WorkoutDaySelector;
