import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TeamGroupCard, { type GroupData } from '../components/TeamGroupCard';

const DEMO_GROUPS: GroupData[] = [
  {
    id: '1',
    name: 'Westlake Varsity Football',
    type: 'team',
    sport: 'Football',
    description: 'Pregame prayer and weekly devotionals for the Wolves.',
    memberCount: 14,
  },
  {
    id: '2',
    name: 'Spring Classic Tournament',
    type: 'event',
    sport: 'Baseball',
    description: 'All-tournament prayer space for athletes competing this weekend.',
    memberCount: 31,
  },
  {
    id: '3',
    name: 'Riverdale Christian Athletes',
    type: 'school',
    sport: undefined,
    description: 'For all athletes across every sport at Riverdale.',
    memberCount: 58,
  },
];

export default function TeamGroupsScreen() {
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['1']);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<GroupData['type']>('team');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = (id: string) => {
    setJoinedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-2 flex-row items-end justify-between">
          <View>
            <Text className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">
              Prayer Groups
            </Text>
            <Text className="text-white text-2xl font-bold">Your Teams</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="px-6 mt-4 mb-6 flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-[#F59E0B] py-3 rounded-2xl items-center"
            onPress={() => setShowCreate(true)}
          >
            <Text className="text-[#0F172A] font-bold text-sm">+ Create Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-[#1e2d47] border border-[#1e3a6e] py-3 rounded-2xl items-center"
            onPress={() => setShowJoinCode(true)}
          >
            <Text className="text-slate-300 font-bold text-sm">Join by Code</Text>
          </TouchableOpacity>
        </View>

        {/* My Groups */}
        <View className="px-6 mb-6">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            My Groups
          </Text>
          {DEMO_GROUPS.filter((g) => joinedGroups.includes(g.id)).map((g) => (
            <TeamGroupCard
              key={g.id}
              group={g}
              isMember
              onPress={() => handleJoin(g.id)}
            />
          ))}
          {joinedGroups.length === 0 && (
            <View className="bg-[#1e2d47] rounded-2xl p-5 border border-[#1e3a6e] items-center">
              <Text className="text-slate-500 text-sm text-center">
                You haven't joined any groups yet.{'\n'}Join or create one below.
              </Text>
            </View>
          )}
        </View>

        {/* Discover */}
        <View className="px-6 mb-10">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            Discover
          </Text>
          {DEMO_GROUPS.filter((g) => !joinedGroups.includes(g.id)).map((g) => (
            <TeamGroupCard
              key={g.id}
              group={g}
              isMember={false}
              onPress={() => handleJoin(g.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Create Group Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-[#0F172A] rounded-t-3xl px-6 pt-6 pb-10 border-t border-[#1e3a6e]">
              <Text className="text-white text-xl font-bold mb-1">Create a Group</Text>
              <Text className="text-slate-400 text-sm mb-6">
                Start a prayer space for your team or event.
              </Text>

              <Text className="text-slate-300 text-sm font-semibold mb-2">Group Name</Text>
              <TextInput
                className="bg-[#1e2d47] text-white rounded-xl px-4 py-3 mb-4 border border-[#1e3a6e]"
                placeholder="e.g. Westlake JV Soccer"
                placeholderTextColor="#475569"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />

              <Text className="text-slate-300 text-sm font-semibold mb-2">Type</Text>
              <View className="flex-row gap-2 mb-4">
                {(['team', 'event', 'school'] as GroupData['type'][]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setNewGroupType(t)}
                    className={`px-4 py-2 rounded-full border ${
                      newGroupType === t
                        ? 'bg-[#F59E0B] border-[#F59E0B]'
                        : 'bg-[#1e2d47] border-[#1e3a6e]'
                    }`}
                  >
                    <Text
                      className={`font-semibold capitalize text-sm ${
                        newGroupType === t ? 'text-[#0F172A]' : 'text-slate-300'
                      }`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-slate-300 text-sm font-semibold mb-2">Description (optional)</Text>
              <TextInput
                className="bg-[#1e2d47] text-white rounded-xl px-4 py-3 mb-6 border border-[#1e3a6e]"
                placeholder="What's this group for?"
                placeholderTextColor="#475569"
                value={newGroupDesc}
                onChangeText={setNewGroupDesc}
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-[#1e2d47] py-4 rounded-2xl items-center"
                  onPress={() => setShowCreate(false)}
                >
                  <Text className="text-slate-400 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-4 rounded-2xl items-center ${
                    newGroupName ? 'bg-[#F59E0B]' : 'bg-[#1e2d47]'
                  }`}
                  onPress={() => {
                    if (newGroupName) {
                      setShowCreate(false);
                      setNewGroupName('');
                    }
                  }}
                >
                  <Text className={`font-bold ${newGroupName ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Join by Code Modal */}
      <Modal visible={showJoinCode} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-[#0F172A] rounded-t-3xl px-6 pt-6 pb-10 border-t border-[#1e3a6e]">
              <Text className="text-white text-xl font-bold mb-1">Join by Invite Code</Text>
              <Text className="text-slate-400 text-sm mb-6">
                Ask your group leader for the 6-digit code.
              </Text>
              <TextInput
                className="bg-[#1e2d47] text-white rounded-xl px-4 py-3 mb-6 border border-[#1e3a6e] text-center text-2xl font-bold tracking-[10px]"
                placeholder="A1B2C3"
                placeholderTextColor="#475569"
                maxLength={6}
                autoCapitalize="characters"
                value={inviteCode}
                onChangeText={setInviteCode}
              />
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-[#1e2d47] py-4 rounded-2xl items-center"
                  onPress={() => setShowJoinCode(false)}
                >
                  <Text className="text-slate-400 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-4 rounded-2xl items-center ${
                    inviteCode.length === 6 ? 'bg-[#F59E0B]' : 'bg-[#1e2d47]'
                  }`}
                  onPress={() => {
                    if (inviteCode.length === 6) setShowJoinCode(false);
                  }}
                >
                  <Text className={`font-bold ${inviteCode.length === 6 ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                    Join
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
