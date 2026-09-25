"use client";

import { useState } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export const FAQS_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "Curriculum & Subjects",
    question: "What classes and subjects does Parasnath Learning cover?",
    answer:
      "Parasnath Learning is built around the official NCERT syllabus, starting with Class 9 and Class 10 Social Science (History, Geography, Political Science, Economics), Science, Mathematics, English, and Hindi. The modular architecture is designed to expand across all school grades and subjects seamlessly.",
  },
  {
    id: "faq-2",
    category: "Learning & Testing Cycle",
    question: "How does the topic-wise learning and automatic test evaluation work?",
    answer:
      "The platform follows a strict pedagogical cycle: Learn → Practice → Topic Test → Written Practice → Evaluation → Revision. After studying each micro-topic, students take instant competency-based MCQs, Assertion-Reason questions, and previous-year board questions with automatic grading, step-by-step solutions, and immediate performance analytics.",
  },
  {
    id: "faq-3",
    category: "Written Practice & Checking",
    question: "Can students upload handwritten notebook answers for teacher verification?",
    answer:
      "Yes! Students can write subjective answers directly in their notebook, take a clear photo or scan as PDF, and upload it through the app. Teachers can mark answers, award scores, write personalized feedback, and highlight areas for improvement. AI-assisted conceptual checking is also provided for instant pre-checks.",
  },
  {
    id: "faq-4",
    category: "AI Learning Assistant",
    question: "How does the AI Assistant generate mind-maps, diagrams, and explanations?",
    answer:
      "Students can prompt the AI to 'Explain the French Revolution in simple terms' or 'Generate a mind map of photosynthesis'. The AI generates age-appropriate concept maps, timelines, and visual diagrams. It adheres to school safety guidelines and includes built-in mental wellbeing triggers.",
  },
  {
    id: "faq-5",
    category: "Devices & Student Privacy",
    question: "Is the app mobile-friendly and how is student privacy protected?",
    answer:
      "Parasnath Learning is available as a responsive web app and a React Native mobile application. Student data is safeguarded under strict DPDP and COPPA standards with row-level security (RLS), encrypted authentication, zero advertising trackers, and an SLA response time promise of <100ms for smooth learning on any device.",
  },
];

export function FaqAccordion({ items = FAQS_DATA }: { items?: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  function toggle(id: string) {
    setOpenId((curr) => (curr === id ? null : id));
  }

  return (
    <div className="space-y-3" role="region" aria-label="Frequently Asked Questions">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all ${
              isOpen
                ? "border-brand/40 bg-card shadow-sm"
                : "border-card-border bg-card/60 hover:border-brand/30 hover:bg-card"
            }`}
          >
            <button
              type="button"
              id={`faq-btn-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-brand-dark focus-visible:ring-2 focus-visible:ring-brand rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <span className="text-base font-bold">{item.question}</span>
              </div>
              <span
                className={`transform text-brand transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-btn-${item.id}`}
                className="px-5 pb-5 pt-1 text-sm leading-relaxed text-foreground"
              >
                <div className="mb-2 inline-block rounded-md bg-accent-light px-2 py-0.5 text-[11px] font-semibold text-accent">
                  {item.category}
                </div>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
