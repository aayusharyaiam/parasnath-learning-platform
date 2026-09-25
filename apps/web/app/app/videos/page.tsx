import {
  getClasses,
  getProfile,
  getVideoLectures,
  getSubjects,
  getChapters,
} from "@/lib/data";
import { VideoExplorer } from "@/components/videos/video-explorer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Lectures | Parasnath Learning",
  description:
    "Curated video masterclasses, topic lectures, and downloadable teacher handouts for NCERT Classes 9 & 10.",
};

export default async function VideosPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [classes, subjects, chapters, videos] = await Promise.all([
    getClasses(),
    getSubjects(),
    getChapters(),
    getVideoLectures(),
  ]);

  const isTeacherOrAdmin = profile.role === "teacher" || profile.role === "admin";

  return (
    <VideoExplorer
      initialVideos={videos}
      classes={classes}
      subjects={subjects}
      chapters={chapters}
      isTeacherOrAdmin={isTeacherOrAdmin}
    />
  );
}
