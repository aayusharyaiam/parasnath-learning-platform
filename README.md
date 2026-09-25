# Parasnath School Learning Platform

A full-featured digital school learning and assessment platform engineered for **NCERT Classes 9 & 10** (Social Science, Science, Mathematics, English, and Hindi) with architecture extensible across all K-12 subjects.

---

## 🏛️ Monorepo Architecture

This repository is organized as a unified pnpm monorepo:

* **`apps/web`:** Next.js 16 (React 19, Turbopack, Tailwind CSS v4, Server/Client components, SSR Supabase auth, Edge Route Guard proxy).
* **`apps/mobile`:** React Native / Expo application (Cross-platform Android & iOS with role-based navigation and offline caching).
* **`packages/shared`:** Shared TypeScript types, validation helpers (`toE164India`, `isProfileComplete`), and navigation structures.
* **`supabase/`:** PostgreSQL schemas, Row-Level Security (RLS) policies, trigger functions, and demo account seed scripts.
* **`.github/workflows/`:** Automated CI/CD pipelines (`ci.yml` and `deploy.yml`) for automated linting, builds, and type-checks.

---

## 🚀 Key Modules & Engines Implemented

### 1. Teacher Question Paper Generator Studio (`/app/papers`)
* **Automated Blueprint Builder:** Assemble custom examination papers by choosing Class (9/10), Subject, Chapters, Target Marks (20, 40, or 80 Marks), and Time Allowed (1 to 3 Hours).
* **Structured Sectional Layout:** Automatically organizes Section A (MCQs / Assertion-Reason), Section C (Short Answer 3M), and Section D (Long Answer 5M).
* **One-Click Distribution & Export:**
  * 🖨️ **Printable PDF Format:** Prepares formal school exam paper layout with school header, instructions, and marks breakdown.
  * 📄 **Google Docs Export:** Formatted with tab stops and tables ready to copy/paste directly into Google Docs.
  * 🔑 **Confidential Marking Scheme:** Generates matching Answer Key and CBSE marking rubrics for evaluators.

### 2. Teacher Content & Material Studio (`/app/notes`)
* **Teacher Uploader:** Upload PDF revision notes, formula sheets, and chapter summaries tagged by `Class → Subject → Chapter → (Optional Topic)`.
* **Important Topic Tagging:** 1-click ⭐ *"Board Exam High-Yield"* flag.
* **Embedded In-App PDF Viewer:** Secure modal reader with zoom controls and in-app viewing without external downloads.

### 3. Teacher Question Bank Studio (`/app/questions`)
* **Interactive Question Creator:**
  * Competency-based MCQs with dynamic choices (A, B, C, D) and radio button correct key selection.
  * Assertion–Reason question templates with CBSE standard reason choices.
  * Statement 1 & 2 question templates.
  * Short (3M) & Long (5M) subjective questions with model scoring criteria.
* **Question Explorer:** Expandable cards with one-click *"Reveal Answer & CBSE Marking Scheme"*.

### 4. Curated Previous-Year Questions (PYQ) & Test Suite (`/app/tests`)
* **Pre-Loaded CBSE Board Exam Questions (2020–2024):** Verified questions across Class 10 History, Science, and Mathematics.
* **Dual Mode Learning Suite:**
  * **Mode 1 — PYQ Explorer:** Filter by Exam Year (`2024`, `2023`, `2022`, `2020`), Subject, and Chapter.
  * **Mode 2 — Timed Practice Quiz:** Live micro-test engine with question navigation pills, auto-scoring percentage, and question-by-question solution breakdowns.

### 5. Video Lecture Studio (`/app/videos`)
* **Direct MP4/WebM Video Uploads & YouTube (Unlisted) / Vimeo Embeds.**
* **Interactive Video Catalog:** 16:9 embedded player with timestamped outlines and attached study notes.

### 6. Multi-Role Authentication & Access Control
* Unified login for **Students**, **Teachers**, and **Administrators**.
* Multi-provider auth: Email & Password, Phone SMS OTP, and Google OAuth.
* **1-Click Instant Demo Login** on `/login` to test all roles immediately without setup.

### 7. Responsive Time SLA Promise & Accessibility
* Dedicated `<100ms` UI latency guarantee with edge-cached assets.
* WCAG AA/AAA verified high-contrast palette (`#165b46` on `#fbf9f4`, contrast > 11:1).
* Keyboard-friendly forms with focus rings, `aria-describedby`, and `SkipToContent` navigation.
* Animated skeleton loading screens (`/loading.tsx`).

### 8. Legal, Privacy & Student Crisis Support
* Comprehensive Privacy Policy (`/privacy`), Terms & Conditions (`/terms`), Cookies Policy (`/cookies`), and Data Disclosure Statement (`/data-disclosure`).
* 5 Interactive FAQs (`/faq`).
* Global emergency mental health modal with verified toll-free helplines: **Tele-MANAS (14416)**, **KIRAN (1800-599-0019)**, **Childline (1098)**, and **Vandrevala (+91 9999 666 555)**.

---

## 🔑 Pre-Configured Demo Accounts

| Role | Name | Email | Default Password | Access & Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Admin** | `Principal R. K. Parasnath` | `admin@parasnath.edu` | `Parasnath@2026` | User Access Manager, Classes & Subjects config, syllabus controls. |
| 🎓 **Student** | `Aarav Sharma` | `student@parasnath.edu` | `Parasnath@2026` | NCERT Class 10 Learning Rooms, Competency Tests, Notebook Upload, AI Mind-Maps. |
| 🧑🏫 **Teacher** | `Dr. Sunita Verma` | `teacher@parasnath.edu` | `Parasnath@2026` | Student Roster, Question Bank, Notes Studio, Question Paper Generator, Answer Verification. |

---

## 🛠️ Environment Configuration

Copy `.env.example` to your local environment files:

### Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## 💻 Running the Project Locally

### 1. Run Next.js Web App:
```powershell
pnpm dev:web
```
Open **`http://localhost:3000`** in your browser.

### 2. Run React Native / Expo Mobile App:
```powershell
pnpm dev:mobile
```
* Press **`w`** for browser simulation.
* Scan the terminal QR code with **Expo Go** on Android/iOS.

### 3. Build & Typecheck:
```powershell
pnpm build:web
pnpm --filter mobile exec tsc --noEmit
```

---

## 🚢 Deployment (Vercel)

1. Connect the GitHub repository in Vercel.
2. Set **Root Directory:** `apps/web`.
3. Add your Supabase Environment Variables in Vercel Project Settings.
4. Automatic deployment runs on every `git push origin main`.
