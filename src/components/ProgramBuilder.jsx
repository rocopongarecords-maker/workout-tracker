import { useState } from 'react';
import ExerciseLibrary from './ExerciseLibrary';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_REST = { compound: '3-4 min', isolation: '1-2 min' };

const ProgramBuilder = ({ onSave, onBack, existingProgram }) => {
  const [step, setStep] = useState(1); // 1=name, 2=schedule, 3=exercises, 4=review
  const [name, setName] = useState(existingProgram?.name || '');
  const [weeks, setWeeks] = useState(existingProgram?.weeks || 8);
  const [workoutDays, setWorkoutDays] = useState(existingProgram?.workoutDays || []);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

  // workoutDays: [{ name: 'Push Day', dayOfWeek: 0, exercises: [{ name, sets, reps, type, restTime }] }]

  const toggleDayOfWeek = (dayIdx) => {
    const existing = workoutDays.find(d => d.dayOfWeek === dayIdx);
    if (existing) {
      setWorkoutDays(prev => prev.filter(d => d.dayOfWeek !== dayIdx));
    } else {
      setWorkoutDays(prev => [...prev, {
        name: `Day ${prev.length + 1}`,
        dayOfWeek: dayIdx,
        exercises: []
      }].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
    }
  };

  const updateDayName = (dayIdx, newName) => {
    setWorkoutDays(prev => prev.map(d =>
      d.dayOfWeek === dayIdx ? { ...d, name: newName } : d
    ));
  };

  const addExerciseToDay = (exercise) => {
    const day = workoutDays[currentDayIndex];
    if (!day) return;

    const newExercise = {
      name: exercise.name,
      sets: 3,
      reps: '10',
      type: exercise.category === 'compound' ? 'primary' : 'isolation',
      restTime: DEFAULT_REST[exercise.category]
    };

    setWorkoutDays(prev => prev.map((d, i) =>
      i === currentDayIndex
        ? { ...d, exercises: [...d.exercises, newExercise] }
        : d
    ));
    setShowExerciseLibrary(false);
  };

  const removeExercise = (dayIndex, exIndex) => {
    setWorkoutDays(prev => prev.map((d, i) =>
      i === dayIndex
        ? { ...d, exercises: d.exercises.filter((_, ei) => ei !== exIndex) }
        : d
    ));
  };

  const updateExercise = (dayIndex, exIndex, field, value) => {
    setWorkoutDays(prev => prev.map((d, i) =>
      i === dayIndex
        ? {
          ...d,
          exercises: d.exercises.map((ex, ei) =>
            ei === exIndex ? { ...ex, [field]: value } : ex
          )
        }
        : d
    ));
  };

  const handleSave = () => {
    const program = {
      id: existingProgram?.id || `custom_${Date.now()}`,
      name,
      weeks,
      workoutDays,
      isCustom: true,
      createdAt: existingProgram?.createdAt || new Date().toISOString()
    };
    onSave(program);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return workoutDays.length > 0;
      case 3: return workoutDays.every(d => d.exercises.length > 0);
      default: return true;
    }
  };

  if (showExerciseLibrary) {
    return (
      <ExerciseLibrary
        onBack={() => setShowExerciseLibrary(false)}
        onSelectExercise={addExerciseToDay}
      />
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {existingProgram ? 'Edit Program' : 'Create Program'}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>

      {/* Step 1: Name & Duration */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Program Details
          </h3>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Program Name</label>
            <input
              type="text"
              placeholder="e.g., Upper/Lower Split"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Duration (weeks)</label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {[4, 6, 8, 10, 12, 16, 20, 24].map(w => (
                <option key={w} value={w}>{w} weeks</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Training Days
          </h3>
          <p className="text-xs text-slate-500">
            Tap the days you want to train. You'll add exercises to each day next.
          </p>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day, i) => {
              const isSelected = workoutDays.some(d => d.dayOfWeek === i);
              return (
                <button
                  key={day}
                  onClick={() => toggleDayOfWeek(i)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Name each day */}
          {workoutDays.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mt-4">Name your training days:</p>
              {workoutDays.map((d) => (
                <div key={d.dayOfWeek} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-8">{DAYS_OF_WEEK[d.dayOfWeek]}</span>
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => updateDayName(d.dayOfWeek, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Exercises */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Exercises
          </h3>

          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {workoutDays.map((d, i) => (
              <button
                key={d.dayOfWeek}
                onClick={() => setCurrentDayIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  currentDayIndex === i
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d.name}
                {d.exercises.length > 0 && (
                  <span className="ml-1 text-[10px] opacity-70">({d.exercises.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Current day's exercises */}
          {workoutDays[currentDayIndex] && (
            <div className="space-y-2">
              {workoutDays[currentDayIndex].exercises.map((ex, exIdx) => (
                <div key={exIdx} className="bg-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate flex-1">{ex.name}</span>
                    <button
                      onClick={() => removeExercise(currentDayIndex, exIdx)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 block">Sets</label>
                      <select
                        value={ex.sets}
                        onChange={(e) => updateExercise(currentDayIndex, exIdx, 'sets', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-slate-700 text-white rounded-lg text-sm focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 block">Reps</label>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => updateExercise(currentDayIndex, exIdx, 'reps', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-700 text-white rounded-lg text-sm focus:outline-none"
                        placeholder="e.g., 8-12"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setShowExerciseLibrary(true);
                }}
                className="w-full py-3 bg-slate-700 text-blue-400 rounded-xl font-semibold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Exercise
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Review Your Program
          </h3>
          <div className="bg-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Name</span>
              <span className="text-sm text-white font-semibold">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Duration</span>
              <span className="text-sm text-white">{weeks} weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Training days</span>
              <span className="text-sm text-white">{workoutDays.length}/week</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Total exercises</span>
              <span className="text-sm text-white">
                {workoutDays.reduce((sum, d) => sum + d.exercises.length, 0)}
              </span>
            </div>
          </div>

          {workoutDays.map((d, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-2">
                {DAYS_OF_WEEK[d.dayOfWeek]} — {d.name}
              </div>
              <div className="space-y-1">
                {d.exercises.map((ex, ei) => (
                  <div key={ei} className="flex justify-between text-xs">
                    <span className="text-slate-400">{ex.name}</span>
                    <span className="text-slate-500">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Save Program
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramBuilder;
