-- ====================================================================
-- Parasnath School Learning - Migration 0003: Question Papers Generator
-- ====================================================================

create table if not exists public.question_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  school_name text not null default 'Parasnath Public School',
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  time_allowed_minutes integer not null default 180,
  max_marks integer not null default 80,
  general_instructions jsonb not null default '["1. All questions are compulsory.", "2. Question paper contains 5 sections: Section A, B, C, D and E.", "3. Section A comprises 20 Multiple Choice Questions of 1 mark each.", "4. Section B comprises 4 Very Short Answer Questions of 2 marks each.", "5. Section C comprises 5 Short Answer Questions of 3 marks each.", "6. Section D comprises 4 Long Answer Questions of 5 marks each.", "7. Section E comprises 3 Case-Based Questions of 4 marks each."]'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.question_papers enable row level security;

-- Read policy (authenticated users can read question papers)
create policy "authenticated read question_papers" on public.question_papers
  for select to authenticated using (true);

-- Manage policy (Teachers & Admins can create/edit/delete question papers)
create policy "teachers manage question_papers" on public.question_papers
  for all to authenticated
  using (public.is_teacher_or_admin())
  with check (public.is_teacher_or_admin());
