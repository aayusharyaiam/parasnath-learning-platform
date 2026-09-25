import Link from "next/link";
import { CrisisHelplineModal } from "./crisis-helpline-modal";
import { SlaBadge } from "./sla-badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-card-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-brand-dark focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Parasnath Learning Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block text-base text-brand-dark font-extrabold">Parasnath</span>
              <span className="block text-[10px] tracking-wider uppercase text-muted-foreground font-semibold">
                School Learning
              </span>
            </div>
          </Link>
          <div className="hidden lg:block">
            <SlaBadge />
          </div>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block">
            <CrisisHelplineModal />
          </div>
          <Link
            href="/faq"
            className="text-xs font-semibold text-foreground hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
          >
            5 FAQs
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-card-border bg-card px-4 py-1.5 text-xs font-semibold text-brand-dark transition-all hover:border-brand focus-visible:ring-2 focus-visible:ring-brand"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
          >
            Register
          </Link>
        </nav>
      </div>
      <div className="border-t border-card-border/50 bg-background/50 px-4 py-1.5 lg:hidden flex justify-between items-center text-xs">
        <SlaBadge />
        <div className="sm:hidden">
          <CrisisHelplineModal />
        </div>
      </div>
    </header>
  );
}
