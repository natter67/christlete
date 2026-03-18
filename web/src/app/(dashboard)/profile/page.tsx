'use client';

import { useEffect, useState } from 'react';
import { Flame, BookOpen, Zap, Users, LogOut, Bell, Lock, Edit2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const SPORT_EMOJI: Record<string, string> = {
  Basketball: '🏀',
  Football: '🏈',
  Soccer: '⚽',
  Baseball: '⚾',
  Softball: '🥎',
  Swimming: '🏊',
  Track: '🏃',
  'Cross Country': '🏃',
  Tennis: '🎾',
  Volleyball: '🏐',
  Lacrosse: '🥍',
  Wrestling: '🤼',
  Golf: '⛳',
  Gymnastics: '🤸',
  default: '🏅',
};

type Profile = {
  name: string;
  sport: string;
  school: string | null;
  struggles: string[];
};

type Stats = {
  checkins: number;
  devotionals: number;
  groups: number;
  streak: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ checkins: 0, devotionals: 0, groups: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { data: profileData },
        { count: checkinCount },
        { count: journalCount },
        { count: groupCount },
      ] = await Promise.all([
        supabase.from('profiles').select('name, sport, school, struggles').eq('user_id', user.id).single(),
        supabase.from('prayer_checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      if (profileData) setProfile(profileData);

      // Calculate streak: count consecutive days with a prayer_checkin going backward from today
      let streak = 0;
      if (checkinCount && checkinCount > 0) {
        const { data: checkins } = await supabase
          .from('prayer_checkins')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (checkins && checkins.length > 0) {
          const seen = new Set<string>();
          checkins.forEach((c) => {
            const day = new Date(c.created_at).toISOString().split('T')[0];
            seen.add(day);
          });

          const current = new Date();
          for (let i = 0; i < 365; i++) {
            const key = new Date(current.getTime() - i * 86400000).toISOString().split('T')[0];
            if (seen.has(key)) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      setStats({
        checkins: checkinCount ?? 0,
        devotionals: journalCount ?? 0,
        groups: groupCount ?? 0,
        streak,
      });

      setLoading(false);
    }

    load();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const sportEmoji = profile ? (SPORT_EMOJI[profile.sport] ?? SPORT_EMOJI.default) : '🏅';

  if (loading) {
    return (
      <div className="pb-24 md:pb-8 max-w-xl animate-pulse">
        <div className="h-20 w-20 rounded-full bg-[#1e3a6e] mb-8" />
        <div className="h-6 w-40 bg-[#1e3a6e] rounded mb-2" />
        <div className="h-4 w-64 bg-[#1e3a6e] rounded" />
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8 max-w-xl">
      <div className="mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">Profile</p>
      </div>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#1e3a6e] border-2 border-[#F59E0B] flex items-center justify-center text-4xl flex-shrink-0">
          {sportEmoji}
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">{profile?.name ?? 'Athlete'}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {profile?.sport}
            {profile?.school ? ` · ${profile.school}` : ''}
          </p>
        </div>
      </div>

      <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5">Your Journey</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: stats.streak, label: 'Day Streak', icon: Flame, color: '#F59E0B' },
            { value: stats.checkins, label: 'Check-ins', icon: Zap, color: '#3B82F6' },
            { value: stats.devotionals, label: 'Devotionals', icon: BookOpen, color: '#10B981' },
            { value: stats.groups, label: 'Groups', icon: Users, color: '#8B5CF6' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={14} style={{ color: stat.color }} />
              </div>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Flame size={24} className="text-[#F59E0B] flex-shrink-0" />
          <div>
            <p className="text-[#F59E0B] font-bold text-sm">{stats.streak} day streak</p>
            <p className="text-slate-400 text-xs">Keep showing up. God sees every rep.</p>
          </div>
        </div>
      )}

      {profile?.struggles && profile.struggles.length > 0 && (
        <div className="mb-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">What I&apos;m Carrying</p>
          <div className="flex flex-wrap gap-2">
            {profile.struggles.map((s) => (
              <span key={s} className="px-4 py-2 rounded-full bg-[#1e2d47] border border-[#1e3a6e] text-slate-300 text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Account</p>
        <div className="space-y-2">
          {[
            { label: 'Edit Profile', icon: Edit2 },
            { label: 'Notifications', icon: Bell },
            { label: 'Privacy & Safety', icon: Lock },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center justify-between bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-slate-400" />
                <span className="text-white text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-slate-600 text-xs">→</span>
            </button>
          ))}
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 bg-red-900/20 border border-red-900/30 rounded-xl px-5 py-4 hover:bg-red-900/30 transition-colors">
            <LogOut size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
