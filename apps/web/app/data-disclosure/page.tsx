import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Data Disclosure & AI Safety | Parasnath Learning",
  description:
    "Complete transparency on how student records, handwritten answer scans, and AI learning interactions are securely stored, processed, and safeguarded.",
};

export default function DataDisclosurePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Accountability &amp; Clarity
          </p>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Data Disclosure Statement
          </h1>
          <p className="text-xs text-muted-foreground">
            Clear Breakdown of Data Flows, Storage, and AI Processing
          </p>
        </div>

        <div className="mt-8 space-y-8 rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">1. Why We Provide Full Data Disclosure</h2>
            <p>
              In educational technology, students, parents, and school administrators deserve complete clarity on where their data goes. This disclosure explains exactly what happens when you sign in, take a test, upload a notebook scan, or consult the AI Assistant.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-brand-dark">2. Detailed Data Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-card-border bg-background/80 text-brand-dark">
                    <th className="p-3 font-bold">Data Category</th>
                    <th className="p-3 font-bold">Purpose</th>
                    <th className="p-3 font-bold">Storage Location</th>
                    <th className="p-3 font-bold">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Student Profile (Name, Class, Section, Roll No, School)</td>
                    <td className="p-3 text-muted-foreground">Account identification &amp; class roster management</td>
                    <td className="p-3 text-muted-foreground">Encrypted PostgreSQL DB (Supabase)</td>
                    <td className="p-3 text-muted-foreground">Active academic enrollment period</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Test Scores &amp; Question Responses</td>
                    <td className="p-3 text-muted-foreground">Automatic MCQ grading, diagnostic weak area tracking</td>
                    <td className="p-3 text-muted-foreground">Encrypted database with Row-Level Security</td>
                    <td className="p-3 text-muted-foreground">Retained for progress portfolio &amp; revision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Handwritten Notebook Photos &amp; PDFs</td>
                    <td className="p-3 text-muted-foreground">Teacher verification &amp; AI conceptual answer check</td>
                    <td className="p-3 text-muted-foreground">Encrypted Object Storage (Private Bucket)</td>
                    <td className="p-3 text-muted-foreground">Academic term + 30 days post board exams</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">AI Prompts &amp; Mind-Map Inquiries</td>
                    <td className="p-3 text-muted-foreground">Generating study notes, mind-maps &amp; answers</td>
                    <td className="p-3 text-muted-foreground">Ephemeral processing (Zero training retention)</td>
                    <td className="p-3 text-muted-foreground">Deleted after session completion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">3. AI Safety and Mental Health Safeguards</h2>
            <p>
              Our AI safety layer is programmed to prioritize student wellbeing above all else. If an inquiry indicates emotional distress or self-harm risks:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>The system halts standard response generation and presents an empathetic, immediate support card.</li>
              <li>Verified national toll-free support helplines (Tele-MANAS <code className="text-brand font-bold">14416</code>, KIRAN <code className="text-brand font-bold">1800-599-0019</code>, Childline <code className="text-brand font-bold">1098</code>) are displayed with single-tap calling.</li>
              <li>Data regarding distress triggers is treated with strict confidentiality and never logged for punitive or disciplinary action.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-card-border pt-6">
            <h2 className="text-lg font-bold text-brand-dark">4. Export or Erase Your Data</h2>
            <p className="text-xs text-muted-foreground">
              To request a complete copy of your student portfolio or to erase all historical submissions, submit a request via our feedback portal or email data-privacy@parasnathlearning.org.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/privacy" className="text-xs font-semibold text-brand underline">
                Privacy Policy →
              </Link>
              <Link href="/terms" className="text-xs font-semibold text-brand underline">
                Terms of Service →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
