-- ====================================================================
-- Fix Supabase Auth Triggers & Enable Clean Email Sign-In
-- Run this script in Supabase SQL Editor to resolve "Database error querying schema"
-- ====================================================================

-- 1. Fix handle_new_user trigger function
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
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
end;
$$;

-- 2. Fix handle_user_update trigger function
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    email = coalesce(new.email, email),
    phone = coalesce(new.phone, phone),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;

-- 3. Ensure trigger attachments are clean
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();

-- 4. Verify admin user password and confirmation
update auth.users
set 
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  encrypted_password = crypt('Parasnath@2026', gen_salt('bf'))
where email in ('admin@parasnath.edu', 'student@parasnath.edu', 'teacher@parasnath.edu', 'aayush10738@gmail.com');
