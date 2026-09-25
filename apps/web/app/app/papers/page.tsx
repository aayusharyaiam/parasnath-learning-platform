import {
  getClasses,
  getProfile,
  getQuestionPapers,
  getQuestions,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { PaperGeneratorStudio } from "@/components/papers/paper-generator-studio";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Paper Generator | Parasnath Learning",
  description:
    "Generate custom CBSE & NCERT question papers, exam blueprints, printable PDFs, and Google Docs exports.",
};

export default async function PapersPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, questions, papers] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getQuestions(),
    getQuestionPapers(),
  ]);

  const isTeacherOrAdmin = profile.role === "teacher" || profile.role === "admin";

  return (
    <PaperGeneratorStudio
      initialPapers={papers}
      classes={classes}
      subjects={subjects}
      chapters={chapters}
      questions={questions}
      isTeacherOrAdmin={isTeacherOrAdmin}
    />
  );
}
