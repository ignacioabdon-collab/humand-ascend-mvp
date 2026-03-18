import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  name: string
  email: string | null
  employee_id: string | null
  department: string | null
  position: string | null
  created_at: string
  updated_at: string
}

export type Session = {
  id: string
  session_id: string
  user_id: string | null
  recorded_at: string
  duration_seconds: number
  file_size_bytes: number
  mime_type: string
  input_type: 'voice' | 'text'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  audio_url: string | null
  transcript: string | null
  question: string | null
  created_at: string
  updated_at: string
  user?: User
}

export type Skill = {
  id: string
  session_id: string | null
  user_id: string | null
  skill_name: string
  skill_category: string | null
  confidence_score: number | null
  extracted_from: string | null
  created_at: string
}

export type SessionWithUser = Session & {
  users: User | null
}
