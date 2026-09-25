# Parasnath Learning Platform - Project Progress & Architecture Context

> **AI Context Handover Note:**  
> This file preserves the complete architectural decisions, completed features, database schemas, and implementation roadmap. When resuming in a new session or after a context reset, read this file first for full project continuity.

---

## 📌 Project Overview & Stack Summary

* **Monorepo Manager:** `pnpm` (v9.15.4) workspaces (`apps/*`, `packages/*`).
* **Web Frontend:** Next.js 16.3.6 (Turbopack, React 19.2.8, Tailwind CSS v4, `@supabase/ssr`).
* **Mobile Frontend:** React Native (0.86.3) with Expo (SDK 57.0.25).
* **Shared Logic:** `@parasnath/shared` (TypeScript definitions, E.164 phone sanitizers, role navigation).
* **Backend Database:** Supabase (PostgreSQL 15+ with Row-Level Security, Auth, and Storage Buckets).
* **Target Users:** School Students (Class 9 & 10), Teachers, and Administrators.

---

## ✅ Phase 1: Completed Foundations & Compliance

### 1. Multi-Role Authentication & Security
* [x] Email & Password Authentication (`/login/email`, `/register`).
* [x] Phone SMS OTP Authentication with Indian 10-digit regex (`/login/phone`).
* [x] Google OAuth client integration (`/login`, `/auth/callback`).
* [x] **1-Click Instant Demo Login Switcher** (`/auth/demo?role=admin|student|teacher`) on `/login`.
* [x] Multi-Provider Identity Linking (`/app/profile`): Allows phone-registered users to link verified emails, passwords, and Google OAuth to the same profile.
* [x] Edge Route Guard & Middleware (`apps/web/proxy.ts`): Intercepts unauthenticated routes, guards role-restricted areas (`/app/admin/*`, `/app/students`), and redirects completed profiles.

### 2. Mandatory Mandates & UX Safeguards (All 16 Implemented)
* [x] **Responsive Time SLA Promise:** Dedicated `<100ms` UI latency badge on header, footer, and mobile workspace.
* [x] **Branded Favicon & Tab Titles:** Custom SVG emblem (`/favicon.svg`) with `%s | Parasnath Learning` title template.
* [x] **Unique Page Titles & SEO Meta:** Dedicated semantic titles and OpenGraph descriptions across all 33 routes.
* [x] **Privacy Policy (`/privacy`):** Comprehensive DPDP Act & COPPA minor safety and data confidentiality.
* [x] **Terms & Conditions (`/terms`):** Academic honor code and school usage terms.
* [x] **Cookies Policy (`/cookies`):** Zero-ad tracking disclosure and session token breakdown.
* [x] **Data Disclosure Statement (`/data-disclosure`):** Inventory of student records, scan uploads, and ephemeral AI prompts.
* [x] **Interactive Cookie Consent Banner:** Consent bar with localStorage sync.
* [x] **5 FAQs (Interactive Accordion):** Dedicated `/faq` page and interactive accordion covering NCERT Class 9 & 10 syllabus, competency tests, notebook scanning, AI mind-maps, and privacy.
* [x] **Form Validation & Keyboard Accessibility:**
  * Client and server-side validation (10-digit Indian phone regex, email pattern, password length).
  * High-contrast `focus-visible` rings, `aria-invalid`, `aria-describedby`, and `SkipToContent` link.
* [x] **Thank You Page (`/thank-you`):** Context-aware confirmation screen for registrations, profile updates, and support feedback.
* [x] **Component Skeletons & Shimmer Loaders:** Reusable `Skeleton`, `CardSkeleton`, `ProfileSkeleton`, `NavSkeleton`, and full-page loading states (`/loading.tsx`).
* [x] **Self-Harm Response & Crisis Support:** Accessible 24/7 mental wellness modal with verified toll-free helplines (Tele-MANAS `14416`, KIRAN `1800-599-0019`, Childline `1098`, Vandrevala `+91 9999 666 555`).
* [x] **WCAG AA/AAA Color Contrast:** Verified deep forest palette (`#165b46`, `#0d382b` on `#fbf9f4`, contrast > 11:1).
* [x] **Responsive Design:** Fluid mobile-first UI with responsive header, collapsible sidebar, and touch-friendly controls.
* [x] **CI/CD Pipelines:** GitHub Actions workflows (`.github/workflows/ci.yml` and `deploy.yml`) for automated linting, builds, and type-checks.
* [x] **Vercel Monorepo Deployment:** Configured for `apps/web` with root workspace resolution.

---

## ✅ Phase 2: Completed Learning & Content Engines

### 1. Teacher Question Paper Generator Studio (`/app/papers`)
* [x] **Automated Blueprint Builder:** Assemble custom examination papers by choosing Class (9/10), Subject, Chapters, Target Marks (20, 40, or 80 Marks), and Time Allowed (1 to 3 Hours).
* [x] **Structured Sectional Layout:** Automatically organizes Section A (MCQs / Assertion-Reason), Section C (Short Answer 3M), and Section D (Long Answer 5M).
* [x] **Printable PDF Format:** Prepares formal school exam paper layout with school header, instructions, and marks breakdown.
* [x] **Google Docs Export:** Formatted with tab stops and tables ready to copy/paste directly into Google Docs.
* [x] **Confidential Marking Scheme:** Generates matching Answer Key and CBSE marking rubrics for evaluators.

