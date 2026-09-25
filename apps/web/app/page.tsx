import Link from "next/link";
import { getProfile, getSessionUser } from "@/lib/data";
import { isProfileComplete } from "@parasnath/shared";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SlaBadge } from "@/components/sla-badge";
import { FaqAccordion } from "@/components/faq-accordion";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) {
    const profile = await getProfile();
    if (isProfileComplete(profile)) redirect("/app");
    redirect("/complete-profile");
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="flex justify-center mb-4">
              <SlaBadge />
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              Official NCERT Syllabus · Classes 9 &amp; 10
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Learn, Practise, and Excel —{" "}
              <span className="text-brand">One Topic at a Time.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
              A comprehensive digital learning and assessment platform for school students and teachers.
              Master NCERT chapters, take competency micro-tests, upload notebook written answers, and unlock AI visual mind-maps.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-hover hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand"
              >
                Sign In to Your Account
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-brand/30 bg-card px-7 py-3 text-sm font-bold text-brand-dark transition-all hover:border-brand hover:bg-brand-light/30 focus-visible:ring-2 focus-visible:ring-brand"
              >
                Create Student / Teacher Account
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-brand font-bold">✓</span> Social Science, Science &amp; Math
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-brand font-bold">✓</span> Dual Teacher + AI Evaluation
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-brand font-bold">✓</span> No Ads · 100% Student Safe
              </span>
            </div>
          </div>
        </section>

        {/* 7-Step Learning Cycle Section */}
        <section className="border-y border-card-border bg-card/60 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Pedagogical Framework
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
                The Complete NCERT Learning Cycle
              </h2>
              <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground">
                Engineered to ensure students deeply understand every single concept before progressing to the next.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Learn the Topic",
                  desc: "Study bite-sized NCERT micro-topics with colorful illustrations, historical maps, and key formulas.",
                },
                {
                  num: "02",
                  title: "Topic Micro-Test",
                  desc: "Attempt competency-based MCQs, Assertion-Reason, and Previous Board Exam questions with instant scores.",
                },
                {
                  num: "03",
                  title: "Write & Upload",
                  desc: "Write 3-mark and 5-mark answers in your physical notebook, snap a photo or scan PDF to upload.",
                },
                {
                  num: "04",
                  title: "Evaluate & Master",
                  desc: "Receive teacher corrections and AI conceptual analysis, fix weak spots, and retake for 100% mastery.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="relative rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-all hover:border-brand/40"
                >
                  <span className="text-2xl font-extrabold text-brand/25">
                    {step.num}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-brand-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Platform Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
                Everything for School Students &amp; Teachers
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand font-bold text-lg">
                  📖
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  NCERT Chapter Hierarchy
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Class → Subject → Chapter → Sub-topic structure. Study material, maps, and illustrations formatted cleanly for mobile and desktop screens.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-bold text-lg">
                  🎯
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  Competency-Based Tests
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Case-based MCQs, situation questions, Assertion-Reason, Statement 1/2 tests, and tagged previous-year board questions.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-bold text-lg">
                  ✍️
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  Handwritten Notebook Scans
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Students write answers in their notebooks, upload photos or PDF scans. Teachers evaluate, mark errors, and give actionable feedback.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800 font-bold text-lg">
                  🤖
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  AI Mind-Maps &amp; Assistant
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Ask the AI to simplify difficult concepts, generate visual flowcharts, create timelines, and provide instant conceptual evaluations.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-800 font-bold text-lg">
                  📝
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  Teacher Paper Generator
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Custom blueprints with marks allocation, difficulty mix, Google Docs import/export, and instant PDF question paper distribution.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-800 font-bold text-lg">
                  📊
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-dark">
                  Diagnostic Progress Reports
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Clear breakdowns of mastered topics, weak areas, test accuracy trends, and teacher feedback portfolios.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 FAQs Section on Home Page */}
        <section className="border-t border-card-border bg-card/40 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
                Frequently Asked Questions (5 FAQs)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Direct answers regarding the syllabus, testing, handwriting upload, and security.
              </p>
            </div>

            <FaqAccordion />

            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="text-xs font-bold text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand"
              >
                View full FAQ portal &amp; support documentation →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
