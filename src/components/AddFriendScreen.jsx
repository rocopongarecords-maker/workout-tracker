import { useState } from 'react';
import { Copy, Check, Send } from 'lucide-react';

const AddFriendScreen = ({ social = {}, onBack }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  const {
    profile = {},
    sendFriendRequest,
  } = social;

  const myCode = profile.friend_code || '';

  const handleCopy = async () => {
    if (!myCode) return;
    try {
      await navigator.clipboard.writeText(myCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSend = async () => {
    if (code.length < 6) return;
    setStatus(null);
    try {
      await sendFriendRequest?.(code.toUpperCase());
      setStatus({ type: 'success', message: 'Friend request sent!' });
      setCode('');
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Could not send request. Check the code and try again.' });
    }
  };

  const getBorderColor = () => {
    if (code.length === 0) return 'rgba(255,255,255,0.08)';
    if (code.length >= 8) return 'rgba(34, 197, 94, 0.5)';
    if (code.length >= 6) return 'rgba(249, 115, 22, 0.5)';
    return 'rgba(255,255,255,0.08)';
  };

  const getValidationText = () => {
    if (code.length === 0) return '';
    if (code.length < 6) return `${6 - code.length} more characters needed`;
    if (code.length >= 8) return 'Ready to send';
    return 'Minimum reached — 8 chars recommended';
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Add Friend</h1>
        <p className="text-sm text-slate-400">Share codes to connect</p>
      </div>

      {/* My Friend Code */}
      <div className="glass-card p-6 text-center animate-fade-in-up">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Friend Code</h2>
        <div
          className="text-2xl font-mono font-bold tracking-[0.3em] text-white py-3 px-4 rounded-xl mb-3"
          style={{ backgroundColor: 'rgb(var(--bg-surface-light))' }}
        >
          {myCode || '--------'}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgb(var(--bg-surface-light))',
            color: copied ? 'rgb(34, 197, 94)' : 'rgb(var(--color-primary))',
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <p className="text-[10px] text-slate-600 mt-3">Share this code with friends so they can find you</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-4">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-slate-600 font-medium">OR</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Enter Friend Code */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Enter Friend Code</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
            placeholder="ENTER CODE"
            maxLength={8}
            className="w-full text-center text-xl font-mono font-bold tracking-[0.3em] py-3 px-4 rounded-xl bg-transparent outline-none text-white placeholder:text-slate-700 transition-all"
            style={{ border: `2px solid ${getBorderColor()}` }}
          />
          {getValidationText() && (
            <p className={`text-[10px] text-center ${code.length >= 8 ? 'text-green-400' : code.length >= 6 ? 'text-orange-400' : 'text-slate-500'}`}>
              {getValidationText()}
            </p>
          )}
          <button
            onClick={handleSend}
            disabled={code.length < 6}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: code.length >= 6
                ? 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-primary-light)))'
                : 'rgb(var(--bg-surface-light))',
            }}
          >
            <Send size={16} />
            Send Request
          </button>
        </div>
      </div>

      {/* Status Feedback */}
      {status && (
        <div
          className={`glass-card p-4 text-center text-sm font-medium animate-fade-in-up ${
            status.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            borderColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          }}
        >
          {status.type === 'success' ? '✓ ' : '✕ '}{status.message}
        </div>
      )}
    </div>
  );
};

export default AddFriendScreen;
