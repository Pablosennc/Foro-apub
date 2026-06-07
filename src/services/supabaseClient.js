import { createClient } from '@supabase/supabase-js'

// Reemplaza estas variables con las de tu proyecto en Supabase (Project Settings -> API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)