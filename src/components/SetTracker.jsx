import { useState } from 'react';

const SetTracker = ({ setNumber, weight, reps, targetReps, completed, onChange }) => {
  const [localWeight, setLocalWeight] = useState(weight || '');
  const [localReps, setLocalReps] = useState(() => {
    return targetReps || '';
  });
  const [localCompleted, setLocalCompleted] = useState(completed || false);

  const handleWeightChange = (e) => {
    const value = e.target.value;
    setLocalWeight(value);
    onChange(setNumber, 'weight', value);
  };

  const handleRepsChange = (e) => {
    const value = e.target.value;
    setLocalReps(value);
    onChange(setNumber, 'reps', value);
  };

  const handleToggleComplete = () => {
    const newValue = !localCompleted;
    setLocalCompleted(newValue);
    onChange(setNumber, 'completed', newValue);
  };

  return (
    <div className={`bg-slate-700/50 rounded-lg p-4 transition-colors ${
      localCompleted ? 'border-2 border-green-500' : 'border-2 border-transparent'
    }`}>
      {/* Set Header with Target */}
      <div className="mb-3">
        <span className="text-sm text-slate-400">Set {setNumber}</span>
        {targetReps && (
          <span className="text-xs text-slate-500 ml-2">
            (Target: {targetReps} reps)
          </span>
        )}
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Weight Input */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Weight Used
          </label>
          <input
            type="number"
            value={localWeight}
            onChange={handleWeightChange}
            placeholder="0"
            className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-3 py-2 text-white text-center text-lg font-semibold placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            inputMode="decimal"
          />
          <div className="text-xs text-slate-500 text-center mt-1">kg</div>
        </div>

        {/* Reps Input */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Reps Done
          </label>
          <input
            type="number"
            value={localReps}
            onChange={handleRepsChange}
            placeholder="0"
            className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-3 py-2 text-white text-center text-lg font-semibold placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            inputMode="decimal"
          />
          <div className="text-xs text-slate-500 text-center mt-1">reps</div>
        </div>
      </div>

      {/* Mark Complete Button */}
      <button
        onClick={handleToggleComplete}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          localCompleted
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
        }`}
      >
        {localCompleted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            </svg>
            Mark Complete
          </>
        )}
      </button>
    </div>
  );
};

export default SetTracker;