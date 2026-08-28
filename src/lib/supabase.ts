import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

let supabaseClient: SupabaseClient | undefined

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  supabaseClient ??= createClient(supabaseUrl, supabasePublishableKey)

  return supabaseClient
}
