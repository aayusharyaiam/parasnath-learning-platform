import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Cookies Policy | Transparent Session Management",
  description:
    "Learn about our minimal, ad-free cookies policy. Parasnath Learning uses strictly essential authentication and preference tokens with zero 3rd-party tracking.",
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Transparency &amp; Storage
          </p>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Cookies Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Strictly Minimal · No Third-Party Tracking · Ad-Free
          </p>
        </div>

        <div className="mt-8 space-y-8 rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">1. What are Cookies and Local Storage?</h2>
            <p>
              Cookies and local storage tokens are small text files placed on your device to enable basic
              platform functionality, such as keeping your student or teacher account logged in across pages
              and remembering your selected class and subjects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">2. Categories of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-card-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-dark">1. Strictly Essential Cookies</span>
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand">
                    Always Required
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Required for secure login authentication (Supabase auth tokens, JWT session cookies) and CSRF protection. Without these, you cannot log into your student account or save test responses.
                </p>
              </div>

              <div className="rounded-2xl border border-card-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-dark">2. Functional &amp; Preference Cookies</span>
                  <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    User Preference
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Stores user interface preferences such as high-contrast color mode, collapsed sidebar state, and in-progress offline test drafts.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950">3. Advertising &amp; 3rd-Party Trackers</span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
                    Strictly Prohibited (0%)
                  </span>
                </div>
                <p className="mt-2 text-xs text-rose-900">
                  Parasnath Learning contains <strong>ZERO</strong> third-party advertising cookies, cross-site trackers, or data-broker pixels.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-dark">3. Managing Your Preferences</h2>
            <p>
              You can clear cookies anytime in your browser settings or adjust consent via the cookie banner at the bottom of the screen. Clearing essential cookies will require you to log back into your account.
            </p>
          </section>

          <section className="space-y-3 border-t border-card-border pt-6">
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs font-semibold text-brand underline">
                Privacy Policy →
              </Link>
              <Link href="/data-disclosure" className="text-xs font-semibold text-brand underline">
                Data Disclosure →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
