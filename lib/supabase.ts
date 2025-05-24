import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface EmailSubscriber {
  id?: string
  email: string
  cookbook_id?: string
  cookbook_title?: string
  subscribed_at?: string
  source?: string
  is_active?: boolean
}
