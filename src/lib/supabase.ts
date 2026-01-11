import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate that required environment variables are set
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
}

// Verify the service role key is not the anonymous key
if (supabaseServiceKey.includes('eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYSIsInJvbGUiOiJhbm9u')) {
  console.warn('⚠️ WARNING: You appear to be using an ANONYMOUS key as SUPABASE_SERVICE_ROLE_KEY. Use the SERVICE ROLE key instead!')
}

// Server client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for our study data (matching your Supabase table structure)
export interface StudyData {
  Date: string  // Primary key (date column)
  Hours: number
  Minutes: number  // Using capital M to match your table
  Topics: string  // Using capital T to match your table
  created_at?: string
  updated_at?: string
}
