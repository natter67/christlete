import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Zap, Shield, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    label: 'Daily Devotionals',
    description:
      'Scripture and reflection written specifically for athletes — around pressure, injury, identity, team conflict, and the mental demands of competition.',
  },
  {
    icon: Zap,
    label: 'Pregame Prayer',
    description:
      'A focused check-in before every game or practice. Tell God how you are feeling. Receive a prayer for your exact moment.',
  },
  {
    icon: Users,
    label: 'Team Prayer Groups',
    description:
      'Verified spaces for your team, school, or tournament. Share prayer requests, post encouragement, and pray together before competition.',
  },
];

const QUOTES = [
  {
    text: 'Run in such a way as to get the prize.',
    ref: '1 Corinthians 9:24',
  },
  {
    text: 'He gives strength to the weary and increases the power of the weak.',
    ref: 'Isaiah 40:29',
  },
  {
    text: 'I can do all things through Christ who strengthens me.',
    ref: 'Philippians 4:13',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">Christlete</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#mission" className="hover:text-white transition-colors">Mission</Link>
            <Link href="#devotional" className="hover:text-white transition-colors">Devotional</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#F59E0B] text-[#0F172A] font-bold px-4 py-2 rounded-lg hover:bg-[#FBBF24] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1e3a6e]/20 rounded-full blur-[120px]" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#F59E0B]/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            Faith for the Athlete
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 text-balance">
            Helping athletes bring faith into the{' '}
            <span className="text-[#F59E0B]">moments that matter most.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-8 mb-12">
            A faith platform built for high school athletes. Daily devotionals tailored to sports
            life. Pregame prayer check-ins. Team prayer groups that stay connected through
            practices, games, and tournaments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#FBBF24] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Tagline row */}
          <div className="flex items-center justify-center gap-6 mt-14 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#F59E0B]" />
              <span>Built for high school athletes</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#F59E0B]" />
              <span>Safe, verified communities</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#F59E0B]" />
              <span>Free to start</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE SCROLL ── */}
      <section className="py-10 border-y border-white/5 overflow-hidden">
        <div className="flex gap-16 animate-none">
          <div className="flex gap-16 whitespace-nowrap">
            {[...QUOTES, ...QUOTES].map((q, i) => (
              <div key={i} className="flex items-center gap-4 flex-shrink-0">
                <span className="text-slate-500 text-sm italic">"{q.text}"</span>
                <span className="text-[#F59E0B] text-xs font-bold">— {q.ref}</span>
                {i < QUOTES.length * 2 - 1 && (
                  <span className="text-slate-700 text-xl">·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">
              What Christlete Does
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Faith built into the rhythm of sports.
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Not a generic Bible app. Not a social feed. A spiritual companion built
              around the actual moments of an athlete's life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-3xl p-8 hover:border-[#F59E0B]/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center mb-6 group-hover:bg-[#F59E0B]/20 transition-colors">
                  <f.icon size={22} className="text-[#F59E0B]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{f.label}</h3>
                <p className="text-slate-400 text-[15px] leading-7">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION SECTION ── */}
      <section id="mission" className="py-24 px-6 bg-[#0a1020]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-4">
                Why Christlete Exists
              </p>
              <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Athletes experience some of the most spiritually significant moments of their lives inside competition.
              </h2>
              <p className="text-slate-400 text-base leading-8 mb-6">
                Before games. After losses. On the bus. During injuries. In the locker room. These are the moments where faith support would mean the most — and there's nothing built to meet athletes there.
              </p>
              <p className="text-slate-400 text-base leading-8">
                Christlete closes that gap.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Faith connection around real sports moments',
                'Athlete-specific devotionals — not generic content',
                'Safe, verified team and event communities',
                'Natural, invitational — not preachy',
                'Built for the real rhythm of a season',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight size={12} className="text-[#0F172A]" />
                  </div>
                  <span className="text-slate-300 text-[15px] leading-6">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVOTIONAL PREVIEW ── */}
      <section id="devotional" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">
              Today's Word
            </p>
            <h2 className="text-3xl font-bold text-white">A taste of what's inside.</h2>
          </div>

          <div className="bg-[#1e2d47] rounded-3xl p-8 md:p-10 border border-[#1e3a6e]">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-4">
              Before the Whistle Blows
            </p>
            <blockquote className="text-slate-300 text-lg italic leading-9 mb-4 border-l-4 border-[#F59E0B] pl-6">
              "Be still and know that I am God."
            </blockquote>
            <p className="text-slate-500 text-sm font-bold mb-8">— Psalm 46:10</p>

            <p className="text-slate-300 text-[15px] leading-8 mb-6">
              The minutes before competition are loud. Your mind is running through scenarios, your
              heart rate is up, coaches are talking, music is playing, teammates are moving.
              Everything in sports culture tells you to get hyped, get locked in, get ready.
            </p>
            <p className="text-slate-300 text-[15px] leading-8 mb-8">
              But there is a different kind of readiness. The kind that comes from stillness. From
              the ten seconds before the game where you close your eyes, take one breath, and
              remember who made you and why you play.
            </p>

            <div className="bg-[#0F172A] rounded-2xl p-5 border border-[#1e3a6e] mb-8">
              <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
                Reflect
              </p>
              <p className="text-white text-base font-medium">
                Can you find thirty seconds of stillness before your next practice or game?
                What does God want you to hear in it?
              </p>
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold px-6 py-3 rounded-xl hover:bg-[#FBBF24] transition-colors"
            >
              Read today's full devotional
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#0a1020]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-balance">
            The spiritual home for Christian athletes.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-8">
            Join athletes who are bringing faith into practices, games, and tournaments —
            and experiencing what it means to compete for something bigger.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold text-lg px-10 py-4 rounded-xl hover:bg-[#FBBF24] transition-all hover:scale-[1.02]"
          >
            Create your account
            <ArrowRight size={20} />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Free. No credit card required.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#F59E0B] font-bold text-lg">Christlete</span>
          <p className="text-slate-600 text-sm">
            Faith for the athlete. Built with purpose.
          </p>
          <div className="flex items-center gap-6 text-slate-600 text-sm">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-400 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
