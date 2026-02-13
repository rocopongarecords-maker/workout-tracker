import { useState, useRef } from 'react';

const SettingsScreen = ({ data, user, onSignOut, onReset, onImport, onBack }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const isV1 = imported.completedWorkouts && imported.workoutHistory;
        const isV2 = imported.programData;
        if (!isV1 && !isV2) {
          setImportStatus({ type: 'error', message: 'Invalid backup file format.' });
          return;
        }
        onImport(imported);
        setImportStatus({ type: 'success', message: 'Data restored successfully!' });
      } catch {
        setImportStatus({ type: 'error', message: 'Could not read file. Make sure it is a valid JSON backup.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  const completedCount = data.completedWorkouts?.length || 0;
  const historyCount = Object.keys(data.workoutHistory || {}).length;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <div className="w-16" />
      </div>

      {user && (
        <div className="glass-card-elevated p-5 space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              {(user.email || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{user.user_metadata?.full_name || user.email}</div>
              <div className="text-xs text-slate-400">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full py-2 btn-secondary text-sm"
          >
            Sign Out
          </button>
        </div>
      )}

      <div className="glass-card p-5 space-y-4 animate-fade-in-up stagger-1">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Data</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="stat-number text-xl">{completedCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Workouts Done</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="stat-number text-xl">{historyCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">With Data</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 space-y-4 animate-fade-in-up stagger-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backup & Restore</h3>
        <p className="text-xs text-slate-500">
          Export your workout data as a JSON file to keep a backup. Import a previous backup to restore your data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-3 btn-primary"
          >
            Export Data
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 py-3 btn-secondary"
          >
            Import Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {importStatus && (
          <div className={`text-sm px-3 py-2 rounded-lg ${
            importStatus.type === 'success'
              ? 'bg-green-900/30 text-green-400 border border-green-500/20'
              : 'bg-red-900/30 text-red-400 border border-red-500/20'
          }`}>
            {importStatus.message}
          </div>
        )}
      </div>

      <div className="glass-card border-red-500/20 p-5 space-y-4 animate-fade-in-up stagger-3">
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Danger Zone</h3>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 btn-danger"
          >
            Reset All Data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-300">
              This will permanently delete all workout data including completed workouts and exercise history. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
