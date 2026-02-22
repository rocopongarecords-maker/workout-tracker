import { useState, useEffect } from 'react';

const CONFETTI_COUNT = 40;
const COLORS = ['#fbbf24', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#ec4899'];

const PRCelebration = ({ show, type, value, onDone }) => {
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    setShowShare(false);
    setCopied(false);

    const newParticles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 120,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    // Show share button after banner animates in
    const shareTimer = setTimeout(() => setShowShare(true), 800);

    const timer = setTimeout(() => {
      setVisible(false);
      setShowShare(false);
      setParticles([]);
      onDone?.();
    }, 4000);

    return () => { clearTimeout(timer); clearTimeout(shareTimer); };
  }, [show]);

  const handleShare = async () => {
    const text = type === '1rm'
      ? `I just hit a new PR! 🏆 Estimated 1RM: ${value} kg`
      : `I just hit a new PR! 🏆 ${value} kg — New best!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'New Personal Record! 🏆', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Confetti layer (non-interactive) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-sm animate-confetti-fall"
            style={{
              left: `${p.x}%`,
              top: '-2%',
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Banner + share button */}
      <div className="relative animate-pr-pop flex flex-col items-center gap-3">
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-2xl px-8 py-5 shadow-2xl shadow-amber-500/30 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-3xl font-black text-white tracking-tight">
              NEW PR!
            </div>
            {type === '1rm' && value && (
              <div className="text-amber-100 text-sm mt-1 font-semibold">
                Est. 1RM: {value} kg
              </div>
            )}
            {type === 'weight' && value && (
              <div className="text-amber-100 text-sm mt-1 font-semibold">
                {value} kg — New best!
              </div>
            )}
          </div>
        </div>

        {showShare && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-lg animate-fade-in-up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PRCelebration;
