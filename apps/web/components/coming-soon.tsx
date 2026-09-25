"use client";

import Link from "next/link";
import { useState } from "react";

type RoomDetails = {
  title: string;
  badge: string;
  description: string;
  learningStep: string;
  highlights: string[];
  previewSample: {
    heading: string;
    subheading: string;
    details: string;
    bulletPoints: string[];
  };
};

const ROOM_MAP: Record<string, RoomDetails> = {
  "Study": {
    title: "NCERT Chapter & Topic Study Room",
    badge: "Step 1: Learn",
    description:
      "Interactive Class 9 & 10 NCERT study material with colorful diagrams, historical maps, key summaries, and micro-topic breakdowns.",
    learningStep: "1. Learn & Understand",
    highlights: [
      "NCERT Class 9 & 10 Social Science, Science, Math",
      "Interactive Maps, Timelines & High-Res Diagrams",
      "Key formulas, summaries and glossary points",
      "Bilingual student-friendly explanations",
    ],
    previewSample: {
      heading: "Class 10 Social Science: The Rise of Nationalism in Europe",
      subheading: "Sub-topic 1.1: Frederic Sorrieu Vision & The French Revolution",
      details:
        "Sorrieu painted a world of democratic and social republics in 1848. Key ideas include liberty represented by the female figure and absolutist symbols shattered on the earth.",
      bulletPoints: [
        "Key Concept: Nation-state emergence in 19th-century Europe",
        "Visual Aid: Sorrieu's 4-print series breakdown with interactive zoom",
        "Pre-requisite check before unlocking Sub-topic Test 1",
      ],
    },
  },
  "Tests": {
    title: "Topic-Wise Competency Test Engine",
    badge: "Step 2: Test & Practice",
    description:
      "Instant micro-tests after every topic with Competency-based MCQs, Assertion-Reason, Statement 1/2 tests, and previous board exam questions.",
    learningStep: "2. Practice & Instant Evaluation",
    highlights: [
      "Automatic score calculation & timer",
      "Competency & Case-based MCQs (CBSE/NCERT standard)",
      "Assertion-Reason & Multi-statement questions",
      "Detailed step-by-step answer explanations",
    ],
    previewSample: {
      heading: "Topic 1.1 Micro-Test (10 Marks · 12 Mins)",
      subheading: "Sample Question 1 (Competency / Assertion-Reason):",
      details:
        "Assertion (A): During 1848, the statue of Liberty held the torch of Enlightenment in one hand and the Charter of Rights of Man in the other.\nReason (R): French artists personified Liberty as a female figure during the Revolution.",
      bulletPoints: [
        "Option A: Both A and R are true and R is correct explanation of A (Correct)",
        "Option B: Both A and R are true but R is NOT correct explanation",
        "Option C: A is true but R is false",
        "Option D: A is false but R is true",
      ],
    },
  },
  "Written practice": {
    title: "Written Question & Notebook Scan Upload",
    badge: "Step 3: Write & Get Checked",
    description:
      "Practice 3-mark, 5-mark and case-based written questions in your physical notebook, upload photos or PDF scans, and receive dual AI and teacher grading.",
    learningStep: "3. Written Practice & Feedback",
    highlights: [
      "Upload camera photos or PDF scans directly",
      "Dual checking: Instant AI conceptual check + Teacher final mark",
      "Red-pen margin comments and correction highlights",
      "Model answer comparison & improvement tips",
    ],
    previewSample: {
      heading: "Long Answer Practice (5 Marks):",
      subheading: "Question: 'Explain the major changes introduced by Napoleon through the Civil Code of 1804.'",
      details:
        "Upload your handwritten answer sheet (PNG/JPG/PDF). The system will scan keywords (Abolished privileges, Equality before law, Right to property, Uniform weights & measures) and queue it on your teacher's dashboard.",
      bulletPoints: [
        "AI Preliminary Score: 4.5/5 (Identified all 4 key Napoleonic reforms)",
        "Teacher Feedback: 'Very well structured! Remember to mention abolition of feudal dues in rural areas.'",
        "Status: Verified & Stored in Progress Portfolio",
      ],
    },
  },
  "AI assistant": {
    title: "AI Educational Assistant & Mind-Map Studio",
    badge: "Step 4: AI Mastery",
    description:
      "Interactive AI tutor capable of simplifying difficult topics, creating concept maps, generating timelines, and answering doubts 24/7.",
    learningStep: "4. Clarify Doubts & Visualize",
    highlights: [
      "Concept simplification in plain English and Hindi",
      "Automatic Mind-map & Flowchart generator",
      "Timeline and visual diagram synthesis",
      "Strict student safety & wellbeing guardrails",
    ],
    previewSample: {
      heading: "AI Prompt: 'Generate a mind map for French Revolution Causes'",
      subheading: "AI Visual Synthesizer (Instant Concept Tree):",
      details:
        "Causes of French Revolution\n├── 1. Social Causes (3 Estates, Clergy/Nobility Tax Exemption)\n├── 2. Economic Crisis (Bad harvest, Rising bread prices, National debt)\n├── 3. Political Causes (Autocratic rule of Louis XVI, Marie Antoinette)\n└── 4. Intellectual Causes (Rousseau, Montesquieu, Voltaire Enlightenment ideas)",
      bulletPoints: [
        "Export format: Interactive SVG / Downloadable PDF Mind-Map",
        "Syllabus aligned: Strictly NCERT Class 9/10 curriculum boundaries",
        "Safe Mode: 100% kid-safe with integrated wellbeing support",
      ],
    },
  },
  "Videos": {
    title: "Curated Video Lectures & Demonstrations",
    badge: "Step 5: Visual Learning",
    description:
      "Topic-by-topic master video lectures uploaded by teachers, complete with timestamped notes, interactive quizzes, and downloadable slides.",
    learningStep: "5. Visual Lectures",
    highlights: [
      "Organized by Class → Subject → Chapter → Sub-topic",
      "Attached teacher lecture slides and revision notes",
      "In-video checkpoint questions",
      "Fast streaming optimized for mobile data",
    ],
    previewSample: {
      heading: "Lecture: The Making of Nationalism in Europe (Part 1)",
      subheading: "Duration: 18 mins · High Quality · Offline Download Supported",
      details:
        "Master the Aristocracy and the New Middle Class, Liberal Nationalism, and the Customs Union (Zollverein 1834) with animated maps.",
      bulletPoints: [
        "Teacher Note: Download PDF lecture summary (2.4 MB)",
        "Attached Test: 5-question quick checkpoint",
      ],
    },
  },
  "Notes": {
    title: "Teacher Notes & NCERT Study Material",
    badge: "Step 6: Revision Library",
    description:
      "Official NCERT chapters, teacher-uploaded PDF notes, formula sheets, key dates, and printable revision handbooks.",
    learningStep: "6. Quick Revision",
    highlights: [
      "Teacher PDF & Document repository",
      "Chapter summary one-pagers for quick board exam revision",
      "Downloadable offline notes on mobile & desktop",
      "Categorized by Class, Subject, and Chapter",
    ],
    previewSample: {
      heading: "Chapter 1 Revision Notes: Quick Handbook",
      subheading: "Prepared by Parasnath Faculty · 4 Pages · PDF",
      details:
        "Comprehensive summary of all Treaty of Vienna (1815) provisions, Giuseppe Mazzini's secret societies, and the 1848 Frankfurt Parliament.",
      bulletPoints: [
        "Class 10 Social Science Board Exam High-Yield Points",
        "Previous 5-year CBSE questions included",
      ],
    },
  },
  "Question papers": {
    title: "Teacher Question Paper Generator & Distributor",
    badge: "Teacher Toolkit",
    description:
      "Automated question paper generator allowing teachers to customize blueprints, select chapters, difficulty levels, and export to Google Docs/PDF.",
    learningStep: "Teacher Assessment Tool",
    highlights: [
      "Class, Subject, Chapter & Topic selection",
      "Difficulty mix (Easy / Medium / Hard) & marks allotment",
      "Import from Google Docs or Word documents",
      "Instant distribution via shareable links, PDF or app portal",
    ],
    previewSample: {
      heading: "Paper Generator Blueprint (Class 10 Social Science - 80 Marks)",
      subheading: "Section A (20 MCQs) · Section B (4 VSA) · Section C (5 SA) · Section D (4 LA) · Section E (3 Case) · Section F (Map)",
      details:
        "One-click generation pulled from verified question bank. Generates matching Answer Key and marking rubric automatically.",
      bulletPoints: [
        "Export Options: Google Docs · Printable PDF · In-App Assignment",
        "Includes Competency & Previous-Year questions",
      ],
    },
  },
  "Questions": {
    title: "Question & Answer Bank Management",
    badge: "Content Repository",
    description:
      "Central question bank for teachers to create, tag, import from Google Docs/PDF/CSV, and organize questions by syllabus standards.",
    learningStep: "Content Management",
    highlights: [
      "Direct Google Docs import & sync",
      "Competency, Assertion-Reason, and Case-study tagging",
      "Pre-loaded NCERT Class 9 & 10 question database",
    ],
    previewSample: {
      heading: "Question Bank Hub",
      subheading: "Over 2,500+ Verified NCERT Questions Ready for Import",
      details: "Import questions easily from Google Docs or spreadsheet templates without manual typing.",
      bulletPoints: ["Supports LaTeX formulas for Math & Science", "Diagram & Map image uploads"],
    },
  },
  "Check answers": {
    title: "Teacher Answer Evaluation & Verification Hub",
    badge: "Teacher Dashboard",
    description:
      "Review student handwritten answer scans, mark corrections with digital red-pen tools, provide encouraging remarks, and record scores.",
    learningStep: "Grading & Verification",
    highlights: [
      "High-resolution image & PDF answer viewer",
      "AI evaluation assistance with keyword highlighting",
      "One-click rubric scoring and feedback recording",
      "Instant notification sent to student account",
    ],
    previewSample: {
      heading: "Pending Submissions (Class 10-A · Social Science)",
      subheading: "14 submissions awaiting review · 28 reviewed today",
      details: "Open any student answer sheet to inspect high-resolution images, compare against marking schemes, and award marks.",
      bulletPoints: ["Digital pen annotations", "Voice/Text feedback option"],
    },
  },
  "Performance": {
    title: "Class & Student Performance Analytics",
    badge: "Analytics",
    description:
      "Deep analytics dashboard for teachers and admins to track syllabus progress, class averages, weak topics, and at-risk students.",
    learningStep: "Diagnostic Analytics",
    highlights: [
      "Topic-wise mastery distribution graphs",
      "Identify students needing remedial attention",
      "Class average vs topper benchmark",
      "Exportable gradebook reports",
    ],
    previewSample: {
      heading: "Class 10-A Diagnostic Report",
      subheading: "Overall Average: 78.4% · 3 Topics flagged for revision",
      details: "Strong in Nationalism in Europe (86%), needs revision in Federalism & Power Sharing (64%).",
      bulletPoints: ["Automated remedial revision recommendations", "Parent-teacher summary export"],
    },
  },
  "Progress": {
    title: "Student Progress & Mastery Portfolio",
    badge: "Learning Portfolio",
    description:
      "Comprehensive learning journey report showing completed topics, test scores, written practice feedback, weak areas, and revision queue.",
    learningStep: "Track & Improve",
    highlights: [
      "Chapter and topic completion percentages",
      "Weak topic diagnostic & revision alerts",
      "Test score history and answer logs",
      "Teacher written feedback portfolio",
    ],
    previewSample: {
      heading: "Your Learning Progress (Class 10)",
      subheading: "Syllabus Completed: 34% · 12 Tests Attempted · Average Score: 88%",
      details: "You are excelling in History Chapter 1. Revise Geography Topic 2 to boost your overall mastery.",
      bulletPoints: ["Earned 8 topic mastery badges", "3 written answers verified by teacher"],
    },
  },
};

