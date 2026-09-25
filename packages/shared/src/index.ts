export type UserRole = "student" | "teacher" | "admin";

export type Profile = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  class_id: string | null;
  section: string | null;
  roll_number: string | null;
  school_name: string | null;
  profile_completed_at: string | null;
};

export type SchoolClass = {
  id: string;
  name: string;
  grade: number;
};

export type Subject = {
  id: string;
  name: string;
};

export type Chapter = {
  id: string;
  class_id: string;
  subject_id: string;
  title: string;
  sort_order: number;
};

export type Topic = {
  id: string;
  chapter_id: string;
  title: string;
  sort_order: number;
};

export type Material = {
  id: string;
  class_id: string;
  subject_id: string;
  chapter_id: string;
  topic_id?: string | null;
  title: string;
  description?: string | null;
  file_url: string;
  file_type: "pdf" | "image" | "doc";
  file_size_bytes?: number | null;
  is_important: boolean;
  created_by?: string | null;
  created_at?: string;
};

export type QuestionType =
  | "mcq"
  | "assertion_reason"
  | "statement"
  | "case_based"
  | "short_answer"
  | "long_answer";

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  class_id: string;
  subject_id: string;
  chapter_id: string;
  topic_id?: string | null;
  question_text: string;
  question_type: QuestionType;
  options?: QuestionOption[] | null;
  correct_answer?: string | null;
  explanation?: string | null;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  is_pyq: boolean;
  pyq_year?: string | null;
  is_important: boolean;
  diagram_url?: string | null;
  created_by?: string | null;
  created_at?: string;
};

export type VideoLecture = {
  id: string;
  class_id: string;
  subject_id: string;
  chapter_id: string;
  topic_id?: string | null;
  title: string;
  description?: string | null;
  video_url: string;
  provider: "youtube" | "vimeo" | "direct";
  duration_seconds?: number | null;
  attached_notes_url?: string | null;
  created_by?: string | null;
  created_at?: string;
};

export type PaperSection = {
  id: string;
  name: string; // e.g. "Section A: Multiple Choice Questions"
  question_type: QuestionType | "mixed";
  marks_per_question: number;
  questions: Question[];
};

export type QuestionPaper = {
  id: string;
  title: string; // e.g. "Class 10 Social Science Periodic Assessment - Term 1"
  school_name: string;
  class_id: string;
  subject_id: string;
  time_allowed_minutes: number;
  max_marks: number;
  general_instructions: string[];
  sections: PaperSection[];
  created_by?: string | null;
  created_at?: string;
};

export function toE164India(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return `+91${digits}`;
}

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.profile_completed_at &&
      profile.full_name?.trim() &&
      profile.phone?.trim() &&
      profile.class_id &&
      profile.section?.trim() &&
      profile.school_name?.trim()
  );
}

export type NavItem = {
  href: string;
  label: string;
  comingSoon?: boolean;
};

export const STUDENT_NAV: NavItem[] = [
  { href: "/app", label: "Home" },
  { href: "/app/profile", label: "My details" },
  { href: "/app/notes", label: "Notes & Material" },
  { href: "/app/tests", label: "PYQs & Practice Tests" },
  { href: "/app/videos", label: "Video Lectures" },
  { href: "/app/study", label: "Study Room" },
  { href: "/app/written", label: "Written Practice", comingSoon: true },
  { href: "/app/ai", label: "AI Assistant", comingSoon: true },
  { href: "/app/progress", label: "Progress", comingSoon: true },
];

export const TEACHER_NAV: NavItem[] = [
  { href: "/app", label: "Home" },
  { href: "/app/profile", label: "My details" },
  { href: "/app/students", label: "Students" },
  { href: "/app/papers", label: "Question Papers" },
  { href: "/app/notes", label: "Notes Studio" },
  { href: "/app/questions", label: "Question Bank" },
  { href: "/app/videos", label: "Video Lectures" },
  { href: "/app/tests", label: "PYQ Explorer" },
  { href: "/app/checking", label: "Check Answers", comingSoon: true },
  { href: "/app/performance", label: "Performance", comingSoon: true },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/app", label: "Home" },
  { href: "/app/profile", label: "My details" },
  { href: "/app/admin/users", label: "Users" },
  { href: "/app/admin/classes", label: "Classes & Subjects" },
  { href: "/app/papers", label: "Question Papers" },
  { href: "/app/notes", label: "Notes Studio" },
  { href: "/app/questions", label: "Question Bank" },
  { href: "/app/videos", label: "Video Lectures" },
  { href: "/app/tests", label: "PYQ Explorer" },
];

export function navForRole(role: UserRole): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "teacher") return TEACHER_NAV;
  return STUDENT_NAV;
}

export const SCHOOL_DEFAULT_NAME = "Parasnath";
