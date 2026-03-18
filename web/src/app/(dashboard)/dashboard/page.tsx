import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Users } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Today's devotional (static — fetched from DB in production)
const TODAY_DEV = {
  title: 'Before the Whistle Blows',
  scripture: '"Be still and know that I am God."',
  scripture_ref: 'Psalm 46:10',
  body: 'The minutes before competition are loud. Your mind is running through scenarios, your heart rate is up, coaches are talking, music is playing. But there is a different kind of readiness — the kind that comes from stillness.',
};

export default function DashboardPage() {
  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm">{dayName}, {dateStr}</p>
        <h1 className="text-white text-3xl font-bold mt-1">{greeting}, Athlete.</h1>
      </div>

      {/* Scripture Banner */}
      <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">Today's Verse</p>
        <p className="text-slate-300 text-lg italic leading-8 mb-2">{TODAY_DEV.scripture}</p>
        <p className="text-slate-500 text-sm font-bold">{TODAY_DEV.scripture_ref}</p>
      </div>

      {/* Today's Devotional */}
      <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6 hover:border-[#F59E0B]/30 transition-colors group">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Today's Devotional</p>
        <h2 className="text-white text-xl font-bold mb-3">{TODAY_DEV.title}</h2>
        <p className="text-slate-400 text-sm leading-7 mb-4 line-clamp-3">{TODAY_DEV.body}</p>
        <Link
          href="/devotional"
          className="inline-flex items-center gap-2 text-[#F59E0B] text-sm font-semibold hover:gap-3 transition-all"
        >
          Read full devotional <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Actions */}
      <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            href: '/prayer',
            icon: Zap,
            label: 'Pregame Prayer',
            sub: 'Check in before your next game',
            color: '#F59E0B',
          },
          {
            href: '/groups',
            icon: Users,
            label: 'Prayer Groups',
            sub: 'Pray with your team',
            color: '#3B82F6',
          },
          {
            href: '/devotional',
            icon: BookOpen,
            label: 'Read the Word',
            sub: 'Today's full devotional',
            color: '#10B981',
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-5 hover:border-white/20 transition-colors group"
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

      {/* Encouragement */}
      <div className="bg-[#0a1020] border border-[#1e3a6e] rounded-2xl p-6">
        <p className="text-slate-400 text-sm italic leading-7 text-center mb-3">
          "Run in such a way as to get the prize. Everyone who competes goes into strict training —
          they do it to get a crown that will not last, but we do it to get a crown that will last forever."
        </p>
        <p className="text-[#F59E0B] text-xs font-bold text-center">1 Corinthians 9:24-25</p>
      </div>
    </div>
  );
}
