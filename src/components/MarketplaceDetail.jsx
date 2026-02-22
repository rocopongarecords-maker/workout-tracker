import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Users, Calendar, Dumbbell, Clock, MessageSquare, Share2, Pencil, EyeOff, Loader2 } from 'lucide-react';

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

const CATEGORY_COLORS = {
  hypertrophy: 'bg-purple-500/20 text-purple-400',
  strength: 'bg-orange-500/20 text-orange-400',
  endurance: 'bg-cyan-500/20 text-cyan-400',
  hyrox: 'bg-amber-500/20 text-amber-400',
  bodyweight: 'bg-emerald-500/20 text-emerald-400',
  powerlifting: 'bg-red-500/20 text-red-400',
};

const MarketplaceDetail = ({ program, marketplace, saveCustomProgram, userId, onViewFeed, onShare, onBack }) => {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const isSubscribed = (marketplace.mySubscriptions || []).some(
    (sub) => sub.program_id === program.id || sub.id === program.id
  );
  const isAuthor = userId && program.author_id === userId;

  // Load ratings on mount
  useEffect(() => {
    if (program.id) {
      loadRatings();
      marketplace.refreshSubscriptions?.();
    }
  }, [program.id]);

  const loadRatings = async () => {
    try {
      const result = await marketplace.getRatings(program.id);
      if (result) setRatings(result);
    } catch (e) {
      console.error('Failed to load ratings:', e);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
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
      await marketplace.refreshSubscriptions?.();
    } catch (e) {
      console.error('Failed to subscribe:', e);
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    setSubscribing(true);
    try {
      await marketplace.unsubscribe(program.id);
      await marketplace.refreshSubscriptions?.();
    } catch (e) {
      console.error('Failed to unsubscribe:', e);
    } finally {
      setSubscribing(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating) return;
    setSubmittingRating(true);
    try {
      await marketplace.rateProgram(program.id, userRating, reviewText);
      setReviewText('');
      setUserRating(0);
      await loadRatings();
    } catch (e) {
      console.error('Failed to submit rating:', e);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    try {
      await marketplace.unpublish(program.id);
      onBack();
    } catch (e) {
      console.error('Failed to unpublish:', e);
    } finally {
      setUnpublishing(false);
    }
  };

  const workoutDays = program.program_data?.workoutDays || [];
  const categoryKey = (program.category || '').toLowerCase();
  const difficultyKey = (program.difficulty || '').toLowerCase();

  return (
    <div className="space-y-6 pb-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
        <ArrowLeft size={20} /> Back
      </button>

      {/* Program header */}
      <div>
        <h2 className="text-2xl font-bold text-white">{program.name}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {program.is_builtin ? (
            <span className="text-amber-400 font-medium">by ZWAR</span>
          ) : (
            <span>by {program.authorEmoji || '👤'} {program.authorName || 'Anonymous'}</span>
          )}
        </p>
        {program.description && (
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">{program.description}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Calendar size={18} className="mx-auto text-blue-400 mb-1" />
          <p className="text-white font-bold">{program.weeks || '?'}</p>
          <p className="text-xs text-slate-400">Weeks</p>
        </div>
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Dumbbell size={18} className="mx-auto text-purple-400 mb-1" />
          <p className="text-white font-bold">{program.days_per_week || '?'}</p>
          <p className="text-xs text-slate-400">Days/wk</p>
        </div>
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Users size={18} className="mx-auto text-green-400 mb-1" />
          <p className="text-white font-bold">{program.subscriber_count || 0}</p>
          <p className="text-xs text-slate-400">Subs</p>
        </div>
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4 text-center">
          <Star size={18} className="mx-auto text-yellow-400 mb-1" />
          <p className="text-white font-bold">{program.avg_rating ? program.avg_rating.toFixed(1) : '--'}</p>
          <p className="text-xs text-slate-400">Rating</p>
        </div>
      </div>

      {/* Category + Difficulty pills */}
      <div className="flex gap-2">
        {program.category && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[categoryKey] || 'bg-app-surface-light/50 text-slate-300'}`}>
            {program.category}
          </span>
        )}
        {program.difficulty && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[difficultyKey] || 'bg-app-surface-light/50 text-slate-300'}`}>
            {program.difficulty}
          </span>
        )}
      </div>

      {/* Workout schedule preview */}
      {workoutDays.length > 0 && (
        <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Workout Schedule</h3>
          <div className="space-y-2">
            {workoutDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-white text-sm">{day.name || `Day ${index + 1}`}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {day.exercises?.length || 0} exercise{(day.exercises?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribe / Unsubscribe button */}
      {!isAuthor && (
        <button
          onClick={isSubscribed ? handleUnsubscribe : () => { setDisclaimerChecked(false); setShowDisclaimer(true); }}
          disabled={subscribing}
          className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
            isSubscribed
              ? 'bg-app-surface-light text-slate-300 hover:bg-app-surface-light/80'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
          }`}
        >
          {subscribing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isSubscribed ? (
            'Unsubscribe'
          ) : (
            'Subscribe'
          )}
        </button>
      )}

      {/* Disclaimer modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowDisclaimer(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-[rgb(15,23,41)] border border-white/[0.08] rounded-t-2xl p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-1">Before you subscribe</h3>
            <p className="text-slate-400 text-sm mb-5">Please read and agree to continue.</p>

            <ul className="space-y-3 mb-6">
              {[
                'This program is user-generated content and has not been reviewed by a certified professional.',
                'Results vary based on individual effort, nutrition, recovery, and health status.',
                'This is not medical advice. Consult a physician before starting any new exercise program.',
                'You remain solely responsible for your health and safety during all training.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-300">I understand and accept these terms</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-slate-400 bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDisclaimer(false); handleSubscribe(); }}
                disabled={!disclaimerChecked}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Confirm & Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Author actions */}
      {isAuthor && (
        <div className="flex gap-3">
          <button
            onClick={() => onShare?.(program)}
            className="flex-1 bg-app-surface/50 border border-white/[0.08] rounded-xl px-4 py-3 text-white font-semibold flex items-center justify-center gap-2 hover:border-blue-500/30 transition-colors"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={handleUnpublish}
            disabled={unpublishing}
            className="flex-1 bg-app-surface/50 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          >
            {unpublishing ? <Loader2 size={16} className="animate-spin" /> : <EyeOff size={16} />}
            Unpublish
          </button>
        </div>
      )}

      {/* Rating section */}
      <div className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3">Rate this Program</h3>

        {/* Star picker */}
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= (hoverRating || userRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-600'
                }
              />
            </button>
          ))}
        </div>

        {/* Review textarea */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write a review (optional)..."
          rows={3}
          className="w-full bg-app-bg/50 border border-white/[0.08] rounded-xl p-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-blue-500/50 mb-3"
        />

        {/* Submit button */}
        <button
          onClick={handleSubmitRating}
          disabled={!userRating || submittingRating}
          className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
            userRating
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
              : 'bg-app-surface-light text-slate-500 cursor-not-allowed'
          }`}
        >
          {submittingRating ? <Loader2 size={18} className="animate-spin" /> : 'Submit Rating'}
        </button>
      </div>

      {/* Existing ratings list */}
      {ratings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Reviews ({ratings.length})</h3>
          {ratings.map((rating, index) => (
            <div key={index} className="bg-app-surface/50 border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-app-surface-light flex items-center justify-center text-sm">
                  {rating.authorEmoji || '👤'}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{rating.authorName || 'Anonymous'}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={
                          star <= rating.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-600'
                        }
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {rating.created_at ? new Date(rating.created_at).toLocaleDateString() : ''}
                </span>
              </div>
              {rating.review && (
                <p className="text-sm text-slate-300 leading-relaxed">{rating.review}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View Feed + Share buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onViewFeed?.(program)}
          className="flex-1 bg-app-surface/50 border border-white/[0.08] rounded-xl px-4 py-3 text-white font-semibold flex items-center justify-center gap-2 hover:border-blue-500/30 transition-colors"
        >
          <MessageSquare size={16} /> View Feed
        </button>
        <button
          onClick={() => onShare?.(program)}
          className="flex-1 bg-app-surface/50 border border-white/[0.08] rounded-xl px-4 py-3 text-white font-semibold flex items-center justify-center gap-2 hover:border-blue-500/30 transition-colors"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default MarketplaceDetail;
