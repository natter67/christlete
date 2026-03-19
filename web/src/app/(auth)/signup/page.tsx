'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const SPORTS = [
  'Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field',
  'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Cross Country',
  'Lacrosse', 'Golf', 'Softball', 'Hockey', 'Other',
];

type Step = 'account' | 'profile';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const [step, setStep] = useState<Step>('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sport, setSport] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://christlete.love';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, sport, school },
        emailRedirectTo: `${appUrl}/auth/confirm`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      setStep('account');
    } else if (data.session) {
      // Email confirmation disabled — user is immediately signed in
      router.push(planParam === 'elite' ? '/upgrade' : '/dashboard');
    } else {
      // Email confirmation enabled — show confirmation prompt
      setConfirmSent(true);
    }
  };

  if (confirmSent) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
            </Link>
          </div>
          <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8 text-center">
            <div
              className="w-14 h-14 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center mx-auto mb-5"
              aria-hidden="true"
            >
              <span className="text-[#F59E0B] text-2xl" aria-hidden="true">✉</span>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-slate-400 text-sm leading-6">
              We sent a confirmation link to{' '}
              <span className="text-white font-semibold">{email}</span>.
              Click it to activate your account and start your faith journey.
            </p>
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

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Your faith journey starts here.</p>
        </div>

        <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={step === 'account' ? 1 : 2} aria-valuemin={1} aria-valuemax={2} aria-label="Signup progress">
          <div className="flex-1 h-1 rounded-full bg-[#F59E0B]" />
          <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'profile' ? 'bg-[#F59E0B]' : 'bg-[#1e3a6e]'}`} />
        </div>

        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8">
          {step === 'account' ? (
            <>
              <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
              <p className="text-slate-400 text-sm mb-8">Step 1 of 2 — Your credentials</p>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleAccount} className="space-y-5">
                <div>
                  <label htmlFor="signup-name" className="text-slate-300 text-sm font-semibold block mb-2">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="text-slate-300 text-sm font-semibold block mb-2">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="text-slate-300 text-sm font-semibold block mb-2">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
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
                Back
              </button>
              <h1 className="text-white text-2xl font-bold mb-1">Your sport</h1>
              <p className="text-slate-400 text-sm mb-8">Step 2 of 2 — We&apos;ll tailor your experience.</p>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-1">
                    Select your sport <span className="text-red-400">*</span>
                  </label>
                  <p className="text-slate-600 text-xs mb-3">Required to personalize your prayers and devotionals.</p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Select your sport"
                    aria-required="true"
                  >
                    {SPORTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSport(s)}
                        role="radio"
                        aria-checked={sport === s}
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
                  <label htmlFor="signup-school" className="text-slate-300 text-sm font-semibold block mb-2">
                    School <span className="text-slate-600 font-normal">(optional)</span>
                  </label>
                  <input
                    id="signup-school"
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

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
