import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Student Data Protection & Safety",
  description:
    "Parasnath Learning adheres strictly to the India Digital Personal Data Protection (DPDP) Act and COPPA standards for student privacy, encrypted notes, and test security.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Student Safety &amp; Trust
          </p>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Last updated: September 2026 · Compliant with India DPDP Act &amp; COPPA
          </p>
        </div>

        <div className="mt-8 space-y-8 rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">1. Our Commitment to Student Privacy</h2>
            <p>
              Parasnath Learning (&quot;we&quot;, &quot;our&quot;, &quot;the Platform&quot;) is dedicated to providing a secure,
              distraction-free digital learning environment for school students (Classes 9, 10, and beyond),
              teachers, and educators. We believe that school student data must receive the highest
              standard of confidentiality and protection.
            </p>
            <p className="rounded-xl bg-brand-light p-3 font-medium text-brand-dark text-xs">
              🔒 Zero-Ad Guarantee: We never display commercial advertisements, sell student personal information,
              or profile minors for third-party commercial purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">2. Information We Collect</h2>
            <p>We collect only the minimum necessary information to deliver curriculum-aligned learning:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Account Information:</strong> Name, student phone number (for OTP authentication), email address, class/grade (e.g. Class 9 or 10), section, roll number, and school name.</li>
              <li><strong className="text-foreground">Academic Activity:</strong> Topic study progress, completed MCQ tests, accuracy scores, time spent per topic, and revision logs.</li>
              <li><strong className="text-foreground">Uploaded Handwritten Work:</strong> Photographs or PDF scans of written answers uploaded by students for teacher grading and AI preliminary evaluation.</li>
              <li><strong className="text-foreground">Technical Logs:</strong> Session tokens, device type, and latency metrics solely used to maintain our &lt;100ms response time guarantee.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">3. How We Use Academic Data</h2>
            <p>The collected data is used exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Deliver NCERT chapter materials, tests, and individualized student performance reports.</li>
              <li>Allow verified teachers to review and grade written notebook answer submissions.</li>
              <li>Provide personalized AI explanations, mind-maps, and revision suggestions.</li>
              <li>Identify student weak areas to recommend remedial practice before board examinations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">4. AI Processing and Safety Guardrails</h2>
            <p>
              When a student asks the AI Assistant for study explanations or mind-maps:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Prompts are processed strictly within safe educational parameters aligned with NCERT standards.</li>
              <li>AI models do not use student identifiable personal data for training public foundation models.</li>
              <li>Automated safety filters detect distress, bullying, or self-harm keywords and immediately surface verified toll-free helpline resources (Tele-MANAS, KIRAN, Childline).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">5. Data Security and Access Controls</h2>
            <p>
              All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We enforce PostgreSQL
              Row-Level Security (RLS) ensuring that a student can only view their own records, while teachers
              can only view students registered in their assigned school classes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">6. Rights of Parents and Students</h2>
            <p>
              Students and their legal guardians have the right to inspect, update, or request the deletion
              of their account details at any time by contacting our student privacy officer or using the
              profile management settings in the app.
            </p>
          </section>

          <section className="space-y-3 border-t border-card-border pt-6">
            <h2 className="text-lg font-bold text-brand-dark">7. Contact Privacy Team</h2>
            <p className="text-xs text-muted-foreground">
              For any questions regarding this Privacy Policy, please reach out to:
              <br />
              <strong className="text-foreground">Email:</strong> privacy@parasnathlearning.org · <strong className="text-foreground">School Portal:</strong> Support &amp; Feedback Form
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/terms" className="text-xs font-semibold text-brand underline">
                View Terms &amp; Conditions →
              </Link>
              <Link href="/data-disclosure" className="text-xs font-semibold text-brand underline">
                View Data Disclosure →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
