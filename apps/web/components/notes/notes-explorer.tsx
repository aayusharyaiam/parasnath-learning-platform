"use client";

import { useState } from "react";
import type { Chapter, Material, SchoolClass, Subject } from "@parasnath/shared";
import { EmbeddedPdfViewer } from "./embedded-pdf-viewer";
import { NotesUploader } from "./notes-uploader";

export function NotesExplorer({
  initialMaterials,
  classes,
  subjects,
  chapters,
  isTeacherOrAdmin,
}: {
  initialMaterials: Material[];
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  isTeacherOrAdmin: boolean;
}) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  const filtered = materials.filter((m) => {
    if (selectedSubjectId !== "all" && m.subject_id !== selectedSubjectId) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Active Embedded PDF Modal */}
      {activeMaterial && (
        <EmbeddedPdfViewer
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
        />
      )}

      {/* Header & Teacher Uploader Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            NCERT Study Material &amp; Handouts
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Official teacher revision handbooks, formula sheets, and chapter summaries.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <NotesUploader
            classes={classes}
            subjects={subjects}
            chapters={chapters}
            onUploaded={(newM) => setMaterials((prev) => [newM, ...prev])}
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
          All Subjects ({materials.length})
        </button>
        {subjects.map((s) => {
          const count = materials.filter((m) => m.subject_id === s.id).length;
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

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-card-border bg-card p-12 text-center">
          <p className="text-3xl">📄</p>
          <h3 className="mt-3 text-base font-bold text-brand-dark">
            No study materials uploaded for this subject yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isTeacherOrAdmin
              ? "Use the 'Upload Teacher Notes' button above to publish your first handout."
              : "Your teachers will upload revision handbooks here soon."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className="group flex flex-col justify-between rounded-3xl border border-card-border bg-card p-5 shadow-xs transition-all hover:border-brand/40 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand">
                    {subjectMap[mat.subject_id] ?? "Social Science"}
                  </span>
                  {mat.is_important && (
                    <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                      ⭐ High-Yield
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-semibold text-muted-foreground">
                  {chapterMap[mat.chapter_id] ?? "NCERT Chapter"}
                </p>

                <h3 className="text-sm font-bold text-brand-dark group-hover:text-brand transition-colors leading-snug">
                  {mat.title}
                </h3>

                {mat.description && (
                  <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-card-border/60 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {mat.file_size_bytes
                    ? `${(mat.file_size_bytes / 1024 / 1024).toFixed(1)} MB`
                    : "PDF Document"}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveMaterial(mat)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span>👁️ Read in App</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
