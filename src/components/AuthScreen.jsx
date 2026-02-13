import { useState } from 'react';

const AuthScreen = ({ onSignIn, onSignUp, onGoogleSignIn, onResetPassword, onContinueAsGuest, error }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (mode === 'login') {
      const result = await onSignIn(email, password);
      if (result?.error) setMessage(result.error.message);
    } else if (mode === 'signup') {
      const result = await onSignUp(email, password);
      if (result?.error) {
        setMessage(result.error.message);
      } else {
        setMessage('Check your email for a confirmation link!');
      }
    } else if (mode === 'reset') {
      const result = await onResetPassword(email);
      if (result?.error) {
        setMessage(result.error.message);
      } else {
        setMessage('Password reset email sent!');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center animate-fade-in-up">
          <div className="text-4xl mb-3">🏋️</div>
          <h1 className="text-2xl font-bold text-white">Workout Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            Jeff Nippard's Legs-Push-Pull Program
          </p>
        </div>

        <div className="glass-card-elevated p-6 animate-fade-in-up stagger-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-blue-500/50 outline-none transition-colors"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-blue-500/50 outline-none transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary disabled:bg-slate-600 disabled:text-slate-400 disabled:shadow-none"
            >
              {loading ? 'Loading...' : (
                mode === 'login' ? 'Sign In' :
                mode === 'signup' ? 'Create Account' :
                'Send Reset Link'
              )}
            </button>
          </form>

          {(error || message) && (
            <div className={`text-sm text-center p-3 rounded-xl mt-4 ${
              message && !error ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'bg-red-900/20 text-red-400 border border-red-500/20'
            }`}>
              {error || message}
            </div>
          )}

          {/* Google sign in */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent px-3 text-slate-500">or</span>
            </div>
          </div>

          <button
            onClick={onGoogleSignIn}
            className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Mode toggle */}
        <div className="text-center text-sm space-y-2 animate-fade-in-up stagger-2">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('signup')} className="text-blue-400 hover:text-blue-300">
                Don't have an account? Sign up
              </button>
              <br />
              <button onClick={() => setMode('reset')} className="text-slate-500 hover:text-slate-400">
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300">
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300">
              Back to sign in
            </button>
          )}
        </div>

        {/* Guest mode */}
        <div className="pt-2 border-t border-white/5 animate-fade-in-up stagger-3">
          <button
            onClick={onContinueAsGuest}
            className="w-full py-3 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Continue without account (data stays on this device)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
