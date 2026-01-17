import { useState } from 'react';

const SetTracker = ({ setNumber, weight, reps, targetReps, completed, onChange }) => {
  console.log('SetTracker render:', { setNumber, weight, reps, targetReps, completed });

  const [localWeight, setLocalWeight] = useState(weight || '');
  const [localReps, setLocalReps] = useState(() => {
    return targetReps || '';
  });
  const [localCompleted, setLocalCompleted] = useState(completed || false);

  const handleWeightChange = (e) => {
    const value = e.target.value;
    console.log('Weight change:', setNumber, value);
    setLocalWeight(value);
    onChange(setNumber, 'weight', value);
  };

  const handleRepsChange = (e) => {
    const value = e.target.value;
    console.log('Reps change:', setNumber, value);
    setLocalReps(value);
    onChange(setNumber, 'reps', value);
  };

  const handleToggleComplete = () => {
    const newValue = !localCompleted;
    console.log('Toggle complete:', setNumber, newValue);
    setLocalCompleted(newValue);
    onChange(setNumber, 'completed', newValue);
  };

  return (
    <div
      className={`bg-slate-700/50 rounded-lg p-4 transition-colors ${
        localCompleted ? 'border-2 border-green-500' : 'border-2 border-slate-600'
      }`}
      style={{ border: '2px solid', backgroundColor: '#1e293b' }}
    >
      <div style={{ marginBottom: '12px' }}>
        <span className="text-sm text-slate-400">Set {setNumber}</span>
        {targetReps && (
          <span className="text-xs text-slate-500 ml-2">
            (Target: {targetReps} reps)
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Weight Used
          </label>
          <input
            type="number"
            value={localWeight}
            onChange={handleWeightChange}
            placeholder="0"
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              border: '2px solid #334155',
              borderRadius: '8px'
            }}
            inputMode="decimal"
          />
          <div className="text-xs text-slate-500 text-center mt-1">kg</div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Reps Done
          </label>
          <input
            type="number"
            value={localReps}
            onChange={handleRepsChange}
            placeholder="0"
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              border: '2px solid #334155',
              borderRadius: '8px'
            }}
            inputMode="decimal"
          />
          <div className="text-xs text-slate-500 text-center mt-1">reps</div>
        </div>
      </div>

      <button
        onClick={handleToggleComplete}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: '600',
          backgroundColor: localCompleted ? '#22c55e' : '#475569',
          color: localCompleted ? '#ffffff' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
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