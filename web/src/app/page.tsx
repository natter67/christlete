import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const FREE_FEATURES = [
  'Daily athlete devotionals',
  'Pregame prayer check-in',
  '1 prayer group (Free tier)',
  'Streak tracking',
];

const ELITE_FEATURES = [
  'Everything in Free',
  'AI-personalized prayer',
  'Unlimited prayer groups',
  'Team leader dashboard',
  'Weekly faith report',
  'Advanced journaling',
  'Bus devotional (shareable)',
  'Tournament prayer rooms',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080E1A] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 border-b border-white/[0.06] bg-[#080E1A]/90 backdrop-blur-md">
        <span className="text-white font-bold text-lg tracking-tight">Christlete</span>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#mission" className="hover:text-white transition-colors">Mission</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold bg-[#F59E0B] text-[#080E1A] px-4 py-2 rounded-lg hover:bg-[#FBBF24] transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-32 px-8 md:px-16 max-w-7xl mx-auto">
        <p className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-8">
          Faith for the Athlete
        </p>

        <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.92] tracking-tight text-white mb-10 max-w-5xl">
          The spiritual home<br />
          for Christian<br />
          <span className="text-[#F59E0B]">athletes.</span>
        </h1>

        <p className="text-slate-400 text-xl leading-relaxed max-w-xl mb-12">
          Before games. After losses. During injury. On the bus. The moments athletes need
          faith most have never had a product built for them. Until now.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#080E1A] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#FBBF24] transition-colors"
          >
            Get started free <ArrowRight size={18} />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 text-slate-400 font-semibold text-base px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          >
            See Christlete Elite
          </Link>
        </div>
      </section>

      {/* SCRIPTURE STRIP */}
      <div className="border-y border-white/[0.06] py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-x-12 gap-y-3 items-center text-slate-600 text-sm">
          <span className="italic">"I can do all things through Christ who strengthens me." <span className="text-[#F59E0B] not-italic font-bold">Phil 4:13</span></span>
          <span className="hidden md:block w-px h-4 bg-white/10" />
          <span className="italic">"He gives strength to the weary." <span className="text-[#F59E0B] not-italic font-bold">Isa 40:29</span></span>
          <span className="hidden md:block w-px h-4 bg-white/10" />
          <span className="italic">"Be still and know that I am God." <span className="text-[#F59E0B] not-italic font-bold">Ps 46:10</span></span>
        </div>
      </div>

      {/* WHAT IT IS */}
      <section id="features" className="py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-6">What Christlete Does</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight mb-8">
              Faith built into<br />the rhythm<br />of sports.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Not a Bible app. Not a social feed. A spiritual companion built around
              the actual moments of an athlete's life.
            </p>
          </div>
          <div className="space-y-px">
            {[
              {
                num: '01',
                title: 'Daily Devotionals',
                body: 'Written specifically for athletes. Pressure, injury, identity, team conflict, mental health. Every devotional meets you where the sport actually takes you.',
              },
              {
                num: '02',
                title: 'Pregame Prayer',
                body: 'Pick how you are feeling. Tell God what you are carrying. Receive a prayer for your exact moment. Takes sixty seconds. Changes everything.',
              },
              {
                num: '03',
                title: 'Team Prayer Groups',
                body: 'Verified spaces for your team, your school, or your tournament. Shared prayer requests. Pregame check-ins. Post-game reflections.',
              },
            ].map((f) => (
              <div key={f.num} className="group border border-white/[0.06] rounded-2xl p-8 hover:border-[#F59E0B]/20 hover:bg-white/[0.02] transition-all cursor-default">
                <div className="flex items-start gap-6">
                  <span className="text-[#F59E0B]/40 text-xs font-black tracking-widest pt-1 flex-shrink-0">{f.num}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-7">{f.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVOTIONAL PREVIEW */}
      <section className="py-20 px-8 md:px-16 bg-[#0a1020] border-y border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-8">Today's Devotional</p>
          <div className="border border-white/[0.08] rounded-3xl p-10">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-6">Before the Whistle Blows</p>
            <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-4 border-l-2 border-[#F59E0B] pl-8">
              "Be still and know that I am God."
            </blockquote>
            <p className="text-slate-500 text-sm font-bold pl-8 mb-10">Psalm 46:10</p>
            <p className="text-slate-400 text-base leading-8 mb-5">
              The minutes before competition are loud. Your mind is running through scenarios,
              your heart rate is up, coaches are talking, teammates are moving. Everything in
              sports culture tells you to get hyped and locked in.
            </p>
            <p className="text-slate-400 text-base leading-8 mb-10">
              But there is a different kind of readiness. The kind that comes from stillness.
              From the ten seconds before the game where you close your eyes, take one breath,
              and remember who made you and why you play.
            </p>
            <div className="bg-[#080E1A] rounded-2xl p-6 border border-white/[0.06] mb-8">
              <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">Reflect</p>
              <p className="text-white text-base font-medium leading-7">
                Can you find thirty seconds of stillness before your next practice or game?
                What does God want you to hear in it?
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-[#F59E0B] font-bold text-sm hover:gap-3 transition-all"
            >
              Read full devotional and journal your reflection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-8">Why This Exists</p>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-white mb-10">
            Athletes face some of the most spiritually significant moments of their lives inside competition.
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed mb-6">
            Before games. After losses. During injuries. On the bus. At tournaments far from home.
            These are the moments where faith support would mean the most.
          </p>
          <p className="text-slate-500 text-xl leading-relaxed">
            There was nothing built to meet athletes there. Christlete closes that gap.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-8 md:px-16 bg-[#0a1020] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">Pricing</p>
            <h2 className="text-5xl font-black tracking-tight text-white mb-4">Simple. Honest.</h2>
            <p className="text-slate-500 text-lg">Free gets you started. Elite takes you further.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-white/[0.08] rounded-3xl p-10">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-3">Free</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-500 text-sm mb-2">forever</span>
              </div>
              <p className="text-slate-500 text-sm mb-10">Everything you need to start your faith journey as an athlete.</p>
              <ul className="space-y-4 mb-10">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check size={14} className="text-[#F59E0B] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-4 rounded-xl border border-white/10 text-white font-bold text-sm hover:border-white/20 hover:bg-white/[0.03] transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Elite */}
            <div className="border border-[#F59E0B]/30 rounded-3xl p-10 bg-[#F59E0B]/[0.04] relative overflow-hidden">
              <div className="absolute top-6 right-6">
                <span className="bg-[#F59E0B] text-[#080E1A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Elite
                </span>
              </div>
              <p className="text-[#F59E0B] text-sm font-bold uppercase tracking-widest mb-3">Christlete Elite</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-white">$6.99</span>
                <span className="text-slate-400 text-sm mb-2">/ month</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">or $49.99/year <span className="text-[#F59E0B] font-bold">save 40%</span></p>
              <p className="text-slate-500 text-sm mb-10">For the athlete who wants to go deeper.</p>
              <ul className="space-y-4 mb-10">
                {ELITE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check size={14} className="text-[#F59E0B] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=elite"
                className="block text-center py-4 rounded-xl bg-[#F59E0B] text-[#080E1A] font-bold text-sm hover:bg-[#FBBF24] transition-colors"
              >
                Start Elite free for 7 days
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-8 text-center max-w-4xl mx-auto">
        <h2 className="text-6xl md:text-7xl font-black leading-[0.92] tracking-tight text-white mb-8">
          Compete for something<br />
          <span className="text-[#F59E0B]">bigger.</span>
        </h2>
        <p className="text-slate-400 text-xl leading-relaxed max-w-xl mx-auto mb-12">
          Join athletes who are bringing faith into practices, games, and tournaments.
          It starts with showing up. God does the rest.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#080E1A] font-bold text-lg px-10 py-5 rounded-xl hover:bg-[#FBBF24] transition-colors"
        >
          Create your account <ArrowRight size={20} />
        </Link>
        <p className="text-slate-600 text-sm mt-4">Free. No credit card required.</p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold">Christlete</span>
          <p className="text-slate-700 text-xs">Faith for the athlete. Built with purpose.</p>
          <div className="flex gap-6 text-slate-600 text-sm">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-400 transition-colors">Sign up</Link>
            <Link href="#pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
