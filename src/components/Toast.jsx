import { useEffect, useState } from 'react';

const typeStyles = {
  success: 'border-emerald-500/30 shadow-glow-green',
  info: 'border-purple-500/30 shadow-glow-purple',
  warning: 'border-amber-500/30 shadow-glow-amber',
};

const typeIcons = {
  success: '✓',
  info: '→',
  warning: '!',
};

const typeColors = {
  success: 'text-emerald-400',
  info: 'text-purple-400',
  warning: 'text-amber-400',
};

const Toast = ({ message, type = 'success', visible, icon }) => {
  const [show, setShow] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimating(true);
    } else if (show) {
      setAnimating(false);
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 px-4 py-2.5
        bg-slate-900/90 backdrop-blur-xl border rounded-xl
        flex items-center gap-2 text-sm font-medium whitespace-nowrap
        ${typeStyles[type] || typeStyles.success}
        ${animating ? 'animate-toast-in' : 'animate-toast-out'}`}
    >
      <span className={`font-bold ${typeColors[type] || typeColors.success}`}>
        {icon || typeIcons[type] || '✓'}
      </span>
      <span className="text-white">{message}</span>
    </div>
  );
};

export default Toast;
