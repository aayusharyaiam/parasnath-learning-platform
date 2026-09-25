import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Parasnath School Learning",
  description:
    "Review the academic honor code, teacher content guidelines, and platform terms of service for Parasnath Learning digital school platform.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Legal Agreement
          </p>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Terms &amp; Conditions (T&amp;Cs)
          </h1>
          <p className="text-xs text-muted-foreground">
            Effective Date: September 2026 · Academic Year 2026–2027
          </p>
        </div>

        <div className="mt-8 space-y-8 rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing the Parasnath Learning platform (web and mobile application),
              you agree to comply with and be bound by these Terms &amp; Conditions, our Privacy Policy,
              and our Academic Honor Code. If you are under the age of 18, you confirm that your parent or
              legal school guardian has authorized your use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">2. Academic Honor Code &amp; Student Conduct</h2>
            <p>
              Parasnath Learning is dedicated to genuine student learning, revision, and academic growth:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Honest Submissions:</strong> Uploaded handwritten answer sheets must represent the student&apos;s own authentic work.</li>
              <li><strong className="text-foreground">Respectful Interaction:</strong> Any notes, doubt queries, or communications between students and teachers must maintain respectful, educational standards.</li>
              <li><strong className="text-foreground">Prohibited Behavior:</strong> Harassment, sharing vulgar content, attempting to bypass test timers or exploiting platform vulnerabilities will lead to account suspension.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">3. Teacher &amp; Educator Responsibilities</h2>
            <p>
              Educators utilizing Parasnath Learning to upload question papers, video lectures, and study notes agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Uploaded study materials and question banks comply with copyright laws and NCERT educational guidelines.</li>
              <li>Teacher verification of student written answers remains the definitive academic grading standard.</li>
              <li>Student performance diagnostics will be maintained in strict educational confidentiality.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">4. AI Assistant &amp; Generated Material</h2>
            <p>
              The AI Learning Assistant is provided as an educational supplement to explain concepts, generate
              mind-maps, and provide pre-assessment feedback. While we strive for absolute factual accuracy
              matching the NCERT curriculum, official textbook materials and teacher guidance remain the
              ultimate authority.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">5. Service Level &amp; Responsive Time Commitment</h2>
            <p>
              We strive to deliver sub-100ms interface response times and 99.9% platform availability.
              Occasional maintenance windows for syllabus updates will be scheduled during non-school hours
              with prior notice.
            </p>
          </section>

          <section className="space-y-3 border-t border-card-border pt-6">
            <h2 className="text-lg font-bold text-brand-dark">6. Updates to Terms</h2>
            <p className="text-xs text-muted-foreground">
              We may revise these Terms as new features (such as live doubt solving and adaptive tests) are introduced. Continued use of the platform constitutes agreement to the updated terms.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/privacy" className="text-xs font-semibold text-brand underline">
                Privacy Policy →
              </Link>
              <Link href="/cookies" className="text-xs font-semibold text-brand underline">
                Cookies Policy →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
