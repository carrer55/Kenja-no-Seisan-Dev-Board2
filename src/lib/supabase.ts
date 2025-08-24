import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'kenja-seisan-auth'
  }
})

// Database types - 最新スキーマに対応
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          position: string | null
          department: string | null
          role: string | null
          default_organization_id: string | null
          avatar_url: string | null
          onboarding_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          position?: string | null
          department?: string | null
          role?: string | null
          default_organization_id?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          position?: string | null
          department?: string | null
          role?: string | null
          default_organization_id?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          type: string
          title: string
          description: string | null
          data: any
          total_amount: number
          status: string
          submitted_at: string | null
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          type: string
          title: string
          description?: string | null
          data?: any
          total_amount?: number
          status?: string
          submitted_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          type?: string
          title?: string
          description?: string | null
          data?: any
          total_amount?: number
          status?: string
          submitted_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      application_approvals: {
        Row: {
          id: string
          application_id: string
          approver_id: string
          step: number
          status: string
          comment: string | null
          approved_at: string
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          approver_id: string
          step?: number
          status: string
          comment?: string | null
          approved_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          approver_id?: string
          step?: number
          status?: string
          comment?: string | null
          approved_at?: string
          created_at?: string
        }
      }
      travel_regulations: {
        Row: {
          id: string
          organization_id: string | null
          name: string
          version: string
          company_info: any
          articles: any
          allowance_settings: any
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          name: string
          version?: string
          company_info?: any
          articles?: any
          allowance_settings?: any
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          name?: string
          version?: string
          company_info?: any
          articles?: any
          allowance_settings?: any
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          application_id: string | null
          type: string
          title: string
          content: any
          file_url: string | null
          file_size: number | null
          mime_type: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          application_id?: string | null
          type: string
          title: string
          content?: any
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          application_id?: string | null
          type?: string
          title?: string
          content?: any
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: any
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: any
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: any
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// 型定義 - 更新
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  position: string | null
  department: string | null
  role: string | null
  default_organization_id: string | null
  avatar_url: string | null
  onboarding_completed: boolean | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  description: string | null
  owner_id: string
  settings: any
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  organization_id: string | null
  type: 'business_trip' | 'expense'
  title: string
  description: string | null
  data: any
  total_amount: number
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned'
  submitted_at: string | null
  approved_at: string | null
  approved_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  email_confirmed_at: string | null
  created_at: string
}
// 認証関連のヘルパー関数
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }

  return profile;
};

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // ローカルストレージのクリア
  localStorage.removeItem('userProfile');
  localStorage.removeItem('demoMode');
  localStorage.removeItem('demoSession');
};