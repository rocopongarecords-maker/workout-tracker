import { useState, useEffect, useRef } from 'react';
import { calculate1RM } from '../utils/calculate1RM';

const ExerciseCard = ({ exercise, onChange, previousWorkout, onSave, scrollToNext, currentSet, totalSets }) => {
  const setsCount = Number(exercise.sets) || 0;
  const oneRM = previousWorkout ? calculate1RM(previousWorkout.weight, previousWorkout.reps) : null;
  const timerIntervals = useRef({});

  const getTargetReps = () => {
    const repsStr = exercise.reps;
    if (!repsStr.includes('-')) return repsStr;
    return repsStr.split('-')[0];
  };

  const parseRestRange = (restTimeStr) => {
    if (!restTimeStr) return { min: 0, max: 0 };
    const match = restTimeStr.match(/(\d+)-(\d+)/);
    if (match) return { min: parseInt(match[1]) * 60, max: parseInt(match[2]) * 60 };
    const single = restTimeStr.match(/(\d+)/);
    if (single) return { min: parseInt(single[1]) * 60, max: parseInt(single[1]) * 60 };
    return { min: 0, max: 0 };
  };

  const restRange = parseRestRange(exercise.restTime);

  const getTimerColor = (seconds, timerRunning) => {
    if (seconds === 0 && !timerRunning) return 'text-slate-500';
    if (restRange.max === 0) return timerRunning ? 'text-green-400' : 'text-blue-400';
    if (seconds < restRange.min) return 'text-blue-400';
    if (seconds <= restRange.max) return 'text-green-400';
    return 'text-yellow-400';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const targetReps = getTargetReps();
  const [userSets, setUserSets] = useState(() => {
    const prefillWeight = previousWorkout?.weight ? String(previousWorkout.weight) : '';
    const prefillReps = previousWorkout?.reps ? String(previousWorkout.reps) : '';
    return Array.from({ length: setsCount }, (_, i) => ({
      setNumber: i + 1,
      weight: prefillWeight,
      reps: prefillReps,
      completed: false,
      restTime: 0,
      timerRunning: false
    }));
  });

  useEffect(() => {
    return () => {
      Object.values(timerIntervals.current).forEach(clearInterval);
    };
  }, []);

  const startTimer = (setNumber) => {
    if (timerIntervals.current[setNumber]) return;

    setUserSets(prev => prev.map(set =>
      set.setNumber === setNumber
        ? { ...set, timerRunning: true }
        : set
    ));

    const startTime = performance.now();
    timerIntervals.current[setNumber] = setInterval(() => {
      setUserSets(prev => prev.map(set =>
        set.setNumber === setNumber
          ? { ...set, restTime: Math.floor((performance.now() - startTime) / 1000) }
          : set
      ));
    }, 100);
  };

  const stopTimer = (setNumber) => {
    if (timerIntervals.current[setNumber]) {
      clearInterval(timerIntervals.current[setNumber]);
      delete timerIntervals.current[setNumber];
    }

    setUserSets(prev => prev.map(set =>
      set.setNumber === setNumber
        ? { ...set, timerRunning: false }
        : set
    ));
  };

  const resetTimer = (setNumber) => {
    stopTimer(setNumber);
    setUserSets(prev => prev.map(set =>
      set.setNumber === setNumber
        ? { ...set, restTime: 0 }
        : set
    ));
  };

  const handleSetChange = (setNumber, field, value) => {
    setUserSets(prev => {
      const updatedSets = prev.map(set =>
        set.setNumber === setNumber
          ? { ...set, [field]: value }
          : set
      );
      onChange(exercise.name, updatedSets);
      return updatedSets;
    });
  };

  const handleSaveAndNext = (setNumber) => {
    stopTimer(setNumber);

    const updatedSets = userSets.map(set =>
      set.setNumber === setNumber
        ? { ...set, completed: true, timerRunning: false }
        : set
    );

    setUserSets(updatedSets);
    onChange(exercise.name, updatedSets);
    onSave(exercise.name, updatedSets);

    setTimeout(() => {
      scrollToNext(setNumber, setsCount);
    }, 300);
  };

  const weightOptions = Array.from({ length: 301 }, (_, i) => i);
  const repOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="bg-slate-800 rounded-xl p-4 mb-4" id={`exercise-${exercise.name.replace(/\s+/g, '-')}`}>
      <h3 className="text-lg font-semibold text-white mb-3">
        {exercise.name}
      </h3>

      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-400">
            <strong className="text-white">Target:</strong> {exercise.sets} sets × {exercise.reps} reps
          </div>
          {oneRM && (
            <div className="text-sm text-slate-400">
              <strong className="text-white">1RM:</strong> {oneRM} kg
            </div>
          )}
        </div>
        <div className="text-xs text-slate-500">
          Rest: {exercise.restTime}
        </div>
        {previousWorkout && previousWorkout.weight && (
          <div className="text-xs text-slate-500 mt-2">
            Last: {previousWorkout.weight} kg × {previousWorkout.reps} reps (Day {previousWorkout.dayNumber})
          </div>
        )}
      </div>

      <div className="space-y-3">
        {userSets.map((set) => (
          <div
            key={set.setNumber}
            className={`rounded-lg p-4 border-2 transition-all ${
              set.completed
                ? 'bg-teal-900/50 border-green-500'
                : 'bg-slate-700/50 border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Set {set.setNumber}</span>
              {targetReps && (
                <span className="text-slate-500 text-xs">(Target: {targetReps} reps)</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-slate-400 text-xs mb-1">Weight (kg)</div>
                <select
                  value={set.weight}
                  onChange={(e) => handleSetChange(set.setNumber, 'weight', e.target.value)}
                  disabled={set.completed}
                  className={`w-full bg-slate-900 text-white p-2 rounded-lg text-center font-semibold border-2 ${
                    set.completed ? 'border-green-500 opacity-70' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select</option>
                  {weightOptions.map(w => (
                    <option key={w} value={w}>{w} kg</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-slate-400 text-xs mb-1">Reps Done</div>
                <select
                  value={set.reps}
                  onChange={(e) => handleSetChange(set.setNumber, 'reps', e.target.value)}
                  disabled={set.completed}
                  className={`w-full bg-slate-900 text-white p-2 rounded-lg text-center font-semibold border-2 ${
                    set.completed ? 'border-green-500 opacity-70' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select</option>
                  {repOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-xs">Rest Timer</div>
                {set.timerRunning && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-green-400 text-xs">Resting...</div>
                  </div>
                )}
              </div>

              <div className={`text-2xl font-bold text-center mb-3 ${getTimerColor(set.restTime, set.timerRunning)}`}>
                {formatTime(set.restTime)}
              </div>

              <div className="flex gap-2">
                {!set.timerRunning && set.restTime === 0 && (
                  <button
                    onClick={() => startTimer(set.setNumber)}
                    disabled={set.completed}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                  >
                    Start
                  </button>
                )}

                {!set.timerRunning && set.restTime > 0 && (
                  <button
                    onClick={() => startTimer(set.setNumber)}
                    disabled={set.completed}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                  >
                    Resume
                  </button>
                )}

                {set.timerRunning && (
                  <button
                    onClick={() => stopTimer(set.setNumber)}
                    disabled={set.completed}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                  >
                    Stop
                  </button>
                )}

                {!set.timerRunning && set.restTime > 0 && (
                  <button
                    onClick={() => resetTimer(set.setNumber)}
                    disabled={set.completed}
                    className="flex-1 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-300 rounded-lg font-semibold transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {!set.completed && (
              <button
                onClick={() => handleSaveAndNext(set.setNumber)}
                disabled={!set.weight || !set.reps}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  set.weight && set.reps
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Set
              </button>
            )}

            {set.completed && (
              <div className="flex flex-col items-center justify-center gap-2 text-green-400">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-semibold">Saved</span>
                </div>
                {set.restTime > 0 && (
                  <span className="text-xs text-slate-400">Rest: {formatTime(set.restTime)}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Sets Completed</span>
          <span className="text-white font-semibold">
            {userSets.filter(s => s.completed).length}/{setsCount}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(userSets.filter(s => s.completed).length / setsCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
