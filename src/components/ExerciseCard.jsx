import { useState, useEffect, useRef } from 'react';
import { calculate1RM } from '../utils/calculate1RM';
import { detectPR } from '../utils/detectPR';
import { haptic } from '../utils/haptics';
import PRCelebration from './PRCelebration';
import ExerciseInfoModal from './ExerciseInfoModal';
import NumberStepper from './NumberStepper';

const ExerciseCard = ({ exercise, exerciseIndex, onChange, previousWorkout, onSave, scrollToNext, workoutHistory, onPR, onSkip, onSubstitute, substitutes }) => {
  const [showInfo, setShowInfo] = useState(false);
  const setsCount = Number(exercise.sets) || 0;
  const oneRM = previousWorkout ? calculate1RM(previousWorkout.weight, previousWorkout.reps) : null;

  // Compute all-time best set for this exercise from history
  const bestSet = (() => {
    if (!workoutHistory) return null;
    let best = null;
    let bestRM = 0;
    for (const dayKey of Object.keys(workoutHistory)) {
      const workout = workoutHistory[dayKey];
      if (!workout?.exercises) continue;
      for (const ex of workout.exercises) {
        if (ex.name !== exercise.name) continue;
        for (const s of (ex.userSets || [])) {
          if (!s.completed) continue;
          const w = Number(s.weight) || 0;
          const r = Number(s.reps) || 0;
          if (w === 0 || r === 0) continue;
          const rm = calculate1RM(w, r);
          if (rm > bestRM) {
            bestRM = rm;
            best = { weight: w, reps: r };
          }
        }
      }
    }
    return best;
  })();

  const timerIntervals = useRef({});
  const timerHapticFired = useRef({});

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

  const getTimerBorderClass = (seconds, timerRunning) => {
    if (!timerRunning || restRange.max === 0) return '';
    if (seconds >= restRange.min && seconds <= restRange.max) return 'border-green-500/40 shadow-glow-green';
    if (seconds > restRange.max) return 'border-amber-500/40 shadow-glow-amber';
    return '';
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

    timerHapticFired.current[setNumber] = false;

    setUserSets(prev => prev.map(set =>
      set.setNumber === setNumber
        ? { ...set, timerRunning: true }
        : set
    ));

    const startTime = performance.now();
    timerIntervals.current[setNumber] = setInterval(() => {
      setUserSets(prev => prev.map(set => {
        if (set.setNumber !== setNumber) return set;
        const elapsed = Math.floor((performance.now() - startTime) / 1000);
        // Haptic when first entering green zone
        if (restRange.min > 0 && elapsed >= restRange.min && !timerHapticFired.current[setNumber]) {
          timerHapticFired.current[setNumber] = true;
          haptic.timerReady();
        }
        return { ...set, restTime: elapsed };
      }));
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

  const [prInfo, setPrInfo] = useState({ show: false, type: null, value: null });

  const handleSaveAndNext = (setNumber) => {
    stopTimer(setNumber);

    const currentSetData = userSets.find(s => s.setNumber === setNumber);

    const updatedSets = userSets.map(set =>
      set.setNumber === setNumber
        ? { ...set, completed: true, timerRunning: false }
        : set
    );

    setUserSets(updatedSets);
    onChange(exercise.name, updatedSets);
    onSave(exercise.name, updatedSets);
    haptic.medium();

    // Auto-start rest timer on the completed set
    setTimeout(() => startTimer(setNumber), 50);

    // Check for PR
    if (workoutHistory && currentSetData?.weight && currentSetData?.reps) {
      const pr = detectPR(exercise.name, currentSetData.weight, currentSetData.reps, workoutHistory);
      if (pr.isPR) {
        setPrInfo({ show: true, type: pr.type, value: pr.value });
        haptic.pr();
        if (onPR) onPR();
        return;
      }
    }

    setTimeout(() => {
      scrollToNext(exerciseIndex, setNumber, setsCount);
    }, 300);
  };

  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const hasSavedSets = userSets.some(s => s.completed);

  // If exercise is skipped, show collapsed state
  if (exercise.skipped) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-amber-500/20" id={`exercise-${exercise.name.replace(/\s+/g, '-')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 line-through">{exercise.name}</h3>
              <span className="text-xs text-amber-400">Exercise Skipped</span>
            </div>
          </div>
          <button
            onClick={() => onSkip && onSkip(exercise.name, false)}
            className="px-3 py-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all font-semibold"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 mb-4" id={`exercise-${exercise.name.replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white">
            {exercise.name}
          </h3>
          {exercise.substituted && exercise.originalName && (
            <span className="text-[11px] text-purple-400">Substituted for {exercise.originalName}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {substitutes && substitutes.length > 0 && !hasSavedSets && (
            <button
              onClick={() => setShowSubstitutes(true)}
              className="p-1.5 text-purple-400 hover:text-purple-300 transition-colors"
              title="Swap exercise"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" />
              </svg>
            </button>
          )}
          {onSkip && (
            <button
              onClick={() => onSkip(exercise.name, true)}
              className="p-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              title="Skip exercise"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setShowInfo(true)}
            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="Exercise info"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        </div>
      </div>

      {showInfo && (
        <ExerciseInfoModal
          exerciseName={exercise.name}
          onClose={() => setShowInfo(false)}
        />
      )}

      <div className="bg-black/20 rounded-lg p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            <strong className="text-white">Target:</strong> {exercise.sets} sets × {exercise.reps} reps
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {oneRM && <span>1RM: <span className="text-white font-semibold">{oneRM}</span> kg</span>}
            {exercise.restTime && <span className="text-slate-600">|</span>}
            {exercise.restTime && <span>Rest: {exercise.restTime}</span>}
          </div>
        </div>
        {(previousWorkout?.weight || bestSet) && (
          <div className="flex items-center gap-2">
            {previousWorkout?.weight && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-md text-[11px] text-slate-400 border border-white/5">
                <span className="text-slate-500">Last</span>
                <span className="text-white font-semibold tabular-nums">{previousWorkout.weight}</span>
                <span className="text-slate-600">kg ×</span>
                <span className="text-white font-semibold tabular-nums">{previousWorkout.reps}</span>
                <span className="text-slate-600">reps</span>
              </span>
            )}
            {bestSet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/5 rounded-md text-[11px] text-amber-400/80 border border-amber-500/10">
                <span className="text-amber-500/60">Best</span>
                <span className="text-amber-300 font-semibold tabular-nums">{bestSet.weight}</span>
                <span className="text-amber-500/40">kg ×</span>
                <span className="text-amber-300 font-semibold tabular-nums">{bestSet.reps}</span>
                <span className="text-amber-500/40">reps</span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {userSets.map((set) => {
          // Quick-fill: check if previous set was saved with different values
          const prevSet = set.setNumber > 1 ? userSets.find(s => s.setNumber === set.setNumber - 1) : null;
          const showCopyButton = !set.completed && prevSet?.completed &&
            (prevSet.weight !== set.weight || prevSet.reps !== set.reps);

          return (
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

              {/* Quick-fill from previous set */}
              {showCopyButton && (
                <button
                  onClick={() => {
                    handleSetChange(set.setNumber, 'weight', prevSet.weight);
                    handleSetChange(set.setNumber, 'reps', prevSet.reps);
                    haptic.light();
                  }}
                  className="w-full mb-3 py-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                  Copy Set {prevSet.setNumber} ({prevSet.weight}kg × {prevSet.reps})
                </button>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                {exercise.repType === 'distance' || exercise.repType === 'duration' ? (
                  <>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1 text-center">
                        {exercise.repType === 'distance' ? 'Distance' : 'Duration'}
                      </div>
                      <input
                        type="text"
                        value={set.reps || ''}
                        onChange={(e) => handleSetChange(set.setNumber, 'reps', e.target.value)}
                        disabled={set.completed}
                        placeholder={exercise.repType === 'distance' ? 'e.g. 50m' : 'e.g. 2:00'}
                        className="w-full bg-black/20 text-white p-2.5 rounded-lg text-center font-semibold border border-white/10 focus:border-blue-500/50 outline-none text-sm disabled:opacity-50"
                      />
                    </div>
                    <NumberStepper
                      value={set.weight}
                      onChange={(val) => handleSetChange(set.setNumber, 'weight', val)}
                      min={0}
                      max={300}
                      step={2.5}
                      label="Weight"
                      unit="kg"
                      disabled={set.completed}
                    />
                  </>
                ) : (
                  <>
                    <NumberStepper
                      value={set.weight}
                      onChange={(val) => handleSetChange(set.setNumber, 'weight', val)}
                      min={0}
                      max={300}
                      step={2.5}
                      label="Weight"
                      unit="kg"
                      disabled={set.completed}
                    />
                    <NumberStepper
                      value={set.reps}
                      onChange={(val) => handleSetChange(set.setNumber, 'reps', val)}
                      min={1}
                      max={50}
                      step={1}
                      label="Reps"
                      disabled={set.completed}
                    />
                  </>
                )}
              </div>

              {/* Rest Timer — auto-starts on save, no manual Start button */}
              {(set.restTime > 0 || set.timerRunning) && (
                <div className={`rounded-lg p-3 mb-3 border transition-all ${
                  getTimerBorderClass(set.restTime, set.timerRunning) || 'border-transparent bg-slate-800/50'
                } ${!getTimerBorderClass(set.restTime, set.timerRunning) ? 'bg-slate-800/50' : 'bg-black/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-slate-400 text-xs">Rest Timer</div>
                    {set.timerRunning && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="text-green-400 text-xs">Resting...</div>
                      </div>
                    )}
                    {!set.timerRunning && set.restTime > 0 && restRange.min > 0 && set.restTime >= restRange.min && (
                      <div className="text-emerald-400 text-xs font-semibold">Ready to go!</div>
                    )}
                  </div>

                  <div className={`text-3xl font-bold text-center mb-3 ${getTimerColor(set.restTime, set.timerRunning)}`}
                       style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(set.restTime)}
                  </div>

                  <div className="flex gap-2">
                    {set.timerRunning && (
                      <button
                        onClick={() => stopTimer(set.setNumber)}
                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
                      >
                        Stop
                      </button>
                    )}

                    {!set.timerRunning && set.restTime > 0 && (
                      <>
                        <button
                          onClick={() => startTimer(set.setNumber)}
                          className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => resetTimer(set.setNumber)}
                          className="flex-1 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-lg font-semibold transition-all"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!set.completed && (
                <button
                  onClick={() => handleSaveAndNext(set.setNumber)}
                  disabled={exercise.repType ? !set.reps : (!set.weight || !set.reps)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    (exercise.repType ? set.reps : (set.weight && set.reps))
                      ? 'btn-primary'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Save Set
                </button>
              )}

              {set.completed && (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" strokeDasharray="24" strokeDashoffset="0" className="animate-checkmark-draw" />
                    </svg>
                    <span className="text-sm font-semibold">Saved</span>
                  </div>
                  <button
                    onClick={() => {
                      stopTimer(set.setNumber);
                      setUserSets(prev => {
                        const updated = prev.map(s =>
                          s.setNumber === set.setNumber
                            ? { ...s, completed: false }
                            : s
                        );
                        onChange(exercise.name, updated);
                        return updated;
                      });
                      haptic.light();
                    }}
                    className="px-3 py-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PRCelebration
        show={prInfo.show}
        type={prInfo.type}
        value={prInfo.value}
        onDone={() => {
          setPrInfo({ show: false, type: null, value: null });
          const lastCompleted = userSets.filter(s => s.completed).pop();
          if (lastCompleted) {
            scrollToNext(exerciseIndex, lastCompleted.setNumber, setsCount);
          }
        }}
      />

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

      {/* Substitution bottom sheet */}
      {showSubstitutes && substitutes && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowSubstitutes(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl p-6 pb-8 max-h-[60vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Swap Exercise</h3>
              <button
                onClick={() => setShowSubstitutes(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Replace <strong className="text-white">{exercise.name}</strong> with:</p>
            <div className="space-y-2">
              {substitutes.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => {
                    onSubstitute && onSubstitute(exercise.name, sub.name);
                    setShowSubstitutes(false);
                    haptic.light();
                  }}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                >
                  <div className="text-sm font-semibold text-white">{sub.name}</div>
                  {sub.muscles && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sub.muscles.map((m, i) => (
                        <span key={i} className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{m}</span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
