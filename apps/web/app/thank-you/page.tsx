import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Thank You | Parasnath School Learning",
  description:
    "Thank you for being part of Parasnath Learning. Your learning journey and feedback make education better every day.",
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; message?: string }>;
}) {
  const params = await searchParams;
  const from = params.from || "general";

  let title = "Thank You for Connecting With Us!";
  let subtitle =
    "We have received your message and our academic team is reviewing it.";
  let badge = "Success & Confirmation";

  if (from === "register") {
    title = "Welcome to Parasnath Learning!";
    subtitle =
      "Your account has been created successfully. The next step is completing your personal details and subject choices.";
    badge = "Registration Complete";
  } else if (from === "profile") {
    title = "Personal Details Saved Successfully!";
    subtitle =
      "Your student profile, class, section, and enrolled subjects have been safely updated.";
    badge = "Profile Updated";
  } else if (from === "feedback") {
    title = "Thank You for Your Valuable Feedback!";
    subtitle =
      "Your input directly shapes our next build, helping us tailor NCERT learning and test tools for your school.";
    badge = "Feedback Received";
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="w-full rounded-3xl border border-card-border bg-card p-8 sm:p-12 shadow-sm space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              {badge}
            </span>
            <h1 className="text-2xl font-extrabold text-brand-dark sm:text-3xl">
              {title}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-foreground">
              {subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-background/70 p-4 text-xs text-muted-foreground text-left space-y-1.5">
            <p className="font-bold text-brand-dark">⚡ What happens next?</p>
            <p>
              • If you signed up, you can now enter your dashboard and explore topic previews.
            </p>
            <p>
              • If you submitted feedback, our educators read every response within 24 hours.
            </p>
            <p>
              • You can update your profile, class, or enrolled subjects at any time from your account settings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/app"
              className="w-full sm:w-auto rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand shadow-xs"
            >
              Go to Learning Dashboard
            </Link>
            <Link
              href="/faq"
              className="w-full sm:w-auto rounded-full border border-card-border bg-background px-6 py-2.5 text-xs font-bold text-foreground hover:bg-card focus-visible:ring-2 focus-visible:ring-brand"
            >
              Browse 5 FAQs
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
