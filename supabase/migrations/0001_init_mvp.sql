-- =============================================================================
-- MVP mi-app — esquema inicial
-- Tablas: profiles, onboarding_responses, diagnostic_results,
--         personalized_paths, chat_conversations, chat_messages
-- Incluye RLS (cada usuaria solo accede a sus propias filas) y un trigger
-- que crea el perfil automáticamente al registrarse en auth.users.
-- =============================================================================

-- ---------- utilidad: mantener updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  onboarding_completed boolean not null default false,
  diagnosis_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- onboarding_responses ----------
create table if not exists public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_responses_user_id_idx
  on public.onboarding_responses (user_id);

create trigger onboarding_responses_set_updated_at
  before update on public.onboarding_responses
  for each row execute function public.set_updated_at();

-- ---------- diagnostic_results ----------
create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scores jsonb not null default '{}'::jsonb,
  primary_area text,
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_results_user_id_idx
  on public.diagnostic_results (user_id);

-- ---------- personalized_paths ----------
create table if not exists public.personalized_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  diagnostic_id uuid references public.diagnostic_results (id) on delete set null,
  title text not null,
  focus_area text,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists personalized_paths_user_id_idx
  on public.personalized_paths (user_id);

-- ---------- chat_conversations ----------
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_conversations_user_id_idx
  on public.chat_conversations (user_id);

create trigger chat_conversations_set_updated_at
  before update on public.chat_conversations
  for each row execute function public.set_updated_at();

-- ---------- chat_messages ----------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_conversation_id_idx
  on public.chat_messages (conversation_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles              enable row level security;
alter table public.onboarding_responses  enable row level security;
alter table public.diagnostic_results    enable row level security;
alter table public.personalized_paths    enable row level security;
alter table public.chat_conversations    enable row level security;
alter table public.chat_messages         enable row level security;

-- profiles: la usuaria ve/edita su propio perfil
create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = id);

-- onboarding_responses
create policy "onboarding_select_own" on public.onboarding_responses
  for select using ((select auth.uid()) = user_id);
create policy "onboarding_insert_own" on public.onboarding_responses
  for insert with check ((select auth.uid()) = user_id);
create policy "onboarding_update_own" on public.onboarding_responses
  for update using ((select auth.uid()) = user_id);

-- diagnostic_results
create policy "diagnostic_select_own" on public.diagnostic_results
  for select using ((select auth.uid()) = user_id);
create policy "diagnostic_insert_own" on public.diagnostic_results
  for insert with check ((select auth.uid()) = user_id);

-- personalized_paths
create policy "paths_select_own" on public.personalized_paths
  for select using ((select auth.uid()) = user_id);
create policy "paths_insert_own" on public.personalized_paths
  for insert with check ((select auth.uid()) = user_id);
create policy "paths_update_own" on public.personalized_paths
  for update using ((select auth.uid()) = user_id);

-- chat_conversations
create policy "conversations_select_own" on public.chat_conversations
  for select using ((select auth.uid()) = user_id);
create policy "conversations_insert_own" on public.chat_conversations
  for insert with check ((select auth.uid()) = user_id);
create policy "conversations_update_own" on public.chat_conversations
  for update using ((select auth.uid()) = user_id);

-- chat_messages
create policy "messages_select_own" on public.chat_messages
  for select using ((select auth.uid()) = user_id);
create policy "messages_insert_own" on public.chat_messages
  for insert with check ((select auth.uid()) = user_id);

-- =============================================================================
-- Trigger: crear perfil automáticamente al registrarse
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
