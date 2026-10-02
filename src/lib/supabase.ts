import { createClient } from '@supabase/supabase-js';

const getStoredSupabaseConfig = () => {
  const customUrl = localStorage.getItem('custom_supabase_url');
  const customKey = localStorage.getItem('custom_supabase_key');
  
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = customUrl || envUrl || 'https://placeholder-project.supabase.co';
  const key = customKey || envKey || 'placeholder-anon-key';

  const isConfigured = Boolean((customUrl && customKey) || (envUrl && envKey));

  return { url, key, isConfigured };
};

export const supabaseConfig = getStoredSupabaseConfig();

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const isSupabaseLiveConfigured = (): boolean => {
  const { isConfigured } = getStoredSupabaseConfig();
  return isConfigured;
};

export const saveSupabaseCredentials = (url: string, anonKey: string) => {
  if (url && anonKey) {
    localStorage.setItem('custom_supabase_url', url);
    localStorage.setItem('custom_supabase_key', anonKey);
  } else {
    localStorage.removeItem('custom_supabase_url');
    localStorage.removeItem('custom_supabase_key');
  }
};
