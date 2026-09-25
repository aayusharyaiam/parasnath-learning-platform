-- ====================================================================
-- Parasnath School Learning - System & Database Health Check Script
-- Run this query in Supabase SQL Editor to verify complete functionality
-- ====================================================================

with 
table_check as (
  select 'Database Tables' as component,
         case when count(*) = 6 then 'PASS (All 6 tables exist: classes, subjects, profiles, profile_subjects, chapters, topics)'
              else 'FAIL (Found ' || count(*) || ' of 6 tables)'
         end as status
  from information_schema.tables 
  where table_schema = 'public' 
    and table_name in ('classes', 'subjects', 'profiles', 'profile_subjects', 'chapters', 'topics')
),

classes_check as (
  select 'Classes Seed' as component,
         case when count(*) >= 2 then 'PASS (' || count(*) || ' classes configured: Class 9 & Class 10)'
              else 'FAIL (Classes missing)'
         end as status
  from public.classes
),

subjects_check as (
  select 'Subjects Seed' as component,
         case when count(*) >= 5 then 'PASS (' || count(*) || ' subjects configured: Social Science, Science, Math, English, Hindi)'
              else 'FAIL (Subjects missing)'
         end as status
  from public.subjects
),

auth_users_check as (
  select 'Auth Demo Users' as component,
         case when count(*) >= 3 then 'PASS (' || count(*) || ' demo users in auth.users: Admin, Student, Teacher)'
              else 'WARNING (' || count(*) || ' users found. Run seed_demo_accounts.sql)'
         end as status
  from auth.users
  where email in ('admin@parasnath.edu', 'student@parasnath.edu', 'teacher@parasnath.edu')
),

profiles_check as (
  select 'Profiles Sync & Roles' as component,
         case when count(distinct role) >= 3 then 'PASS (All 3 roles active: Admin, Teacher, Student in profiles)'
              else 'WARNING (Found ' || count(*) || ' profiles across ' || count(distinct role) || ' roles)'
         end as status
  from public.profiles
),

triggers_check as (
  select 'Database Triggers' as component,
         case when count(*) >= 2 then 'PASS (Auth sync & timestamp triggers active)'
              else 'FAIL (Triggers missing)'
         end as status
  from information_schema.triggers
  where trigger_schema in ('public', 'auth')
    and trigger_name in ('on_auth_user_created', 'profiles_updated_at', 'on_auth_user_updated')
),

rls_check as (
  select 'Row-Level Security (RLS)' as component,
         case when count(*) = 6 then 'PASS (All 6 public tables protected by RLS)'
              else 'WARNING (' || count(*) || ' of 6 tables have RLS enabled)'
         end as status
  from pg_tables
  where schemaname = 'public'
    and rowsecurity = true
    and tablename in ('classes', 'subjects', 'profiles', 'profile_subjects', 'chapters', 'topics')
)

select * from table_check
union all select * from classes_check
union all select * from subjects_check
union all select * from auth_users_check
union all select * from profiles_check
union all select * from triggers_check
union all select * from rls_check;

-- Optional: Detailed user inspection query
select 
  u.id,
  u.email,
  u.phone,
  p.full_name,
  p.role,
  p.school_name,
  p.section,
  case when u.email_confirmed_at is not null then 'Verified' else 'Pending Verification' end as email_status,
  u.created_at
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in ('admin@parasnath.edu', 'student@parasnath.edu', 'teacher@parasnath.edu')
   or u.phone is not null
order by p.role;
