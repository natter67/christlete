'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Feeling = { id: string; label: string; emoji: string; prayer: string };

const FEELINGS: Feeling[] = [
  {
    id: 'anxious', label: 'Anxious', emoji: '😰',
    prayer: "Lord, I come to You with anxiety in my chest and uncertainty in my mind. You said not to be anxious about anything, but to bring everything to You in prayer. So here I am. Still my heart before this moment. Let Your peace — the kind that doesn't make sense — guard my mind right now. I choose to trust You with the outcome. Amen.",
  },
  {
    id: 'confident', label: 'Confident', emoji: '💪',
    prayer: "Father, I walk into this competition with confidence — not in my own ability, but in what You've placed in me. Every gift I have comes from You. Let me use it with excellence and humility. Keep me from pride. Let me compete in a way that honors You, win or lose. Amen.",
  },
  {
    id: 'tired', label: 'Tired', emoji: '😔',
    prayer: "God, I am tired. My body is drained and my mind feels heavy. But Your Word says You give strength to the weary. I'm asking for that right now — not just physical energy, but the kind that carries me through. You've seen every rep, every early morning. Be present with me in this moment. Amen.",
  },
  {
    id: 'grateful', label: 'Grateful', emoji: '🙏',
    prayer: "God, I'm grateful today. Grateful for a body that can compete, for teammates beside me, and for the opportunity to do what I love. Before anything else happens today, I want to say thank You. Let me play with gratitude in every step. You are the reason I compete. Amen.",
  },
  {
    id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌊',
    prayer: "Lord, there is too much going on — in the game, in my life, in my head. I feel like I'm underwater. But You are the God who walks on water. I reach for You. Carry what I can't carry. Clear the noise. Help me take one breath, one rep, one play at a time, trusting You with the rest. Amen.",
  },
  {
    id: 'focused', label: 'Focused', emoji: '🎯',
    prayer: "Father, I am locked in. My preparation is done. My mind is clear. As I step into competition, keep my focus sharp but my heart humble. Remind me that this ability is a gift, and I am using it for something bigger than a scoreboard. Let me be an example today. Amen.",
  },
];

type Step = 'feeling' | 'carrying' | 'prayer';

export default function PrayerPage() {
  const [step, setStep] = useState<Step>('feeling');
  const [selected, setSelected] = useState<Feeling | null>(null);
  const [carrying, setCarrying] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => { setStep('feeling'); setSelected(null); setCarrying(''); setDone(false); setSaving(false); };

  const handlePrayed = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('prayer_checkins').insert({
          user_id: user.id,
          feeling: selected.id,
          carrying: carrying.trim() || null,
          prayer_text: selected.prayer,
        });
      }
    } catch {
      // non-blocking — checkin is best-effort
    } finally {
      setSaving(false);
      setDone(true);
    }
  };

  return (
    <div className="pb-24 md:pb-8 max-w-xl">
      <div className="mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Pregame Prayer</p>
        <h1 className="text-white text-3xl font-bold">
          {step === 'feeling' && 'How are you feeling?'}
          {step === 'carrying' && "What are you carrying?"}
          {step === 'prayer' && 'Ready to compete.'}
        </h1>
        {step === 'feeling' && (
          <p className="text-slate-400 text-sm mt-2">Be honest. God meets you exactly where you are.</p>
        )}
        {step === 'carrying' && (
          <p className="text-slate-400 text-sm mt-2">A fear, a pressure, a request — anything on your heart right now.</p>
        )}
      </div>

      {/* Step: Feeling */}
      {step === 'feeling' && (
        <>
          <div className="flex flex-wrap gap-3 mb-8">
            {FEELINGS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelected(f)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                  selected?.id === f.id
                    ? 'bg-[#1e3a6e] border-[#F59E0B] text-white'
                    : 'bg-[#1e2d47] border-transparent text-slate-300 hover:border-slate-600'
                }`}
              >
                <span>{f.emoji}</span> {f.label}
              </button>
            ))}
          </div>
          <button
            disabled={!selected}
            onClick={() => selected && setStep('carrying')}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24]"
          >
            Continue
          </button>
        </>
      )}

      {/* Step: Carrying */}
      {step === 'carrying' && (
        <>
          <div className="flex items-center gap-2 bg-[#1e2d47] rounded-xl px-4 py-3 border border-[#1e3a6e] mb-5">
            <span className="text-xl">{selected?.emoji}</span>
            <span className="text-slate-300 text-sm font-medium">Feeling {selected?.label}</span>
          </div>
          <textarea
            value={carrying}
            onChange={(e) => setCarrying(e.target.value)}
            rows={5}
            placeholder="What's on your mind going into this?"
            className="w-full bg-[#1e2d47] border border-[#1e3a6e] text-white rounded-2xl px-4 py-4 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors resize-none leading-7 mb-5"
          />
          <div className="space-y-3">
            <button
              onClick={() => setStep('prayer')}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24] transition-colors"
            >
              Receive Your Prayer
            </button>
            <button
              onClick={() => setStep('prayer')}
              className="w-full py-3 text-slate-500 text-sm hover:text-slate-400 transition-colors"
            >
              Skip — just give me the prayer
            </button>
            <button
              onClick={() => setStep('feeling')}
              className="w-full py-3 text-slate-600 text-sm"
            >
              Back
            </button>
          </div>
        </>
      )}

      {/* Step: Prayer */}
      {step === 'prayer' && (
        <>
          {selected && (
            <div className="inline-flex items-center gap-2 bg-[#1e2d47] border border-[#1e3a6e] rounded-full px-4 py-2 mb-6">
              <span>{selected.emoji}</span>
              <span className="text-slate-300 text-sm font-medium">{selected.label}</span>
            </div>
          )}

          <div className="border-l-4 border-[#F59E0B] pl-6 mb-6">
            <p className="text-white text-[15px] leading-8 italic">{selected?.prayer}</p>
          </div>

          {carrying.trim() && (
            <div className="bg-[#1e3a6e]/20 border border-[#1e3a6e] rounded-2xl p-5 mb-6">
              <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">You Brought</p>
              <p className="text-slate-300 text-sm italic leading-6">&ldquo;{carrying}&rdquo;</p>
              <p className="text-slate-500 text-sm mt-2">He hears it. Lay it down.</p>
            </div>
          )}

          <div className="bg-[#1e2d47] border border-[#1e3a6e] rounded-2xl p-5 mb-6">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">A Word for Today</p>
            <p className="text-slate-300 text-sm italic leading-6">
              &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo;
            </p>
            <p className="text-slate-500 text-xs mt-2 font-bold">Philippians 4:6</p>
          </div>

          <div className="space-y-3">
            {!done ? (
              <button
                onClick={handlePrayed}
                disabled={saving}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'I Prayed This'}
              </button>
            ) : (
              <div className="w-full py-3.5 rounded-xl text-center border border-green-700/50 bg-green-900/20">
                <span className="text-green-400 font-bold text-sm">Check-in complete. Go compete.</span>
              </div>
            )}
            <button onClick={reset} className="w-full py-3 text-slate-500 text-sm hover:text-slate-400">
              Start over
            </button>
          </div>
        </>
      )}
    </div>
  );
}
