"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import type { Chapter, SchoolClass, Subject, VideoLecture } from "@parasnath/shared";
import { useRouter } from "next/navigation";

export function VideoUploader({
  classes,
  subjects,
  chapters,
  onUploaded,
}: {
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  onUploaded: (v: VideoLecture) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"embed" | "direct">("embed");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredChapters = chapters.filter(
    (ch) =>
      (!classId || ch.class_id === classId) &&
      (!subjectId || ch.subject_id === subjectId)
  );

  function normalizeYouTubeUrl(url: string) {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a video lecture title.");
      return;
    }
    if (!chapterId) {
      setError("Please select a target chapter.");
      return;
    }

    if (uploadMode === "embed" && !videoUrl.trim()) {
      setError("Please enter a YouTube or Vimeo video link.");
      return;
    }

    if (uploadMode === "direct" && !file) {
      setError("Please select a video file (MP4/WebM) to upload.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    let finalVideoUrl = normalizeYouTubeUrl(videoUrl.trim());
    let provider: "youtube" | "vimeo" | "direct" = "youtube";

    if (uploadMode === "direct" && file) {
      provider = "direct";
      finalVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Fallback stream

      if (hasSupabaseConfig()) {
        try {
          const supabase = createClient();
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `videos/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from("materials")
            .upload(filePath, file, { cacheControl: "3600", upsert: true });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage
              .from("materials")
              .getPublicUrl(filePath);
            finalVideoUrl = publicUrlData.publicUrl;
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Video upload failed.");
          setBusy(false);
          return;
        }
      }
    }

    const newVideo: VideoLecture = {
      id: `vid-custom-${Date.now()}`,
      class_id: classId,
      subject_id: subjectId,
      chapter_id: chapterId,
      title: title.trim(),
      description: description.trim() || null,
      video_url: finalVideoUrl,
      provider,
      duration_seconds: 1800,
    };

    if (hasSupabaseConfig()) {
      try {
        const supabase = createClient();
        const { data, error: dbErr } = await supabase
          .from("video_lectures")
          .insert({
            class_id: classId,
            subject_id: subjectId,
            chapter_id: chapterId,
            title: title.trim(),
            description: description.trim() || null,
            video_url: finalVideoUrl,
            provider,
            duration_seconds: 1800,
          })
          .select()
          .single();

        if (dbErr) {
          setError(dbErr.message);
          setBusy(false);
          return;
        }
        if (data) {
          newVideo.id = data.id;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Database error.");
        setBusy(false);
        return;
      }
    }

    setBusy(false);
    setSuccess("Video lecture published successfully!");
    onUploaded(newVideo);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setFile(null);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
      >
        {open ? "✕ Close Uploader" : "＋ Add Video Lecture"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-3xl border-2 border-brand/30 bg-card p-6 sm:p-8 shadow-md space-y-4 animate-fade"
        >
          <div className="border-b border-card-border pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Teacher Lecture Studio
              </span>
              <h3 className="text-base font-bold text-brand-dark">
                Publish Video Masterclass
              </h3>
            </div>
            {/* Mode Switcher */}
            <div className="flex rounded-full border border-card-border bg-background p-1">
              <button
                type="button"
                onClick={() => setUploadMode("embed")}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                  uploadMode === "embed" ? "bg-brand text-white" : "text-muted-foreground"
                }`}
              >
                YouTube / Vimeo Link
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("direct")}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                  uploadMode === "direct" ? "bg-brand text-white" : "text-muted-foreground"
                }`}
              >
                Direct File Upload
              </button>
            </div>
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

          {/* Class, Subject, Chapter */}
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
              Lecture Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The French Revolution & Sorrieu's Vision (Detailed Explanation)"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
            />
          </div>

          {uploadMode === "embed" ? (
            <div>
              <label className="text-xs font-bold text-foreground">
                YouTube (Unlisted) or Vimeo Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-foreground">
                Upload Video File (MP4 / WebM) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                required
                accept="video/mp4,video/webm"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-foreground">Description &amp; Key Timestamps</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="00:00 - Introduction&#10;05:30 - Napoleonic Reforms&#10;14:20 - Treaty of Vienna (1815)"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs disabled:opacity-60"
            >
              {busy ? "Publishing video..." : "Publish Lecture"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
