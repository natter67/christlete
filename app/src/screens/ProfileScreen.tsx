import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const SPORTS_EMOJI: Record<string, string> = {
  Football: '🏈',
  Basketball: '🏀',
  Baseball: '⚾',
  Soccer: '⚽',
  'Track & Field': '🏃',
  Swimming: '🏊',
  Tennis: '🎾',
  Volleyball: '🏐',
  Wrestling: '🤼',
  'Cross Country': '🏔',
  Lacrosse: '🥍',
  Golf: '⛳',
  Softball: '🥎',
  Hockey: '🏒',
  Other: '🏅',
};

// Demo profile data
const DEMO_PROFILE = {
  name: 'Caleb Newton',
  sport: 'Basketball',
  school: 'Westlake High',
  checkinStreak: 7,
  totalCheckins: 23,
  devotionalsRead: 31,
  groupsJoined: 2,
};

const STRUGGLES = [
  'Pressure to perform',
  'Mental health & anxiety',
];

export default function ProfileScreen() {
  const [profile] = useState(DEMO_PROFILE);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">
            Profile
          </Text>
        </View>

        {/* Avatar + Name */}
        <View className="items-center px-6 pt-6 pb-8">
          <View className="w-24 h-24 rounded-full bg-[#1e3a6e] items-center justify-center mb-4 border-2 border-[#F59E0B]">
            <Text className="text-5xl">
              {SPORTS_EMOJI[profile.sport] ?? '🏅'}
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold">{profile.name}</Text>
          <Text className="text-slate-400 text-base mt-1">
            {profile.sport} · {profile.school}
          </Text>
        </View>

        {/* Stats */}
        <View className="mx-6 mb-7">
          <View className="bg-[#1e2d47] rounded-3xl p-5 border border-[#1e3a6e]">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              Your Journey
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{profile.checkinStreak}</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">Day{'\n'}Streak</Text>
              </View>
              <View className="w-px bg-[#1e3a6e]" />
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{profile.totalCheckins}</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">Pregame{'\n'}Check-ins</Text>
              </View>
              <View className="w-px bg-[#1e3a6e]" />
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{profile.devotionalsRead}</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">Devotionals{'\n'}Read</Text>
              </View>
              <View className="w-px bg-[#1e3a6e]" />
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{profile.groupsJoined}</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">Prayer{'\n'}Groups</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Banner */}
        <View className="mx-6 mb-7 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-4 flex-row items-center gap-3">
          <Text className="text-3xl">🔥</Text>
          <View>
            <Text className="text-[#F59E0B] font-bold text-base">
              {profile.checkinStreak} day streak
            </Text>
            <Text className="text-slate-400 text-sm">Keep showing up. God sees every rep.</Text>
          </View>
        </View>

        {/* What I'm carrying */}
        <View className="px-6 mb-7">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            What I'm Carrying
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {STRUGGLES.map((s) => (
              <View
                key={s}
                className="px-4 py-2 rounded-full bg-[#1e2d47] border border-[#1e3a6e]"
              >
                <Text className="text-slate-300 text-sm font-medium">{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 mb-10">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            Account
          </Text>
          {[
            { label: 'Edit Profile', icon: '✏️' },
            { label: 'Notification Settings', icon: '🔔' },
            { label: 'Privacy & Safety', icon: '🔒' },
            { label: 'Sign Out', icon: '→', danger: true },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              className="flex-row items-center justify-between bg-[#1e2d47] rounded-2xl px-5 py-4 mb-2 border border-[#1e3a6e]"
            >
              <Text className={`font-medium text-base ${item.danger ? 'text-red-400' : 'text-white'}`}>
                {item.label}
              </Text>
              <Text className="text-slate-500">{item.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
