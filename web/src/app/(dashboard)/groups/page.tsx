'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Hash, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';

type GroupType = 'team' | 'event' | 'school';

interface Group {
  id: string;
  name: string;
  type: GroupType;
  sport: string | null;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  member_count?: number;
}

const TYPE_COLORS: Record<GroupType, string> = {
  team: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  event: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  school: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

export default function GroupsPage() {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<GroupType>('team');
  const [newSport, setNewSport] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [groupsRes, memberRes] = await Promise.all([
        supabase.from('prayer_groups').select('*').eq('is_private', false).order('created_at', { ascending: true }),
        supabase.from('group_members').select('group_id').eq('user_id', user.id),
      ]);

      if (groupsRes.error) throw groupsRes.error;
      setAllGroups(groupsRes.data ?? []);
      setMyGroupIds((memberRes.data ?? []).map((m) => m.group_id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load groups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Close open panels on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShowCreate(false);
      setShowJoin(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!userId) return false;
    setMyGroupIds((p) => [...p, groupId]);
    const supabase = createClient();
    const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: userId });
    if (error) {
      setMyGroupIds((p) => p.filter((id) => id !== groupId));
      setError('Could not join group. Try again.');
      return false;
    }
    return true;
  };

  const leaveGroup = async (groupId: string) => {
    if (!userId) return;
    const group = allGroups.find((g) => g.id === groupId);
    if (group?.created_by === userId) {
      setError('You created this group. Delete it from settings rather than leaving it.');
      return;
    }
    const confirmed = window.confirm(`Leave "${group?.name}"? You can rejoin later.`);
    if (!confirmed) return;
    // Optimistic removal
    setMyGroupIds((p) => p.filter((id) => id !== groupId));
    const supabase = createClient();
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) {
      // Rollback
      setMyGroupIds((p) => [...p, groupId]);
      setError('Could not leave group. Try again.');
    }
  };

  const createGroup = async () => {
    if (!newName.trim() || !userId) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('prayer_groups')
      .insert({ name: newName.trim(), type: newType, sport: newSport.trim() || null, description: newDesc.trim() || null, created_by: userId, is_private: false })
      .select()
      .single();
    setSaving(false);
    if (error) { setError(error.message); return; }
    if (data) {
      setAllGroups((p) => [data, ...p]);
      await joinGroup(data.id);
    }
    setShowCreate(false);
    setNewName(''); setNewType('team'); setNewSport(''); setNewDesc('');
  };

  const joinByCode = async () => {
    const trimmed = code.trim();
    if (trimmed.length < 4 || !userId) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    // Use exact match (case-insensitive) — not a partial search
    const { data, error } = await supabase
      .from('prayer_groups')
      .select('*')
      .ilike('invite_code', trimmed)
      .maybeSingle();
    setSaving(false);
    if (error || !data) { setError('No group found with that code.'); return; }
    if (myGroupIds.includes(data.id)) {
      setError('You are already a member of that group.');
      setSaving(false);
      return;
    }
    setAllGroups((p) => p.find((g) => g.id === data.id) ? p : [data, ...p]);
    const joined = await joinGroup(data.id);
    if (!joined) return;
    setShowJoin(false);
    setCode('');
  };

  const myGroups = allGroups.filter((g) => myGroupIds.includes(g.id));
  const discover = allGroups.filter((g) => !myGroupIds.includes(g.id));

  return (
    <div className="pb-24 md:pb-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">Prayer Groups</p>
          <h1 className="text-white text-3xl font-bold">Your Teams</h1>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => { setShowCreate(!showCreate); setShowJoin(false); }}
          className="flex items-center gap-2 bg-[#F59E0B] text-[#080E1A] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FBBF24] transition-colors"
        >
          <Plus size={16} aria-hidden="true" /> Create Group
        </button>
        <button
          onClick={() => { setShowJoin(!showJoin); setShowCreate(false); }}
          className="flex items-center gap-2 bg-[#1e2d47] border border-[#1e3a6e] text-slate-300 font-bold text-sm px-5 py-2.5 rounded-xl hover:border-slate-500 transition-colors"
        >
          <Hash size={16} aria-hidden="true" /> Join by Code
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-700/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6" role="alert">
          <AlertCircle size={14} aria-hidden="true" /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-400" aria-label="Dismiss error">&times;</button>
        </div>
      )}

      {showCreate && (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Create a Group</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-group-name" className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Group Name</label>
              <input
                id="new-group-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={80}
                placeholder="e.g. Westlake JV Soccer"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2" id="group-type-label">Type</p>
              <div className="flex gap-2" role="radiogroup" aria-labelledby="group-type-label">
                {(['team', 'event', 'school'] as GroupType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    role="radio"
                    aria-checked={newType === t}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border capitalize transition-colors ${newType === t ? 'bg-[#F59E0B] border-[#F59E0B] text-[#080E1A]' : 'bg-[#0F172A] border-[#1e3a6e] text-slate-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="new-group-sport" className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Sport (optional)</label>
              <input
                id="new-group-sport"
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
                maxLength={40}
                placeholder="Basketball, Soccer, Track..."
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="new-group-desc" className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Description (optional)</label>
              <input
                id="new-group-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                maxLength={200}
                placeholder="What is this group for?"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl bg-[#0F172A] border border-[#1e3a6e] text-slate-400 text-sm font-semibold">Cancel</button>
              <button disabled={!newName.trim() || saving} onClick={createGroup} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-[#080E1A] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />} Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-1">Join by Invite Code</h3>
          <p className="text-slate-500 text-sm mb-4">Ask your group leader for the invite code.</p>
          <label htmlFor="join-code" className="sr-only">Invite code</label>
          <input
            id="join-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FCA001"
            maxLength={20}
            className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm text-center font-bold tracking-[8px] placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors mb-4"
          />
          <div className="flex gap-3">
            <button onClick={() => setShowJoin(false)} className="flex-1 py-3 rounded-xl bg-[#0F172A] border border-[#1e3a6e] text-slate-400 text-sm font-semibold">Cancel</button>
            <button disabled={!code.trim() || saving} onClick={joinByCode} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-[#080E1A] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />} Join
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-600" aria-label="Loading groups" />
        </div>
      ) : (
        <>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">My Groups</h2>
          <div className="space-y-3 mb-8">
            {myGroups.length === 0 ? (
              <div className="bg-[#1e2d47]/40 border border-[#1e3a6e] rounded-2xl p-6 text-center">
                <p className="text-slate-500 text-sm">You have not joined any groups yet.</p>
              </div>
            ) : (
              myGroups.map((g) => <GroupCard key={g.id} group={g} isMember disabled={saving} onToggle={() => leaveGroup(g.id)} />)
            )}
          </div>

          {discover.length > 0 && (
            <>
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Discover</h2>
              <div className="space-y-3">
                {discover.map((g) => <GroupCard key={g.id} group={g} isMember={false} disabled={saving} onToggle={() => joinGroup(g.id)} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function GroupCard({ group, isMember, disabled, onToggle }: { group: Group; isMember: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-5 flex items-start justify-between hover:border-white/20 transition-colors">
      <div className="flex-1 mr-4 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize border ${TYPE_COLORS[group.type]}`}>{group.type}</span>
          {group.sport && <span className="text-slate-500 text-xs">{group.sport}</span>}
        </div>
        <h3 className="text-white font-bold text-base mb-1 truncate">{group.name}</h3>
        {group.description && <p className="text-slate-400 text-sm leading-5 line-clamp-2">{group.description}</p>}
        {isMember && (
          <p className="text-slate-600 text-xs mt-2 flex items-center gap-1">
            <Users size={11} aria-hidden="true" /> Code: <span className="font-mono font-bold">{group.invite_code}</span>
          </p>
        )}
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-label={isMember ? `Leave ${group.name}` : `Join ${group.name}`}
        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMember ? 'bg-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B]/10' : 'bg-[#1e3a6e] text-slate-300 hover:bg-[#1e3a6e]/80'}`}
      >
        {isMember ? 'Joined' : 'Join'}
      </button>
    </div>
  );
}
