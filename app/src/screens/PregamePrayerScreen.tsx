import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

type Feeling = {
  id: string;
  label: string;
  emoji: string;
  prayer: string;
};

const FEELINGS: Feeling[] = [
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    prayer:
      'Lord, I come to You with anxiety in my chest and uncertainty in my mind. You said not to be anxious about anything, but to bring everything to You in prayer. So here I am. Still my heart before this moment. Let Your peace — the kind that doesn\'t make sense — guard my mind right now. I choose to trust You with the outcome. Amen.',
  },
  {
    id: 'confident',
    label: 'Confident',
    emoji: '💪',
    prayer:
      'Father, I walk into this competition with confidence — not in my own ability, but in what You\'ve placed in me. Every gift I have comes from You. Let me use it with excellence and humility. Keep me from pride. Let me compete in a way that honors You, win or lose. Amen.',
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😔',
    prayer:
      'God, I am tired. My body is drained and my mind feels heavy. But Your Word says You give strength to the weary. I\'m asking for that right now — not just physical energy, but the kind that carries me through. You\'ve seen every rep, every early morning. Be present with me in this moment. Amen.',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🙏',
    prayer:
      'God, I\'m grateful today. Grateful for a body that can compete, for teammates beside me, and for the opportunity to do what I love. Before anything else happens today, I want to say thank You. Let me play with gratitude in every step. You are the reason I compete. Amen.',
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌊',
    prayer:
      'Lord, there is too much going on — in the game, in my life, in my head. I feel like I\'m underwater. But You are the God who walks on water. I reach for You. Carry what I can\'t carry. Clear the noise. Help me take one breath, one rep, one play at a time, trusting You with the rest. Amen.',
  },
  {
    id: 'focused',
    label: 'Focused',
    emoji: '🎯',
    prayer:
      'Father, I am locked in. My preparation is done. My mind is clear. As I step into competition, keep my focus sharp but my heart humble. Remind me that this ability is a gift, and I am using it for something bigger than a scoreboard. Let me be an example today. Amen.',
  },
];

type Step = 'feeling' | 'carrying' | 'prayer';

