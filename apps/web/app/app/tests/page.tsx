import {
  getClasses,
  getProfile,
  getQuestions,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { PyqTestEngine } from "@/components/tests/pyq-test-engine";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PYQs & Practice Tests | Parasnath Learning",
  description:
    "Curated CBSE Class 9 & 10 Previous-Year Board Questions (2020-2024), timed competency micro-tests, and automatic grading.",
};

export default async function TestsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, questions] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getQuestions(),
  ]);

  return (
    <PyqTestEngine
      questions={questions}
      classes={classes}
      subjects={subjects}
      chapters={chapters}
    />
  );
}
