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
            className={`w-2 h-2 rounded-full transition-all ${
              i <= step ? 'bg-blue-500 shadow-sm shadow-blue-500/50' : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>

      {currentStep === 'welcome' && (
        <div className="text-center space-y-6 animate-fade-in-up">
          <img src="/icons/icon-192.png" alt="ZWAR" className="w-20 h-20 rounded-2xl mx-auto" />
          <h1 className="text-3xl font-bold text-white">Welcome to<br />ZWAR</h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            Track your training, hit PRs, earn badges, and train with expert coaches.
          </p>
          <button
            onClick={handleNext}
            className="w-full py-4 btn-primary"
          >
            Let's Get Started
          </button>
        </div>
      )}

      {currentStep === 'goal' && (
        <div className="space-y-6 animate-fade-in-up">
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
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  goal === g.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-glow-blue'
                    : 'glass-card-interactive'
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
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Training Frequency</h2>
            <p className="text-slate-400 text-sm">How many days per week can you train?</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => { setFrequency(n); handleNext(); }}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  frequency === n
                    ? 'border-blue-500 bg-blue-500/10 shadow-glow-blue'
                    : 'glass-card-interactive'
                }`}
              >
                <div className="stat-number text-3xl">{n}</div>
                <div className="text-sm text-slate-400 mt-1">days/week</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'program' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Pick a Program</h2>
            <p className="text-slate-400 text-sm">You can always change this later</p>
          </div>
          <div className="space-y-3">
            {[
              { id: 'jeff_nippard_lpp', name: "Legs-Push-Pull", desc: "16 weeks · 6 days/week · Hypertrophy", recommended: true },
              { id: 'jeff_nippard_fullbody', name: "Full Body", desc: "12 weeks · 4 days/week · Hypertrophy" },
              { id: 'hyrox_prep', name: "Hyrox Race Prep", desc: "10 weeks · 4 days/week · Hyrox" },
              { id: 'upper_lower_split', name: "Upper/Lower Split", desc: "10 weeks · 4 days/week · Hypertrophy" },
              { id: 'beginner_strength', name: "Beginner Strength", desc: "8 weeks · 3 days/week · Strength" },
              { id: 'ppl_3day', name: "Push/Pull/Legs 3-Day", desc: "10 weeks · 3 days/week · Hypertrophy" },
              { id: '531_strength', name: "5/3/1 Strength", desc: "12 weeks · 4 days/week · Powerlifting" },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => handleFinish(p.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  p.recommended
                    ? 'border-2 border-blue-500 bg-blue-500/10 shadow-glow-blue'
                    : 'glass-card-interactive'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{p.desc}</div>
                  </div>
                  {p.recommended && (
                    <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full font-semibold uppercase tracking-wider shrink-0 ml-2">Popular</span>
                  )}
                </div>
              </button>
            ))}

            {(programs || []).map(p => (
              <button
                key={p.id}
                onClick={() => handleFinish(p.id)}
                className="w-full p-4 rounded-2xl glass-card-interactive text-left"
              >
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {p.weeks} weeks · {p.workoutDays?.length || '?'} days/week · Custom
                </div>
              </button>
            ))}

            <button
              onClick={() => handleFinish('jeff_nippard_lpp')}
              className="w-full p-4 rounded-2xl glass-card-interactive text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center text-xl text-slate-400">+</div>
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
