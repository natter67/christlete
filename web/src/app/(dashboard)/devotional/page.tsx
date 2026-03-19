'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Devotional = {
  id: string;
  title: string;
  scripture: string;
  scripture_ref: string;
  body: string;
  reflection_prompt: string;
};

export default function DevotionalPage() {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [existingEntry, setExistingEntry] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const dayIndex = new Date().getDay();

      const [{ data: devData }, { data: { user } }] = await Promise.all([
        supabase
          .from('devotionals')
          .select('id, title, scripture, scripture_ref, body, reflection_prompt')
          .eq('day_index', dayIndex)
          .eq('published', true)
          .maybeSingle(),
        supabase.auth.getUser(),
      ]);

      if (user) setUserId(user.id);

      if (devData) {
        setDevotional(devData);

        if (user) {
          // Build UTC bounds for the user's local calendar day
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          const { data: entry } = await supabase
            .from('journal_entries')
            .select('id, body')
            .eq('user_id', user.id)
            .eq('devotional_id', devData.id)
            .gte('created_at', startOfDay.toISOString())
            .lt('created_at', endOfDay.toISOString())
            .maybeSingle();

          if (entry) {
            setReflection(entry.body);
            setExistingEntry(entry.id);
            setSaved(true);
          }
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  const handleSave = async () => {
    if (!reflection.trim() || !devotional || !userId) return;
    setSaving(true);
    setSaveError('');

    try {
      const supabase = createClient();
      // userId already available from component state

      if (existingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({ body: reflection })
          .eq('id', existingEntry)
          .eq('user_id', userId!);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: userId,
            devotional_id: devotional.id,
            body: reflection,
          })
          .select('id')
          .single();
        if (error) throw error;
        if (inserted) setExistingEntry(inserted.id);
      }

      setSaved(true);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save. Try again.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const paragraphs = devotional?.body.split('\n\n').filter(Boolean) ?? [];

  if (loading) {
    return (
      <div className="pb-24 md:pb-8 max-w-2xl animate-pulse">
        <div className="h-3 w-28 bg-[#1e3a6e] rounded mb-4" />
        <div className="h-8 w-2/3 bg-[#1e3a6e] rounded mb-8" />
        <div className="border-l-4 border-[#F59E0B]/30 pl-6 mb-10">
          <div className="h-5 w-full bg-[#1e3a6e] rounded mb-3" />
          <div className="h-5 w-3/4 bg-[#1e3a6e] rounded mb-4" />
          <div className="h-3 w-24 bg-[#1e3a6e] rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-[#1e3a6e] rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="pb-24 md:pb-8 max-w-2xl">
        <p className="text-slate-500">No devotional found for today. Check back later.</p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Daily Devotional</p>
        <h1 className="text-white text-3xl font-bold">{devotional.title}</h1>
      </div>

      <div className="border-l-4 border-[#F59E0B] pl-6 mb-10">
        <p className="text-slate-300 text-lg italic leading-9 mb-2">&ldquo;{devotional.scripture}&rdquo;</p>
        <p className="text-[#F59E0B] text-sm font-bold">{devotional.scripture_ref}</p>
      </div>

      <div className="space-y-5 mb-10">
        {paragraphs.map((p, i) => (
          <p key={`para-${i}`} className="text-slate-300 text-[15px] leading-8">{p}</p>
        ))}
      </div>

      <div className="bg-[#1e3a6e]/20 border border-[#1e3a6e] rounded-2xl p-6 mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">Reflect</p>
        <p className="text-white text-base font-medium leading-7">{devotional.reflection_prompt}</p>
      </div>

      <div className="mb-6">
        <label htmlFor="journal-reflection" className="text-slate-400 text-sm font-semibold block mb-3">
          Write your response
        </label>
        <textarea
          id="journal-reflection"
          value={reflection}
          onChange={(e) => {
            setReflection(e.target.value);
            if (saved) setSaved(false);
            if (saveError) setSaveError('');
          }}
          rows={5}
          maxLength={1000}
          placeholder="What is God saying to you through this today?"
          className="w-full bg-[#1e2d47] border border-[#1e3a6e] text-white rounded-2xl px-4 py-4 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors resize-none leading-7"
        />
      </div>

      {saveError && (
        <div className="bg-red-900/20 border border-red-700/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4" role="alert">
          {saveError}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!reflection.trim() || saving}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : reflection.trim()
            ? 'bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24]'
            : 'bg-[#1e2d47] text-slate-500 cursor-not-allowed'
        }`}
      >
        {saving ? 'Saving...' : saved ? 'Reflection saved' : 'Save Reflection'}
      </button>
    </div>
  );
}
