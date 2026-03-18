import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { getTodaysDevotional } from '../lib/devotionals';
import DevotionalCard from '../components/DevotionalCard';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }: any) {
  const today = new Date();
  const devotional = getTodaysDevotional();
  const dayName = DAYS[today.getDay()];
  const dateStr = `${MONTHS[today.getMonth()]} ${today.getDate()}`;

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-slate-400 text-sm font-medium">
            {dayName}, {dateStr}
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">
            {getGreeting()}, Athlete 👋
          </Text>
        </View>

        {/* Daily Verse Banner */}
        <View className="mx-6 mb-5 bg-[#1e3a6e] rounded-3xl p-5 border border-[#F59E0B]/20">
          <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">
            Today's Verse
          </Text>
          <Text className="text-white text-base leading-6 italic mb-2">
            "{devotional.scripture}"
          </Text>
          <Text className="text-slate-400 text-sm font-semibold">
            — {devotional.scripture_ref}
          </Text>
        </View>

        {/* Today's Devotional */}
        <View className="px-6 mb-5">
          <Text className="text-white text-lg font-bold mb-3">Today's Devotional</Text>
          <DevotionalCard devotional={devotional} onPress={() => navigation.navigate('Devotional')} />
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-5">
          <Text className="text-white text-lg font-bold mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-[#1e2d47] rounded-2xl p-4 items-center"
              onPress={() => navigation.navigate('Prayer')}
            >
              <Text className="text-3xl mb-2">🙏</Text>
              <Text className="text-white font-semibold text-sm text-center">Pregame Prayer</Text>
              <Text className="text-slate-500 text-xs text-center mt-1">Check in before your game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#1e2d47] rounded-2xl p-4 items-center"
              onPress={() => navigation.navigate('Groups')}
            >
              <Text className="text-3xl mb-2">⚡</Text>
              <Text className="text-white font-semibold text-sm text-center">Prayer Groups</Text>
              <Text className="text-slate-500 text-xs text-center mt-1">Pray with your team</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Encouragement */}
        <View className="mx-6 mb-10 bg-[#0a1020] rounded-3xl p-5 border border-[#1e3a6e]">
          <Text className="text-slate-400 text-sm text-center leading-6">
            "Run in such a way as to get the prize. Everyone who competes in the games
            goes into strict training — they do it to get a crown that will not last,
            but we do it to get a crown that will last forever."
          </Text>
          <Text className="text-[#F59E0B] text-sm text-center font-semibold mt-3">
            1 Corinthians 9:24-25
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
