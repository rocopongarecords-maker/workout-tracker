import { useState } from 'react';

const SetTracker = ({ setNumber, weight, reps, completed, onChange }) => {
  const [localWeight, setLocalWeight] = useState(weight || '');
  const [localReps, setLocalReps] = useState(reps || '');
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
    <div className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
      localCompleted ? 'bg-slate-800/50' : 'bg-slate-800'
    }`}>
      <div className="flex-shrink-0 w-16">
        <span className="text-sm text-slate-400">Set {setNumber}</span>
      </div>
      
      <input
        type="number"
        value={localWeight}
        onChange={handleWeightChange}
        placeholder="kg"
        className="flex-1 bg-slate-700 border-0 rounded-lg px-4 py-3 text-white text-center text-lg font-semibold placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all"
        inputMode="decimal"
      />
      
      <div className="text-slate-400 text-lg">×</div>
      
      <input
        type="number"
        value={localReps}
        onChange={handleRepsChange}
        placeholder="reps"
        className="flex-1 bg-slate-700 border-0 rounded-lg px-4 py-3 text-white text-center text-lg font-semibold placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all"
        inputMode="decimal"
      />
      
      <button
        onClick={handleToggleComplete}
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          localCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
        }`}
        aria-label={localCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={localCompleted ? 'block' : 'hidden'}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={localCompleted ? 'hidden' : 'block'}
        />
      </button>
    </div>
  );
};

export default SetTracker;