'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const SPORTS = [
  'Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field',
  'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Cross Country',
  'Lacrosse', 'Golf', 'Softball', 'Hockey', 'Other',
];

type Step = 'account' | 'profile';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const planParam = searchParams?.get('plan');
  const [step, setStep] = useState<Step>('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sport, setSport] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setStep('profile');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport) return;
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, sport, school } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      setStep('account');
    } else {
      router.push(planParam === 'elite' ? '/upgrade' : '/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Your faith journey starts here.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-1 rounded-full bg-[#F59E0B]" />
          <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'profile' ? 'bg-[#F59E0B]' : 'bg-[#1e3a6e]'}`} />
        </div>

        {/* Card */}
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8">
          {step === 'account' ? (
            <>
              <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
              <p className="text-slate-400 text-sm mb-8">Step 1 of 2 — Your credentials</p>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleAccount} className="space-y-5">
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-2">Email</label>
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
                  <label className="text-slate-300 text-sm font-semibold block mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('account')}
                className="text-slate-400 text-sm mb-6 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-white text-2xl font-bold mb-1">Your sport</h1>
              <p className="text-slate-400 text-sm mb-8">Step 2 of 2 — We'll tailor your experience.</p>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-3">Select your sport</label>
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSport(s)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                          sport === s
                            ? 'bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]'
                            : 'bg-[#0F172A] border-[#1e3a6e] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-2">
                    School <span className="text-slate-600 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Westlake High School"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!sport || loading}
                  className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Enter Christlete'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F59E0B] hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
