import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Calendar, Dumbbell, Users, Star } from 'lucide-react';

const InviteJoin = ({ token, marketplace, saveCustomProgram, onBack, onJoined }) => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Resolve invite on mount
  useEffect(() => {
    if (token) {
      resolveInvite();
    } else {
      setError('No invite token provided.');
      setLoading(false);
    }
  }, [token]);

  const resolveInvite = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplace.resolveInvite(token);
      if (result) {
        setProgram(result);
      } else {
        setError('This invite link is invalid or has expired.');
      }
    } catch (e) {
      console.error('Failed to resolve invite:', e);
      setError(e.message || 'Failed to resolve invite. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!program || joining) return;
    setJoining(true);
    try {
      await marketplace.subscribe(program.id);
      // Save a local copy of the program data if available
      if (saveCustomProgram && program.program_data) {
        saveCustomProgram({
          ...program.program_data,
          id: program.id,
          name: program.name,
          marketplaceId: program.id,
        });
      }
      setJoined(true);
      onJoined?.(program);
    } catch (e) {
      console.error('Failed to join:', e);
      setError(e.message || 'Failed to join program. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={40} className="text-blue-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Resolving invite...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !program) {
    return (
      <div className="space-y-6 pb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Invalid Invite</h3>
          <p className="text-slate-400 text-sm text-center max-w-sm">{error}</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-semibold hover:border-slate-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (joined) {
    return (
      <div className="space-y-6 pb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">You're In!</h3>
          <p className="text-slate-400 text-sm text-center max-w-sm">
            You've successfully joined <span className="text-white font-medium">{program.name}</span>.
            It's now available in your programs.
          </p>
          <button
            onClick={onBack}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Program card + Join state
  return (
    <div className="space-y-6 pb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">You've Been Invited</h2>
        <p className="text-sm text-slate-400 mt-1">Join this program and start training</p>
      </div>

      {/* Program card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-1">{program.name}</h3>
        <p className="text-sm text-slate-400 mb-3">
          {program.is_builtin ? (
            <span className="text-amber-400 font-medium">by ZWAR</span>
          ) : (
            <span>by {program.authorEmoji || '👤'} {program.authorName || 'Anonymous'}</span>
          )}
        </p>

        {program.description && (
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{program.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <Calendar size={16} className="mx-auto text-blue-400 mb-1" />
            <p className="text-white text-sm font-bold">{program.weeks || '?'}</p>
            <p className="text-xs text-slate-500">Weeks</p>
          </div>
          <div className="text-center">
            <Dumbbell size={16} className="mx-auto text-purple-400 mb-1" />
            <p className="text-white text-sm font-bold">{program.days_per_week || '?'}</p>
            <p className="text-xs text-slate-500">Days/wk</p>
          </div>
          <div className="text-center">
            <Users size={16} className="mx-auto text-green-400 mb-1" />
            <p className="text-white text-sm font-bold">{program.subscriber_count || 0}</p>
            <p className="text-xs text-slate-500">Subs</p>
          </div>
          <div className="text-center">
            <Star size={16} className="mx-auto text-yellow-400 mb-1" />
            <p className="text-white text-sm font-bold">{program.avg_rating ? program.avg_rating.toFixed(1) : '--'}</p>
            <p className="text-xs text-slate-500">Rating</p>
          </div>
        </div>
      </div>

      {/* Error if join failed */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Join button */}
      <button
        onClick={handleJoin}
        disabled={joining}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        {joining ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Joining...
          </>
        ) : (
          'Join Program'
        )}
      </button>
    </div>
  );
};

export default InviteJoin;
