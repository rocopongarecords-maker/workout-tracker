import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Star, BarChart3, Loader2, ChevronRight, BookOpen } from 'lucide-react';

const CreatorDashboard = ({ marketplace, onSelectProgram, onBack }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await marketplace.getAnalytics?.();
      if (result) setAnalytics(result);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const published = marketplace.myPublished || [];

  // Compute totals from published programs
  const totalSubscribers = published.reduce((sum, p) => sum + (p.subscriber_count || 0), 0);
  const totalRatings = published.reduce((sum, p) => sum + (p.rating_count || 0), 0);
  const avgRating = published.length > 0
    ? published.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / published.filter(p => p.avg_rating).length || 0
    : 0;

  // Find max subscribers for bar scaling
  const maxSubs = Math.max(1, ...published.map((p) => p.subscriber_count || 0));

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-2xl font-bold text-white">Creator Dashboard</h2>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-2xl font-bold text-white">Creator Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">Track your published programs</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Users size={20} className="mx-auto text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{totalSubscribers}</p>
          <p className="text-xs text-slate-400 mt-1">Total Subscribers</p>
        </div>
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <BarChart3 size={20} className="mx-auto text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">{totalRatings}</p>
          <p className="text-xs text-slate-400 mt-1">Total Ratings</p>
        </div>
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Star size={20} className="mx-auto text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">{avgRating ? avgRating.toFixed(1) : '--'}</p>
          <p className="text-xs text-slate-400 mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Published programs section */}
      <div>
        <h3 className="text-white font-semibold mb-3">Your Published Programs</h3>

        {published.length === 0 ? (
          <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-8 text-center">
            <BookOpen size={40} className="mx-auto text-slate-500 mb-3" />
            <h4 className="text-white font-semibold mb-1">No Published Programs</h4>
            <p className="text-sm text-slate-400">
              Create a custom program and publish it to the marketplace to start building your audience.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {published.map((program) => {
              const subPercent = maxSubs > 0 ? ((program.subscriber_count || 0) / maxSubs) * 100 : 0;

              return (
                <button
                  key={program.id}
                  onClick={() => onSelectProgram(program)}
                  className="w-full bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-left hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold truncate flex-1 mr-2">{program.name}</h4>
                    <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                  </div>

                  {/* Subscriber count bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Subscribers</span>
                      <span className="text-white font-medium">{program.subscriber_count || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-app-surface-light/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${subPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Rating + Info */}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Star size={12} className={program.avg_rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'} />
                      <span>{program.avg_rating ? program.avg_rating.toFixed(1) : '--'}</span>
                      {program.rating_count > 0 && (
                        <span>({program.rating_count})</span>
                      )}
                    </div>
                    <span>{program.weeks || '?'} weeks</span>
                    <span>{program.days_per_week || '?'} days/wk</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      program.visibility === 'public' ? 'text-green-400' :
                      program.visibility === 'invite_only' ? 'text-blue-400' :
                      'text-slate-500'
                    }`}>
                      {program.visibility === 'public' ? 'Public' :
                       program.visibility === 'invite_only' ? 'Invite Only' : 'Private'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
