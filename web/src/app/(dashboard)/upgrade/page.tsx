'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, Users, BookOpen, BarChart2, FileText, Bus, Trophy, Star,
} from 'lucide-react';

const ELITE_FEATURES = [
  {
    icon: Zap,
    title: 'AI-Personalized Prayer',
    body: 'Prayers generated around your sport, your struggle, and your season. No generic text.',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'Unlimited Prayer Groups',
    body: 'Join or create as many groups as your team needs. Free tier is capped at 1.',
    color: '#3B82F6',
  },
  {
    icon: Trophy,
    title: 'Team Leader Dashboard',
    body: 'See anonymized faith engagement across your team. Run a prayer group like a program.',
    color: '#F59E0B',
  },
  {
    icon: BarChart2,
    title: 'Weekly Faith Report',
    body: 'Every Sunday, a reflection on your week: streak, check-ins, prayer patterns, and a word for the next 7 days.',
    color: '#10B981',
  },
  {
    icon: FileText,
    title: 'Advanced Journaling',
    body: 'Full journal history with search. Export your reflections. Track how God has moved through your season.',
    color: '#8B5CF6',
  },
  {
    icon: Bus,
    title: 'Bus Devotionals',
    body: 'Short, punchy devotionals built for the bus ride to away games. 3 minutes. High signal.',
    color: '#EC4899',
  },
  {
    icon: BookOpen,
    title: 'Tournament Prayer Rooms',
    body: 'Temporary shared prayer spaces for tournament weekends. Auto-expire. Built for the moment.',
    color: '#3B82F6',
  },
  {
    icon: Star,
    title: 'Early Access to New Features',
    body: 'First access to everything we ship. Christlete Elite builds the product alongside us.',
    color: '#F59E0B',
  },
];

type BillingCycle = 'monthly' | 'yearly';

export default function UpgradePage() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingCycle>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? '';
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY ?? '';

  const handleCheckout = async () => {
    const priceId = billing === 'monthly' ? monthlyPriceId : yearlyPriceId;
    if (!priceId) {
      setError('Pricing not configured yet. Check back soon.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 md:pb-8 max-w-2xl">
      <div className="mb-10">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Christlete Elite</p>
        <h1 className="text-white text-4xl font-bold leading-tight mb-4">
          Compete for<br />something bigger.
        </h1>
        <p className="text-slate-400 text-base leading-7">
          Everything in Free, plus the tools that go deeper. For athletes who want faith woven into every part of their season.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-8" role="group" aria-label="Billing cycle">
        <button
          onClick={() => setBilling('monthly')}
          aria-pressed={billing === 'monthly'}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            billing === 'monthly'
              ? 'bg-[#1e3a6e] border-[#F59E0B] text-white'
              : 'bg-transparent border-[#1e3a6e] text-slate-400 hover:border-slate-600'
          }`}
        >
          Monthly - $6.99
        </button>
        <button
          onClick={() => setBilling('yearly')}
          aria-pressed={billing === 'yearly'}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors relative ${
            billing === 'yearly'
              ? 'bg-[#1e3a6e] border-[#F59E0B] text-white'
              : 'bg-transparent border-[#1e3a6e] text-slate-400 hover:border-slate-600'
          }`}
        >
          Yearly - $49.99
          <span className="absolute -top-2.5 -right-2 bg-[#F59E0B] text-[#0F172A] text-[10px] font-bold px-1.5 py-0.5 rounded-full">SAVE 40%</span>
        </button>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#1e3a6e] to-[#0a1020] border border-[#F59E0B]/30 rounded-2xl p-6 mb-10">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-white text-4xl font-bold">{billing === 'monthly' ? '$6.99' : '$49.99'}</span>
          <span className="text-slate-400 text-sm">/{billing === 'monthly' ? 'month' : 'year'}</span>
        </div>
        {billing === 'yearly' && (
          <p className="text-slate-500 text-xs mb-4">That is $4.17/month, billed annually.</p>
        )}
        <p className="text-slate-400 text-sm mb-5">7-day free trial. Cancel any time. No questions.</p>
        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-900/30 rounded-xl px-4 py-3" role="alert">{error}</p>
        )}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-base bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24] transition-colors disabled:opacity-60"
        >
          {loading ? 'Opening checkout...' : 'Start Free Trial'}
        </button>
      </div>

      {/* Features */}
      <div className="mb-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">What you get</p>
        <div className="space-y-4">
          {ELITE_FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${f.color}15` }}
                aria-hidden="true"
              >
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                <p className="text-slate-400 text-sm leading-6">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free vs Elite comparison */}
      <div className="bg-[#0a1020] border border-[#1e3a6e] rounded-2xl overflow-hidden mb-8">
        <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest border-b border-[#1e3a6e]">
          <div className="py-4 px-5 text-slate-500">Feature</div>
          <div className="py-4 px-4 text-slate-400 border-l border-[#1e3a6e]">Free</div>
          <div className="py-4 px-4 text-[#F59E0B] border-l border-[#1e3a6e]">Elite</div>
        </div>
        {[
          ['Daily Devotionals', true, true],
          ['Pregame Prayer', true, true],
          ['Prayer Groups', '1 max', 'Unlimited'],
          ['Journal Entries', true, true],
          ['AI-Personalized Prayer', false, true],
          ['Team Leader Dashboard', false, true],
          ['Weekly Faith Report', false, true],
          ['Bus Devotionals', false, true],
          ['Tournament Prayer Rooms', false, true],
        ].map(([label, free, elite]) => (
          <div key={String(label)} className="grid grid-cols-3 text-sm border-t border-[#1e3a6e]/50">
            <div className="py-4 px-5 text-slate-400">{label}</div>
            <div className="py-4 px-4 border-l border-[#1e3a6e]/50 text-slate-400">
              {free === true ? '✓' : free === false ? <span className="text-slate-700">—</span> : free}
            </div>
            <div className="py-4 px-4 border-l border-[#1e3a6e]/50 text-[#F59E0B] font-medium">
              {elite === true ? '✓' : elite === false ? <span className="text-slate-700">—</span> : elite}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="text-slate-500 text-sm hover:text-slate-400 transition-colors"
      >
        Not right now
      </button>
    </div>
  );
}
