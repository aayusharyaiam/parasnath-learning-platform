import {
  getClasses,
  getProfile,
  getMaterials,
  getQuestions,
  getVideoLectures,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { ChapterStudyViewer } from "@/components/study/chapter-study-viewer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Room | Parasnath Learning",
  description:
    "Explore Class 9 & 10 NCERT chapters, study notes, diagrams, and direct chapter practice tests.",
};

export default async function StudyPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, materials, questions, videos] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getMaterials(),
    getQuestions(),
    getVideoLectures(),
  ]);

  return (
    <ChapterStudyViewer
      classes={classes}
      subjects={subjects}
      chapters={chapters}
      materials={materials}
      questions={questions}
      videos={videos}
    />
  );
}
