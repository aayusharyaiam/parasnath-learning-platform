"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import type {
  Chapter,
  PaperSection,
  Question,
  QuestionPaper,
  SchoolClass,
  Subject,
} from "@parasnath/shared";
import { PaperPreviewModal } from "./paper-preview-modal";
import { useRouter } from "next/navigation";

export function PaperGeneratorStudio({
  initialPapers,
  classes,
  subjects,
  chapters,
  questions,
  isTeacherOrAdmin,
}: {
  initialPapers: QuestionPaper[];
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  questions: Question[];
  isTeacherOrAdmin: boolean;
}) {
  const router = useRouter();
  const [papers, setPapers] = useState<QuestionPaper[]>(initialPapers);
  const [openCreator, setOpenCreator] = useState(false);
  const [activePreviewPaper, setActivePreviewPaper] = useState<QuestionPaper | null>(null);

  // Blueprint form states
  const [title, setTitle] = useState("Class 10 Social Science Periodic Assessment - Term 1");
  const [schoolName, setSchoolName] = useState("Parasnath Public School");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [targetMarks, setTargetMarks] = useState<number>(80);
  const [durationMins, setDurationMins] = useState<number>(180);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(
    chapters.map((c) => c.id)
  );
  const [includePyqs, setIncludePyqs] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));

  const filteredChapters = chapters.filter(
    (ch) => (!classId || ch.class_id === classId) && (!subjectId || ch.subject_id === subjectId)
  );

  function toggleChapter(id: string) {
    setSelectedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSelectAllChapters() {
    setSelectedChapterIds(filteredChapters.map((c) => c.id));
  }

  async function generatePaper(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a question paper title.");
      return;
    }
    if (selectedChapterIds.length === 0) {
      setError("Please select at least one chapter for the question paper blueprint.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    // Filter available pool of questions
    const pool = questions.filter((q) => {
      if (classId && q.class_id !== classId) return false;
      if (subjectId && q.subject_id !== subjectId) return false;
      if (!selectedChapterIds.includes(q.chapter_id)) return false;
      if (!includePyqs && q.is_pyq) return false;
      return true;
    });

    const mcqs = pool.filter((q) => q.question_type === "mcq" || q.question_type === "assertion_reason" || q.question_type === "statement");
    const shortAns = pool.filter((q) => q.question_type === "short_answer");
    const longAns = pool.filter((q) => q.question_type === "long_answer");
    const caseBased = pool.filter((q) => q.question_type === "case_based");

    const sections: PaperSection[] = [];

    if (mcqs.length > 0) {
      sections.push({
        id: "sec-a",
        name: `Section A: Multiple Choice Questions (${Math.min(mcqs.length, 20)} Marks)`,
        question_type: "mcq",
        marks_per_question: 1,
        questions: mcqs.slice(0, 20),
      });
    }

    if (shortAns.length > 0) {
      sections.push({
        id: "sec-c",
        name: `Section C: Short Answer Questions (${Math.min(shortAns.length, 5) * 3} Marks)`,
        question_type: "short_answer",
        marks_per_question: 3,
        questions: shortAns.slice(0, 5),
      });
    }

    if (longAns.length > 0) {
      sections.push({
        id: "sec-d",
        name: `Section D: Long Answer Questions (${Math.min(longAns.length, 4) * 5} Marks)`,
        question_type: "long_answer",
        marks_per_question: 5,
        questions: longAns.slice(0, 4),
      });
    }

    if (caseBased.length > 0) {
      sections.push({
        id: "sec-e",
        name: `Section E: Case-Based / Source Study (${Math.min(caseBased.length, 3) * 4} Marks)`,
        question_type: "case_based",
        marks_per_question: 4,
        questions: caseBased.slice(0, 3),
      });
    }

    const calculatedTotalMarks = sections.reduce(
      (secSum, sec) => secSum + sec.questions.reduce((qSum, q) => qSum + q.marks, 0),
      0
    );

    const newPaper: QuestionPaper = {
      id: `paper-${Date.now()}`,
      title: title.trim(),
      school_name: schoolName.trim(),
      class_id: classId,
      subject_id: subjectId,
      time_allowed_minutes: durationMins,
      max_marks: calculatedTotalMarks || targetMarks,
      general_instructions: [
        "1. All questions are compulsory.",
        "2. Question paper comprises structured sections: Section A (MCQs), Section C (Short Answer), and Section D (Long Answer).",
        "3. Section A comprises Multiple Choice Questions of 1 mark each.",
        "4. Section C comprises Short Answer Type Questions carrying 3 marks each.",
        "5. Section D comprises Long Answer Type Questions carrying 5 marks each.",
        "6. There is no overall choice, however internal choice is provided where applicable.",
      ],
      sections,
      created_at: new Date().toISOString(),
    };

    if (hasSupabaseConfig()) {
      try {
        const supabase = createClient();
        const { data, error: err } = await supabase
          .from("question_papers")
          .insert({
            title: newPaper.title,
            school_name: newPaper.school_name,
            class_id: newPaper.class_id,
            subject_id: newPaper.subject_id,
            time_allowed_minutes: newPaper.time_allowed_minutes,
            max_marks: newPaper.max_marks,
            general_instructions: newPaper.general_instructions,
            sections: newPaper.sections,
          })
          .select()
          .single();

        if (err) {
          setError(err.message);
          setBusy(false);
          return;
        }
        if (data) {
          newPaper.id = data.id;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save question paper.");
        setBusy(false);
        return;
      }
    }

    setBusy(false);
    setSuccess("Question Paper assembled and saved successfully!");
    setPapers((prev) => [newPaper, ...prev]);
    setActivePreviewPaper(newPaper);
    setOpenCreator(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Active Modal */}
      {activePreviewPaper && (
        <PaperPreviewModal
          paper={activePreviewPaper}
          onClose={() => setActivePreviewPaper(null)}
        />
      )}

      {/* Header & Creator Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Question Paper Generator Studio
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Assemble custom examination papers, blueprints, printable PDFs, and Google Docs exports.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            type="button"
            onClick={() => setOpenCreator(!openCreator)}
            className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
          >
            {openCreator ? "✕ Close Blueprint Builder" : "＋ Generate New Question Paper"}
          </button>
        )}
      </div>

      {/* Blueprint Builder Drawer */}
      {openCreator && (
        <form
          onSubmit={generatePaper}
          className="rounded-3xl border-2 border-brand/30 bg-card p-6 sm:p-8 shadow-md space-y-5 animate-fade"
        >
          <div className="border-b border-card-border pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Automated Paper Assembly Engine
              </span>
              <h3 className="text-base font-bold text-brand-dark">
                Blueprint &amp; Examination Parameters
              </h3>
            </div>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">
              Target: {targetMarks} Marks · {durationMins} Mins
            </span>
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

          {/* Paper Title & School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground">Examination Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Periodic Assessment 1 - Term 1"
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">School Header <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
              />
            </div>
          </div>

          {/* Class, Subject, Marks, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Class / Grade</label>
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
              <label className="text-xs font-bold text-foreground">Maximum Marks</label>
              <select
                value={targetMarks}
                onChange={(e) => setTargetMarks(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value={20}>20 Marks (Unit Test)</option>
                <option value={40}>40 Marks (Periodic Assessment)</option>
                <option value={80}>80 Marks (Full Board Examination)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Time Allowed</label>
              <select
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value={60}>1 Hour (60 mins)</option>
                <option value={120}>2 Hours (120 mins)</option>
                <option value={180}>3 Hours (180 mins)</option>
              </select>
            </div>
          </div>

          {/* Chapter Scope Selection */}
          <div className="space-y-2 rounded-2xl border border-card-border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-dark">
                Include Chapters in Syllabus Blueprint:
              </label>
              <button
                type="button"
                onClick={handleSelectAllChapters}
                className="text-[11px] font-bold text-brand underline"
              >
                Select All Chapters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {filteredChapters.map((ch) => {
                const on = selectedChapterIds.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChapter(ch.id)}
                    className={`rounded-xl border p-2.5 text-xs text-left transition-all flex items-center justify-between ${
                      on
                        ? "border-brand bg-brand-light text-brand-dark font-bold shadow-xs"
                        : "border-card-border bg-card text-foreground"
                    }`}
                  >
                    <span className="truncate mr-2">{ch.title}</span>
                    <span>{on ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Previous Year Tag */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pyq-paper-toggle"
              checked={includePyqs}
              onChange={(e) => setIncludePyqs(e.target.checked)}
              className="h-4 w-4 rounded text-brand focus:ring-brand"
            />
            <label htmlFor="pyq-paper-toggle" className="text-xs font-bold text-foreground cursor-pointer">
              Include Verified CBSE Previous-Year Board Questions in pool
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenCreator(false)}
              className="rounded-full border border-card-border bg-background px-5 py-2 text-xs font-bold text-foreground hover:bg-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand px-7 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md disabled:opacity-60"
            >
              {busy ? "Assembling Blueprint..." : "⚡ Generate & Preview Question Paper"}
            </button>
          </div>
        </form>
      )}

      {/* Generated Papers List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-dark">
          School Question Papers Repository ({papers.length})
        </h2>

        {papers.length === 0 ? (
          <div className="rounded-3xl border border-card-border bg-card p-12 text-center">
            <p className="text-3xl">📄</p>
            <h3 className="mt-3 text-base font-bold text-brand-dark">
              No Question Papers Generated Yet
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Click &quot;Generate New Question Paper&quot; above to assemble your first exam paper.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {papers.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-3xl border border-card-border bg-card p-5 shadow-xs hover:border-brand/40 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      {subjectMap[p.subject_id] ?? "Social Science"} · {classMap[p.class_id] ?? "Class 10"}
                    </span>
                    <span className="rounded-md bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                      {p.max_marks} Marks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-brand-dark leading-snug group-hover:text-brand transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-[11px] text-muted-foreground">
                    Time: {Math.floor(p.time_allowed_minutes / 60)} Hours · {p.sections.length} Sections
                  </p>

                  <div className="rounded-xl bg-background p-3 text-[11px] text-foreground space-y-1">
                    {p.sections.map((sec) => (
                      <p key={sec.id} className="truncate text-muted-foreground">
                        • {sec.name}: <strong>{sec.questions.length} Questions</strong>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-card-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActivePreviewPaper(p)}
                    className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    👁️ Preview &amp; Print PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
