import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../lib/supabase';

const SPORTS = [
  'Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field',
  'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Cross Country',
  'Lacrosse', 'Golf', 'Softball', 'Hockey', 'Other',
];

const STRUGGLES = [
  'Pressure to perform',
  'Fear of failure',
  'Comparing myself to others',
  'Staying focused on God',
  'Team conflict',
  'Injury & recovery',
  'Mental health & anxiety',
  'Keeping faith as a priority',
];

type Step = 'welcome' | 'auth' | 'sport' | 'struggles' | 'done';

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleStruggle = (s: string) => {
    setSelectedStruggles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setStep('sport');
    }
  };

  const handleFinish = () => {
    navigation.replace('Main');
  };

  if (step === 'welcome') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-6">✝️</Text>
          <Text className="text-white text-4xl font-bold text-center mb-3">
            Christlete
          </Text>
          <Text className="text-slate-400 text-lg text-center mb-2 leading-7">
            Faith. Competition. Brotherhood.
          </Text>
          <Text className="text-slate-500 text-base text-center leading-7 mb-12">
            A spiritual home for Christian athletes — grow with God, pray with
            your team, and compete with purpose.
          </Text>
          <TouchableOpacity
            className="bg-[#F59E0B] w-full py-4 rounded-2xl items-center mb-4"
            onPress={() => setStep('auth')}
          >
            <Text className="text-[#0F172A] font-bold text-lg">Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace('Main')}>
            <Text className="text-slate-500 text-sm">Sign in to existing account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'auth') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-8 pt-12">
            <TouchableOpacity onPress={() => setStep('welcome')} className="mb-8">
              <Text className="text-slate-400 text-base">← Back</Text>
            </TouchableOpacity>
            <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
            <Text className="text-slate-400 text-base mb-10">
              Your faith journey starts here.
            </Text>

            <Text className="text-slate-300 text-sm mb-2 font-semibold">Full Name</Text>
            <TextInput
              className="bg-[#1e2d47] text-white rounded-xl px-4 py-4 mb-5 text-base"
              placeholder="Caleb Newton"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />

            <Text className="text-slate-300 text-sm mb-2 font-semibold">Email</Text>
            <TextInput
              className="bg-[#1e2d47] text-white rounded-xl px-4 py-4 mb-5 text-base"
              placeholder="you@example.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text className="text-slate-300 text-sm mb-2 font-semibold">Password</Text>
            <TextInput
              className="bg-[#1e2d47] text-white rounded-xl px-4 py-4 mb-10 text-base"
              placeholder="At least 8 characters"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className={`bg-[#F59E0B] w-full py-4 rounded-2xl items-center mb-6 ${loading ? 'opacity-60' : ''}`}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="text-[#0F172A] font-bold text-lg">
                {loading ? 'Creating Account...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (step === 'sport') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <ScrollView className="flex-1 px-8 pt-12">
          <Text className="text-white text-3xl font-bold mb-2">Your Sport</Text>
          <Text className="text-slate-400 text-base mb-8">
            We'll tailor your devotionals and prayer groups.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport}
                className={`px-5 py-3 rounded-full border ${
                  selectedSport === sport
                    ? 'bg-[#F59E0B] border-[#F59E0B]'
                    : 'border-[#1e3a6e] bg-[#1e2d47]'
                }`}
                onPress={() => setSelectedSport(sport)}
              >
                <Text
                  className={`font-semibold ${
                    selectedSport === sport ? 'text-[#0F172A]' : 'text-slate-300'
                  }`}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            className={`bg-[#F59E0B] w-full py-4 rounded-2xl items-center mt-10 mb-8 ${!selectedSport ? 'opacity-40' : ''}`}
            onPress={() => selectedSport && setStep('struggles')}
            disabled={!selectedSport}
          >
            <Text className="text-[#0F172A] font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'struggles') {
    return (
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        <ScrollView className="flex-1 px-8 pt-12">
          <Text className="text-white text-3xl font-bold mb-2">
            What are you carrying?
          </Text>
          <Text className="text-slate-400 text-base mb-8">
            Select any that feel true right now. No judgment here.
          </Text>
          {STRUGGLES.map((s) => (
            <TouchableOpacity
              key={s}
              className={`flex-row items-center justify-between px-5 py-4 rounded-2xl mb-3 border ${
                selectedStruggles.includes(s)
                  ? 'bg-[#1e3a6e] border-[#F59E0B]'
                  : 'bg-[#1e2d47] border-transparent'
              }`}
              onPress={() => toggleStruggle(s)}
            >
              <Text className="text-white text-base font-medium">{s}</Text>
              {selectedStruggles.includes(s) && (
                <Text className="text-[#F59E0B] text-lg">✓</Text>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="bg-[#F59E0B] w-full py-4 rounded-2xl items-center mt-6 mb-8"
            onPress={handleFinish}
          >
            <Text className="text-[#0F172A] font-bold text-lg">Enter Christlete</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
