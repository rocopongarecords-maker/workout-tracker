import { useState, useEffect } from 'react';
import SetTracker from './SetTracker';

const ExerciseCard = ({ exercise, onChange, previousWeight }) => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const initialSets = [];
    for (let i = 1; i <= exercise.sets; i++) {
      initialSets.push({
        setNumber: i,
        weight: previousWeight || '',
        reps: '',
        completed: false
      });
    }
    setSets(initialSets);
  }, [exercise.sets, previousWeight]);

  const handleSetChange = (setNumber, field, value) => {
    setSets(prev => prev.map(set => 
      set.setNumber === setNumber 
        ? { ...set, [field]: value }
        : set
    ));
    
    onChange(exercise.name, sets.map(set => 
      set.setNumber === setNumber 
        ? { ...set, [field]: value }
        : set
    ));
  };

  const getRestTimeColor = () => {
    if (exercise.type === 'primary') return 'text-yellow-400';
    if (exercise.type === 'secondary') return 'text-blue-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {exercise.superset && <span className="text-purple-400 mr-2">A1</span>}
            {exercise.name}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">{exercise.sets} × {exercise.reps}</span>
            <span className={`${getRestTimeColor()} text-xs uppercase tracking-wide`}>
              {exercise.restTime}
            </span>
          </div>
        </div>
        {previousWeight && (
          <div className="bg-slate-700 rounded-lg px-3 py-1 text-xs text-slate-400">
            Last: {previousWeight} kg
          </div>
        )}
      </div>

      <div className="space-y-2">
        {sets.map(set => (
          <SetTracker
            key={set.setNumber}
            setNumber={set.setNumber}
            weight={set.weight}
            reps={set.reps}
            completed={set.completed}
            onChange={handleSetChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;