-- ====================================================================
-- Template: Add an Administrator in Parasnath School Learning
-- Replace the variables below with your email, phone, and name
-- ====================================================================

create extension if not exists "pgcrypto";

do $$
declare
  target_email text := 'admin@parasnath.edu';
  target_phone text := '+919876543212';
  target_name text := 'Principal R. K. Parasnath';
  target_password text := 'Parasnath@2026';
  user_id uuid;
  class_10_id uuid;
begin
  select id into class_10_id from public.classes where grade = 10 limit 1;
  select id into user_id from auth.users where email = target_email limit 1;

  if user_id is null then
    user_id := gen_random_uuid();

    insert into auth.users (
      id, instance_id, email, phone, encrypted_password,
      email_confirmed_at, phone_confirmed_at, raw_app_meta_data,
      raw_user_meta_data, created_at, updated_at, role, aud
    ) values (
      user_id, '00000000-0000-0000-0000-000000000000',
      target_email, target_phone,
      crypt(target_password, gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email","phone"]}',
      jsonb_build_object('full_name', target_name, 'name', target_name),
      now(), now(), 'authenticated', 'authenticated'
    );
  else
    update auth.users set
      phone = target_phone,
      phone_confirmed_at = coalesce(phone_confirmed_at, now()),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
    where id = user_id;
  end if;

  insert into public.profiles (
    id, email, phone, full_name, role, class_id,
    section, roll_number, school_name, profile_completed_at,
    created_at, updated_at
  ) values (
    user_id, target_email, target_phone, target_name, 'admin',
    class_10_id, 'Admin', '001', 'Parasnath Public School',
    now(), now(), now()
  )
  on conflict (id) do update set
    role = 'admin',
    full_name = target_name,
    phone = target_phone,
    email = target_email,
    section = 'Admin',
    school_name = 'Parasnath Public School',
    profile_completed_at = now(),
    updated_at = now();

end $$;
