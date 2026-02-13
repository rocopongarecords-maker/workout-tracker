const WorkoutDaySelector = ({ schedule, completedWorkouts, nextDay, onSelectDay, onReviewDay, currentView, setCurrentView }) => {
  const getStatusColor = (day) => {
    if (day.rest) return 'bg-slate-700/30 text-slate-500';
    if (completedWorkouts.includes(day.day)) return 'bg-green-500/20 text-green-400';
    if (day.day === nextDay) return 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500';
    return 'bg-slate-700/50 text-slate-400';
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
    // For custom programs: abbreviate to first 2-3 chars
    if (type.length <= 3) return type;
    return type.slice(0, 3);
  };

  const weeks = [];
  let currentWeekDays = [];
  
  schedule.forEach(day => {
    currentWeekDays.push(day);
    if (day.rest || day.day % 7 === 0) {
      weeks.push([...currentWeekDays]);
      currentWeekDays = [];
    }
  });

  if (currentWeekDays.length > 0) {
    weeks.push(currentWeekDays);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">All Workouts</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs text-slate-500 font-semibold py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <button
                key={`${weekIndex}-${dayIndex}`}
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
                  aspect-square rounded-lg flex items-center justify-center
                  text-xs font-semibold transition-all
                  ${getStatusColor(day)}
                  ${!day.rest ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed'}
                `}
                title={`Day ${day.day} - ${day.type}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] opacity-60">{day.day}</span>
                  <span className="text-xs">{getWorkoutLabel(day.type)}</span>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 rounded border-2 border-green-500"></div>
          <span className="text-slate-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 rounded border-2 border-yellow-500"></div>
          <span className="text-slate-400">Next</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700/50 rounded"></div>
          <span className="text-slate-400">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDaySelector;