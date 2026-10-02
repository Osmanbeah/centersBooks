import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xlhjygekwqsgfvlcptcm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaGp5Z2Vrd3FzZ2Z2bGNwdGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTE0OTUsImV4cCI6MjEwNjUyNzQ5NX0.QRO3jt-sRThDDLhIcl1alThPAJoqcKxWmKANPQ2CWOw';

export const getStoredSupabaseConfig = () => {
  const customUrl = localStorage.getItem('custom_supabase_url');
  const customKey = localStorage.getItem('custom_supabase_key');
  
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = customUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = customKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    (customUrl && customKey) || 
    (envUrl && envKey) || 
    (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY)
  );

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
