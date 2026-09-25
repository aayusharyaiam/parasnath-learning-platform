import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card/70 pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              <span className="font-bold text-brand-dark">Parasnath Learning</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              NCERT-aligned digital learning and assessment platform for Classes 9 &amp; 10.
              Learn, practice, test, write, evaluate, and revise systematically.
            </p>
            <div className="rounded-xl border border-emerald-800/15 bg-emerald-50/70 p-2.5">
              <p className="text-[11px] font-semibold text-emerald-950">
                ⚡ Response Time Promise
              </p>
              <p className="text-[10px] text-emerald-800 mt-0.5">
                Targeting &lt;100ms client interactions &amp; high availability.
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Academic Modules
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>NCERT Class 9 &amp; 10 Syllabus</li>
              <li>Topic-wise Competency Tests</li>
              <li>Handwritten Answer Scan Checking</li>
              <li>AI Mind-maps &amp; Diagram Generation</li>
              <li>Teacher Question Paper Generator</li>
              <li>Student Progress &amp; Weak Area Tracker</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Legal &amp; Trust
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Privacy Policy (DPDP &amp; COPPA)
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Terms &amp; Conditions (T&amp;Cs)
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/data-disclosure"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Data Disclosure &amp; AI Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Frequently Asked Questions (5 FAQs)
                </Link>
              </li>
              <li>
                <Link
                  href="/thank-you"
                  className="text-muted-foreground hover:text-brand transition-colors focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Student Feedback &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Student Wellbeing Helplines
            </p>
            <p className="text-xs text-muted-foreground">
              Toll-free 24/7 mental wellness &amp; academic stress helplines:
            </p>
            <div className="space-y-1.5 text-xs font-medium">
              <p className="text-emerald-900">
                • Tele-MANAS: <a href="tel:14416" className="underline font-bold">14416</a>
              </p>
              <p className="text-blue-900">
                • KIRAN Helpline: <a href="tel:18005990019" className="underline font-bold">1800-599-0019</a>
              </p>
              <p className="text-purple-900">
                • Childline: <a href="tel:1098" className="underline font-bold">1098</a>
              </p>
              <p className="text-rose-900">
                • Vandrevala: <a href="tel:+919999666555" className="underline font-bold">+91 9999 666 555</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-card-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Parasnath Learning. All rights reserved. WCAG AA/AAA Accessible.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/cookies" className="hover:underline">Cookies</Link>
            <Link href="/data-disclosure" className="hover:underline">Data Safety</Link>
            <Link href="/faq" className="hover:underline">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
