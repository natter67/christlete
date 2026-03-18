import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Devotional } from '../lib/devotionals';

interface Props {
  devotional: Devotional;
  onPress?: () => void;
  compact?: boolean;
}

export default function DevotionalCard({ devotional, onPress, compact }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-[#1e2d47] rounded-3xl p-5 border border-[#1e3a6e]"
    >
      <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">
        Today's Word
      </Text>
      <Text className="text-white text-xl font-bold mb-3 leading-7">
        {devotional.title}
      </Text>
      <Text className="text-slate-300 text-sm italic mb-1 leading-6" numberOfLines={compact ? 2 : 3}>
        "{devotional.scripture}"
      </Text>
      <Text className="text-slate-500 text-xs font-semibold mb-4">
        {devotional.scripture_ref}
      </Text>
      {!compact && (
        <Text className="text-slate-400 text-sm leading-6" numberOfLines={3}>
          {devotional.body}
        </Text>
      )}
      <View className="flex-row items-center mt-4">
        <Text className="text-[#F59E0B] text-sm font-semibold">
          Read full devotional →
        </Text>
      </View>
    </TouchableOpacity>
  );
}