export default function PregamePrayerScreen() {
  const [step, setStep] = useState<Step>('feeling');
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [carrying, setCarrying] = useState('');
  const [checkinDone, setCheckinDone] = useState(false);

  const handleReset = () => {
    setStep('feeling');
    setSelectedFeeling(null);
    setCarrying('');
    setCheckinDone(false);
  };

  if (step === 'feeling') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-8 pb-4">
            <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
              Pregame Check-In
            </Text>
            <Text className="text-white text-3xl font-bold leading-tight mb-2">
              How are you feeling?
            </Text>
            <Text className="text-slate-400 text-base leading-6">
              Be honest. God meets you exactly where you are.
            </Text>
          </View>

          <View className="px-6 mt-4">
            <View className="flex-row flex-wrap gap-3">
              {FEELINGS.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setSelectedFeeling(f)}
                  className={`flex-row items-center gap-2 px-5 py-3 rounded-2xl border ${
                    selectedFeeling?.id === f.id
                      ? 'bg-[#1e3a6e] border-[#F59E0B]'
                      : 'bg-[#1e2d47] border-transparent'
                  }`}
                >
                  <Text className="text-xl">{f.emoji}</Text>
                  <Text
                    className={`font-semibold ${
                      selectedFeeling?.id === f.id ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="px-6 mt-8 mb-12">
            <TouchableOpacity
              className={`py-4 rounded-2xl items-center ${
                selectedFeeling ? 'bg-[#F59E0B]' : 'bg-[#1e2d47]'
              }`}
              onPress={() => selectedFeeling && setStep('carrying')}
              disabled={!selectedFeeling}
            >
              <Text
                className={`font-bold text-base ${
                  selectedFeeling ? 'text-[#0F172A]' : 'text-slate-500'
                }`}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'carrying') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="px-6 pt-8 pb-4">
              <TouchableOpacity onPress={() => setStep('feeling')} className="mb-6">
                <Text className="text-slate-400">← Back</Text>
              </TouchableOpacity>
              <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
                Pregame Check-In
              </Text>
              <Text className="text-white text-3xl font-bold leading-tight mb-2">
                What are you carrying?
              </Text>
              <Text className="text-slate-400 text-base leading-6">
                It can be a fear, a pressure, a prayer request — anything on your heart right now.
              </Text>
            </View>

            <View className="px-6 mt-2">
              <View className="bg-[#1e2d47] rounded-2xl p-4 mb-2 flex-row items-center gap-3 border border-[#1e3a6e]">
                <Text className="text-2xl">{selectedFeeling?.emoji}</Text>
                <Text className="text-slate-300 font-medium">Feeling {selectedFeeling?.label}</Text>
              </View>

              <TextInput
                className="bg-[#1e2d47] text-white rounded-2xl px-4 py-4 mt-4 text-[15px] leading-6 border border-[#1e3a6e]"
                placeholder="What's on your mind going into this?"
                placeholderTextColor="#475569"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={carrying}
                onChangeText={setCarrying}
                style={{ minHeight: 130 }}
              />
            </View>

            <View className="px-6 mt-6 mb-12 gap-3">
              <TouchableOpacity
                className="bg-[#F59E0B] py-4 rounded-2xl items-center"
                onPress={() => setStep('prayer')}
              >
                <Text className="text-[#0F172A] font-bold text-base">Receive Your Prayer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 items-center"
                onPress={() => setStep('prayer')}
              >
                <Text className="text-slate-500 text-sm">Skip — just give me the prayer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (step === 'prayer') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-8 pb-4">
            <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
              Your Prayer
            </Text>
            <Text className="text-white text-3xl font-bold leading-tight">
              Ready to compete.
            </Text>
          </View>

          {/* Feeling badge */}
          <View className="px-6 mt-2 mb-6">
            <View className="flex-row items-center gap-2 bg-[#1e2d47] rounded-full px-4 py-2 self-start border border-[#1e3a6e]">
              <Text className="text-xl">{selectedFeeling?.emoji}</Text>
              <Text className="text-slate-300 text-sm font-medium">{selectedFeeling?.label}</Text>
            </View>
          </View>

          {/* Prayer */}
          <View className="mx-6 mb-6 bg-[#0a1020] rounded-3xl p-6 border-l-4 border-[#F59E0B]">
            <Text className="text-white text-[15px] leading-[28px] italic">
              {selectedFeeling?.prayer}
            </Text>
          </View>

          {carrying.trim() ? (
            <View className="mx-6 mb-8 bg-[#1e3a6e]/30 rounded-3xl p-5 border border-[#1e3a6e]">
              <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
                You Brought
              </Text>
              <Text className="text-slate-300 text-sm leading-6 italic">"{carrying}"</Text>
              <Text className="text-slate-500 text-sm mt-3">
                He hears it. Lay it down.
              </Text>
            </View>
          ) : null}

          <View className="px-6 mb-6">
            <View className="bg-[#1e2d47] rounded-2xl p-4 border border-[#1e3a6e]">
              <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
                A Word for Today
              </Text>
              <Text className="text-slate-300 text-sm italic leading-6">
                "Do not be anxious about anything, but in every situation, by prayer and petition,
                with thanksgiving, present your requests to God."
              </Text>
              <Text className="text-slate-500 text-xs mt-2 font-semibold">Philippians 4:6</Text>
            </View>
          </View>

          <View className="px-6 mb-12 gap-3">
            {!checkinDone ? (
              <TouchableOpacity
                className="bg-[#F59E0B] py-4 rounded-2xl items-center"
                onPress={() => setCheckinDone(true)}
              >
                <Text className="text-[#0F172A] font-bold text-base">I Prayed This ✓</Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-green-900/40 border border-green-700 py-4 rounded-2xl items-center">
                <Text className="text-green-400 font-bold text-base">Check-in complete. Go compete.</Text>
              </View>
            )}
            <TouchableOpacity className="py-3 items-center" onPress={handleReset}>
              <Text className="text-slate-500 text-sm">Start over</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
