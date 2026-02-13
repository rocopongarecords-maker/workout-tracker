import { useState, useEffect } from 'react';

const CONFETTI_COUNT = 40;
const COLORS = ['#fbbf24', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#ec4899'];

const PRCelebration = ({ show, type, value, onDone }) => {
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);

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

    const timer = setTimeout(() => {
      setVisible(false);
      setParticles([]);
      onDone?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Banner */}
      <div className="relative animate-pr-pop">
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
      </div>
    </div>
  );
};

export default PRCelebration;
