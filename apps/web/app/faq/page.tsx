import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FaqAccordion } from "@/components/faq-accordion";
import { SlaBadge } from "@/components/sla-badge";

export const metadata: Metadata = {
  title: "5 Frequently Asked Questions (FAQs) | Parasnath Learning",
  description:
    "Explore essential answers about NCERT Class 9 & 10 coverage, competency tests, handwritten answer grading, AI mind-map generator, and privacy.",
};

export default function FaqPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SlaBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Frequently Asked Questions (5 FAQs)
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-foreground">
            Everything you need to know about the Parasnath School Learning application, our NCERT curriculum, automatic tests, handwritten answer uploads, and student safety.
          </p>
        </div>

        <div className="mt-10">
          <FaqAccordion />
        </div>

        <div className="mt-12 rounded-3xl border border-card-border bg-card p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-brand-dark">
            Have another question or need help?
          </h2>
          <p className="mx-auto max-w-md text-xs text-muted-foreground">
            Our educational support team is here for students and teachers. Send us a quick note and we&apos;ll be happy to assist you.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/thank-you?from=faq"
              className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
            >
              Contact Support / Send Feedback
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-card-border bg-background px-5 py-2 text-xs font-semibold text-foreground hover:bg-card focus-visible:ring-2 focus-visible:ring-brand"
            >
              Go to Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
