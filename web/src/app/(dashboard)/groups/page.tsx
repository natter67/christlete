'use client';

import { useState } from 'react';
import { Users, Plus, Hash } from 'lucide-react';

type GroupType = 'team' | 'event' | 'school';

interface Group {
  id: string;
  name: string;
  type: GroupType;
  sport?: string;
  description?: string;
  memberCount: number;
}

const DEMO_GROUPS: Group[] = [
  { id: '1', name: 'Westlake Varsity Football', type: 'team', sport: 'Football', description: 'Pregame prayer and weekly devotionals for the Wolves.', memberCount: 14 },
  { id: '2', name: 'Spring Classic Tournament', type: 'event', sport: 'Baseball', description: 'All-tournament prayer space for athletes competing this weekend.', memberCount: 31 },
  { id: '3', name: 'Riverdale Christian Athletes', type: 'school', description: 'For all athletes across every sport at Riverdale.', memberCount: 58 },
];

const TYPE_COLORS: Record<GroupType, string> = {
  team: 'text-blue-400 bg-blue-400/10',
  event: 'text-emerald-400 bg-emerald-400/10',
  school: 'text-purple-400 bg-purple-400/10',
};

export default function GroupsPage() {
  const [joined, setJoined] = useState<string[]>(['1']);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<GroupType>('team');
  const [newDesc, setNewDesc] = useState('');
  const [code, setCode] = useState('');

  const toggle = (id: string) =>
    setJoined((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">Prayer Groups</p>
          <h1 className="text-white text-3xl font-bold">Your Teams</h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FBBF24] transition-colors"
        >
          <Plus size={16} /> Create Group
        </button>
        <button
          onClick={() => setShowJoin(!showJoin)}
          className="flex items-center gap-2 bg-[#1e2d47] border border-[#1e3a6e] text-slate-300 font-bold text-sm px-5 py-2.5 rounded-xl hover:border-slate-500 transition-colors"
        >
          <Hash size={16} /> Join by Code
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Create a Group</h3>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Westlake JV Soccer"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Type</label>
              <div className="flex gap-2">
                {(['team', 'event', 'school'] as GroupType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border capitalize transition-colors ${
                      newType === t
                        ? 'bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]'
                        : 'bg-[#0F172A] border-[#1e3a6e] text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Description</label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What's this group for?"
                className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl bg-[#0F172A] border border-[#1e3a6e] text-slate-400 text-sm font-semibold">
                Cancel
              </button>
              <button
                disabled={!newName}
                onClick={() => { if (newName) { setShowCreate(false); setNewName(''); }}}
                className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-[#0F172A] text-sm font-bold disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join by Code */}
      {showJoin && (
        <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-2">Join by Invite Code</h3>
          <p className="text-slate-400 text-sm mb-4">Ask your group leader for the 6-character code.</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="A1B2C3"
            className="w-full bg-[#0F172A] border border-[#1e3a6e] text-white rounded-xl px-4 py-3 text-sm text-center text-2xl font-bold tracking-[12px] placeholder:text-slate-600 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-[#F59E0B] transition-colors mb-4"
          />
          <div className="flex gap-3">
            <button onClick={() => setShowJoin(false)} className="flex-1 py-3 rounded-xl bg-[#0F172A] border border-[#1e3a6e] text-slate-400 text-sm font-semibold">
              Cancel
            </button>
            <button
              disabled={code.length !== 6}
              onClick={() => { if (code.length === 6) setShowJoin(false); }}
              className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-[#0F172A] text-sm font-bold disabled:opacity-40"
            >
              Join
            </button>
          </div>
        </div>
      )}

      {/* My Groups */}
      <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">My Groups</h2>
      <div className="space-y-3 mb-8">
        {DEMO_GROUPS.filter((g) => joined.includes(g.id)).length === 0 ? (
          <div className="bg-[#1e2d47]/40 border border-[#1e3a6e] rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm">You haven't joined any groups yet.</p>
          </div>
        ) : (
          DEMO_GROUPS.filter((g) => joined.includes(g.id)).map((g) => (
            <GroupCard key={g.id} group={g} isMember onToggle={toggle} />
          ))
        )}
      </div>

      {/* Discover */}
      <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Discover</h2>
      <div className="space-y-3">
        {DEMO_GROUPS.filter((g) => !joined.includes(g.id)).map((g) => (
          <GroupCard key={g.id} group={g} isMember={false} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, isMember, onToggle }: { group: Group; isMember: boolean; onToggle: (id: string) => void }) {
  return (
    <div className="bg-[#1e2d47]/60 border border-[#1e3a6e] rounded-2xl p-5 flex items-start justify-between hover:border-white/20 transition-colors">
      <div className="flex-1 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[group.type]}`}>
            {group.type}
          </span>
          {group.sport && <span className="text-slate-500 text-xs">{group.sport}</span>}
        </div>
        <h3 className="text-white font-bold text-base mb-1">{group.name}</h3>
        {group.description && (
          <p className="text-slate-400 text-sm leading-5">{group.description}</p>
        )}
        <p className="text-slate-600 text-xs mt-2 flex items-center gap-1">
          <Users size={11} /> {group.memberCount} members
        </p>
      </div>
      <button
        onClick={() => onToggle(group.id)}
        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
          isMember
            ? 'bg-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B]/10'
            : 'bg-[#1e3a6e] text-slate-300 hover:bg-[#1e3a6e]/80'
        }`}
      >
        {isMember ? 'Joined' : 'Join'}
      </button>
    </div>
  );
}
