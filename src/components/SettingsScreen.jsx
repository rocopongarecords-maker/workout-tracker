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
        // Accept both v1 (completedWorkouts/workoutHistory) and v2 (programData) formats
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
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back
        </button>
      </div>

      {user && (
        <div className="bg-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Account</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {(user.email || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{user.user_metadata?.full_name || user.email}</div>
              <div className="text-xs text-slate-400">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Your Data</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{completedCount}</div>
            <div className="text-xs text-slate-400">Workouts Done</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{historyCount}</div>
            <div className="text-xs text-slate-400">With Data</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Backup & Restore</h3>
        <p className="text-xs text-slate-500">
          Export your workout data as a JSON file to keep a backup. Import a previous backup to restore your data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Export Data
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
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
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}>
            {importStatus.message}
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">Danger Zone</h3>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 bg-red-500/20 text-red-400 border-2 border-red-500/40 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
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
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
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
