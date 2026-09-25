"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getConsentSnapshot() {
  return localStorage.getItem("parasnath_cookie_consent");
}

function getServerSnapshot() {
  return "accepted"; // Default on server to avoid layout shift
}

export function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribe,
    getConsentSnapshot,
    getServerSnapshot,
  );

  function acceptAll() {
    localStorage.setItem("parasnath_cookie_consent", "all");
    window.dispatchEvent(new Event("storage"));
  }

  function acceptEssential() {
    localStorage.setItem("parasnath_cookie_consent", "essential");
    window.dispatchEvent(new Event("storage"));
  }

  if (consent) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-4xl rounded-2xl border border-card-border bg-card p-4 shadow-xl sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label="Cookie">
            🍪
          </span>
          <p className="text-sm font-semibold text-brand-dark">
            Privacy &amp; Cookie Preferences
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          We use strictly essential session tokens to keep you logged in and save your test progress. No advertising or 3rd-party tracking cookies are used. Read our{" "}
          <Link href="/cookies" className="text-brand underline hover:text-brand-dark">
            Cookies Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand underline hover:text-brand-dark">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap items-center gap-2 sm:mt-0">
        <button
          type="button"
          onClick={acceptEssential}
          className="rounded-full border border-card-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-brand"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={acceptAll}
          className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
}
