const MigrationBanner = ({ onMigrate, onDismiss, syncing }) => {
  return (
    <div className="bg-blue-900/30 border border-blue-500/40 rounded-xl p-4 mb-4">
      <div className="text-sm font-semibold text-blue-400 mb-2">
        Existing Data Found
      </div>
      <p className="text-xs text-slate-400 mb-3">
        You have workout data saved on this device. Would you like to upload it to your account so it syncs across devices?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onMigrate}
          disabled={syncing}
          className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 disabled:bg-slate-600 transition-colors"
        >
          {syncing ? 'Uploading...' : 'Upload Data'}
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default MigrationBanner;
