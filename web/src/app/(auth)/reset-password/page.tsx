'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const sessionReadyRef = useRef(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash; the client SDK handles it automatically
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
        sessionReadyRef.current = true;
      }
    });

    // If no recovery session arrives within 20s, redirect to forgot-password
    const timeout = setTimeout(() => {
      if (!sessionReadyRef.current) {
        router.push('/forgot-password');
      }
    }, 20000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!sessionReady) return;

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      const redirect = setTimeout(() => router.push('/dashboard'), 2000);
      return () => clearTimeout(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Faith for the athlete.</p>
        </div>

        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8">
          {done ? (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center mx-auto mb-5"
                aria-hidden="true"
              >
                <span className="text-green-400 text-2xl">✓</span>
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">Password updated</h1>
              <p className="text-slate-400 text-sm">Taking you to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1 className="text-white text-2xl font-bold mb-1">Set new password</h1>
              <p className="text-slate-400 text-sm mb-8">
                Choose a strong password for your account.
              </p>

              {!sessionReady && (
                <div className="bg-amber-900/20 border border-amber-700/30 text-amber-400 text-sm rounded-xl px-4 py-3 mb-6">
                  Waiting for reset link to be verified... If this takes too long, request a new link from the{' '}
                  <Link href="/forgot-password" className="underline">forgot password page</Link>.
                </div>
              )}

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="text-slate-300 text-sm font-semibold block mb-2">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="text-slate-300 text-sm font-semibold block mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Same password again"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !sessionReady}
                  className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/login" className="text-[#F59E0B] hover:underline font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
