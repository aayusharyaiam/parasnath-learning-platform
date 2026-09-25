import type {
  Chapter,
  Material,
  Profile,
  Question,
  QuestionPaper,
  SchoolClass,
  Subject,
  VideoLecture,
} from "@parasnath/shared";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const FALLBACK_CLASSES: SchoolClass[] = [
  { id: "class-9-id", name: "Class 9", grade: 9 },
  { id: "class-10-id", name: "Class 10", grade: 10 },
];

export const FALLBACK_SUBJECTS: Subject[] = [
  { id: "sub-social-id", name: "Social Science" },
  { id: "sub-science-id", name: "Science" },
  { id: "sub-math-id", name: "Mathematics" },
  { id: "sub-english-id", name: "English" },
  { id: "sub-hindi-id", name: "Hindi" },
];

export const FALLBACK_CHAPTERS: Chapter[] = [
  {
    id: "ch-hist-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    title: "History Ch 1: The Rise of Nationalism in Europe",
    sort_order: 1,
  },
  {
    id: "ch-hist-2",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    title: "History Ch 2: Nationalism in India",
    sort_order: 2,
  },
  {
    id: "ch-geo-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    title: "Geography Ch 1: Resources and Development",
    sort_order: 3,
  },
  {
    id: "ch-pol-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    title: "Civics Ch 1: Power Sharing & Federalism",
    sort_order: 4,
  },
  {
    id: "ch-eco-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    title: "Economics Ch 1: Development",
    sort_order: 5,
  },
  {
    id: "ch-sci-1",
    class_id: "class-10-id",
    subject_id: "sub-science-id",
    title: "Chemistry Ch 1: Chemical Reactions and Equations",
    sort_order: 1,
  },
  {
    id: "ch-sci-2",
    class_id: "class-10-id",
    subject_id: "sub-science-id",
    title: "Biology Ch 6: Life Processes (Nutrition & Respiration)",
    sort_order: 2,
  },
  {
    id: "ch-mat-1",
    class_id: "class-10-id",
    subject_id: "sub-math-id",
    title: "Math Ch 1: Real Numbers (Fundamental Theorem of Arithmetic)",
    sort_order: 1,
  },
];

export const FALLBACK_MATERIALS: Material[] = [
  {
    id: "mat-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    title: "Class 10 History Ch 1: Complete Revision Notes & Timelines",
    description:
      "Official revision handbook covering Frederic Sorrieu's 1848 vision, French Revolution reforms, Napoleonic Code, and the Treaty of Vienna (1815).",
    file_url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    file_type: "pdf",
    file_size_bytes: 1450000,
    is_important: true,
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "mat-2",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-2",
    title: "Class 10 History Ch 2: Satyagraha & Non-Cooperation Summary Handout",
    description:
      "Important dates, Rowlatt Act (1919), Jallianwala Bagh incident, Khilafat Movement, and Simon Commission key points.",
    file_url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    file_type: "pdf",
    file_size_bytes: 980000,
    is_important: true,
    created_at: "2026-09-02T11:30:00Z",
  },
  {
    id: "mat-3",
    class_id: "class-10-id",
    subject_id: "sub-science-id",
    chapter_id: "ch-sci-1",
    title: "Chemical Reactions & Balancing Equations Formula Sheet",
    description:
      "All NCERT balanced chemical equations, precipitation reactions, redox reactions, and color change observation charts.",
    file_url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    file_type: "pdf",
    file_size_bytes: 1200000,
    is_important: true,
    created_at: "2026-09-03T14:00:00Z",
  },
];

