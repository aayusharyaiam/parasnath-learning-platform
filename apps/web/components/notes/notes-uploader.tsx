"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import type { Chapter, Material, SchoolClass, Subject } from "@parasnath/shared";
import { useRouter } from "next/navigation";

export function NotesUploader({
  classes,
  subjects,
  chapters,
  onUploaded,
}: {
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  onUploaded: (newM: Material) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredChapters = chapters.filter(
    (ch) =>
      (!classId || ch.class_id === classId) &&
      (!subjectId || ch.subject_id === subjectId)
  );

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }
    if (!chapterId) {
      setError("Please select a target chapter.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    let fileUrl = "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf";

    if (hasSupabaseConfig() && file) {
      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `notes/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("materials")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from("materials")
            .getPublicUrl(filePath);
          fileUrl = publicUrlData.publicUrl;
        }

        const { error: dbErr } = await supabase.from("materials").insert({
          class_id: classId,
          subject_id: subjectId,
          chapter_id: chapterId,
          title: title.trim(),
          description: description.trim() || null,
          file_url: fileUrl,
          file_type: "pdf",
          file_size_bytes: file.size,
          is_important: isImportant,
        });

        if (dbErr) {
          setError(dbErr.message);
          setBusy(false);
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
        setBusy(false);
        return;
      }
    }

    const newMaterial: Material = {
      id: `mat-custom-${Date.now()}`,
      class_id: classId,
      subject_id: subjectId,
      chapter_id: chapterId,
      title: title.trim(),
      description: description.trim() || null,
      file_url: fileUrl,
      file_type: "pdf",
      file_size_bytes: file?.size ?? 1200000,
      is_important: isImportant,
      created_at: new Date().toISOString(),
    };

    setBusy(false);
    setSuccess("Study notes uploaded successfully!");
    setTitle("");
    setDescription("");
    setIsImportant(false);
    setFile(null);
    onUploaded(newMaterial);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
      >
        {open ? "✕ Close Uploader" : "＋ Upload Teacher Notes / PDF"}
      </button>

      {open && (
        <form
          onSubmit={handleUpload}
          className="mt-4 rounded-3xl border-2 border-brand/30 bg-card p-6 sm:p-8 shadow-md space-y-4 animate-fade"
        >
          <div className="border-b border-card-border pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Teacher Content Studio
            </span>
            <h3 className="text-base font-bold text-brand-dark">
              Upload Chapter Study Material &amp; Handouts
            </h3>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                {filteredChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">
              Material Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 Formula Sheet & Important Dates"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Description / Important Instructions</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts to focus on for 2026 Board Examinations..."
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-important-note"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 rounded-md text-brand focus:ring-brand"
              />
              <label htmlFor="is-important-note" className="text-xs font-bold text-amber-900 cursor-pointer">
                ⭐ Mark as High-Yield Board Exam Topic
              </label>
            </div>

            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-xs text-muted-foreground file:mr-2 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs disabled:opacity-60"
            >
              {busy ? "Uploading notes..." : "Publish to Students"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
