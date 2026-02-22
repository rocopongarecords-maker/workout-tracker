import { useState } from 'react';
import { calculateBF3Site, calculateBF7Site } from '../utils/calculateBF';
import { weighingGuide, skinfoldGuide, skinfoldSites } from '../data/measurementGuide';
import SimpleLineChart from './charts/SimpleLineChart';

const GuidanceCard = ({ title, tips }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-blue-400 flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-xs">{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SiteInfoButton = ({ siteKey }) => {
  const [show, setShow] = useState(false);
  const site = skinfoldSites[siteKey];
  if (!site) return null;
  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="p-0.5 text-slate-500 hover:text-blue-400 transition-colors"
        title={`Info: ${site.label}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
      </button>
      {show && (
        <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-app-surface border border-white/[0.08] rounded-lg p-2.5 shadow-lg">
          <p className="text-[10px] text-slate-300 mb-1">{site.description}</p>
          <p className="text-[10px] text-blue-400">Tip: {site.tip}</p>
        </div>
      )}
    </>
  );
};

const MeasurementsScreen = ({ weightLog, skinfoldLog, moodLog, onSaveWeight, onSaveSkinfold, onSaveMood, onBack }) => {
  const [activeTab, setActiveTab] = useState('weight');

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
        <h1 className="text-2xl font-bold text-white mb-1">Measurements</h1>
        <p className="text-slate-400 text-sm">Track body weight, body fat & mood</p>
      </div>

      {/* Tabs */}
      <div className="flex glass-card p-1 gap-1">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'weight'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setActiveTab('bodyfat')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'bodyfat'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Body Fat %
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'mood'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Mood
        </button>
      </div>

      {activeTab === 'weight' && (
        <>
          <GuidanceCard title={weighingGuide.title} tips={weighingGuide.tips} />
          <WeightTab weightLog={weightLog} onSave={onSaveWeight} />
        </>
      )}
      {activeTab === 'bodyfat' && (
        <>
          <GuidanceCard title={skinfoldGuide.title} tips={skinfoldGuide.tips} />
          <BodyFatTab skinfoldLog={skinfoldLog} onSave={onSaveSkinfold} />
        </>
      )}
      {activeTab === 'mood' && (
        <MoodTab moodLog={moodLog} onSave={onSaveMood} />
      )}
    </div>
  );
};

const WeightTab = ({ weightLog, onSave }) => {
  const [weight, setWeight] = useState('');
  const log = weightLog || [];

  const chartData = log.slice(-30).map(entry => ({
    value: entry.weight,
    label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const handleSave = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    onSave({ date: new Date().toISOString(), weight: w });
    setWeight('');
  };

  const latest = log.length > 0 ? log[log.length - 1] : null;
  const prev = log.length > 1 ? log[log.length - 2] : null;
  const diff = latest && prev ? (latest.weight - prev.weight).toFixed(1) : null;

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="glass-card p-4 animate-fade-in-up">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Log Today's Weight</div>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            className="flex-1 bg-black/20 text-white p-3 rounded-lg text-center font-semibold border border-white/[0.08] focus:border-blue-500/50 outline-none"
          />
          <button
            onClick={handleSave}
            disabled={!weight}
            className="px-6 py-3 btn-primary disabled:bg-app-surface-light disabled:text-slate-400 disabled:shadow-none"
          >
            Save
          </button>
        </div>
      </div>

      {/* Stats */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
            <div className="stat-number text-2xl">{latest.weight}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Current (kg)</div>
          </div>
          <div className="glass-card p-4 text-center animate-fade-in-up stagger-2">
            <div className={`stat-number text-2xl ${
              diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-slate-400'
            }`}>
              {diff !== null ? `${diff > 0 ? '+' : ''}${diff}` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Change (kg)</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass-card p-4 animate-fade-in-up stagger-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Weight History</h2>
        <SimpleLineChart data={chartData} color="#3b82f6" height={160} />
      </div>

      {/* History list */}
      {log.length > 0 && (
        <div className="glass-card p-4 animate-fade-in-up stagger-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Entries</h2>
          <div className="space-y-1">
            {[...log].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                <span className="text-slate-400">
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-white font-semibold">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BodyFatTab = ({ skinfoldLog, onSave }) => {
  const [protocol, setProtocol] = useState('3site');
  const [sex, setSex] = useState('male');
  const [age, setAge] = useState('');
  const [sites, setSites] = useState({});
  const [result, setResult] = useState(null);

  const log = skinfoldLog || [];

  const siteFields3Male = [
    { key: 'chest', label: 'Chest' },
    { key: 'abdomen', label: 'Abdomen' },
    { key: 'thigh', label: 'Thigh' }
  ];

  const siteFields3Female = [
    { key: 'triceps', label: 'Triceps' },
    { key: 'suprailiac', label: 'Suprailiac' },
    { key: 'thigh', label: 'Thigh' }
  ];

  const siteFields7 = [
    { key: 'chest', label: 'Chest' },
    { key: 'midaxillary', label: 'Midaxillary' },
    { key: 'triceps', label: 'Triceps' },
    { key: 'subscapular', label: 'Subscapular' },
    { key: 'abdomen', label: 'Abdomen' },
    { key: 'suprailiac', label: 'Suprailiac' },
    { key: 'thigh', label: 'Thigh' }
  ];

  const fields = protocol === '3site'
    ? (sex === 'male' ? siteFields3Male : siteFields3Female)
    : siteFields7;

  const handleCalculate = () => {
    const a = parseInt(age);
    if (!a) return;

    const bf = protocol === '3site'
      ? calculateBF3Site(sites, a, sex)
      : calculateBF7Site(sites, a, sex);

    if (bf !== null) {
      setResult(bf);
    }
  };

  const handleSave = () => {
    if (result === null) return;
    onSave({
      date: new Date().toISOString(),
      protocol,
      sex,
      age: parseInt(age),
      sites: { ...sites },
      bf: result
    });
    setSites({});
    setAge('');
    setResult(null);
  };

  const chartData = log.slice(-30).map(entry => ({
    value: entry.bf,
    label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-4">
      {/* Protocol selection */}
      <div className="glass-card p-4 space-y-3 animate-fade-in-up">
        <div className="flex gap-2">
          <button
            onClick={() => { setProtocol('3site'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              protocol === '3site' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white/[0.05] text-slate-400'
            }`}
          >
            JP 3-Site
          </button>
          <button
            onClick={() => { setProtocol('7site'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              protocol === '7site' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white/[0.05] text-slate-400'
            }`}
          >
            JP 7-Site
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setSex('male'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              sex === 'male' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white/[0.05] text-slate-400'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => { setSex('female'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              sex === 'female' ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25' : 'bg-white/[0.05] text-slate-400'
            }`}
          >
            Female
          </button>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-1">Age</div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Years"
            className="w-full bg-black/20 text-white p-2 rounded-lg text-center font-semibold border border-white/[0.08] focus:border-blue-500/50 outline-none text-sm"
          />
        </div>

        <div className="text-xs text-slate-400 mb-1">Skinfold Measurements (mm)</div>
        <div className={`grid ${protocol === '7site' ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
          {fields.map(field => (
            <div key={field.key} className="relative">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[10px] text-slate-500">{field.label}</span>
                <SiteInfoButton siteKey={field.key} />
              </div>
              <input
                type="number"
                step="0.5"
                value={sites[field.key] || ''}
                onChange={(e) => setSites(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder="mm"
                className="w-full bg-black/20 text-white p-2 rounded-lg text-center font-semibold border border-white/[0.08] focus:border-blue-500/50 outline-none text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2.5 btn-primary text-sm"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="glass-card border-purple-500/30 p-4 text-center shadow-glow-purple">
            <div className="stat-number text-3xl text-purple-400">{result}%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Estimated Body Fat</div>
            <button
              onClick={handleSave}
              className="mt-3 px-4 py-2 btn-primary text-sm"
            >
              Save to Log
            </button>
          </div>
        )}
      </div>

      {/* BF% Chart */}
      {chartData.length >= 2 && (
        <div className="glass-card p-4 animate-fade-in-up stagger-1">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Body Fat % History</h2>
          <SimpleLineChart data={chartData} color="#a855f7" height={160} />
        </div>
      )}

      {/* History */}
      {log.length > 0 && (
        <div className="glass-card p-4 animate-fade-in-up stagger-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Measurements</h2>
          <div className="space-y-1">
            {[...log].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                <span className="text-slate-400">
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-slate-500 text-xs">{entry.protocol === '7site' ? '7-site' : '3-site'}</span>
                <span className="text-purple-400 font-semibold">{entry.bf}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MOOD_OPTIONS = [
  { rating: 1, emoji: '😩', label: 'Rough' },
  { rating: 2, emoji: '😟', label: 'Low' },
  { rating: 3, emoji: '😐', label: 'Okay' },
  { rating: 4, emoji: '😊', label: 'Good' },
  { rating: 5, emoji: '😄', label: 'Great' },
];

const MOOD_FACTORS = [
  'Poor sleep',
  'High stress',
  'Low energy',
  'Poor nutrition',
  'Injury',
  'Work/personal issues',
  'Missed workouts',
];

const MoodTab = ({ moodLog, onSave }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [note, setNote] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState(new Set());

  const log = moodLog || [];

  const toggleFactor = (factor) => {
    setSelectedFactors(prev => {
      const next = new Set(prev);
      if (next.has(factor)) next.delete(factor);
      else next.add(factor);
      return next;
    });
  };

  const handleSave = () => {
    if (!selectedRating) return;
    onSave({
      date: new Date().toISOString(),
      rating: selectedRating,
      note: note.trim(),
      factors: [...selectedFactors],
    });
    setSelectedRating(null);
    setNote('');
    setShowAdvanced(false);
    setSelectedFactors(new Set());
  };

  const today = new Date().toDateString();
  const todayEntry = [...log].reverse().find(e => new Date(e.date).toDateString() === today);
  const last7 = log.filter(e => {
    const d = new Date(e.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return d >= cutoff;
  });
  const avg7 = last7.length >= 2
    ? Math.round(last7.reduce((s, e) => s + e.rating, 0) / last7.length)
    : null;

  const moodForRating = (r) => MOOD_OPTIONS.find(m => m.rating === r);

  return (
    <div className="space-y-4">
      {/* Logger card */}
      <div className="glass-card p-4 space-y-4 animate-fade-in-up">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          How are you feeling right now?
        </div>

        {/* Emoji row */}
        <div className="flex justify-between gap-1">
          {MOOD_OPTIONS.map(({ rating, emoji, label }) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                selectedRating === rating
                  ? 'bg-gradient-to-b from-green-500 to-green-600 shadow-lg shadow-green-500/25'
                  : 'bg-white/[0.05] hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className={`text-[10px] font-medium ${selectedRating === rating ? 'text-white' : 'text-slate-500'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Note input — shown once a rating is selected */}
        {selectedRating !== null && (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note… (optional)"
            className="w-full bg-black/20 text-white p-3 rounded-lg border border-white/[0.08] focus:border-green-500/50 outline-none text-sm placeholder:text-slate-600"
          />
        )}

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          Advanced
        </button>

        {/* Factor pills */}
        {showAdvanced && (
          <div className="flex flex-wrap gap-2 animate-fade-in-up">
            {MOOD_FACTORS.map(factor => (
              <button
                key={factor}
                onClick={() => toggleFactor(factor)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedFactors.has(factor)
                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-slate-300'
                }`}
              >
                {factor}
              </button>
            ))}
          </div>
        )}

        {/* Log button */}
        <button
          onClick={handleSave}
          disabled={!selectedRating}
          className="w-full py-3 btn-primary disabled:bg-app-surface-light disabled:text-slate-400 disabled:shadow-none"
        >
          Log Mood
        </button>
      </div>

      {/* Stats row */}
      {log.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 text-center animate-fade-in-up stagger-1">
            <div className="text-3xl mb-1">{todayEntry ? moodForRating(todayEntry.rating)?.emoji : '—'}</div>
            <div className="text-sm font-semibold text-white">{todayEntry ? moodForRating(todayEntry.rating)?.label : 'No entry'}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Today</div>
          </div>
          <div className="glass-card p-4 text-center animate-fade-in-up stagger-2">
            <div className="text-3xl mb-1">{avg7 !== null ? moodForRating(avg7)?.emoji : '—'}</div>
            <div className="text-sm font-semibold text-white">{avg7 !== null ? moodForRating(avg7)?.label : 'Not enough data'}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">7-Day Avg</div>
          </div>
        </div>
      )}

      {/* History */}
      {log.length > 0 && (
        <div className="glass-card p-4 animate-fade-in-up stagger-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Entries</h2>
          <div className="space-y-2">
            {[...log].reverse().slice(0, 10).map((entry, i) => {
              const mood = moodForRating(entry.rating);
              return (
                <div key={i} className="border-b border-white/5 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mood?.emoji}</span>
                      <span className="text-sm font-semibold text-white">{mood?.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-slate-400 mt-1 pl-8 truncate">{entry.note}</p>
                  )}
                  {entry.factors?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 pl-8">
                      {entry.factors.map(f => (
                        <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsScreen;