export const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "q-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    question_text: "Which of the following treaties recognized Greece as an independent nation?",
    question_type: "mcq",
    options: [
      { id: "A", text: "Treaty of Vienna of 1815" },
      { id: "B", text: "Treaty of Constantinople of 1832" },
      { id: "C", text: "Treaty of Versailles" },
      { id: "D", text: "Treaty of Paris" },
    ],
    correct_answer: "B",
    explanation:
      "CBSE 2024 Marking Scheme: The Treaty of Constantinople of 1832 recognized Greece as an independent nation following the Greek War of Independence against the Ottoman Empire.",
    marks: 1,
    difficulty: "easy",
    is_pyq: true,
    pyq_year: "2024",
    is_important: true,
  },
  {
    id: "q-2",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    question_text: `Assertion (A): During 1848, the statue of Liberty held the torch of Enlightenment in one hand and the Charter of Rights of Man in the other.
Reason (R): French artists during the French Revolution personified Liberty as a female figure.`,
    question_type: "assertion_reason",
    options: [
      { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
      { id: "B", text: "Both (A) and (R) are true but (R) is NOT the correct explanation of (A)" },
      { id: "C", text: "(A) is true but (R) is false" },
      { id: "D", text: "(A) is false but (R) is true" },
    ],
    correct_answer: "A",
    explanation:
      "CBSE 2023 Marking Scheme: Sorrieu's 1848 vision drew upon the French Revolutionary personification of Liberty as an allegorical female figure holding enlightenment and human rights.",
    marks: 1,
    difficulty: "medium",
    is_pyq: true,
    pyq_year: "2023",
    is_important: true,
  },
  {
    id: "q-3",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    question_text: "Explain any three measures introduced by the French revolutionaries to create a sense of collective identity among the French people.",
    question_type: "short_answer",
    options: null,
    correct_answer: `1. The ideas of la patrie (the fatherland) and le citoyen (the citizen) emphasized a united community enjoying equal rights.
2. A new French tricolour flag was chosen to replace the former royal standard.
3. The Estates General was elected by the body of active citizens and renamed the National Assembly.
4. Internal customs duties and dues were abolished and a uniform system of weights and measures was adopted.`,
    explanation:
      "CBSE 2022 Marking Scheme: 1 mark for each valid historical point with explanation (Max 3 marks).",
    marks: 3,
    difficulty: "medium",
    is_pyq: true,
    pyq_year: "2022",
    is_important: true,
  },
  {
    id: "q-4",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    question_text: "Explain the major administrative changes introduced by Napoleon through the Civil Code of 1804 (Napoleonic Code) in the territories ruled by him.",
    question_type: "long_answer",
    options: null,
    correct_answer: `1. Privileges based on birth were abolished.
2. Equality before the law was established and the right to property was secured.
3. Administrative divisions were simplified and the feudal system was abolished.
4. Peasants were freed from serfdom and manorial dues.
5. In towns, guild restrictions were removed; transport and communication networks were upgraded.`,
    explanation:
      "CBSE 2020 Marking Scheme: 5 distinct points explained clearly yield full 5 marks.",
    marks: 5,
    difficulty: "hard",
    is_pyq: true,
    pyq_year: "2020",
    is_important: true,
  },
  {
    id: "q-5",
    class_id: "class-10-id",
    subject_id: "sub-science-id",
    chapter_id: "ch-sci-1",
    question_text: "When Lead Nitrate powder is heated in a boiling tube, brown fumes are emitted. These brown fumes are of which gas?",
    question_type: "mcq",
    options: [
      { id: "A", text: "Nitrogen dioxide (NO2)" },
      { id: "B", text: "Lead oxide (PbO)" },
      { id: "C", text: "Nitrogen monoxide (NO)" },
      { id: "D", text: "Oxygen (O2)" },
    ],
    correct_answer: "A",
    explanation:
      "CBSE 2024: 2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) + O2(g). The brown fumes emitted are Nitrogen dioxide (NO2).",
    marks: 1,
    difficulty: "easy",
    is_pyq: true,
    pyq_year: "2024",
    is_important: true,
  },
  {
    id: "q-6",
    class_id: "class-10-id",
    subject_id: "sub-math-id",
    chapter_id: "ch-mat-1",
    question_text: "If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, where x, y are prime numbers, then HCF(a, b) is:",
    question_type: "mcq",
    options: [
      { id: "A", text: "xy" },
      { id: "B", text: "xy^2" },
      { id: "C", text: "x^3 y^3" },
      { id: "D", text: "x^2 y^2" },
    ],
    correct_answer: "B",
    explanation:
      "CBSE 2023: HCF is the product of the smallest power of each common prime factor involved in the numbers. HCF(a, b) = x^1 * y^2 = xy^2.",
    marks: 1,
    difficulty: "medium",
    is_pyq: true,
    pyq_year: "2023",
    is_important: true,
  },
];

