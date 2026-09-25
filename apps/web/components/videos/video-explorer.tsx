"use client";

import { useState } from "react";
import type { Chapter, SchoolClass, Subject, VideoLecture } from "@parasnath/shared";
import { VideoUploader } from "./video-uploader";

export function VideoExplorer({
  initialVideos,
  classes,
  subjects,
  chapters,
  isTeacherOrAdmin,
}: {
  initialVideos: VideoLecture[];
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  isTeacherOrAdmin: boolean;
}) {
  const [videos, setVideos] = useState<VideoLecture[]>(initialVideos);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  const filtered = videos.filter((v) => {
    if (selectedSubjectId !== "all" && v.subject_id !== selectedSubjectId) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Active Video Player Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-xs"
        >
          <div className="w-full max-w-4xl rounded-3xl border border-card-border bg-card shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-card-border bg-brand-dark px-5 py-3 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  {subjectMap[activeVideo.subject_id]} Masterclass
                </span>
                <h2 id="video-modal-title" className="text-sm font-bold truncate max-w-lg">
                  {activeVideo.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30"
              >
                ✕ Close
              </button>
            </div>

            {/* 16:9 Video Player */}
            <div className="relative w-full aspect-video bg-black">
              {activeVideo.provider === "direct" ? (
                <video
                  src={activeVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={`${activeVideo.video_url}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            {activeVideo.description && (
              <div className="p-4 bg-background/60 border-t border-card-border">
                <p className="text-xs font-bold text-brand-dark">Lecture Outline &amp; Notes:</p>
                <p className="mt-1 text-xs text-foreground whitespace-pre-line font-mono">
                  {activeVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header & Teacher Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Curated Video Lectures
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Topic-by-topic master video explanations uploaded by your school faculty.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <VideoUploader
            classes={classes}
            subjects={subjects}
            chapters={chapters}
            onUploaded={(newV) => setVideos((prev) => [newV, ...prev])}
          />
        )}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-card-border pb-3">
        <button
          type="button"
          onClick={() => setSelectedSubjectId("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            selectedSubjectId === "all"
              ? "bg-brand text-white shadow-xs"
              : "border border-card-border bg-card text-foreground hover:border-brand/40"
          }`}
        >
          All Subjects ({videos.length})
        </button>
        {subjects.map((s) => {
          const count = videos.filter((v) => v.subject_id === s.id).length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSubjectId(s.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                selectedSubjectId === s.id
                  ? "bg-brand text-white shadow-xs"
                  : "border border-card-border bg-card text-foreground hover:border-brand/40"
              }`}
            >
              {s.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-card-border bg-card p-12 text-center">
          <p className="text-3xl">🎥</p>
          <h3 className="mt-3 text-base font-bold text-brand-dark">
            No video lectures available for this subject yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isTeacherOrAdmin
              ? "Use the 'Add Video Lecture' button to publish your first video masterclass."
              : "Your teachers will upload topic lectures here soon."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vid) => (
            <div
              key={vid.id}
              className="group flex flex-col justify-between rounded-3xl border border-card-border bg-card overflow-hidden shadow-xs hover:border-brand/40 hover:shadow-md transition-all"
            >
              {/* Thumbnail Container with Play Icon */}
              <div
                onClick={() => setActiveVideo(vid)}
                className="relative aspect-video bg-neutral-900 cursor-pointer flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/90 text-white text-lg shadow-lg group-hover:scale-110 transition-transform z-20">
                  ▶
                </div>
                <div className="absolute bottom-2 left-3 z-20">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    {vid.provider === "direct" ? "MP4 Upload" : "Video Lecture"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand uppercase">
                      {subjectMap[vid.subject_id] ?? "Social Science"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {chapterMap[vid.chapter_id] ?? "NCERT Chapter"}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveVideo(vid)}
                    className="text-sm font-bold text-brand-dark group-hover:text-brand transition-colors cursor-pointer leading-snug mt-1"
                  >
                    {vid.title}
                  </h3>

                  {vid.description && (
                    <p className="text-xs text-foreground/80 line-clamp-2 mt-1 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-card-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(vid)}
                    className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-hover"
                  >
                    ▶ Watch Lecture
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
