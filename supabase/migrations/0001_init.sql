-- Parasnath school learning app — foundation schema

create extension if not exists "pgcrypto";

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  grade smallint not null unique,
  created_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create type public.user_role as enum ('student', 'teacher', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  phone text,
  full_name text,
  role public.user_role not null default 'student',
  class_id uuid references public.classes (id),
  section text,
  roll_number text,
  school_name text,
  profile_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_subjects (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  primary key (profile_id, subject_id)
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.classes (name, grade) values
  ('Class 9', 9),
  ('Class 10', 10);

insert into public.subjects (name) values
  ('Social Science'),
  ('Mathematics'),
  ('Science'),
  ('English'),
  ('Hindi');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set
    email = case when new.email_confirmed_at is not null then new.email else profiles.email end,
    phone = coalesce(new.phone, profiles.phone),
    full_name = coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      profiles.full_name
    ),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_teacher_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('teacher', 'admin')
  );
$$;

alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;

create policy "authenticated read classes" on public.classes
  for select to authenticated using (true);

create policy "authenticated read subjects" on public.subjects
  for select to authenticated using (true);

create policy "authenticated read chapters" on public.chapters
  for select to authenticated using (true);

create policy "authenticated read topics" on public.topics
  for select to authenticated using (true);

create policy "read own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_teacher_or_admin());

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "update own profile except role" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = public.current_role()
  );

create policy "admin update any profile" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "read own profile_subjects" on public.profile_subjects
  for select to authenticated
  using (profile_id = auth.uid() or public.is_teacher_or_admin());

create policy "manage own profile_subjects" on public.profile_subjects
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "admin manage profile_subjects" on public.profile_subjects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
