import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured');
      return { error: { message: 'Supabase is not configured' } };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    return { data, error };
  };

  const signIn = async (email, password) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured');
      return { error: { message: 'Supabase is not configured' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    return { data, error };
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured');
      return { error: { message: 'Supabase is not configured' } };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) setError(error.message);
    return { data, error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    setUser(null);
  };

  const resetPassword = async (email) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured');
      return { error: { message: 'Supabase is not configured' } };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });
    if (error) setError(error.message);
    return { data, error };
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isConfigured: isSupabaseConfigured()
  };
};
