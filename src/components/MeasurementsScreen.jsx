import { useState } from 'react';
import { calculateBF3Site, calculateBF7Site } from '../utils/calculateBF';
import SimpleLineChart from './charts/SimpleLineChart';

const MeasurementsScreen = ({ weightLog, skinfoldLog, onSaveWeight, onSaveSkinfold, onBack }) => {
  const [activeTab, setActiveTab] = useState('weight');

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Measurements</h1>
        <p className="text-slate-400 text-sm">Track body weight & body fat</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'weight'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setActiveTab('bodyfat')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'bodyfat'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Body Fat %
        </button>
      </div>

      {activeTab === 'weight' && (
        <WeightTab weightLog={weightLog} onSave={onSaveWeight} />
      )}
      {activeTab === 'bodyfat' && (
        <BodyFatTab skinfoldLog={skinfoldLog} onSave={onSaveSkinfold} />
      )}
    </div>
  );
};

const WeightTab = ({ weightLog, onSave }) => {
  const [weight, setWeight] = useState('');
  const log = weightLog || [];

  const chartData = log.slice(-20).map(entry => ({
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
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="text-sm text-slate-400 mb-2">Log Today's Weight</div>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            className="flex-1 bg-slate-900 text-white p-3 rounded-lg text-center font-semibold border-2 border-slate-600 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSave}
            disabled={!weight}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Stats */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{latest.weight}</div>
            <div className="text-xs text-slate-400 mt-1">Current (kg)</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${
              diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-slate-400'
            }`}>
              {diff !== null ? `${diff > 0 ? '+' : ''}${diff}` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Change (kg)</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Weight History</h2>
        <SimpleLineChart data={chartData} color="#3b82f6" height={160} />
      </div>

      {/* History list */}
      {log.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Recent Entries</h2>
          <div className="space-y-1">
            {[...log].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-slate-700/50 last:border-0">
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

  const chartData = log.slice(-20).map(entry => ({
    value: entry.bf,
    label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-4">
      {/* Protocol selection */}
      <div className="bg-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setProtocol('3site'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              protocol === '3site' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            JP 3-Site
          </button>
          <button
            onClick={() => { setProtocol('7site'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              protocol === '7site' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            JP 7-Site
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setSex('male'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              sex === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => { setSex('female'); setSites({}); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              sex === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'
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
            className="w-full bg-slate-900 text-white p-2 rounded-lg text-center font-semibold border-2 border-slate-600 focus:border-blue-500 outline-none text-sm"
          />
        </div>

        <div className="text-xs text-slate-400 mb-1">Skinfold Measurements (mm)</div>
        <div className={`grid ${protocol === '7site' ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
          {fields.map(field => (
            <div key={field.key}>
              <div className="text-[10px] text-slate-500 mb-1 text-center">{field.label}</div>
              <input
                type="number"
                step="0.5"
                value={sites[field.key] || ''}
                onChange={(e) => setSites(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder="mm"
                className="w-full bg-slate-900 text-white p-2 rounded-lg text-center font-semibold border-2 border-slate-600 focus:border-blue-500 outline-none text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{result}%</div>
            <div className="text-xs text-slate-400 mt-1">Estimated Body Fat</div>
            <button
              onClick={handleSave}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              Save to Log
            </button>
          </div>
        )}
      </div>

      {/* BF% Chart */}
      {chartData.length >= 2 && (
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Body Fat % History</h2>
          <SimpleLineChart data={chartData} color="#a855f7" height={160} />
        </div>
      )}

      {/* History */}
      {log.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Recent Measurements</h2>
          <div className="space-y-1">
            {[...log].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-slate-700/50 last:border-0">
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

export default MeasurementsScreen;
