import { createClient } from '@supabase/supabase-js';

// Esto jala de forma automática las variables reales que guardamos en Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Faltan las variables de entorno de Supabase en Vercel.");
}

export const supabase = createClient(
  supabaseUrl || 'https://zkudkbtltwsvhwrjsigv.supabase.co', 
  supabaseAnonKey || ''
);
