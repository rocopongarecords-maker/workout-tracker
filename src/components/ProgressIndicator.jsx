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
            stroke="#1e293b"
            strokeWidth="12"
          />
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {percentage}%
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-slate-400 mb-1">Progress</p>
        <p className="text-lg font-semibold text-white">
          {completed} of {total} workouts
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;