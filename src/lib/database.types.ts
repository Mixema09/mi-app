/**
 * Tipos de la base de datos (escritos a mano, alineados con
 * supabase/migrations/0001_init_mvp.sql). Se pueden regenerar con el conector
 * de Supabase (`generate_typescript_types`).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  onboarding_completed: boolean;
  diagnosis_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingResponse {
  id: string;
  user_id: string;
  answers: Record<string, number | string>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticResult {
  id: string;
  user_id: string;
  scores: Record<string, number>;
  primary_area: string | null;
  summary: string | null;
  created_at: string;
}

export interface PathStep {
  title: string;
  description: string;
}

export interface PersonalizedPath {
  id: string;
  user_id: string;
  diagnostic_id: string | null;
  title: string;
  focus_area: string | null;
  steps: PathStep[];
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}