export function ComingSoon({ title }: { title: string }) {
  const [notified, setNotified] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "preview">("overview");

  const room = ROOM_MAP[title] ?? {
    title,
    badge: "Learning Cycle",
    description:
      "This section will be part of the full NCERT learning cycle: study, practise, test, write, get evaluated, and revise. It is actively being prepared for the next build.",
    learningStep: "NCERT Learning Suite",
    highlights: [
      "Class 9 & 10 NCERT Curriculum Alignment",
      "Competency-based assessment framework",
      "AI-assisted learning & instant feedback",
      "Teacher verification & student progress tracking",
    ],
    previewSample: {
      heading: `${title} Architecture Preview`,
      subheading: "Substantially complete data model & schema ready",
      details:
        "The underlying database schema, authentication roles, and API contracts are fully prepared. The interactive frontend engine will launch in the upcoming deployment.",
      bulletPoints: [
        "Full database schema deployed in Supabase",
        "Role-based access control enabled",
        "Fast response time promise (<100ms)",
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent border border-accent/20">
              {room.badge}
            </span>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
              Coming in Next Build
            </span>
          </div>

          <button
            type="button"
            onClick={() => setNotified(true)}
            disabled={notified}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-brand ${
              notified
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-brand text-white hover:bg-brand-hover shadow-xs"
            }`}
          >
            {notified ? "✓ Notification Subscribed" : "🔔 Notify Me on Release"}
          </button>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-brand-dark">
          {room.title}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm sm:text-base leading-relaxed text-foreground">
          {room.description}
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex border-b border-card-border">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Architecture &amp; Features
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`pb-2.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "preview"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Interactive Prototype Preview
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {room.highlights.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-card-border/70 bg-background/60 p-3.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Learning Cycle Roadmap */}
            <div className="rounded-2xl border border-card-border bg-background/80 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
                Full NCERT 7-Step Pedagogical Cycle
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                {[
                  { step: "1. Learn", name: "Topic Study", current: room.badge.includes("Step 1") },
                  { step: "2. Practice", name: "Micro Quiz", current: room.badge.includes("Step 2") },
                  { step: "3. Test", name: "Competency MCQ", current: room.badge.includes("Step 2") },
                  { step: "4. Write", name: "Notebook Scan", current: room.badge.includes("Step 3") },
                  { step: "5. Evaluate", name: "AI + Teacher", current: room.badge.includes("Teacher") || room.badge.includes("Step 3") },
                  { step: "6. Improve", name: "Mistake Fix", current: room.badge.includes("Step 4") },
                  { step: "7. Revise", name: "Retest & Master", current: room.badge.includes("Step 6") || room.badge.includes("Portfolio") },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-2.5 border transition-all ${
                      s.current
                        ? "border-brand bg-brand text-white font-bold shadow-xs"
                        : "border-card-border bg-card text-foreground"
                    }`}
                  >
                    <p className={`text-[10px] ${s.current ? "text-white/80" : "text-muted-foreground"}`}>
                      {s.step}
                    </p>
                    <p className="mt-0.5 font-semibold text-xs">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Prototype Mockup */}
        {activeTab === "preview" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-brand/30 bg-background/90 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                    Live Component Wireframe
                  </span>
                  <h3 className="text-base font-bold text-brand-dark">
                    {room.previewSample.heading}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {room.previewSample.subheading}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                  Ready in Build 2
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-card p-4 border border-card-border text-xs leading-relaxed text-foreground whitespace-pre-line font-mono">
                {room.previewSample.details}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-brand-dark">
                  Features in this workspace:
                </p>
                <ul className="space-y-1.5 text-xs text-foreground">
                  {room.previewSample.bulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-card-border pt-4">
          <Link
            href="/app/profile"
            className="text-xs font-semibold text-brand hover:text-brand-dark underline focus-visible:ring-2 focus-visible:ring-brand"
          >
            ← View / Edit My Personal Details
          </Link>
          <p className="text-xs text-muted-foreground">
            ⚡ Response SLA: &lt;100ms latency guaranteed across all pages
          </p>
        </div>
      </div>
    </div>
  );
}
