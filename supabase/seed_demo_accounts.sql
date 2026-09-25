-- ============================================================
-- Parasnath School Learning - Demo Accounts Seed Script
-- Password for all 3 demo accounts: Parasnath@2026
-- ============================================================

-- Enable pgcrypto extension for password hashing
create extension if not exists "pgcrypto";

do $$
declare
  admin_id uuid := gen_random_uuid();
  teacher_id uuid := gen_random_uuid();
  student_id uuid := gen_random_uuid();
  class_10_id uuid;
  class_9_id uuid;
  sub_social_id uuid;
  sub_science_id uuid;
  sub_math_id uuid;
begin
  -- Get existing class and subject IDs
  select id into class_10_id from public.classes where grade = 10 limit 1;
  select id into class_9_id from public.classes where grade = 9 limit 1;
  select id into sub_social_id from public.subjects where name = 'Social Science' limit 1;
  select id into sub_science_id from public.subjects where name = 'Science' limit 1;
  select id into sub_math_id from public.subjects where name = 'Mathematics' limit 1;

  -- 1. Create Admin Account (admin@parasnath.edu / Parasnath@2026)
  if not exists (select 1 from auth.users where email = 'admin@parasnath.edu') then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) values (
      admin_id, '00000000-0000-0000-0000-000000000000',
      'admin@parasnath.edu',
      crypt('Parasnath@2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Principal R. K. Parasnath (Admin)"}',
      now(), now(), 'authenticated', 'authenticated'
    );

    update public.profiles set
      full_name = 'Principal R. K. Parasnath (Admin)',
      phone = '+919876543212',
      role = 'admin',
      class_id = class_10_id,
      section = 'Admin',
      school_name = 'Parasnath Public School',
      profile_completed_at = now()
    where id = admin_id;
  end if;

  -- 2. Create Teacher Account (teacher@parasnath.edu / Parasnath@2026)
  if not exists (select 1 from auth.users where email = 'teacher@parasnath.edu') then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) values (
      teacher_id, '00000000-0000-0000-0000-000000000000',
      'teacher@parasnath.edu',
      crypt('Parasnath@2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Dr. Sunita Verma (Teacher)"}',
      now(), now(), 'authenticated', 'authenticated'
    );

    update public.profiles set
      full_name = 'Dr. Sunita Verma (Teacher)',
      phone = '+919876543211',
      role = 'teacher',
      class_id = class_10_id,
      section = 'A',
      school_name = 'Parasnath Public School',
      profile_completed_at = now()
    where id = teacher_id;
  end if;

  -- 3. Create Student Account (student@parasnath.edu / Parasnath@2026)
  if not exists (select 1 from auth.users where email = 'student@parasnath.edu') then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) values (
      student_id, '00000000-0000-0000-0000-000000000000',
      'student@parasnath.edu',
      crypt('Parasnath@2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Aarav Sharma (Student)"}',
      now(), now(), 'authenticated', 'authenticated'
    );

    update public.profiles set
      full_name = 'Aarav Sharma (Student)',
      phone = '+919876543210',
      role = 'student',
      class_id = class_10_id,
      section = 'A',
      roll_number = '24',
      school_name = 'Parasnath Public School',
      profile_completed_at = now()
    where id = student_id;

    -- Attach subjects to student
    if sub_social_id is not null then
      insert into public.profile_subjects (profile_id, subject_id) values (student_id, sub_social_id) on conflict do nothing;
    end if;
    if sub_science_id is not null then
      insert into public.profile_subjects (profile_id, subject_id) values (student_id, sub_science_id) on conflict do nothing;
    end if;
    if sub_math_id is not null then
      insert into public.profile_subjects (profile_id, subject_id) values (student_id, sub_math_id) on conflict do nothing;
    end if;
  end if;

end $$;
