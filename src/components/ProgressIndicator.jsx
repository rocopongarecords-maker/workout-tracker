const ProgressIndicator = ({ percentage, completed, total }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgb(var(--bg-surface-light))"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" />
              <stop offset="100%" stopColor="rgb(var(--color-primary-light))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="stat-number text-lg">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-white mb-0.5">Overall Progress</p>
        <p className="text-xs text-slate-400">
          {completed} of {total} workouts
        </p>
        <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
