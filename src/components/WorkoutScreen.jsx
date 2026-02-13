import { useState, useEffect, useRef, useMemo } from 'react';
import { getLastCompletedWorkoutForType } from '../utils/getPreviousWorkout';
import { haptic } from '../utils/haptics';
import ExerciseCard from './ExerciseCard';
import Toast from './Toast';

const WorkoutScreen = ({ dayNumber, workoutType, block, editing, onSave, onComplete, onCancel, workoutHistory, completedWorkouts, onPR, getExercisesForDay, getWorkoutName }) => {
  const [exercises, setExercises] = useState([]);
  const [lastWorkout, setLastWorkout] = useState(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', icon: null });
  const [showBackGuard, setShowBackGuard] = useState(false);
  const exerciseRefs = useRef([]);
  const [startTime] = useState(() => Date.now());
  const toastTimeout = useRef(null);

  const showToast = (message, type = 'success', icon = null, duration = 2000) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, message, type, icon });
    toastTimeout.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);
  };

  // Build superset group map
  const supersetMap = useMemo(() => {
    const map = {};
    let i = 0;
    while (i < exercises.length) {
      if (exercises[i].superset) {
        const groupIndices = [];
        while (i < exercises.length && exercises[i].superset) {
          groupIndices.push(i);
          i++;
        }
        groupIndices.forEach((idx, pos) => {
          map[idx] = { groupIndices, positionInGroup: pos };
        });
      } else {
        i++;
      }
    }
    return map;
  }, [exercises]);

  const scrollToNext = (exerciseIndex, setNumber, totalSets) => {
    setTimeout(() => {
      const group = supersetMap[exerciseIndex];

      if (!group) {
        if (setNumber < totalSets) {
          const el = exerciseRefs.current[exerciseIndex];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const nextIndex = exerciseIndex + 1;
          if (nextIndex < exercises.length) {
            const el = exerciseRefs.current[nextIndex];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        return;
      }

      const { groupIndices, positionInGroup } = group;
      const isLastInGroup = positionInGroup === groupIndices.length - 1;

      if (!isLastInGroup) {
        const nextPartner = groupIndices[positionInGroup + 1];
        const el = exerciseRefs.current[nextPartner];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Superset toast
        const nextExercise = exercises[nextPartner];
        if (nextExercise) {
          showToast(`Now: ${nextExercise.name} — Set ${setNumber}`, 'info', '→');
        }
      } else if (setNumber < totalSets) {
        const firstInGroup = groupIndices[0];
        const el = exerciseRefs.current[firstInGroup];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstExercise = exercises[firstInGroup];
        if (firstExercise) {
          showToast(`Now: ${firstExercise.name} — Set ${setNumber + 1}`, 'info', '↩');
        }
      } else {
        const lastGroupIndex = groupIndices[groupIndices.length - 1];
        const nextIndex = lastGroupIndex + 1;
        if (nextIndex < exercises.length) {
          const el = exerciseRefs.current[nextIndex];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);
  };

  useEffect(() => {
    const exerciseList = getExercisesForDay(dayNumber);
    if (exerciseList) {
      const savedHistory = editing ? workoutHistory[dayNumber] : null;

      const initialExercises = exerciseList.map(ex => {
        if (savedHistory?.exercises) {
          const savedEx = savedHistory.exercises.find(s => s.name === ex.name);
          if (savedEx?.userSets?.length > 0) {
            return { ...ex, userSets: savedEx.userSets, completed: false };
          }
        }
        return { ...ex, userSets: [], completed: false };
      });

      setExercises(initialExercises);
      if (savedHistory?.notes) setWorkoutNotes(savedHistory.notes);

      const lastCompleted = getLastCompletedWorkoutForType(workoutType, workoutHistory, completedWorkouts);
      setLastWorkout(lastCompleted);
    }
  }, [dayNumber, workoutType, block, editing]);

  const handleExerciseChange = (exerciseName, newSets) => {
    setExercises(prev => prev.map(ex =>
      ex.name === exerciseName
        ? { ...ex, userSets: newSets }
        : ex
    ));
  };

  const getPreviousWorkoutDetails = (exerciseName) => {
    if (!lastWorkout) return null;

    const exercise = lastWorkout.exercises?.find(ex => ex.name === exerciseName);
    if (!exercise || !exercise.userSets || exercise.userSets.length === 0) return null;

    const lastSet = exercise.userSets[exercise.userSets.length - 1];

    return {
      weight: lastSet?.weight || null,
      reps: lastSet?.reps || null,
      dayNumber: lastWorkout.dayNumber || null
    };
  };

  const handleSave = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    onSave(dayNumber, {
      workoutType,
      block,
      duration,
      notes: workoutNotes || undefined,
      exercises: exercises.map(ex => ({
        name: ex.name,
        userSets: ex.userSets
      }))
    });
    showToast('Workout saved', 'success', '✓');
    haptic.success();
  };

  const handleComplete = () => {
    handleSave();
    haptic.workoutComplete();
    onComplete(dayNumber);
  };

  const handleBack = () => {
    if (completedSets > 0) {
      setShowBackGuard(true);
    } else {
      onCancel();
    }
  };

  const isComplete = exercises.every(ex => ex.completed);

  const totalSets = exercises.reduce((sum, ex) => sum + Number(ex.sets), 0);
  const completedSets = exercises.reduce((sum, ex) =>
    sum + ex.userSets.filter(s => s.completed).length, 0
  );
  const completedExercises = exercises.filter(ex =>
    ex.userSets.length === Number(ex.sets) && ex.userSets.every(s => s.completed)
  ).length;

  const workoutName = getWorkoutName ? getWorkoutName(dayNumber) || workoutType : workoutType;

  return (
    <div className="space-y-6 pb-24">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} icon={toast.icon} />

      {/* Sticky progress bar */}
      {totalSets > 0 && (
        <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">{workoutName}</span>
            <span className="stat-number text-white text-sm">{completedSets}/{totalSets}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(completedSets / totalSets) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {completedExercises}/{exercises.length} exercises complete
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="btn-back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="text-sm text-slate-400">
          Day {dayNumber}{block ? ` • Block ${block}` : ''}
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          {workoutName}
        </h1>
        <p className="text-slate-400">
          {exercises.length} exercises
        </p>
      </div>

      <div className="space-y-4">
        {(() => {
          const groups = [];
          let i = 0;
          while (i < exercises.length) {
            if (exercises[i].superset) {
              const group = [];
              while (i < exercises.length && exercises[i].superset) {
                group.push({ exercise: exercises[i], originalIndex: i });
                i++;
              }
              groups.push({ type: 'superset', items: group });
            } else {
              groups.push({ type: 'single', exercise: exercises[i], originalIndex: i });
              i++;
            }
          }

          return groups.map((group, gIdx) => {
            if (group.type === 'superset') {
              return (
                <div key={`superset-${gIdx}`} className="border-2 border-purple-500/30 rounded-xl p-3 space-y-2 shadow-glow-purple">
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Superset
                  </div>
                  {group.items.map(({ exercise, originalIndex }) => (
                    <div
                      key={originalIndex}
                      ref={(el) => (exerciseRefs.current[originalIndex] = el)}
                    >
                      <ExerciseCard
                        exercise={exercise}
                        exerciseIndex={originalIndex}
                        onChange={handleExerciseChange}
                        previousWorkout={getPreviousWorkoutDetails(exercise.name)}
                        onSave={(exerciseName, sets) => {
                          setExercises(prev => prev.map(ex =>
                            ex.name === exerciseName
                              ? { ...ex, userSets: sets }
                              : ex
                          ));
                        }}
                        scrollToNext={scrollToNext}
                        workoutHistory={workoutHistory}
                        onPR={onPR}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={group.originalIndex}
                ref={(el) => (exerciseRefs.current[group.originalIndex] = el)}
              >
                <ExerciseCard
                  exercise={group.exercise}
                  exerciseIndex={group.originalIndex}
                  onChange={handleExerciseChange}
                  previousWorkout={getPreviousWorkoutDetails(group.exercise.name)}
                  onSave={(exerciseName, sets) => {
                    setExercises(prev => prev.map(ex =>
                      ex.name === exerciseName
                        ? { ...ex, userSets: sets }
                        : ex
                    ));
                  }}
                  scrollToNext={scrollToNext}
                  workoutHistory={workoutHistory}
                />
              </div>
            );
          });
        })()}
      </div>

      {/* Workout Notes */}
      <div className="bg-slate-800 rounded-xl p-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Workout Notes
        </label>
        <textarea
          value={workoutNotes}
          onChange={(e) => setWorkoutNotes(e.target.value)}
          placeholder="How did it feel? Any adjustments?"
          className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/10 focus:border-blue-500/50 outline-none resize-none placeholder-slate-600"
          rows={2}
        />
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-4 safe-area-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="flex-1 py-4 btn-secondary"
          >
            Save
          </button>
          <button
            onClick={handleComplete}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                : 'btn-primary'
            }`}
          >
            Mark Complete
          </button>
        </div>
      </div>

      {/* Back guard dialog */}
      {showBackGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBackGuard(false)} />
          <div className="relative glass-card-elevated p-6 mx-4 max-w-sm animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-2">Leave workout?</h3>
            <p className="text-sm text-slate-400 mb-5">
              You have {completedSets} saved set{completedSets !== 1 ? 's' : ''}. Your progress has been auto-saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBackGuard(false)}
                className="flex-1 py-3 btn-secondary"
              >
                Stay
              </button>
              <button
                onClick={() => { setShowBackGuard(false); onCancel(); }}
                className="flex-1 py-3 btn-danger"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutScreen;
