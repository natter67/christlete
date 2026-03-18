import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Simple storage for React Native (no AsyncStorage dependency for V1)
const memoryStorage: Record<string, string> = {};
const storage = {
  getItem: (key: string) => Promise.resolve(memoryStorage[key] ?? null),
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value;
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
    return Promise.resolve();
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sport: string;
          school: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      devotionals: {
        Row: {
          id: string;
          title: string;
          scripture: string;
          scripture_ref: string;
          body: string;
          reflection_prompt: string;
          sport_tag: string | null;
          day_of_week: number;
          created_at: string;
        };
      };
      prayer_groups: {
        Row: {
          id: string;
          name: string;
          type: 'team' | 'event';
          description: string | null;
          created_by: string;
          event_date: string | null;
          created_at: string;
        };
      };
      prayer_checkins: {
        Row: {
          id: string;
          user_id: string;
          feeling: string;
          carrying: string;
          created_at: string;
        };
      };
    };
  };
};
