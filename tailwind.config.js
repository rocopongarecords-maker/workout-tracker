/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
        'glow-emerald': '0 0 15px rgba(52, 211, 153, 0.1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'checkmark-draw': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'badge-flip': {
          '0%': { transform: 'perspective(400px) rotateY(0deg)', opacity: '0.5' },
          '50%': { transform: 'perspective(400px) rotateY(180deg)', opacity: '1' },
          '100%': { transform: 'perspective(400px) rotateY(360deg)', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10vh) translateX(var(--drift)) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) translateX(calc(var(--drift) * -1)) rotate(720deg)', opacity: '0' },
        },
        'pr-pop': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(-8px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-50%) translateY(-8px) scale(0.95)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
        'slide-up': 'slide-up 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'checkmark-draw': 'checkmark-draw 0.4s ease-out forwards',
        'badge-flip': 'badge-flip 0.8s ease-out',
        'confetti-fall': 'confetti-fall var(--duration, 1.5s) ease-in forwards',
        'pr-pop': 'pr-pop 0.5s ease-out',
        'badge-pop': 'badge-pop 0.6s ease-out',
        'toast-in': 'toast-in 0.25s ease-out forwards',
        'toast-out': 'toast-out 0.2s ease-in forwards',
      },
    },
  },
  plugins: [],
}
