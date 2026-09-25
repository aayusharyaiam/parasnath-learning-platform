"use client";

import { useState } from "react";
import Link from "next/link";
import type { Chapter, Material, Question, SchoolClass, Subject, VideoLecture } from "@parasnath/shared";
import { EmbeddedPdfViewer } from "@/components/notes/embedded-pdf-viewer";

export function ChapterStudyViewer({
  chapters,
  subjects,
  materials,
  questions,
  videos,
}: {
  chapters: Chapter[];
  subjects: Subject[];
  classes?: SchoolClass[];
  materials: Material[];
  questions: Question[];
  videos: VideoLecture[];
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id ?? "");
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? "");
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  const filteredChapters = chapters.filter(
    (ch) => !selectedSubjectId || ch.subject_id === selectedSubjectId
  );

  const currentChapter =
    chapters.find((ch) => ch.id === activeChapterId) || filteredChapters[0];

  const chapterMaterials = materials.filter(
    (m) => m.chapter_id === currentChapter?.id
  );
  const chapterQuestions = questions.filter(
    (q) => q.chapter_id === currentChapter?.id
  );
  const chapterVideos = videos.filter(
    (v) => v.chapter_id === currentChapter?.id
  );

  return (
    <div className="space-y-6">
      {activeMaterial && (
        <EmbeddedPdfViewer
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
        />
      )}

      {/* Header */}
      <div>
        <span className="rounded-md bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
          Step 1 of Learning Cycle
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-brand-dark">
          NCERT Chapter Study Room
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Study bite-sized micro-topics, inspect historical maps, open teacher notes, and take chapter micro-tests.
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-card-border pb-3">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSelectedSubjectId(s.id);
              const firstCh = chapters.find((ch) => ch.subject_id === s.id);
              if (firstCh) setActiveChapterId(firstCh.id);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              selectedSubjectId === s.id
                ? "bg-brand text-white shadow-xs"
                : "border border-card-border bg-card text-foreground hover:border-brand/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Chapter Study Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Chapter List */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Chapters ({filteredChapters.length})
          </p>
          <div className="space-y-2">
            {filteredChapters.map((ch, idx) => {
              const isCurrent = currentChapter?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapterId(ch.id)}
                  className={`w-full text-left rounded-2xl border p-4 text-xs font-semibold transition-all ${
                    isCurrent
                      ? "border-brand bg-brand text-white shadow-md font-bold"
                      : "border-card-border bg-card hover:border-brand/40 text-foreground"
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold block ${isCurrent ? "text-emerald-200" : "text-muted-foreground"}`}>
                    Chapter {idx + 1}
                  </span>
                  <span className="text-sm mt-0.5 block">{ch.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Chapter Learning Hub */}
        <div className="lg:col-span-2 space-y-6">
          {currentChapter && (
            <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-card-border pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {subjectMap[currentChapter.subject_id]} · NCERT Class 10
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark mt-1">
                  {currentChapter.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Master all concepts, formula summaries, teacher handouts, and take the topic test.
                </p>
              </div>

              {/* Learning Highlights Cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-card-border bg-background/80 p-4">
                  <span className="text-xl">📄</span>
                  <p className="text-xs font-bold text-brand-dark mt-1">Study Notes</p>
                  <p className="text-[11px] text-muted-foreground">{chapterMaterials.length} Handouts available</p>
                </div>

                <div className="rounded-2xl border border-card-border bg-background/80 p-4">
                  <span className="text-xl">🎯</span>
                  <p className="text-xs font-bold text-brand-dark mt-1">Practice PYQs</p>
                  <p className="text-[11px] text-muted-foreground">{chapterQuestions.length} Questions in bank</p>
                </div>

                <div className="rounded-2xl border border-card-border bg-background/80 p-4">
                  <span className="text-xl">🎥</span>
                  <p className="text-xs font-bold text-brand-dark mt-1">Video Lectures</p>
                  <p className="text-[11px] text-muted-foreground">{chapterVideos.length} Masterclasses</p>
                </div>
              </div>

              {/* Handouts for this Chapter */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-brand-dark">Teacher Revision Handouts for this Chapter:</h3>
                {chapterMaterials.length === 0 ? (
                  <p className="text-xs text-muted-foreground bg-background p-4 rounded-xl">
                    No handouts uploaded for this chapter yet. Browse general notes in the Notes Studio.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {chapterMaterials.map((mat) => (
                      <div
                        key={mat.id}
                        className="flex items-center justify-between rounded-2xl border border-card-border bg-background p-3.5"
                      >
                        <div>
                          <p className="text-xs font-bold text-brand-dark">{mat.title}</p>
                          <p className="text-[10px] text-muted-foreground">{mat.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveMaterial(mat)}
                          className="rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white hover:bg-brand-hover shrink-0"
                        >
                          Read Note
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons to Proceed in Learning Cycle */}
              <div className="border-t border-card-border pt-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/app/tests"
                  className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs"
                >
                  Take Chapter PYQ Test →
                </Link>
                <Link
                  href="/app/videos"
                  className="rounded-full border border-card-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-card"
                >
                  Watch Video Masterclass
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
