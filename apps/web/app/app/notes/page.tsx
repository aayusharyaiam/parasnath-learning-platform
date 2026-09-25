import {
  getClasses,
  getMaterials,
  getProfile,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { NotesExplorer } from "@/components/notes/notes-explorer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes & Material | Parasnath Learning",
  description:
    "Explore Class 9 & 10 NCERT revision notes, formula sheets, and teacher study handouts with in-app reader.",
};

export default async function NotesPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, materials] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getMaterials(),
  ]);

  const isTeacherOrAdmin = profile.role === "teacher" || profile.role === "admin";

  return (
    <NotesExplorer
      initialMaterials={materials}
      classes={classes}
      subjects={subjects}
      chapters={chapters}
      isTeacherOrAdmin={isTeacherOrAdmin}
    />
  );
}