### 2. Teacher Notes & Study Material Studio (`/app/notes`)
* [x] **Teacher Uploader (`NotesUploader`):** Allows faculty to select `Class` → `Subject` → `Chapter` → upload PDF/handouts, write descriptions, and toggle ⭐ *"Board High-Yield Topic"*.
* [x] **Embedded In-App PDF Viewer (`EmbeddedPdfViewer`):** Secure modal viewer with zoom controls (`75%` to `150%`), fullscreen layout, and in-app viewing without external downloads.
* [x] **Subject & Chapter Filtering:** Instant filtering across Social Science, Science, Mathematics, English, and Hindi.

### 3. Teacher Question Bank Studio (`/app/questions`)
* [x] **Interactive Question Creator (`QuestionCreator`):**
  * Competency MCQs with dynamic choices (A, B, C, D) and radio button correct key selection.
  * Assertion–Reason question templates with CBSE standard reason choices.
  * Statement 1 & 2 question templates.
  * Short (3M) & Long (5M) subjective questions with model scoring criteria.
* [x] **Question Explorer (`QuestionBankExplorer`):** Expandable cards with one-click *"Reveal Answer & CBSE Marking Scheme"*.

### 4. Curated Previous-Year Questions (PYQ) & Test Suite (`/app/tests`)
* [x] **Pre-Loaded CBSE Board Exam Questions (2020–2024):** Verified questions across Class 10 History, Science, and Mathematics.
* [x] **Dual Mode Learning Suite:**
  * **Mode 1 — PYQ Explorer:** Filter by Exam Year (`2024`, `2023`, `2022`, `2020`), Subject, and Chapter.
  * **Mode 2 — Timed Practice Quiz:** Live micro-test engine with question navigation pills, auto-scoring percentage, and question-by-question solution breakdowns.

### 5. Video Lecture Studio (`/app/videos`)
* [x] **Direct MP4/WebM Video Uploads & YouTube (Unlisted) / Vimeo Embeds.**
* [x] **Interactive Video Catalog:** 16:9 embedded player with timestamped outlines and attached study notes.

### 6. NCERT Chapter Study Room (`/app/study`)
* [x] Interactive chapter browser connecting micro-topics, teacher handouts, PYQ test shortcuts, and video masterclasses in one view.

### 7. React Native Mobile Application Sync (`apps/mobile/App.tsx`)
* [x] Native mobile screens for Question Papers (`papers`), Notes (`notes`), PYQ Explorer & Practice (`tests`), Video Lectures (`videos`), and Question Bank (`questions`).

---

## 📋 Phase 3: Upcoming Modules (Roadmap)

* [ ] **Student Written Practice & Notebook Scan Upload (`/app/written`):**
  * Subjective 3-mark & 5-mark prompts where students write in their physical notebook, snap a photo or scan PDF, and upload.
* [ ] **Teacher Verification Red-Pen Marking Hub (`/app/checking`):**
  * Digital red-pen markup tools, error tagging, and score recording dashboard for teachers.
* [ ] **AI Educational Assistant & Mind-Map Studio (`/app/ai`):**
  * Syllabus-aligned concept simplifier (Plain English & Hindi).
  * Interactive SVG/PDF Mind-Map & Flowchart synthesizer with student wellbeing guardrails.
* [ ] **Student Progress & Diagnostic Portfolio (`/app/progress`):**
  * Chapter mastery percentages, test accuracy logs, and weak topic alerts.

---

## 🗄️ Database Schemas & Storage Design

### Schema Migration 1 (`supabase/migrations/0001_init.sql`):
* `classes`: `id`, `name`, `grade`.
* `subjects`: `id`, `name`.
* `profiles`: `id`, `email`, `phone`, `full_name`, `role`, `class_id`, `section`, `roll_number`, `school_name`.
* `profile_subjects`: `profile_id`, `subject_id`.
* `chapters`: `id`, `class_id`, `subject_id`, `title`, `sort_order`.
* `topics`: `id`, `chapter_id`, `title`, `sort_order`.

### Schema Migration 2 (`supabase/migrations/0002_content_and_pyqs.sql`):
* `materials`: `id`, `class_id`, `subject_id`, `chapter_id`, `topic_id`, `title`, `description`, `file_url`, `file_type`, `file_size_bytes`, `is_important`, `created_by`.
* `questions`: `id`, `class_id`, `subject_id`, `chapter_id`, `topic_id`, `question_text`, `question_type`, `options` (jsonb), `correct_answer`, `explanation`, `marks`, `difficulty`, `is_pyq`, `pyq_year`, `is_important`, `diagram_url`, `created_by`.
* `video_lectures`: `id`, `class_id`, `subject_id`, `chapter_id`, `topic_id`, `title`, `description`, `video_url`, `provider`, `duration_seconds`, `attached_notes_url`, `created_by`.

### Schema Migration 3 (`supabase/migrations/0003_question_papers.sql`):
* `question_papers`: `id`, `title`, `school_name`, `class_id`, `subject_id`, `time_allowed_minutes`, `max_marks`, `general_instructions` (jsonb), `sections` (jsonb), `created_by`, `created_at`.

---

## 🔐 Credentials & Health Check

* **Supabase Configuration:** Stored securely in `.env.local` and `apps/mobile/.env` (ignored from Git).
* **Demo Passwords:** `Parasnath@2026` for standard test roles:
  * `admin@parasnath.edu` (Admin)
  * `student@parasnath.edu` (Student)
  * `teacher@parasnath.edu` (Teacher)
* **Health Check Script:** `supabase/health_check.sql`.
