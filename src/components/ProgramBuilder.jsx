import { useState } from 'react';
import ExerciseLibrary from './ExerciseLibrary';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_REST = { compound: '3-4 min', isolation: '1-2 min' };

const ProgramBuilder = ({ onSave, onPublish, onBack, existingProgram }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(existingProgram?.name || '');
  const [weeks, setWeeks] = useState(existingProgram?.weeks || 8);
  const [workoutDays, setWorkoutDays] = useState(existingProgram?.workoutDays || []);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

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
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Cancel
        </button>
        <h2 className="text-xl font-bold text-white">
          {existingProgram ? 'Edit Program' : 'Create Program'}
        </h2>
        <div className="w-16" />
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= step ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Name & Duration */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Program Details
          </h3>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Program Name</label>
            <input
              type="text"
              placeholder="e.g., Upper/Lower Split"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/[0.08] focus:border-blue-500/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Duration (weeks)</label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full px-4 py-3 bg-black/20 text-white rounded-xl border border-white/[0.08] focus:border-blue-500/50 outline-none"
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
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/[0.05] text-slate-400 hover:bg-white/[0.08]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

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
                    className="flex-1 px-3 py-2 bg-black/20 text-white rounded-lg border border-white/[0.08] text-sm focus:border-blue-500/50 outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Exercises */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Exercises
          </h3>

          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {workoutDays.map((d, i) => (
              <button
                key={d.dayOfWeek}
                onClick={() => setCurrentDayIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  currentDayIndex === i
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/[0.05] text-slate-400 hover:bg-white/[0.08]'
                }`}
              >
                {d.name}
                {d.exercises.length > 0 && (
                  <span className="ml-1 text-[10px] opacity-70">({d.exercises.length})</span>
                )}
              </button>
            ))}
          </div>

          {workoutDays[currentDayIndex] && (
            <div className="space-y-2">
              {workoutDays[currentDayIndex].exercises.map((ex, exIdx) => (
                <div key={exIdx} className="glass-card p-3 space-y-2">
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
                        className="w-full px-2 py-1.5 bg-black/20 text-white rounded-lg text-sm border border-white/[0.08] outline-none"
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
                        className="w-full px-2 py-1.5 bg-black/20 text-white rounded-lg text-sm border border-white/[0.08] outline-none"
                        placeholder="e.g., 8-12"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowExerciseLibrary(true)}
                className="w-full py-3 glass-card-interactive text-blue-400 font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-white/[0.08]"
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
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Review Your Program
          </h3>
          <div className="glass-card p-4 space-y-3">
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
            <div key={i} className="glass-card p-4">
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
            className="flex-1 py-3 btn-secondary"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 py-3 btn-primary disabled:bg-app-surface-light disabled:text-slate-400 disabled:shadow-none"
          >
            Next
          </button>
        ) : (
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
            >
              Save Program
            </button>
            {onPublish && existingProgram && !existingProgram.isPublished && (
              <button
                onClick={() => {
                  const prog = { id: existingProgram.id, name, weeks, workoutDays, isCustom: true, createdAt: existingProgram.createdAt };
                  onPublish(prog);
                }}
                className="w-full py-3 border border-blue-500/30 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/10 transition-colors text-sm"
              >
                Publish to Marketplace
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramBuilder;
