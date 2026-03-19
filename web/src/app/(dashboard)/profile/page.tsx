'use client';

import { useEffect, useRef, useState } from 'react';
import { Flame, BookOpen, Zap, Users, LogOut, Bell, Lock, Edit2, X, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const SPORT_EMOJI: Record<string, string> = {
  Basketball: '🏀',
  Football: '🏈',
  Soccer: '⚽',
  Baseball: '⚾',
  Softball: '🥎',
  Swimming: '🏊',
  'Track & Field': '🏃',
  'Cross Country': '🏃',
  Tennis: '🎾',
  Volleyball: '🏐',
  Lacrosse: '🥍',
  Wrestling: '🤼',
  Golf: '⛳',
  Gymnastics: '🤸',
  Hockey: '🏒',
  Other: '🏅',
  default: '🏅',
};

const SPORTS = [
  'Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field',
  'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Cross Country',
  'Lacrosse', 'Golf', 'Softball', 'Hockey', 'Other',
];

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
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSport, setEditSport] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [saving, setSaving] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const [
        { data: profileData },
        { count: checkinCount },
        { count: journalCount },
        { count: groupCount },
      ] = await Promise.all([
        supabase.from('profiles').select('name, sport, school, struggles').eq('user_id', user.id).maybeSingle(),
        supabase.from('prayer_checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      if (profileData) {
        setProfile(profileData);
        setEditName(profileData.name ?? '');
        setEditSport(profileData.sport ?? '');
        setEditSchool(profileData.school ?? '');
      }

      // Streak: count consecutive days with check-ins going backward from today
      // Limit the fetch to 365 rows to avoid unbounded downloads
      let streak = 0;
      if (checkinCount && checkinCount > 0) {
        const { data: checkins } = await supabase
          .from('prayer_checkins')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(365);

        if (checkins && checkins.length > 0) {
          const seen = new Set<string>();
          checkins.forEach((c) => {
            const day = new Date(c.created_at).toLocaleDateString('en-CA');
            seen.add(day);
          });

          const now = new Date();
          for (let i = 0; i < 365; i++) {
            const key = new Date(now.getTime() - i * 86400000).toLocaleDateString('en-CA');
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

  // Focus trap: move focus into modal when it opens
  useEffect(() => {
    if (editing) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [editing]);

  const handleOpenEdit = () => {
    setSaveError('');
    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    editButtonRef.current?.focus();
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    if (!userId || !editName.trim() || !editSport) return;
    setSaving(true);
    setSaveError('');
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ name: editName.trim(), sport: editSport, school: editSchool.trim() || null })
      .eq('user_id', userId);
    setSaving(false);
    if (error) {
      setSaveError('Failed to save. Try again.');
      return;
    }
    setProfile((p) => p ? { ...p, name: editName.trim(), sport: editSport, school: editSchool.trim() || null } : p);
    setEditing(false);
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Silently fail — portal link is a nice-to-have
    }
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
        <div
          className="w-20 h-20 rounded-full bg-[#1e3a6e] border-2 border-[#F59E0B] flex items-center justify-center text-4xl flex-shrink-0"
          aria-hidden="true"
        >
          {sportEmoji}
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">{profile?.name ?? 'Athlete'}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {profile?.sport}
            {profile?.school ? ` · ${profile.school}` : ''}
          </p>
          {userEmail && (
            <p className="text-slate-600 text-xs mt-1">{userEmail}</p>
          )}
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
                <stat.icon size={14} style={{ color: stat.color }} aria-hidden="true" />
              </div>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Flame size={24} className="text-[#F59E0B] flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[#F59E0B] font-bold text-sm">{stats.streak} day streak</p>
            <p className="text-slate-400 text-xs">Keep showing up. God sees every rep.</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Account</p>
        <div className="space-y-2">
          <button
            ref={editButtonRef}
            onClick={handleOpenEdit}
            className="w-full flex items-center justify-between bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-xl px-5 py-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Edit2 size={16} className="text-slate-400" aria-hidden="true" />
              <span className="text-white text-sm font-medium">Edit Profile</span>
            </div>
            <span className="text-slate-600 text-xs" aria-hidden="true">&#8594;</span>
          </button>

          <button
            onClick={handleManageBilling}
            className="w-full flex items-center justify-between bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-xl px-5 py-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-slate-400" aria-hidden="true" />
              <span className="text-white text-sm font-medium">Manage Subscription</span>
            </div>
            <span className="text-slate-600 text-xs" aria-hidden="true">&#8594;</span>
          </button>

          {[
            { label: 'Notifications', icon: Bell },
            { label: 'Privacy & Safety', icon: Lock },
          ].map((item) => (
            <div
              key={item.label}
              className="w-full flex items-center justify-between bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-xl px-5 py-4"
              aria-disabled="true"
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-slate-600" aria-hidden="true" />
                <span className="text-slate-600 text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-[#1e3a6e] text-[10px] font-bold uppercase tracking-widest">Soon</span>
            </div>
          ))}

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center gap-3 bg-red-900/20 border border-red-900/30 rounded-xl px-5 py-4 hover:bg-red-900/30 transition-colors disabled:opacity-60"
          >
            <LogOut size={16} className="text-red-400" aria-hidden="true" />
            <span className="text-red-400 text-sm font-medium">
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseEdit(); }}
        >
          <div className="bg-[#1e2d47] border border-[#1e3a6e] rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 id="edit-profile-title" className="text-white font-bold text-lg">Edit Profile</h2>
              <button
                ref={closeButtonRef}
                onClick={handleCloseEdit}
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Close edit profile"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Full Name</label>
                <input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2" id="edit-sport-label">Sport</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="edit-sport-label">
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditSport(s)}
                      role="radio"
                      aria-checked={editSport === s}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        editSport === s
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
                <label htmlFor="edit-school" className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  School <span className="text-slate-700 font-normal normal-case">optional</span>
                </label>
                <input
                  id="edit-school"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  placeholder="Westlake High School"
                  className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              {saveError && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-xl px-4 py-3" role="alert">
                  {saveError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseEdit}
                  className="flex-1 py-3 rounded-xl bg-[#0F172A] border border-[#1e3a6e] text-slate-400 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!editName.trim() || !editSport || saving}
                  className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-[#0F172A] text-sm font-bold disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
