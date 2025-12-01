import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          university?: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          university?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          university?: string
          created_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category?: string
          status: 'draft' | 'brainstorming' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category?: string
          status?: 'draft' | 'brainstorming' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          status?: 'draft' | 'brainstorming' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      brainstorm_sessions: {
        Row: {
          id: string
          idea_id: string
          messages: any[]
          outline?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          messages?: any[]
          outline?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          messages?: any[]
          outline?: string
          created_at?: string
          updated_at?: string
        }
      }
      slides: {
        Row: {
          id: string
          idea_id: string
          slide_url: string
          presentation_id: string
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          slide_url: string
          presentation_id: string
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          slide_url?: string
          presentation_id?: string
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          idea_id: string
          pdf_url: string
          sha256_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          pdf_url: string
          sha256_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          pdf_url?: string
          sha256_hash?: string
          created_at?: string
        }
      }
      expert_requests: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          expert_type: 'tax_accountant' | 'lawyer' | 'patent_attorney'
          message: string
          status: 'pending' | 'sent' | 'replied'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          expert_type: 'tax_accountant' | 'lawyer' | 'patent_attorney'
          message: string
          status?: 'pending' | 'sent' | 'replied'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          expert_type?: 'tax_accountant' | 'lawyer' | 'patent_attorney'
          message?: string
          status?: 'pending' | 'sent' | 'replied'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
