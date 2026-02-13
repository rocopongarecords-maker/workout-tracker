import { useState } from 'react';

const STEPS = ['welcome', 'goal', 'frequency', 'program'];

const OnboardingScreen = ({ onComplete, onSelectProgram, programs }) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [frequency, setFrequency] = useState(null);

  const currentStep = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleFinish = (programId) => {
    if (programId && programId !== 'jeff_nippard_lpp') {
      onSelectProgram(programId);
    }
    onComplete();
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= step ? 'bg-blue-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {currentStep === 'welcome' && (
        <div className="text-center space-y-6">
          <div className="text-6xl">💪</div>
          <h1 className="text-3xl font-bold text-white">Welcome to<br />Workout Tracker</h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            Track your training, hit PRs, earn badges, and stay consistent with your program.
          </p>
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Let's Get Started
          </button>
        </div>
      )}

      {currentStep === 'goal' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">What's Your Goal?</h2>
            <p className="text-slate-400 text-sm">This helps us personalize your experience</p>
          </div>
          <div className="space-y-3">
            {[
              { id: 'strength', icon: '🏋️', label: 'Build Strength', desc: 'Get stronger on compound lifts' },
              { id: 'hypertrophy', icon: '💪', label: 'Build Muscle', desc: 'Maximize muscle growth' },
              { id: 'fitness', icon: '🏃', label: 'General Fitness', desc: 'Stay active and healthy' }
            ].map(g => (
              <button
                key={g.id}
                onClick={() => { setGoal(g.id); handleNext(); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  goal === g.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-3xl">{g.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-white">{g.label}</div>
                  <div className="text-sm text-slate-400">{g.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'frequency' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Training Frequency</h2>
            <p className="text-slate-400 text-sm">How many days per week can you train?</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => { setFrequency(n); handleNext(); }}
                className={`p-6 rounded-xl border-2 text-center transition-colors ${
                  frequency === n
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl font-bold text-white">{n}</div>
                <div className="text-sm text-slate-400 mt-1">days/week</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'program' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Pick a Program</h2>
            <p className="text-slate-400 text-sm">You can always change this later</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleFinish('jeff_nippard_lpp')}
              className="w-full p-4 rounded-xl border-2 border-blue-500 bg-blue-500/10 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Jeff Nippard's Legs-Push-Pull</div>
                  <div className="text-sm text-slate-400 mt-1">16 weeks · 6 days/week · Strength & Hypertrophy</div>
                </div>
                <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full font-semibold">Recommended</span>
              </div>
            </button>

            {(programs || []).map(p => (
              <button
                key={p.id}
                onClick={() => handleFinish(p.id)}
                className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-800 hover:border-slate-600 text-left transition-colors"
              >
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {p.weeks} weeks · {p.workoutDays?.length || '?'} days/week · Custom
                </div>
              </button>
            ))}

            <button
              onClick={() => handleFinish('jeff_nippard_lpp')}
              className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-800 hover:border-slate-600 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl">+</div>
                <div>
                  <div className="font-semibold text-white">Create Custom Program</div>
                  <div className="text-sm text-slate-400">Build your own training plan</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingScreen;
