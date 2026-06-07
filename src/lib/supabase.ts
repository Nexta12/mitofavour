import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.warn(
    'Supabase URL is missing or has placeholder. Database interactions may fail. Please configure NEXT_PUBLIC_SUPABASE_URL in .env.local.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.warn(
    'Supabase Anon Key is missing or has placeholder. Database interactions may fail. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
