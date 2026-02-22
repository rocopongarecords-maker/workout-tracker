import { useState, useEffect } from 'react';
import { DEMO_QUESTIONNAIRE, setDemoRelationship, getDemoRelationship, generateCoachedProgram } from '../data/demoCoaches';

const CoachQuestionnaire = ({ coachId, relationshipId, coach, onComplete, onProgramCreated, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);

  const isDemo = coachId?.startsWith('demo-');

  useEffect(() => {
    if (isDemo) {
      setQuestions(DEMO_QUESTIONNAIRE.questions);
      return;
    }
    (async () => {
      const data = await coach.loadQuestionnaire(coachId);
      if (data?.questions) setQuestions(data.questions);
    })();
  }, [coachId]);

  const currentQ = questions[currentStep];

  const isComplete = questions
    .filter(q => q.required)
    .every(q => {
      const a = answers[q.id];
      if (a === undefined || a === null) return false;
      if (Array.isArray(a)) return a.length > 0;
      if (typeof a === 'string') return a.trim().length > 0;
      return true;
    });

  const handleSubmit = async () => {
    setSubmitting(true);
    if (isDemo) {
      const existing = getDemoRelationship(coachId) || {};
      setDemoRelationship(coachId, { ...existing, answers, status: 'active' });
      const program = generateCoachedProgram(coachId, answers);
      if (program && onProgramCreated) onProgramCreated(program);
      setSubmitting(false);
      onComplete();
      return;
    }
    const success = await coach.submitQuestionnaire(relationshipId, answers);
    setSubmitting(false);
    if (success) onComplete();
  };

  if (questions.length === 0) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <div className="text-center py-16">
          {coach.loading ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-400 text-sm">No questionnaire available yet</p>
              <p className="text-slate-500 text-xs mt-1">Your coach hasn't set up an intake form. They'll be in touch.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Intake Form</h1>
          <p className="text-xs text-slate-500">Question {currentStep + 1} of {questions.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      {currentQ && (
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {currentQ.question}
            {currentQ.required && <span className="text-red-400 ml-1">*</span>}
          </h2>

          {currentQ.type === 'single_select' && (
            <div className="space-y-2">
              {(currentQ.options || []).map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm text-left transition-all ${
                    answers[currentQ.id] === opt
                      ? 'bg-blue-500/15 border border-blue-500/30 text-white'
                      : 'bg-white/[0.05] border border-white/5 text-slate-300 hover:bg-white/[0.08]'
                  }`}
                >
                  {opt}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === opt ? 'border-blue-400 bg-blue-500' : 'border-white/[0.08]'
                  }`}>
                    {answers[currentQ.id] === opt && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'multi_select' && (
            <div className="space-y-2">
              {(currentQ.options || []).map(opt => {
                const selected = (answers[currentQ.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      const curr = answers[currentQ.id] || [];
                      const updated = selected ? curr.filter(x => x !== opt) : [...curr, opt];
                      setAnswers(a => ({ ...a, [currentQ.id]: updated }));
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm text-left transition-all ${
                      selected
                        ? 'bg-blue-500/15 border border-blue-500/30 text-white'
                        : 'bg-white/[0.05] border border-white/5 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {opt}
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      selected ? 'bg-blue-500' : 'border-2 border-white/[0.08]'
                    }`}>
                      {selected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'number' && (
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-white tabular-nums">
                {answers[currentQ.id] ?? currentQ.min ?? 1}
              </div>
              <input
                type="range"
                min={currentQ.min ?? 1}
                max={currentQ.max ?? 7}
                value={answers[currentQ.id] ?? currentQ.min ?? 1}
                onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: parseInt(e.target.value) }))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{currentQ.min ?? 1}</span>
                <span>{currentQ.max ?? 7}</span>
              </div>
            </div>
          )}

          {currentQ.type === 'text' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
              placeholder="Type your answer..."
              rows={4}
              className="w-full bg-white/[0.05] text-white text-sm px-4 py-3 rounded-xl outline-none resize-none border border-white/5 focus:border-blue-500/30 transition-colors placeholder:text-slate-600"
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(s => s - 1)}
            className="flex-1 py-3 bg-app-surface text-white rounded-xl text-sm font-medium hover:bg-app-surface-light transition-colors"
          >Back</button>
        )}
        {currentStep < questions.length - 1 ? (
          <button
            onClick={() => setCurrentStep(s => s + 1)}
            className="flex-1 py-3 btn-primary text-sm"
          >Next</button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isComplete || submitting}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              isComplete && !submitting
                ? 'btn-primary'
                : 'bg-app-surface text-slate-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CoachQuestionnaire;
