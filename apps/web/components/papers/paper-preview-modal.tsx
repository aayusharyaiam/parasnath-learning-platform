"use client";

import { useEffect, useState } from "react";
import type { QuestionPaper } from "@parasnath/shared";

export function PaperPreviewModal({
  paper,
  onClose,
}: {
  paper: QuestionPaper;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handlePrint() {
    window.print();
  }

  function handleCopyToGoogleDocs() {
    let docText = `${paper.school_name.toUpperCase()}\n`;
    docText += `${paper.title}\n`;
    docText += `Time Allowed: ${Math.floor(paper.time_allowed_minutes / 60)} Hours\t\t\t\t\tMaximum Marks: ${paper.max_marks}\n`;
    docText += `--------------------------------------------------------------------------------\n\n`;
    docText += `GENERAL INSTRUCTIONS:\n`;
    paper.general_instructions.forEach((ins) => {
      docText += `${ins}\n`;
    });
    docText += `\n================================================================================\n\n`;

    let globalQNum = 1;
    paper.sections.forEach((sec) => {
      docText += `${sec.name.toUpperCase()}\n\n`;
      sec.questions.forEach((q) => {
        docText += `Q${globalQNum}. ${q.question_text}\t[${q.marks} Mark${q.marks > 1 ? "s" : ""}]\n`;
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt) => {
            docText += `    (${opt.id}) ${opt.text}\n`;
          });
        }
        docText += `\n`;
        globalQNum++;
      });
      docText += `--------------------------------------------------------------------------------\n\n`;
    });

    if (showAnswerKey) {
      docText += `\n================================================================================\n`;
      docText += `CONFIDENTIAL ANSWER KEY & CBSE MARKING SCHEME\n`;
      docText += `================================================================================\n\n`;
      let ansNum = 1;
      paper.sections.forEach((sec) => {
        docText += `${sec.name.toUpperCase()}\n`;
        sec.questions.forEach((q) => {
          docText += `Q${ansNum}. Answer: ${q.correct_answer || "N/A"}\n`;
          if (q.explanation) {
            docText += `    Marking Scheme: ${q.explanation}\n`;
          }
          docText += `\n`;
          ansNum++;
        });
      });
    }

    void navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  let questionCounter = 1;
  let answerCounter = 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paper-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-6 print:p-0 print:bg-white print:static"
    >
      <div className="flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border border-card-border bg-card shadow-2xl overflow-hidden print:border-0 print:shadow-none print:max-h-none print:w-full">
        {/* Modal Toolbar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between border-b border-card-border bg-brand-dark px-5 py-3 text-white gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Exam Document Preview
            </span>
            <span className="text-xs font-bold text-white truncate max-w-xs">
              {paper.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                showAnswerKey
                  ? "bg-emerald-200 text-emerald-950 font-extrabold"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {showAnswerKey ? "✓ Marking Scheme Included" : "＋ Attach Answer Key"}
            </button>

            <button
              type="button"
              onClick={handleCopyToGoogleDocs}
              className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
            >
              {copied ? "✓ Copied to Clipboard!" : "📄 Copy for Google Docs"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              🖨️ Print / Save as PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30 ml-2"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Paper Document Container (Printable Paper Sheet) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-white text-neutral-900 font-serif leading-relaxed print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="text-center border-b-2 border-neutral-900 pb-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              {paper.school_name}
            </h1>
            <h2 id="paper-preview-title" className="text-base sm:text-lg font-bold">
              {paper.title}
            </h2>
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold pt-2 border-t border-neutral-400 mt-2">
              <span>Time Allowed: {Math.floor(paper.time_allowed_minutes / 60)} Hours</span>
              <span>Maximum Marks: {paper.max_marks}</span>
            </div>
          </div>

          {/* General Instructions */}
          <div className="my-5 p-4 rounded-xl border border-neutral-300 bg-neutral-50 text-xs space-y-1 print:bg-transparent print:border-neutral-800">
            <p className="font-bold uppercase tracking-wide text-neutral-800">
              General Instructions:
            </p>
            {paper.general_instructions.map((ins, i) => (
              <p key={i} className="text-neutral-700">{ins}</p>
            ))}
          </div>

          {/* Sections & Questions */}
          <div className="space-y-8">
            {paper.sections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                <div className="text-center border-y border-neutral-400 py-1.5 bg-neutral-100 print:bg-transparent">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                    {sec.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  {sec.questions.map((q) => {
                    const currentQNum = questionCounter++;
                    return (
                      <div key={q.id} className="text-xs sm:text-sm space-y-1.5">
                        <div className="flex justify-between items-start gap-4">
                          <p className="font-medium text-neutral-900 flex-1">
                            <strong className="font-bold mr-1.5">Q{currentQNum}.</strong>
                            {q.question_text}
                          </p>
                          <span className="font-bold text-neutral-700 shrink-0">
                            [{q.marks}]
                          </span>
                        </div>

                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-6 pt-0.5">
                            {q.options.map((opt) => (
                              <p key={opt.id} className="text-neutral-800 text-xs">
                                <strong className="mr-1">({opt.id})</strong> {opt.text}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Attached Answer Key / Marking Scheme */}
          {showAnswerKey && (
            <div className="mt-12 pt-8 border-t-2 border-neutral-900 space-y-6 page-break-before">
              <div className="text-center border-b-2 border-neutral-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                  Teachers &amp; Evaluators Reference
                </span>
                <h2 className="text-base sm:text-lg font-black uppercase">
                  Confidential Answer Key &amp; CBSE Marking Scheme
                </h2>
              </div>

              <div className="space-y-6 text-xs sm:text-sm">
                {paper.sections.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <p className="font-bold border-b border-neutral-300 pb-1 uppercase text-neutral-800">
                      {sec.name}
                    </p>
                    {sec.questions.map((q) => {
                      const ansNum = answerCounter++;
                      return (
                        <div key={q.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 print:bg-transparent">
                          <p className="font-bold text-neutral-900">
                            Q{ansNum}. Correct Answer: <span className="text-emerald-800">{q.correct_answer || "Subjective Evaluation"}</span> [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                          </p>
                          {q.explanation && (
                            <p className="text-neutral-700 text-xs font-mono whitespace-pre-line">
                              <strong>Marking Scheme:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
