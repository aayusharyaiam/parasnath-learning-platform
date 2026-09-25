"use client";

import { useState } from "react";
import type { Chapter, Question, SchoolClass, Subject } from "@parasnath/shared";
import { QuestionCreator } from "./question-creator";

export function QuestionBankExplorer({
  initialQuestions,
  classes,
  subjects,
  chapters,
  isTeacherOrAdmin,
}: {
  initialQuestions: Question[];
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  isTeacherOrAdmin: boolean;
}) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  function toggleReveal(id: string) {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = questions.filter((q) => {
    if (selectedSubjectId !== "all" && q.subject_id !== selectedSubjectId) return false;
    if (selectedType !== "all" && q.question_type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Creator Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Question &amp; Answer Bank
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Competency MCQs, Assertion–Reason tests, and verified previous board questions.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <QuestionCreator
            classes={classes}
            subjects={subjects}
            chapters={chapters}
            onCreated={(newQ) => setQuestions((prev) => [newQ, ...prev])}
          />
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
        {/* Subject Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubjectId("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              selectedSubjectId === "all"
                ? "bg-brand text-white shadow-xs"
                : "border border-card-border bg-card text-foreground hover:border-brand/40"
            }`}
          >
            All Subjects ({questions.length})
          </button>
          {subjects.map((s) => {
            const count = questions.filter((q) => q.subject_id === s.id).length;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSubjectId(s.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
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

        {/* Question Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-full border border-card-border bg-card px-3 py-1 text-xs font-semibold text-brand"
          >
            <option value="all">All Formats</option>
            <option value="mcq">Competency MCQs</option>
            <option value="assertion_reason">Assertion–Reason</option>
            <option value="short_answer">Short Answer (3M)</option>
            <option value="long_answer">Long Answer (5M)</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-card-border bg-card p-12 text-center">
          <p className="text-3xl">📝</p>
          <h3 className="mt-3 text-base font-bold text-brand-dark">
            No questions found matching your filter
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isTeacherOrAdmin
              ? "Use the 'Create New Question' button above to add custom test items."
              : "Check back as your teachers publish new practice problems."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q, idx) => {
            const isRevealed = Boolean(revealedIds[q.id]);
            return (
              <div
                key={q.id}
                className="rounded-3xl border border-card-border bg-card p-5 sm:p-6 shadow-xs space-y-3"
              >
                {/* Card Header Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-brand-dark">
                      {subjectMap[q.subject_id] ?? "Social Science"} · {chapterMap[q.chapter_id] ?? "NCERT Chapter"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {q.is_pyq && (
                      <span className="rounded-md bg-purple-100 border border-purple-300 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                        🎓 CBSE {q.pyq_year || "PYQ"}
                      </span>
                    )}
                    {q.is_important && (
                      <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                        ⭐ High-Yield
                      </span>
                    )}
                    <span className="rounded-md bg-brand-light px-2 py-0.5 text-[10px] font-bold text-brand">
                      {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 capitalize">
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed whitespace-pre-line font-mono">
                  {q.question_text}
                </p>

                {/* MCQ Options Display */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`rounded-xl border p-2.5 text-xs flex items-start gap-2 ${
                          isRevealed && q.correct_answer === opt.id
                            ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                            : "border-card-border bg-background/70 text-foreground"
                        }`}
                      >
                        <span className="font-bold text-brand">{opt.id}.</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Key & Explanation Toggle */}
                <div className="border-t border-card-border/60 pt-3 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleReveal(q.id)}
                    className="rounded-full border border-card-border bg-background px-4 py-1.5 text-xs font-bold text-foreground hover:bg-card-border/30 focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {isRevealed ? "▲ Hide Answer Key" : "▼ Reveal Answer & CBSE Scheme"}
                  </button>

                  <span className="text-[11px] text-muted-foreground capitalize">
                    Format: {q.question_type.replace("_", " ")}
                  </span>
                </div>

                {/* Expanded Answer Rubric */}
                {isRevealed && (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-2 animate-fade">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950">
                        ✓ Correct Answer:
                      </span>
                      <span className="rounded-md bg-emerald-800 text-white px-2 py-0.5 text-xs font-bold">
                        {q.correct_answer}
                      </span>
                    </div>

                    {q.explanation && (
                      <div>
                        <p className="text-[11px] font-bold text-emerald-950">
                          CBSE Marking Scheme &amp; Key Points:
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-emerald-900 whitespace-pre-line font-mono">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
