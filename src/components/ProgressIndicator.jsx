const ProgressIndicator = ({ percentage, completed, total }) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.3))' }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="stat-number text-2xl">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Progress</p>
        <p className="text-lg font-semibold text-white">
          {completed} of {total} workouts
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
