'use client';

import { useState } from 'react';

const DEVOTIONALS = [
  {
    id: 'sun',
    day: 'Sunday',
    title: 'Rest Is Sacred',
    scripture: '"Come to me, all you who are weary and burdened, and I will give you rest."',
    scripture_ref: 'Matthew 11:28',
    body: `The world tells athletes that rest is weakness — that more reps, more film, more grind is always the answer. But God built rest into creation itself. He rested on the seventh day not because He was tired, but to show us that stillness is holy. Your body needs recovery. Your soul needs Sundays.

Today, lay down the scoreboard, the ranking, the pressure. Let God speak into the quiet. You don't earn His love by grinding through rest. You receive it by trusting Him enough to stop.`,
    reflection_prompt: 'What does real rest look like for you today? Where do you need to let go of striving and simply receive?',
  },
  {
    id: 'fri',
    day: 'Friday',
    title: 'Pregame Peace',
    scripture: '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
    scripture_ref: 'Philippians 4:6-7',
    body: `Game day nerves are real. Your heart rate rises, your mind races through scenarios. Paul knew anxiety — he wrote this letter in chains. And his answer is not "calm down" or "you've got this." His answer is prayer.

Not a performance prayer. Not a bargaining prayer. A thankful prayer. You bring God your anxious heart and a list of requests. He trades you peace for it. Not peace that makes sense, but a supernatural calm that guards you from the inside out.

Before you warm up today, pray.`,
    reflection_prompt: "What specific anxiety about today's competition do you want to hand to God? Write it down and speak it out loud to Him.",
  },
];

export default function DevotionalPage() {
  const dayIndex = new Date().getDay();
  const todayDev = DEVOTIONALS.find((_, i) => i === (dayIndex === 5 ? 1 : 0)) ?? DEVOTIONALS[0];
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!reflection.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="pb-24 md:pb-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Daily Devotional</p>
        <h1 className="text-white text-3xl font-bold">{todayDev.title}</h1>
      </div>

      {/* Scripture */}
      <div className="border-l-4 border-[#F59E0B] pl-6 mb-10">
        <p className="text-slate-300 text-lg italic leading-9 mb-2">{todayDev.scripture}</p>
        <p className="text-[#F59E0B] text-sm font-bold">{todayDev.scripture_ref}</p>
      </div>

      {/* Body */}
      <div className="space-y-5 mb-10">
        {todayDev.body.split('\n\n').map((p, i) => (
          <p key={i} className="text-slate-300 text-[15px] leading-8">{p}</p>
        ))}
      </div>

      {/* Reflection */}
      <div className="bg-[#1e3a6e]/20 border border-[#1e3a6e] rounded-2xl p-6 mb-8">
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">Reflect</p>
        <p className="text-white text-base font-medium leading-7">{todayDev.reflection_prompt}</p>
      </div>

      {/* Journal */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm font-semibold mb-3">Write your response</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={5}
          placeholder="What is God saying to you through this today?"
          className="w-full bg-[#1e2d47] border border-[#1e3a6e] text-white rounded-2xl px-4 py-4 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B] transition-colors resize-none leading-7"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!reflection.trim()}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : reflection.trim()
            ? 'bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24]'
            : 'bg-[#1e2d47] text-slate-500 cursor-not-allowed'
        }`}
      >
        {saved ? 'Reflection saved ✓' : 'Save Reflection'}
      </button>
    </div>
  );
}