export const FALLBACK_PAPERS: QuestionPaper[] = [
  {
    id: "paper-1",
    title: "Class 10 Social Science Periodic Assessment - Term 1",
    school_name: "Parasnath Public School",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    time_allowed_minutes: 180,
    max_marks: 80,
    general_instructions: [
      "1. All questions are compulsory.",
      "2. Question paper comprises 5 sections: Section A, Section B, Section C, Section D and Section E.",
      "3. Section A consists of 20 MCQs of 1 mark each.",
      "4. Section B consists of 4 Very Short Answer Questions of 2 marks each.",
      "5. Section C consists of 5 Short Answer Questions of 3 marks each.",
      "6. Section D consists of 4 Long Answer Questions of 5 marks each.",
      "7. Section E consists of 3 Case-Based Questions of 4 marks each.",
    ],
    sections: [
      {
        id: "sec-a",
        name: "Section A: Multiple Choice Questions (20 Marks)",
        question_type: "mcq",
        marks_per_question: 1,
        questions: FALLBACK_QUESTIONS.filter(
          (q) => q.question_type === "mcq" || q.question_type === "assertion_reason",
        ),
      },
      {
        id: "sec-c",
        name: "Section C: Short Answer Questions (15 Marks)",
        question_type: "short_answer",
        marks_per_question: 3,
        questions: FALLBACK_QUESTIONS.filter((q) => q.question_type === "short_answer"),
      },
      {
        id: "sec-d",
        name: "Section D: Long Answer Questions (20 Marks)",
        question_type: "long_answer",
        marks_per_question: 5,
        questions: FALLBACK_QUESTIONS.filter((q) => q.question_type === "long_answer"),
      },
    ],
    created_at: "2026-09-01T12:00:00Z",
  },
];

export const FALLBACK_VIDEOS: VideoLecture[] = [
  {
    id: "vid-1",
    class_id: "class-10-id",
    subject_id: "sub-social-id",
    chapter_id: "ch-hist-1",
    title: "The Rise of Nationalism in Europe (Full Chapter Masterclass)",
    description:
      "Detailed visual lecture explaining Frederic Sorrieu's vision, the French Revolution impact, Zollverein customs union, and unification of Germany & Italy.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    provider: "youtube",
    duration_seconds: 2400,
    created_at: "2026-09-01T12:00:00Z",
  },
  {
    id: "vid-2",
    class_id: "class-10-id",
    subject_id: "sub-science-id",
    chapter_id: "ch-sci-1",
    title: "Chemical Reactions & Balancing Equations in 20 Minutes",
    description:
      "Master combination, decomposition, displacement, and double displacement reactions with live color-change demonstrations.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    provider: "youtube",
    duration_seconds: 1200,
    created_at: "2026-09-02T15:00:00Z",
  },
];

export const DEMO_PROFILES: Record<string, Profile> = {
  admin: {
    id: "demo-admin-id",
    email: "admin@parasnath.edu",
    phone: "+919876543212",
    full_name: "Principal R. K. Parasnath (Admin)",
    role: "admin",
    class_id: "class-10-id",
    section: "Admin",
    roll_number: "001",
    school_name: "Parasnath Public School",
    profile_completed_at: "2026-09-01T00:00:00Z",
  },
  student: {
    id: "demo-student-id",
    email: "student@parasnath.edu",
    phone: "+919876543210",
    full_name: "Aarav Sharma (Student)",
    role: "student",
    class_id: "class-10-id",
    section: "A",
    roll_number: "24",
    school_name: "Parasnath Public School",
    profile_completed_at: "2026-09-01T00:00:00Z",
  },
  teacher: {
    id: "demo-teacher-id",
    email: "teacher@parasnath.edu",
    phone: "+919876543211",
    full_name: "Dr. Sunita Verma (Teacher)",
    role: "teacher",
    class_id: "class-10-id",
    section: "A",
    roll_number: null,
    school_name: "Parasnath Public School",
    profile_completed_at: "2026-09-01T00:00:00Z",
  },
};

export async function getSessionUser() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("parasnath_demo_user")?.value;
  if (demoRole && DEMO_PROFILES[demoRole]) {
    const p = DEMO_PROFILES[demoRole];
    return {
      id: p.id,
      email: p.email,
      phone: p.phone,
      user_metadata: { full_name: p.full_name },
    };
  }

  if (!hasSupabaseConfig()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("parasnath_demo_user")?.value;
  if (demoRole && DEMO_PROFILES[demoRole]) {
    return DEMO_PROFILES[demoRole];
  }

  if (!hasSupabaseConfig()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select(
        "id, email, phone, full_name, role, class_id, section, roll_number, school_name, profile_completed_at",
      )
      .eq("id", user.id)
      .maybeSingle();

    return (data as Profile | null) ?? null;
  } catch {
    return null;
  }
}

export async function getClasses(): Promise<SchoolClass[]> {
  if (!hasSupabaseConfig()) return FALLBACK_CLASSES;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("classes")
      .select("id, name, grade")
      .order("grade");
    return data && data.length ? (data as SchoolClass[]) : FALLBACK_CLASSES;
  } catch {
    return FALLBACK_CLASSES;
  }
}

