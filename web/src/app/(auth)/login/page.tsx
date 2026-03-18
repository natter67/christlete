'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Faith for the athlete.</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8">
          <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to continue your faith journey.</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-semibold">Password</label>
                <a href="#" className="text-[#F59E0B] text-xs hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#F59E0B] hover:underline font-semibold">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
