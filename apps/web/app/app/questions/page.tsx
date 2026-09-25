import {
  getClasses,
  getProfile,
  getQuestions,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { QuestionBankExplorer } from "@/components/questions/question-bank-explorer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Bank | Parasnath Learning",
  description:
    "Teacher question bank studio, competency MCQs, Assertion-Reason tests, and verified previous board exam questions.",
};

export default async function QuestionsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, questions] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getQuestions(),
  ]);

  const isTeacherOrAdmin = profile.role === "teacher" || profile.role === "admin";

  return (
    <QuestionBankExplorer
      initialQuestions={questions}
      classes={classes}
      subjects={subjects}
      chapters={chapters}
      isTeacherOrAdmin={isTeacherOrAdmin}
    />
  );
}
