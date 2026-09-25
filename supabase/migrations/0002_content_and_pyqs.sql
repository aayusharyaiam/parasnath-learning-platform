-- ====================================================================
-- Parasnath School Learning - Migration 0002: Content, Questions, PYQs & Videos
-- ====================================================================

-- 1. Materials Table (Teacher Notes, PDFs, Revision Handouts)
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  topic_id uuid references public.topics (id) on delete set null,
  title text not null,
  description text,
  file_url text not null,
  file_type text not null default 'pdf',
  file_size_bytes bigint,
  is_important boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Questions Table (Teacher Question Bank & Curated PYQs)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  topic_id uuid references public.topics (id) on delete set null,
  question_text text not null,
  question_type text not null default 'mcq', -- 'mcq', 'assertion_reason', 'statement', 'case_based', 'short_answer', 'long_answer'
  options jsonb, -- Array of { id: "A", text: "..." }
  correct_answer text,
  explanation text, -- Official CBSE marking scheme / explanation
  marks smallint not null default 1,
  difficulty text not null default 'medium', -- 'easy', 'medium', 'hard'
  is_pyq boolean not null default false,
  pyq_year text, -- '2024', '2023', '2022', etc.
  is_important boolean not null default false,
  diagram_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Video Lectures Table (Direct Uploads & Stream Embeds)
