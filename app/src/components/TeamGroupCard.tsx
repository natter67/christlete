import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface GroupData {
  id: string;
  name: string;
  type: 'team' | 'event' | 'school';
  description?: string;
  sport?: string;
  memberCount?: number;
  inviteCode?: string;
}

interface Props {
  group: GroupData;
  onPress?: () => void;
  isMember?: boolean;
}

const TYPE_LABELS: Record<GroupData['type'], string> = {
  team: 'Team',
  event: 'Event',
  school: 'School',
};

const TYPE_COLORS: Record<GroupData['type'], string> = {
  team: '#3B82F6',
  event: '#10B981',
  school: '#8B5CF6',
};

export default function TeamGroupCard({ group, onPress, isMember }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-[#1e2d47] rounded-2xl p-4 mb-3 border border-[#1e3a6e]"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2 mb-1">
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${TYPE_COLORS[group.type]}20` }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: TYPE_COLORS[group.type] }}
              >
                {TYPE_LABELS[group.type]}
              </Text>
            </View>
            {group.sport && (
              <Text className="text-slate-500 text-xs">{group.sport}</Text>
            )}
          </View>
          <Text className="text-white font-bold text-base mb-1">{group.name}</Text>
          {group.description && (
            <Text className="text-slate-400 text-sm leading-5" numberOfLines={2}>
              {group.description}
            </Text>
          )}
        </View>
        <View className="items-end">
          {isMember ? (
            <View className="bg-[#F59E0B]/20 px-3 py-1 rounded-full">
              <Text className="text-[#F59E0B] text-xs font-bold">Joined</Text>
            </View>
          ) : (
            <View className="bg-[#1e3a6e] px-3 py-1 rounded-full">
              <Text className="text-slate-300 text-xs font-bold">Join</Text>
            </View>
          )}
          {group.memberCount !== undefined && (
            <Text className="text-slate-500 text-xs mt-2">
              {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
