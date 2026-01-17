import { useState } from 'react';

const SetTracker = ({ setNumber, weight, reps, targetReps, completed, onChange }) => {
  console.log('SetTracker render:', { setNumber, weight, reps, targetReps, completed });

  // Generate weight options (increments of 5kg)
  const weightOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 280, 300];

  // Generate rep options (1-30)
  const repOptions = Array.from({ length: 30 }, (_, i) => i + 1);

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
      style={{
        backgroundColor: localCompleted ? '#134e4a' : '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        border: localCompleted ? '2px solid #22c55e' : '2px solid #475569',
        marginBottom: '16px'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>
          Set {setNumber}
        </span>
        {targetReps && (
          <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>
            (Target: {targetReps} reps)
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
            Weight Used (kg)
          </div>
          <select
            value={localWeight}
            onChange={handleWeightChange}
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              border: '2px solid #334155',
              borderRadius: '8px',
              boxSizing: 'border-box',
              appearance: 'menulist',
              cursor: 'pointer'
            }}
          >
            <option value="">Select weight</option>
            {weightOptions.map(w => (
              <option key={w} value={w}>
                {w} kg
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
            Reps Done
          </div>
          <select
            value={localReps}
            onChange={handleRepsChange}
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              border: '2px solid #334155',
              borderRadius: '8px',
              boxSizing: 'border-box',
              appearance: 'menulist',
              cursor: 'pointer'
            }}
          >
            <option value="">Select reps</option>
            {repOptions.map(r => (
              <option key={r} value={r}>
                {r} reps
              </option>
            ))}
          </select>
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
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        {localCompleted ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            </svg>
            Mark Complete
          </span>
        )}
      </button>
    </div>
  );
};

export default SetTracker;