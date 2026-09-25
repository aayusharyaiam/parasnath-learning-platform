"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import type {
  Chapter,
  Question,
  QuestionOption,
  QuestionType,
  SchoolClass,
  Subject,
} from "@parasnath/shared";
import { useRouter } from "next/navigation";

export function QuestionCreator({
  classes,
  subjects,
  chapters,
  onCreated,
}: {
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  onCreated: (q: Question) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isPyq, setIsPyq] = useState(false);
  const [pyqYear, setPyqYear] = useState("2024");
  const [isImportant, setIsImportant] = useState(false);
  const [explanation, setExplanation] = useState("");

  // Options for MCQ
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);
  const [correctOption, setCorrectOption] = useState("A");

  // Subjective Model Answer
  const [subjectiveAnswer, setSubjectiveAnswer] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredChapters = chapters.filter(
    (ch) =>
      (!classId || ch.class_id === classId) &&
      (!subjectId || ch.subject_id === subjectId)
  );

  function handleTypeChange(type: QuestionType) {
    setQuestionType(type);
    if (type === "mcq") {
      setMarks(1);
      setOptions([
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
      ]);
      setCorrectOption("A");
    } else if (type === "assertion_reason") {
      setMarks(1);
      setOptions([
        { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
        { id: "B", text: "Both (A) and (R) are true but (R) is NOT the correct explanation of (A)" },
        { id: "C", text: "(A) is true but (R) is false" },
        { id: "D", text: "(A) is false but (R) is true" },
      ]);
      setCorrectOption("A");
    } else if (type === "short_answer") {
      setMarks(3);
    } else if (type === "long_answer") {
      setMarks(5);
    } else if (type === "case_based") {
      setMarks(4);
    }
  }

  function updateOptionText(index: number, text: string) {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!questionText.trim()) {
      setError("Please enter the question text.");
      return;
    }
    if (!chapterId) {
      setError("Please select an NCERT chapter.");
      return;
    }

    if (questionType === "mcq" && options.some((o) => !o.text.trim())) {
      setError("Please fill in all 4 option choices for the MCQ.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    const payloadOptions =
      questionType === "mcq" || questionType === "assertion_reason" || questionType === "statement"
        ? options
        : null;

    const payloadCorrectAnswer =
      questionType === "short_answer" || questionType === "long_answer" || questionType === "case_based"
        ? subjectiveAnswer.trim()
        : correctOption;

    const newQuestion: Question = {
      id: `q-custom-${Date.now()}`,
      class_id: classId,
      subject_id: subjectId,
      chapter_id: chapterId,
      question_text: questionText.trim(),
      question_type: questionType,
      options: payloadOptions,
      correct_answer: payloadCorrectAnswer,
      explanation: explanation.trim() || null,
      marks,
      difficulty,
      is_pyq: isPyq,
      pyq_year: isPyq ? pyqYear : null,
      is_important: isImportant,
    };

    if (hasSupabaseConfig()) {
      try {
        const supabase = createClient();
        const { data, error: err } = await supabase
          .from("questions")
          .insert({
            class_id: classId,
            subject_id: subjectId,
            chapter_id: chapterId,
            question_text: questionText.trim(),
            question_type: questionType,
            options: payloadOptions,
            correct_answer: payloadCorrectAnswer,
            explanation: explanation.trim() || null,
            marks,
            difficulty,
            is_pyq: isPyq,
            pyq_year: isPyq ? pyqYear : null,
            is_important: isImportant,
          })
          .select()
          .single();

        if (err) {
          setError(err.message);
          setBusy(false);
          return;
        }
        if (data) {
          newQuestion.id = data.id;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save question.");
        setBusy(false);
        return;
      }
    }

    setBusy(false);
    setSuccess("Question added to bank successfully!");
    onCreated(newQuestion);
    setQuestionText("");
    setExplanation("");
    setSubjectiveAnswer("");
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
      >
        {open ? "✕ Close Creator" : "＋ Create New Question / PYQ"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-3xl border-2 border-brand/30 bg-card p-6 sm:p-8 shadow-md space-y-5 animate-fade"
        >
          <div className="border-b border-card-border pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Teacher Question Studio
              </span>
              <h3 className="text-base font-bold text-brand-dark">
                Add Questions to School Bank
              </h3>
            </div>
            <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold text-brand">
              {marks} {marks === 1 ? "Mark" : "Marks"}
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

          {/* Class, Subject, Chapter Row */}
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

          {/* Question Type & Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Question Format</label>
              <select
                value={questionType}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-semibold text-brand"
              >
                <option value="mcq">Standard Competency MCQ (1 Mark)</option>
                <option value="assertion_reason">Assertion–Reason Question (1 Mark)</option>
                <option value="statement">Statement 1 &amp; 2 Question (1 Mark)</option>
                <option value="short_answer">Short Answer (2–3 Marks)</option>
                <option value="long_answer">Long Answer (5 Marks)</option>
                <option value="case_based">Case-Based / Source Study (4 Marks)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Marks Allocation</label>
              <input
                type="number"
                min={1}
                max={10}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-medium text-foreground"
              >
                <option value="easy">Easy (Knowledge / Recall)</option>
                <option value="medium">Medium (Application / Understanding)</option>
                <option value="hard">Hard (Analysis / Board Benchmark)</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="text-xs font-bold text-foreground">
              Question Statement / Problem Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                questionType === "assertion_reason"
                  ? "Assertion (A): ...\nReason (R): ..."
                  : "Enter the complete question prompt..."
              }
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground font-mono"
            />
          </div>

          {/* MCQ Options with Radio Button to Select Correct Option */}
          {(questionType === "mcq" || questionType === "assertion_reason" || questionType === "statement") && (
            <div className="space-y-3 rounded-2xl border border-card-border bg-background/60 p-4">
              <p className="text-xs font-bold text-brand-dark">
                MCQ Choices &amp; Correct Answer Selection:
              </p>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs font-bold text-brand">
                      <input
                        type="radio"
                        name="correct_option"
                        value={opt.id}
                        checked={correctOption === opt.id}
                        onChange={() => setCorrectOption(opt.id)}
                        className="h-4 w-4 text-brand focus:ring-brand"
                      />
                      <span>Option {opt.id}:</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => updateOptionText(idx, e.target.value)}
                      placeholder={`Choice ${opt.id} text...`}
                      className="flex-1 rounded-xl border border-card-border bg-card px-3 py-1.5 text-xs text-foreground"
                    />
                    {correctOption === opt.id && (
                      <span className="rounded-md bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                        ✓ Correct Key
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjective Model Answer */}
          {(questionType === "short_answer" || questionType === "long_answer" || questionType === "case_based") && (
            <div>
              <label className="text-xs font-bold text-foreground">
                Model Answer Key / Main Answer Points <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={subjectiveAnswer}
                onChange={(e) => setSubjectiveAnswer(e.target.value)}
                placeholder="1. First key historical/scientific point...&#10;2. Second point..."
                className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground font-mono"
              />
            </div>
          )}

          {/* Explanation / CBSE Marking Scheme */}
          <div>
            <label className="text-xs font-bold text-foreground">
              Official Explanation / Step-by-Step Marking Rubric (Optional)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. CBSE 2024 Marking Scheme: 1 mark for mentioning la patrie, 1 mark for tricolour flag..."
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs font-normal text-foreground"
            />
          </div>

          {/* PYQ Tag & High-Yield Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-card-border pt-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is-pyq-chk"
                checked={isPyq}
                onChange={(e) => setIsPyq(e.target.checked)}
                className="h-4 w-4 rounded text-brand focus:ring-brand"
              />
              <label htmlFor="is-pyq-chk" className="text-xs font-bold text-foreground cursor-pointer">
                Previous-Year Board Question (PYQ)
              </label>
              {isPyq && (
                <select
                  value={pyqYear}
                  onChange={(e) => setPyqYear(e.target.value)}
                  className="rounded-lg border border-card-border bg-card px-2 py-1 text-xs font-bold text-brand"
                >
                  <option value="2024">CBSE 2024</option>
                  <option value="2023">CBSE 2023</option>
                  <option value="2022">CBSE 2022</option>
                  <option value="2020">CBSE 2020</option>
                  <option value="2019">CBSE 2019</option>
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-imp-q-chk"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 rounded text-brand focus:ring-brand"
              />
              <label htmlFor="is-imp-q-chk" className="text-xs font-bold text-amber-900 cursor-pointer">
                ⭐ Mark as High-Yield Board Exam Question
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-xs disabled:opacity-60"
            >
              {busy ? "Saving question..." : "Save to Question Bank"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