create table if not exists public.video_lectures (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  topic_id uuid references public.topics (id) on delete set null,
  title text not null,
  description text,
  video_url text not null,
  provider text not null default 'youtube', -- 'youtube', 'vimeo', 'direct'
  duration_seconds integer,
  attached_notes_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.materials enable row level security;
alter table public.questions enable row level security;
alter table public.video_lectures enable row level security;

-- Read Policies (All authenticated students, teachers, admins can view materials, questions, videos)
create policy "authenticated read materials" on public.materials
  for select to authenticated using (true);

create policy "authenticated read questions" on public.questions
  for select to authenticated using (true);

create policy "authenticated read videos" on public.video_lectures
  for select to authenticated using (true);

-- Manage Policies (Only Teachers and Admins can create/update/delete)
create policy "teachers manage materials" on public.materials
  for all to authenticated
  using (public.is_teacher_or_admin())
  with check (public.is_teacher_or_admin());

create policy "teachers manage questions" on public.questions
  for all to authenticated
  using (public.is_teacher_or_admin())
  with check (public.is_teacher_or_admin());

create policy "teachers manage videos" on public.video_lectures
  for all to authenticated
  using (public.is_teacher_or_admin())
  with check (public.is_teacher_or_admin());

-- 5. Seed Official NCERT Class 10 & 9 Chapters
do $$
declare
  c10 uuid;
  c9 uuid;
  sub_sst uuid;
  sub_sci uuid;
  sub_mat uuid;
  ch_hist_1 uuid := gen_random_uuid();
  ch_hist_2 uuid := gen_random_uuid();
  ch_geo_1 uuid := gen_random_uuid();
  ch_pol_1 uuid := gen_random_uuid();
  ch_eco_1 uuid := gen_random_uuid();
  ch_sci_1 uuid := gen_random_uuid();
  ch_sci_2 uuid := gen_random_uuid();
  ch_sci_3 uuid := gen_random_uuid();
  ch_mat_1 uuid := gen_random_uuid();
  ch_mat_2 uuid := gen_random_uuid();
begin
  select id into c10 from public.classes where grade = 10 limit 1;
  select id into c9 from public.classes where grade = 9 limit 1;
  select id into sub_sst from public.subjects where name = 'Social Science' limit 1;
  select id into sub_sci from public.subjects where name = 'Science' limit 1;
  select id into sub_mat from public.subjects where name = 'Mathematics' limit 1;

  if c10 is not null and sub_sst is not null then
    -- Class 10 Social Science Chapters
    insert into public.chapters (id, class_id, subject_id, title, sort_order) values
      (ch_hist_1, c10, sub_sst, 'History Ch 1: The Rise of Nationalism in Europe', 1),
      (ch_hist_2, c10, sub_sst, 'History Ch 2: Nationalism in India', 2),
      (ch_geo_1, c10, sub_sst, 'Geography Ch 1: Resources and Development', 3),
      (ch_pol_1, c10, sub_sst, 'Civics Ch 1: Power Sharing & Federalism', 4),
      (ch_eco_1, c10, sub_sst, 'Economics Ch 1: Development', 5)
    on conflict do nothing;

    -- Sub-topics for History Ch 1
    insert into public.topics (chapter_id, title, sort_order) values
      (ch_hist_1, '1.1 The French Revolution and the Idea of the Nation', 1),
      (ch_hist_1, '1.2 The Making of Nationalism in Europe (Aristocracy & Middle Class)', 2),
      (ch_hist_1, '1.3 The Age of Revolutions: 1830–1848', 3),
      (ch_hist_1, '1.4 The Making of Germany and Italy', 4)
    on conflict do nothing;
  end if;

  if c10 is not null and sub_sci is not null then
    -- Class 10 Science Chapters
    insert into public.chapters (id, class_id, subject_id, title, sort_order) values
      (ch_sci_1, c10, sub_sci, 'Chemistry Ch 1: Chemical Reactions and Equations', 1),
      (ch_sci_2, c10, sub_sci, 'Biology Ch 6: Life Processes (Nutrition & Respiration)', 2),
      (ch_sci_3, c10, sub_sci, 'Physics Ch 10: Light – Reflection and Refraction', 3)
    on conflict do nothing;
  end if;

  if c10 is not null and sub_mat is not null then
    -- Class 10 Math Chapters
    insert into public.chapters (id, class_id, subject_id, title, sort_order) values
      (ch_mat_1, c10, sub_mat, 'Math Ch 1: Real Numbers (Fundamental Theorem of Arithmetic)', 1),
      (ch_mat_2, c10, sub_mat, 'Math Ch 8: Introduction to Trigonometry & Identities', 2)
    on conflict do nothing;
  end if;

  -- 6. Seed Verified CBSE Previous-Year Questions (PYQs 2020-2024)
  if ch_hist_1 is not null and sub_sst is not null and c10 is not null then
    insert into public.questions (
      class_id, subject_id, chapter_id, question_text, question_type,
      options, correct_answer, explanation, marks, difficulty, is_pyq, pyq_year, is_important
    ) values
    (
      c10, sub_sst, ch_hist_1,
      'Which of the following treaties recognized Greece as an independent nation?',
      'mcq',
      '[{"id":"A","text":"Treaty of Vienna of 1815"},{"id":"B","text":"Treaty of Constantinople of 1832"},{"id":"C","text":"Treaty of Versailles"},{"id":"D","text":"Treaty of Paris"}]'::jsonb,
      'B',
      'CBSE 2024 Marking Scheme: The Treaty of Constantinople of 1832 recognized Greece as an independent nation following the Greek War of Independence.',
      1, 'easy', true, '2024', true
    ),
    (
      c10, sub_sst, ch_hist_1,
      'Assertion (A): During 1848, the statue of Liberty held the torch of Enlightenment in one hand and the Charter of Rights of Man in the other.
Reason (R): French artists during the French Revolution personified Liberty as a female figure.',
      'assertion_reason',
      '[{"id":"A","text":"Both (A) and (R) are true and (R) is the correct explanation of (A)"},{"id":"B","text":"Both (A) and (R) are true but (R) is NOT the correct explanation of (A)"},{"id":"C","text":"(A) is true but (R) is false"},{"id":"D","text":"(A) is false but (R) is true"}]'::jsonb,
      'A',
      'CBSE 2023 Marking Scheme: Sorrieus 1848 vision drew upon the French Revolutionary personification of Liberty as an allegorical female figure holding enlightenment and human rights.',
      1, 'medium', true, '2023', true
    ),
    (
      c10, sub_sst, ch_hist_1,
      'Explain any three measures introduced by the French revolutionaries to create a sense of collective identity among the French people.',
      'short_answer',
      null,
      '1. The ideas of la patrie (the fatherland) and le citoyen (the citizen) emphasized a united community.
2. A new French tricolour flag replaced the former royal standard.
3. The Estates General was elected by active citizens and renamed the National Assembly.
4. Internal customs duties were abolished and a uniform system of weights and measures was adopted.',
      'CBSE Marking Scheme: 1 mark for each valid point with explanation (Max 3 marks).',
      3, 'medium', true, '2022', true
    ),
    (
      c10, sub_sst, ch_hist_1,
      'Explain the major administrative changes introduced by Napoleon through the Civil Code of 1804 (Napoleonic Code) in the territories ruled by him.',
      'long_answer',
      null,
      '1. Abolished all privileges based on birth.
2. Established equality before the law and secured the right to property.
3. Simplified administrative divisions and abolished the feudal system.
4. Freed peasants from serfdom and manorial dues.
5. In towns, guild restrictions were removed and transport/communication systems were improved.',
      'CBSE 2020 Marking Scheme: 5 points with distinct heading and explanation earn full 5 marks.',
      5, 'hard', true, '2020', true
    );
  end if;

  if ch_sci_1 is not null and sub_sci is not null and c10 is not null then
    insert into public.questions (
      class_id, subject_id, chapter_id, question_text, question_type,
      options, correct_answer, explanation, marks, difficulty, is_pyq, pyq_year, is_important
    ) values
    (
      c10, sub_sci, ch_sci_1,
      'When Lead Nitrate powder is heated in a boiling tube, brown fumes are emitted. These brown fumes are of which gas?',
      'mcq',
      '[{"id":"A","text":"Nitrogen dioxide (NO2)"},{"id":"B","text":"Lead oxide (PbO)"},{"id":"C","text":"Nitrogen monoxide (NO)"},{"id":"D","text":"Oxygen (O2)"}]'::jsonb,
      'A',
      'CBSE 2024: 2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) + O2(g). The brown fumes are Nitrogen dioxide (NO2).',
      1, 'easy', true, '2024', true
    );
  end if;

  if ch_mat_1 is not null and sub_mat is not null and c10 is not null then
    insert into public.questions (
      class_id, subject_id, chapter_id, question_text, question_type,
      options, correct_answer, explanation, marks, difficulty, is_pyq, pyq_year, is_important
    ) values
    (
      c10, sub_mat, ch_mat_1,
      'If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, where x, y are prime numbers, then HCF(a, b) is:',
      'mcq',
      '[{"id":"A","text":"xy"},{"id":"B","text":"xy^2"},{"id":"C","text":"x^3 y^3"},{"id":"D","text":"x^2 y^2"}]'::jsonb,
      'B',
      'CBSE 2023: HCF is the product of the smallest power of each common prime factor. HCF(a,b) = x^1 * y^2 = xy^2.',
      1, 'medium', true, '2023', true
    );
  end if;

end $$;
