import { useState, useRef, useMemo } from 'react';
import { exerciseLibrary, muscleGroups } from '../data/exerciseLibrary';
import { haptic } from '../utils/haptics';
import NumberStepper from './NumberStepper';

const WORKOUT_TYPES = [
  { id: 'gym', label: 'Gym', icon: '🏋️', defaultName: 'Gym Session' },
  { id: 'run', label: 'Run', icon: '🏃', defaultName: 'Run' },
  { id: 'cardio', label: 'Cardio', icon: '❤️‍🔥', defaultName: 'Cardio' },
  { id: 'stretching', label: 'Stretch', icon: '🧘', defaultName: 'Stretching' },
  { id: 'other', label: 'Other', icon: '⚡', defaultName: 'Workout' },
];

const FreeWorkoutScreen = ({ onSave, onBack }) => {
  const [phase, setPhase] = useState('setup'); // 'setup' | 'logging' | 'done'
  const [workoutType, setWorkoutType] = useState(null);
  const [workoutName, setWorkoutName] = useState('');
  const [startTime] = useState(() => Date.now());

  // Gym state
  const [exercises, setExercises] = useState([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // Run state
  const [distance, setDistance] = useState('');
  const [runDuration, setRunDuration] = useState('');

  // General state
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');

  // Done state
  const [savedWorkout, setSavedWorkout] = useState(null);

  const handleStart = () => {
    if (!workoutType) return;
    if (!workoutName) {
      const typeInfo = WORKOUT_TYPES.find(t => t.id === workoutType);
      setWorkoutName(typeInfo?.defaultName || 'Workout');
    }
    setPhase('logging');
    haptic.light();
  };

  const handleSave = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const workout = {
      type: workoutType,
      name: workoutName || WORKOUT_TYPES.find(t => t.id === workoutType)?.defaultName || 'Workout',
      duration: workoutType === 'run' ? (parseFloat(runDuration) * 60 || elapsed) : (parseFloat(duration) * 60 || elapsed),
      notes: notes || undefined,
    };

    if (workoutType === 'gym') {
      workout.exercises = exercises.map(ex => ({
        name: ex.name,
        userSets: ex.userSets.filter(s => s.completed),
      })).filter(ex => ex.userSets.length > 0);
    }

    if (workoutType === 'run') {
      workout.distance = distance || undefined;
      if (distance && runDuration) {
        const km = parseFloat(distance);
        const mins = parseFloat(runDuration);
        if (km > 0 && mins > 0) {
          workout.pace = (mins / km).toFixed(2);
        }
      }
    }

    if (['cardio', 'stretching', 'other'].includes(workoutType)) {
      workout.intensity = intensity;
    }

    onSave(workout);
    setSavedWorkout(workout);
    setPhase('done');
    haptic.success();
  };

  // ── Setup Phase ──
  if (phase === 'setup') {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Log Activity</h1>
          <p className="text-slate-400 text-sm">What did you do?</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {WORKOUT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => {
                setWorkoutType(type.id);
                setWorkoutName(type.defaultName);
                haptic.light();
              }}
              className={`py-5 rounded-xl text-center transition-all ${
                workoutType === type.id
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'glass-card-interactive border-2 border-transparent'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-semibold text-white">{type.label}</div>
            </button>
          ))}
        </div>

        {workoutType && (
          <div className="glass-card p-4 space-y-3 animate-fade-in-up">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workout Name</div>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g. Morning Run"
              className="w-full bg-black/20 text-white p-3 rounded-lg font-semibold border border-white/[0.08] focus:border-blue-500/50 outline-none"
            />
            <button
              onClick={handleStart}
              className="w-full py-4 btn-primary flex items-center justify-center gap-2"
            >
              Start Logging
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Done Phase ──
  if (phase === 'done' && savedWorkout) {
    const typeInfo = WORKOUT_TYPES.find(t => t.id === savedWorkout.type);
    const durationMins = savedWorkout.duration ? Math.round(savedWorkout.duration / 60) : null;

    return (
      <div className="space-y-6 pb-8">
        <div className="text-center pt-4">
          <div className="text-5xl mb-4">{typeInfo?.icon || '💪'}</div>
          <h1 className="text-2xl font-bold text-white mb-1">Activity Logged!</h1>
          <p className="text-slate-400">{savedWorkout.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {durationMins > 0 && (
            <div className="glass-card p-4 text-center animate-fade-in-up">
              <div className="stat-number text-2xl">{durationMins}m</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Duration</div>
            </div>
          )}
          {savedWorkout.type === 'gym' && savedWorkout.exercises && (
            <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
              <div className="stat-number text-2xl">{savedWorkout.exercises.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Exercises</div>
            </div>
          )}
          {savedWorkout.distance && (
            <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
              <div className="stat-number text-2xl">{savedWorkout.distance}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Distance (km)</div>
            </div>
          )}
          {savedWorkout.pace && (
            <div className="glass-card p-4 text-center animate-fade-in-up stagger-2">
              <div className="stat-number text-2xl">{savedWorkout.pace}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Pace (min/km)</div>
            </div>
          )}
        </div>

        {savedWorkout.notes && (
          <div className="glass-card p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</div>
            <p className="text-sm text-slate-300">{savedWorkout.notes}</p>
          </div>
        )}

        <button onClick={onBack} className="w-full py-4 btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ── Logging Phase ──
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="text-sm text-slate-400">
          {WORKOUT_TYPES.find(t => t.id === workoutType)?.icon} {workoutName}
        </div>
      </div>

      {workoutType === 'gym' && (
        <GymLogger
          exercises={exercises}
          setExercises={setExercises}
          showPicker={showExercisePicker}
          setShowPicker={setShowExercisePicker}
          notes={notes}
          setNotes={setNotes}
        />
      )}

      {workoutType === 'run' && (
        <RunLogger
          distance={distance}
          setDistance={setDistance}
          duration={runDuration}
          setDuration={setRunDuration}
          notes={notes}
          setNotes={setNotes}
        />
      )}

      {['cardio', 'stretching', 'other'].includes(workoutType) && (
        <GeneralLogger
          duration={duration}
          setDuration={setDuration}
          intensity={intensity}
          setIntensity={setIntensity}
          notes={notes}
          setNotes={setNotes}
          typeName={WORKOUT_TYPES.find(t => t.id === workoutType)?.label}
        />
      )}

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-app-bg/80 backdrop-blur-xl border-t border-white/[0.08] p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Gym Logger ──
const GymLogger = ({ exercises, setExercises, showPicker, setShowPicker, notes, setNotes }) => {
  const handleAddExercise = (ex) => {
    setExercises(prev => [...prev, {
      name: ex.name,
      muscles: ex.muscles,
      sets: 3,
      reps: '8-12',
      userSets: [
        { setNumber: 1, weight: '', reps: '', completed: false, restTime: 0 },
        { setNumber: 2, weight: '', reps: '', completed: false, restTime: 0 },
        { setNumber: 3, weight: '', reps: '', completed: false, restTime: 0 },
      ],
    }]);
    setShowPicker(false);
    haptic.light();
  };

  const handleSetChange = (exIndex, setNumber, field, value) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIndex) return ex;
      return {
        ...ex,
        userSets: ex.userSets.map(s =>
          s.setNumber === setNumber ? { ...s, [field]: value } : s
        )
      };
    }));
  };

  const handleSaveSet = (exIndex, setNumber) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIndex) return ex;
      return {
        ...ex,
        userSets: ex.userSets.map(s =>
          s.setNumber === setNumber ? { ...s, completed: true } : s
        )
      };
    }));
    haptic.medium();
  };

  const handleAddSet = (exIndex) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIndex) return ex;
      const nextNum = ex.userSets.length + 1;
      const lastSet = ex.userSets[ex.userSets.length - 1];
      return {
        ...ex,
        sets: ex.userSets.length + 1,
        userSets: [...ex.userSets, {
          setNumber: nextNum,
          weight: lastSet?.weight || '',
          reps: lastSet?.reps || '',
          completed: false,
          restTime: 0,
        }]
      };
    }));
    haptic.light();
  };

  const handleRemoveExercise = (exIndex) => {
    setExercises(prev => prev.filter((_, i) => i !== exIndex));
    haptic.light();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-1">Log Exercises</h1>
        <p className="text-slate-400 text-sm">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''} added</p>
      </div>

      {exercises.map((ex, exIndex) => (
        <div key={`${ex.name}-${exIndex}`} className="bg-app-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{ex.name}</h3>
              {ex.muscles && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {ex.muscles.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{m}</span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleRemoveExercise(exIndex)}
              className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {ex.userSets.map((set) => (
              <div
                key={set.setNumber}
                className={`rounded-lg p-4 border-2 transition-all ${
                  set.completed
                    ? 'bg-teal-900/50 border-green-500'
                    : 'bg-app-surface-light/50 border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">Set {set.setNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <NumberStepper
                    value={set.weight}
                    onChange={(val) => handleSetChange(exIndex, set.setNumber, 'weight', val)}
                    min={0}
                    max={300}
                    step={2.5}
                    label="Weight"
                    unit="kg"
                    disabled={set.completed}
                  />
                  <NumberStepper
                    value={set.reps}
                    onChange={(val) => handleSetChange(exIndex, set.setNumber, 'reps', val)}
                    min={1}
                    max={50}
                    step={1}
                    label="Reps"
                    disabled={set.completed}
                  />
                </div>
                {!set.completed ? (
                  <button
                    onClick={() => handleSaveSet(exIndex, set.setNumber)}
                    disabled={!set.weight || !set.reps}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      set.weight && set.reps
                        ? 'btn-primary'
                        : 'bg-app-surface-light text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Save Set
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm font-semibold">Saved</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleAddSet(exIndex)}
            className="w-full mt-3 py-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all font-semibold"
          >
            + Add Set
          </button>
        </div>
      ))}

      <button
        onClick={() => setShowPicker(true)}
        className="w-full py-4 glass-card-interactive text-blue-400 font-semibold flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Exercise
      </button>

      {/* Notes */}
      <div className="bg-app-surface rounded-xl p-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel?"
          className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/[0.08] focus:border-blue-500/50 outline-none resize-none placeholder-slate-600"
          rows={2}
        />
      </div>

      {/* Exercise picker bottom sheet */}
      {showPicker && (
        <ExercisePickerSheet
          onSelect={handleAddExercise}
          onClose={() => setShowPicker(false)}
          addedNames={exercises.map(e => e.name)}
        />
      )}
    </div>
  );
};

// ── Exercise Picker (bottom sheet) ──
const ExercisePickerSheet = ({ onSelect, onClose, addedNames }) => {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    return exerciseLibrary.filter(ex => {
      if (addedNames.includes(ex.name)) return false;
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedMuscle && !ex.muscles?.includes(selectedMuscle)) return false;
      return true;
    });
  }, [search, selectedMuscle, addedNames]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border-t border-white/[0.08] rounded-t-2xl p-6 pb-8 max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Add Exercise</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-black/20 text-white p-3 rounded-lg border border-white/[0.08] focus:border-blue-500/50 outline-none mb-3 text-sm"
          autoFocus
        />

        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
          <button
            onClick={() => setSelectedMuscle(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              !selectedMuscle ? 'bg-blue-500 text-white' : 'bg-white/[0.05] text-slate-400'
            }`}
          >
            All
          </button>
          {muscleGroups.map(mg => (
            <button
              key={mg}
              onClick={() => setSelectedMuscle(selectedMuscle === mg ? null : mg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMuscle === mg ? 'bg-blue-500 text-white' : 'bg-white/[0.05] text-slate-400'
              }`}
            >
              {mg}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 space-y-1">
          {filtered.slice(0, 50).map(ex => (
            <button
              key={ex.name}
              onClick={() => onSelect(ex)}
              className="w-full text-left p-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl border border-white/5 transition-all"
            >
              <div className="text-sm font-semibold text-white">{ex.name}</div>
              {ex.muscles && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {ex.muscles.map((m, i) => (
                    <span key={i} className="text-[10px] text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded">{m}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-8">No exercises found</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Run Logger ──
const RunLogger = ({ distance, setDistance, duration, setDuration, notes, setNotes }) => {
  const km = parseFloat(distance) || 0;
  const mins = parseFloat(duration) || 0;
  const pace = km > 0 && mins > 0 ? (mins / km).toFixed(2) : null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-1">Log Run</h1>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Distance (km)</div>
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g. 5.0"
            className="w-full bg-black/20 text-white p-3 rounded-lg text-center font-semibold text-lg border border-white/[0.08] focus:border-blue-500/50 outline-none"
          />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Duration (minutes)</div>
          <input
            type="number"
            step="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 30"
            className="w-full bg-black/20 text-white p-3 rounded-lg text-center font-semibold text-lg border border-white/[0.08] focus:border-blue-500/50 outline-none"
          />
        </div>
      </div>

      {pace && (
        <div className="glass-card border-blue-500/30 p-4 text-center shadow-glow-blue animate-fade-in-up">
          <div className="stat-number text-3xl text-blue-400">{pace}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Pace (min/km)</div>
        </div>
      )}

      <div className="bg-app-surface rounded-xl p-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did the run feel? Route, weather, etc."
          className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/[0.08] focus:border-blue-500/50 outline-none resize-none placeholder-slate-600"
          rows={2}
        />
      </div>
    </div>
  );
};

// ── General Logger (Cardio / Stretching / Other) ──
const GeneralLogger = ({ duration, setDuration, intensity, setIntensity, notes, setNotes, typeName }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-1">Log {typeName}</h1>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Duration (minutes)</div>
          <input
            type="number"
            step="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 30"
            className="w-full bg-black/20 text-white p-3 rounded-lg text-center font-semibold text-lg border border-white/[0.08] focus:border-blue-500/50 outline-none"
          />
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Intensity</div>
          <div className="flex gap-2">
            {['light', 'moderate', 'intense'].map(level => (
              <button
                key={level}
                onClick={() => { setIntensity(level); haptic.light(); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  intensity === level
                    ? level === 'light'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                      : level === 'moderate'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-white/[0.05] text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-app-surface rounded-xl p-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel?"
          className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/[0.08] focus:border-blue-500/50 outline-none resize-none placeholder-slate-600"
          rows={2}
        />
      </div>
    </div>
  );
};

export default FreeWorkoutScreen;
