'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type Devotional = {
  title: string;
  scripture: string;
  scripture_ref: string;
  body: string;
};

function UpgradedBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get('upgraded') !== '1') return null;
  return (
    <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
      <span className="text-[#F59E0B] text-xl">★</span>
      <div>
        <p className="text-[#F59E0B] font-bold text-sm">Welcome to Christlete Elite</p>
        <p className="text-slate-400 text-xs mt-0.5">Your subscription is active. All Elite features are unlocked.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [userName, setUserName] = useState('Athlete');
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const dayIndex = new Date().getDay();

      const [{ data: devData }, { data: userData }] = await Promise.all([
        supabase
          .from('devotionals')
          .select('title, scripture, scripture_ref, body')
          .eq('day_index', dayIndex)
          .eq('published', true)
          .maybeSingle(),
        supabase.auth.getUser(),
      ]);

      if (devData) setDevotional(devData);

      if (userData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', userData.user.id)
          .maybeSingle();
        if (profile?.name) {
          setUserName(profile.name.split(' ')[0]);
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="pb-24 md:pb-8">
      <Suspense fallback={null}>
        <UpgradedBanner />
      </Suspense>

      <div className="mb-8">
        <p className="text-slate-500 text-sm">{dayName}, {dateStr}</p>
        <h1 className="text-white text-3xl font-bold mt-1">{greeting}, {userName}.</h1>
      </div>

      {loading ? (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6 animate-pulse">
          <div className="h-3 w-24 bg-[#1e3a6e] rounded mb-4" />
          <div className="h-5 w-3/4 bg-[#1e3a6e] rounded mb-3" />
          <div className="h-4 w-32 bg-[#1e3a6e] rounded" />
        </div>
      ) : devotional ? (
        <>
          <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">Today&apos;s Verse</p>
            <p className="text-slate-300 text-lg italic leading-8 mb-2">&ldquo;{devotional.scripture}&rdquo;</p>
            <p className="text-slate-500 text-sm font-bold">{devotional.scripture_ref}</p>
          </div>

          <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6 hover:border-[#F59E0B]/30 transition-colors">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Today&apos;s Devotional</p>
            <h2 className="text-white text-xl font-bold mb-3">{devotional.title}</h2>
            <p className="text-slate-400 text-sm leading-7 mb-4 line-clamp-3">
              {devotional.body.split('\n\n')[0]}
            </p>
            <Link
              href="/devotional"
              className="inline-flex items-center gap-2 text-[#F59E0B] text-sm font-semibold"
            >
              Read full devotional <ArrowRight size={14} />
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
          <p className="text-slate-500 text-sm">No devotional found for today.</p>
        </div>
      )}

      <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {([
          { href: '/prayer', icon: Zap, label: 'Pregame Prayer', sub: 'Check in before your next game', color: '#F59E0B' },
          { href: '/groups', icon: Users, label: 'Prayer Groups', sub: 'Pray with your team', color: '#3B82F6' },
          { href: '/devotional', icon: BookOpen, label: 'Read the Word', sub: "Today's full devotional", color: '#10B981' },
        ] as const).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-5 hover:border-white/20 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon size={18} style={{ color: item.color }} />
            </div>
            <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
            <p className="text-slate-500 text-xs">{item.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-[#0a1020] border border-[#1e3a6e] rounded-2xl p-6">
        <p className="text-slate-400 text-sm italic leading-7 text-center mb-3">
          &ldquo;Run in such a way as to get the prize. Everyone who competes goes into strict training they do it to get a crown that will last forever.&rdquo;
        </p>
        <p className="text-[#F59E0B] text-xs font-bold text-center">1 Corinthians 9:24-25</p>
      </div>
    </div>
  );
}
