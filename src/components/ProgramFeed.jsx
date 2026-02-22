import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Pin, Loader2 } from 'lucide-react';

const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

const ProgramFeed = ({ programId, programName, marketplace, userId, onBack }) => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const feedEndRef = useRef(null);

  // Load feed on mount
  useEffect(() => {
    if (programId) {
      loadFeed();
    }
  }, [programId]);

  // Scroll to bottom when posts change
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const result = await marketplace.getFeed(programId);
      if (result) {
        // Sort: pinned first, then by date descending
        const sorted = [...result].sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return new Date(a.created_at) - new Date(b.created_at);
        });
        setPosts(sorted);
      }
    } catch (e) {
      console.error('Failed to load feed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await marketplace.postToFeed(programId, trimmed);
      setMessage('');
      await loadFeed();
    } catch (e) {
      console.error('Failed to post:', e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-2xl font-bold text-white">{programName || 'Program Feed'}</h2>
        <p className="text-sm text-slate-400 mt-1">Discussion and updates</p>
      </div>

      {/* Feed posts */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-blue-400 animate-spin" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No posts yet. Start the conversation!</p>
          </div>
        )}

        {!loading && posts.map((post, index) => (
          <div
            key={post.id || index}
            className={`bg-app-surface/50 border rounded-2xl p-4 ${
              post.is_pinned ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/[0.08]'
            }`}
          >
            {/* Pinned badge */}
            {post.is_pinned && (
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-2">
                <Pin size={12} />
                <span>Pinned</span>
              </div>
            )}

            {/* Author + Timestamp */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{post.authorEmoji || '👤'}</span>
              <span className="text-white text-sm font-medium">{post.authorName || 'Anonymous'}</span>
              <span className="text-xs text-slate-500 ml-auto">{getRelativeTime(post.created_at)}</span>
            </div>

            {/* Message */}
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{post.message}</p>
          </div>
        ))}

        <div ref={feedEndRef} />
      </div>

      {/* Bottom input bar */}
      <div className="sticky bottom-0 pt-3 pb-2 bg-app-bg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="flex-1 bg-app-surface/50 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className={`p-3 rounded-xl transition-colors ${
              message.trim() && !sending
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                : 'bg-app-surface text-slate-500 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramFeed;