export async function getSubjects(): Promise<Subject[]> {
  if (!hasSupabaseConfig()) return FALLBACK_SUBJECTS;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("subjects").select("id, name").order("name");
    return data && data.length ? (data as Subject[]) : FALLBACK_SUBJECTS;
  } catch {
    return FALLBACK_SUBJECTS;
  }
}

export async function getChapters(classId?: string, subjectId?: string): Promise<Chapter[]> {
  if (!hasSupabaseConfig()) {
    return FALLBACK_CHAPTERS.filter((ch) => {
      if (classId && ch.class_id !== classId) return false;
      if (subjectId && ch.subject_id !== subjectId) return false;
      return true;
    });
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("chapters").select("id, class_id, subject_id, title, sort_order").order("sort_order");
    if (classId) query = query.eq("class_id", classId);
    if (subjectId) query = query.eq("subject_id", subjectId);
    const { data } = await query;
    return data && data.length ? (data as Chapter[]) : FALLBACK_CHAPTERS;
  } catch {
    return FALLBACK_CHAPTERS;
  }
}

export async function getMaterials(chapterId?: string): Promise<Material[]> {
  if (!hasSupabaseConfig()) {
    return chapterId
      ? FALLBACK_MATERIALS.filter((m) => m.chapter_id === chapterId)
      : FALLBACK_MATERIALS;
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("materials").select("*").order("created_at", { ascending: false });
    if (chapterId) query = query.eq("chapter_id", chapterId);
    const { data } = await query;
    return data && data.length ? (data as Material[]) : FALLBACK_MATERIALS;
  } catch {
    return FALLBACK_MATERIALS;
  }
}

export async function getQuestions(filters?: {
  classId?: string;
  subjectId?: string;
  chapterId?: string;
  isPyq?: boolean;
  pyqYear?: string;
  questionType?: string;
}): Promise<Question[]> {
  if (!hasSupabaseConfig()) {
    return FALLBACK_QUESTIONS.filter((q) => {
      if (filters?.classId && q.class_id !== filters.classId) return false;
      if (filters?.subjectId && q.subject_id !== filters.subjectId) return false;
      if (filters?.chapterId && q.chapter_id !== filters.chapterId) return false;
      if (filters?.isPyq !== undefined && q.is_pyq !== filters.isPyq) return false;
      if (filters?.pyqYear && q.pyq_year !== filters.pyqYear) return false;
      if (filters?.questionType && q.question_type !== filters.questionType) return false;
      return true;
    });
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("questions").select("*").order("created_at", { ascending: false });
    if (filters?.classId) query = query.eq("class_id", filters.classId);
    if (filters?.subjectId) query = query.eq("subject_id", filters.subjectId);
    if (filters?.chapterId) query = query.eq("chapter_id", filters.chapterId);
    if (filters?.isPyq !== undefined) query = query.eq("is_pyq", filters.isPyq);
    if (filters?.pyqYear) query = query.eq("pyq_year", filters.pyqYear);
    if (filters?.questionType) query = query.eq("question_type", filters.questionType);
    const { data } = await query;
    return data && data.length ? (data as Question[]) : FALLBACK_QUESTIONS;
  } catch {
    return FALLBACK_QUESTIONS;
  }
}

export async function getVideoLectures(chapterId?: string): Promise<VideoLecture[]> {
  if (!hasSupabaseConfig()) {
    return chapterId
      ? FALLBACK_VIDEOS.filter((v) => v.chapter_id === chapterId)
      : FALLBACK_VIDEOS;
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("video_lectures").select("*").order("created_at", { ascending: false });
    if (chapterId) query = query.eq("chapter_id", chapterId);
    const { data } = await query;
    return data && data.length ? (data as VideoLecture[]) : FALLBACK_VIDEOS;
  } catch {
    return FALLBACK_VIDEOS;
  }
}

export async function getQuestionPapers(classId?: string, subjectId?: string): Promise<QuestionPaper[]> {
  if (!hasSupabaseConfig()) {
    return FALLBACK_PAPERS.filter((p) => {
      if (classId && p.class_id !== classId) return false;
      if (subjectId && p.subject_id !== subjectId) return false;
      return true;
    });
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("question_papers").select("*").order("created_at", { ascending: false });
    if (classId) query = query.eq("class_id", classId);
    if (subjectId) query = query.eq("subject_id", subjectId);
    const { data } = await query;
    return data && data.length ? (data as QuestionPaper[]) : FALLBACK_PAPERS;
  } catch {
    return FALLBACK_PAPERS;
  }
}
