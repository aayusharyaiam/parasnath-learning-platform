"use client";

import { useEffect, useState } from "react";

export function CrisisHelplineModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 hover:border-amber-600/50 focus-visible:ring-2 focus-visible:ring-amber-600"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 text-amber-700"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.244-.77 3.129-2.073 4.828-4.148C17.9 12.186 19 9.68 19 7c0-2.485-.92-4.81-2.586-6.475C14.748-.14 12.424-.5 10 2.2 7.576-.5 5.252-.14 3.586.525 1.92 2.19 1 4.515 1 7c0 2.68 1.1 5.186 2.8 7.21 1.7 2.076 3.585 3.378 4.83 4.148.31.193.57.337.756.433.093.048.188.095.281.14l.018.008.006.003z"
            clipRule="evenodd"
          />
        </svg>
        <span>Student Wellbeing & Crisis Support</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="crisis-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-card-border bg-card p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 id="crisis-title" className="text-lg font-bold text-brand-dark">
                    You Are Not Alone. We Care About You.
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Free, confidential 24/7 mental health and student support
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close crisis support popup"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-brand"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground">
              School, exams, and personal challenges can sometimes feel overwhelming.
              If you or someone you know is feeling stressed, hopeless, or having thoughts
              of self-harm, please reach out right now. Help is always available, free, and completely confidential.
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-950">
                      Tele-MANAS (Govt of India 24/7 Toll-Free)
                    </p>
                    <p className="text-xs text-emerald-800">
                      National Mental Health Helpline in 20+ Indian languages
                    </p>
                  </div>
                  <a
                    href="tel:14416"
                    className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    Call 14416
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-950">
                      KIRAN Mental Health Helpline
                    </p>
                    <p className="text-xs text-blue-800">
                      Ministry of Social Justice & Empowerment
                    </p>
                  </div>
                  <a
                    href="tel:18005990019"
                    className="rounded-full bg-blue-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-700"
                  >
                    1800-599-0019
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-950">
                      Childline 1098 (For Students & Minors)
                    </p>
                    <p className="text-xs text-purple-800">
                      Emergency care, counseling and child protection
                    </p>
                  </div>
                  <a
                    href="tel:1098"
                    className="rounded-full bg-purple-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-900 focus-visible:ring-2 focus-visible:ring-purple-700"
                  >
                    Call 1098
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-rose-950">
                      Vandrevala Foundation Helpline
                    </p>
                    <p className="text-xs text-rose-800">24x7 Free Crisis Counseling via Call/WhatsApp</p>
                  </div>
                  <a
                    href="tel:+919999666555"
                    className="rounded-full bg-rose-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-900 focus-visible:ring-2 focus-visible:ring-rose-700"
                  >
                    +91 9999 666 555
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
              >
                Back to Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
