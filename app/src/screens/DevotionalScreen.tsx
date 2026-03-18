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
} from 'react-native';
import { getTodaysDevotional } from '../lib/devotionals';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DevotionalScreen() {
  const devotional = getTodaysDevotional();
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const today = new Date();
  const dayName = DAYS[today.getDay()];
  const dateStr = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}`;

  const handleSave = () => {
    if (!reflection.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
              {dayName}, {dateStr}
            </Text>
            <Text className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest">
              Daily Devotional
            </Text>
          </View>

          {/* Title */}
          <View className="px-6 pt-4 pb-6">
            <Text className="text-white text-3xl font-bold leading-tight">
              {devotional.title}
            </Text>
          </View>

          {/* Scripture Block */}
          <View className="mx-6 mb-7 bg-[#0a1020] rounded-3xl p-6 border-l-4 border-[#F59E0B]">
            <Text className="text-slate-300 text-lg italic leading-8 mb-3">
              "{devotional.scripture}"
            </Text>
            <Text className="text-[#F59E0B] font-bold text-sm">
              {devotional.scripture_ref}
            </Text>
          </View>

          {/* Divider label */}
          <View className="px-6 mb-4">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Reflection
            </Text>
          </View>

          {/* Body */}
          <View className="px-6 mb-8">
            {devotional.body.split('\n\n').map((paragraph, i) => (
              <Text
                key={i}
                className="text-slate-300 text-[15px] leading-[26px] mb-4"
              >
                {paragraph}
              </Text>
            ))}
          </View>

          {/* Reflection Prompt */}
          <View className="mx-6 mb-6 bg-[#1e3a6e]/40 rounded-3xl p-5 border border-[#1e3a6e]">
            <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">
              Reflect
            </Text>
            <Text className="text-white text-base leading-7 font-medium">
              {devotional.reflection_prompt}
            </Text>
          </View>

          {/* Journal Input */}
          <View className="px-6 mb-4">
            <Text className="text-slate-400 text-sm font-semibold mb-3">
              Write your response
            </Text>
            <TextInput
              className="bg-[#1e2d47] text-white rounded-2xl px-4 py-4 text-[15px] leading-6 border border-[#1e3a6e]"
              placeholder="What is God saying to you through this today?"
              placeholderTextColor="#475569"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={reflection}
              onChangeText={setReflection}
              style={{ minHeight: 120 }}
            />
          </View>

          <View className="px-6 mb-12">
            <TouchableOpacity
              onPress={handleSave}
              className={`py-4 rounded-2xl items-center ${
                saved
                  ? 'bg-green-600'
                  : reflection.trim()
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#1e2d47]'
              }`}
            >
              <Text
                className={`font-bold text-base ${
                  saved
                    ? 'text-white'
                    : reflection.trim()
                    ? 'text-[#0F172A]'
                    : 'text-slate-500'
                }`}
              >
                {saved ? 'Reflection saved ✓' : 'Save Reflection'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
