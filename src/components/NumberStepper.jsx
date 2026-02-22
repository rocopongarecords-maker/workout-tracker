import { useState, useRef, useCallback, useEffect } from 'react';
import { haptic } from '../utils/haptics';

const NumberStepper = ({ value, onChange, min = 0, max = 300, step = 1, label, unit, disabled = false }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const longPressTimer = useRef(null);
  const repeatInterval = useRef(null);

  const numValue = value === '' || value === undefined || value === null ? null : Number(value);

  const clamp = useCallback((v) => {
    const rounded = Math.round(v / step) * step;
    return Math.max(min, Math.min(max, Number(rounded.toFixed(2))));
  }, [min, max, step]);

  const increment = useCallback(() => {
    if (disabled) return;
    const next = numValue === null ? step : clamp(numValue + step);
    onChange(String(next));
    haptic.light();
  }, [numValue, step, clamp, onChange, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;
    const next = numValue === null ? min : clamp(numValue - step);
    onChange(String(next));
    haptic.light();
  }, [numValue, step, min, clamp, onChange, disabled]);

  const clearTimers = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (repeatInterval.current) {
      clearInterval(repeatInterval.current);
      repeatInterval.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const handlePressStart = useCallback((action) => {
    if (disabled) return;
    action();
    longPressTimer.current = setTimeout(() => {
      repeatInterval.current = setInterval(() => {
        action();
      }, 80);
    }, 300);
  }, [disabled]);

  const handlePressEnd = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleTouchMove = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const startEditing = () => {
    if (disabled) return;
    setInputValue('');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const finishEditing = () => {
    setEditing(false);
    if (inputValue === '') {
      // User didn't type anything — keep original value
      return;
    }
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(String(clamp(parsed)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const displayValue = numValue !== null ? numValue : '--';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {/* Decrement button */}
        <button
          type="button"
          disabled={disabled || (numValue !== null && numValue <= min)}
          onMouseDown={() => handlePressStart(decrement)}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={() => handlePressStart(decrement)}
          onTouchEnd={handlePressEnd}
          onTouchMove={handleTouchMove}
          className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-150
            ${disabled
              ? 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] active:scale-95 active:bg-white/15'
            }`}
          style={{ touchAction: 'manipulation' }}
        >
          −
        </button>

        {/* Center value display / input */}
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            inputMode={step < 1 ? 'decimal' : 'numeric'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            className="flex-1 h-11 bg-black/30 border-2 border-blue-500/50 rounded-xl text-center text-white font-bold text-lg outline-none"
            min={min}
            max={max}
            step={step}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            disabled={disabled}
            className={`flex-1 h-11 rounded-xl text-center font-bold text-lg transition-all duration-150
              ${disabled
                ? 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                : 'bg-black/20 border border-white/[0.08] text-white hover:border-white/20'
              }`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {displayValue}
            {unit && numValue !== null && (
              <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>
            )}
          </button>
        )}

        {/* Increment button */}
        <button
          type="button"
          disabled={disabled || (numValue !== null && numValue >= max)}
          onMouseDown={() => handlePressStart(increment)}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={() => handlePressStart(increment)}
          onTouchEnd={handlePressEnd}
          onTouchMove={handleTouchMove}
          className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-150
            ${disabled
              ? 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] active:scale-95 active:bg-white/15'
            }`}
          style={{ touchAction: 'manipulation' }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumberStepper;
