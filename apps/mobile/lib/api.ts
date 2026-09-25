import type {
  Chapter,
  Material,
  Profile,
  Question,
  QuestionPaper,
  SchoolClass,
  Subject,
  UserRole,
  VideoLecture,
} from "@parasnath/shared";
import { supabase } from "./supabase";

export async function fetchProfile(): Promise<Profile | null> {
  try {
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

export async function fetchClasses(): Promise<SchoolClass[]> {
  try {
    const { data } = await supabase.from("classes").select("id, name, grade").order("grade");
    return (data as SchoolClass[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchSubjects(): Promise<Subject[]> {
  try {
    const { data } = await supabase.from("subjects").select("id, name").order("name");
    return (data as Subject[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchChapters(): Promise<Chapter[]> {
  try {
    const { data } = await supabase.from("chapters").select("id, class_id, subject_id, title, sort_order").order("sort_order");
    return (data as Chapter[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchMaterials(): Promise<Material[]> {
  try {
    const { data } = await supabase.from("materials").select("*").order("created_at", { ascending: false });
    return (data as Material[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const { data } = await supabase.from("questions").select("*").order("created_at", { ascending: false });
    return (data as Question[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchVideoLectures(): Promise<VideoLecture[]> {
  try {
    const { data } = await supabase.from("video_lectures").select("*").order("created_at", { ascending: false });
    return (data as VideoLecture[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchQuestionPapers(): Promise<QuestionPaper[]> {
  try {
    const { data } = await supabase.from("question_papers").select("*").order("created_at", { ascending: false });
    return (data as QuestionPaper[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchSubjectIds(profileId: string): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("profile_subjects")
      .select("subject_id")
      .eq("profile_id", profileId);
    return (data ?? []).map((r) => r.subject_id as string);
  } catch {
    return [];
  }
}

export async function saveProfile(input: {
  id: string;
  full_name: string;
  phone: string;
  class_id: string;
  section: string;
  school_name: string;
  roll_number: string;
  email: string | null;
  subjectIds: string[];
}) {
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name,
      phone: input.phone,
      class_id: input.class_id,
      section: input.section,
      school_name: input.school_name,
      roll_number: input.roll_number || null,
      email: input.email,
      profile_completed_at: new Date().toISOString(),
    })
    .eq("id", input.id);
  if (error) throw error;

  await supabase.from("profile_subjects").delete().eq("profile_id", input.id);
  if (input.subjectIds.length) {
    const { error: subErr } = await supabase.from("profile_subjects").insert(
      input.subjectIds.map((subject_id) => ({
        profile_id: input.id,
        subject_id,
      })),
    );
    if (subErr) throw subErr;
  }
}

export async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone, section, school_name, role")
      .eq("role", "student")
      .order("full_name");
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function updateRole(id: string, role: UserRole) {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw error;
}

export async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, role")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}
