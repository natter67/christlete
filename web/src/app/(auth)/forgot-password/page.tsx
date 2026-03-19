'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://christlete.love';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
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
          {submitted ? (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center mx-auto mb-5"
                aria-hidden="true"
              >
                <span className="text-green-400 text-2xl">✓</span>
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">Check your email</h1>
              <p className="text-slate-400 text-sm leading-6">
                We sent a password reset link to{' '}
                <span className="text-white font-semibold">{email}</span>.
                Check your inbox and follow the link.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-slate-500 text-sm hover:text-slate-400 transition-colors"
              >
                Resend link
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-white text-2xl font-bold mb-1">Reset your password</h1>
              <p className="text-slate-400 text-sm mb-8">
                Enter your email and we will send you a reset link.
              </p>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-email" className="text-slate-300 text-sm font-semibold block mb-2">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
