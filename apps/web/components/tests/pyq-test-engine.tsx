"use client";

import { useState } from "react";
import type { Chapter, Question, SchoolClass, Subject } from "@parasnath/shared";

export function PyqTestEngine({
  questions,
  subjects,
  chapters,
}: {
  questions: Question[];
  classes?: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
}) {
  const [activeTab, setActiveTab] = useState<"explorer" | "quiz">("explorer");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Quiz Engine State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const pyqs = questions.filter((q) => q.is_pyq);
  const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  const filteredPyqs = pyqs.filter((q) => {
    if (selectedYear !== "all" && q.pyq_year !== selectedYear) return false;
    if (selectedSubjectId !== "all" && q.subject_id !== selectedSubjectId) return false;
    return true;
  });

  const quizPool = questions.filter((q) => q.options && q.options.length > 0);

  function handleSelectOption(qId: string, optId: string) {
    if (quizFinished) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  }

  function calculateScore() {
    let score = 0;
    quizPool.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) score += q.marks;
    });
    return score;
  }

  const totalPossible = quizPool.reduce((sum, q) => sum + q.marks, 0);
  const userScore = calculateScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-md bg-purple-100 border border-purple-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-900">
            Curated CBSE Board Repository
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Previous-Year Questions &amp; Practice Tests
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Official Class 9 &amp; 10 board exam questions (2020–2024) with step-by-step marking rubrics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-full border border-card-border bg-card p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("explorer");
              setQuizStarted(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "explorer"
                ? "bg-brand text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📚 PYQ Explorer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "quiz"
                ? "bg-brand text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⏱️ Take Timed Quiz
          </button>
        </div>
      </div>

      {/* Tab 1: PYQ Explorer */}
      {activeTab === "explorer" && (
        <div className="space-y-5">
          {/* Year & Subject Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">Exam Year:</span>
              {["all", "2024", "2023", "2022", "2020"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? "bg-purple-800 text-white shadow-xs"
                      : "border border-card-border bg-card text-foreground hover:border-purple-300"
                  }`}
                >
                  {yr === "all" ? "All Years" : `CBSE ${yr}`}
                </button>
              ))}
            </div>

            <div>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="rounded-full border border-card-border bg-card px-3.5 py-1 text-xs font-bold text-brand"
              >
                <option value="all">All Subjects ({pyqs.length})</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4">
            {filteredPyqs.map((q, idx) => {
              const isRevealed = Boolean(revealedIds[q.id]);
              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-card-border bg-card p-5 sm:p-6 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-900">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-brand-dark">
                        {subjectMap[q.subject_id]} · {chapterMap[q.chapter_id]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-purple-100 border border-purple-300 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                        🎓 CBSE {q.pyq_year}
                      </span>
                      <span className="rounded-md bg-brand-light px-2 py-0.5 text-[10px] font-bold text-brand">
                        {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed whitespace-pre-line font-mono">
                    {q.question_text}
                  </p>

                  {q.options && (
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

                  <div className="border-t border-card-border/60 pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="rounded-full border border-card-border bg-background px-4 py-1.5 text-xs font-bold text-foreground hover:bg-card-border/30 focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {isRevealed ? "▲ Hide Marking Scheme" : "▼ Reveal CBSE Marking Scheme"}
                    </button>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      Format: {q.question_type.replace("_", " ")}
                    </span>
                  </div>

                  {isRevealed && (
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 space-y-2 animate-fade">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-950">
                          Official Correct Key:
                        </span>
                        <span className="rounded-md bg-emerald-800 text-white px-2 py-0.5 text-xs font-bold">
                          {q.correct_answer}
                        </span>
                      </div>
                      {q.explanation && (
                        <div>
                          <p className="text-[11px] font-bold text-emerald-950">
                            CBSE Official Rubric &amp; Solution:
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
        </div>
      )}

      {/* Tab 2: Timed Practice Quiz Engine */}
      {activeTab === "quiz" && (
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          {!quizStarted && !quizFinished ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand mx-auto text-3xl">
                ⏱️
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark">
                NCERT Competency Micro-Test
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take a quick 5-question test with Competency-based MCQs, Assertion-Reason questions, and previous-year board questions with instant evaluation.
              </p>
              <div className="rounded-2xl border border-card-border bg-background/80 p-4 text-xs text-left space-y-1.5 font-medium text-foreground">
                <p>• Total Questions: {quizPool.length}</p>
                <p>• Total Marks: {totalPossible} Marks</p>
                <p>• Instant evaluation with step-by-step rationale upon submission</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuizStarted(true);
                  setCurrentIdx(0);
                  setUserAnswers({});
                }}
                className="rounded-full bg-brand px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-hover"
              >
                Start Practice Test Now →
              </button>
            </div>
          ) : quizStarted && !quizFinished ? (
            <div className="space-y-6">
              {/* Question Navigator Bar */}
              <div className="flex items-center justify-between border-b border-card-border pb-4">
                <span className="text-xs font-bold text-brand">
                  Question {currentIdx + 1} of {quizPool.length}
                </span>
                <div className="flex gap-1.5">
                  {quizPool.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      className={`h-6 w-6 rounded-full text-[10px] font-bold transition-all ${
                        currentIdx === i
                          ? "bg-brand text-white"
                          : userAnswers[quizPool[i].id]
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-background border border-card-border text-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Question Statement */}
              {quizPool[currentIdx] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      {subjectMap[quizPool[currentIdx].subject_id]} · {quizPool[currentIdx].marks} Mark
                    </span>
                    {quizPool[currentIdx].is_pyq && (
                      <span className="text-[10px] font-bold text-purple-800">
                        🎓 CBSE {quizPool[currentIdx].pyq_year}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-brand-dark leading-relaxed font-mono">
                    {quizPool[currentIdx].question_text}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {quizPool[currentIdx].options?.map((opt) => {
                      const isSelected = userAnswers[quizPool[currentIdx].id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(quizPool[currentIdx].id, opt.id)}
                          className={`w-full text-left rounded-2xl border p-4 text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-brand bg-brand-light text-brand-dark font-bold shadow-xs"
                              : "border-card-border bg-card hover:bg-background/80 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <span className="text-brand font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quiz Navigation Controls */}
              <div className="flex items-center justify-between border-t border-card-border pt-4">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="rounded-full border border-card-border bg-background px-4 py-2 text-xs font-bold text-foreground disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentIdx < quizPool.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="rounded-full bg-brand px-6 py-2 text-xs font-bold text-white hover:bg-brand-hover"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizFinished(true);
                      setQuizStarted(false);
                    }}
                    className="rounded-full bg-emerald-800 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-900 shadow-md"
                  >
                    Submit Test for Evaluation ✓
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Scorecard & Results */
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 sm:p-8 text-center space-y-3">
                <span className="rounded-full bg-emerald-800 text-white px-3 py-1 text-xs font-bold">
                  Test Evaluation Complete
                </span>
                <h2 className="text-3xl font-extrabold text-emerald-950">
                  Your Score: {userScore} / {totalPossible} Marks ({Math.round((userScore / totalPossible) * 100)}%)
                </h2>
                <p className="text-xs text-emerald-900 max-w-md mx-auto">
                  {userScore === totalPossible
                    ? "🌟 Outstanding! You scored 100% on this topic test."
                    : "Great practice! Review the step-by-step marking rubrics below to fix weak spots."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizFinished(false);
                      setQuizStarted(true);
                      setCurrentIdx(0);
                      setUserAnswers({});
                    }}
                    className="rounded-full bg-emerald-800 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-900"
                  >
                    Retake Test
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-brand-dark">Question-by-Question Solution Breakdown:</h3>
                {quizPool.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correct_answer;
                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4 space-y-2 text-xs ${
                        isCorrect ? "border-emerald-300 bg-emerald-50/50" : "border-red-200 bg-red-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {idx + 1}. {q.question_text}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isCorrect ? "bg-emerald-800 text-white" : "bg-red-800 text-white"
                          }`}
                        >
                          {isCorrect ? "✓ Correct (+1)" : "✕ Incorrect (0)"}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        <strong>Your Selection:</strong> {userAnswer ? `Option ${userAnswer}` : "Not Attempted"} ·{" "}
                        <strong>Correct Key:</strong> Option {q.correct_answer}
                      </p>
                      {q.explanation && (
                        <p className="text-[11px] text-foreground font-mono bg-white/70 p-2.5 rounded-xl border border-card-border/60 mt-1">
                          💡 <strong>CBSE Rationale:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
