"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SlaBadge } from "@/components/sla-badge";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function google() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      });
      if (err) {
        setError(err.message);
        setBusy(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Google sign-in");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6 space-y-6"
      >
        {/* Instant Demo Accounts Card */}
        <div className="rounded-3xl border-2 border-brand/30 bg-emerald-50/70 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="rounded-md bg-brand text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Quick Test
            </span>
            <span className="text-[11px] font-semibold text-emerald-900">
              1-Click Instant Demo
            </span>
          </div>
          <h2 className="text-base font-bold text-brand-dark">
            Instant Demo Account Switcher
          </h2>
          <p className="mt-1 text-xs text-emerald-950 leading-relaxed">
            Test and inspect all roles, navigation bars, and permissions immediately without typing:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <a
              href="/auth/demo?role=admin"
              className="flex items-center justify-between rounded-xl bg-card p-3 border border-emerald-300/80 hover:border-brand hover:shadow-xs transition-all text-xs font-bold text-brand-dark"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <div>
                  <p className="font-bold">Admin Demo Account</p>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    Principal R. K. Parasnath (User Management &amp; Classes)
                  </p>
                </div>
              </div>
              <span className="text-brand text-sm font-extrabold">→</span>
            </a>

            <a
              href="/auth/demo?role=student"
              className="flex items-center justify-between rounded-xl bg-card p-3 border border-emerald-300/80 hover:border-brand hover:shadow-xs transition-all text-xs font-bold text-brand-dark"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <div>
                  <p className="font-bold">Student Demo Account</p>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    Aarav Sharma (Class 10, NCERT Learning &amp; Tests)
                  </p>
                </div>
              </div>
              <span className="text-brand text-sm font-extrabold">→</span>
            </a>

            <a
              href="/auth/demo?role=teacher"
              className="flex items-center justify-between rounded-xl bg-card p-3 border border-emerald-300/80 hover:border-brand hover:shadow-xs transition-all text-xs font-bold text-brand-dark"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🧑🏫</span>
                <div>
                  <p className="font-bold">Teacher Demo Account</p>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    Dr. Sunita Verma (Student Roster, Papers &amp; Grading)
                  </p>
                </div>
              </div>
              <span className="text-brand text-sm font-extrabold">→</span>
            </a>
          </div>
        </div>

        {/* Regular Login Card */}
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
              Production Sign In
            </span>
            <SlaBadge />
          </div>

          <h1 className="text-2xl font-extrabold text-brand-dark">Sign In</h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Use email, phone OTP, or Google authentication.
          </p>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-900"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={google}
              className="flex items-center justify-center gap-2 rounded-full border border-card-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-card-border/30 focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
              <span>{busy ? "Connecting..." : "Continue with Google"}</span>
            </button>

            <div className="relative my-1 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-card-border"></div>
              </div>
              <span className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Or choose method
              </span>
            </div>

            <Link
              href="/login/email"
              className="rounded-full bg-brand px-4 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
            >
              Continue with Email &amp; Password
            </Link>
            <Link
              href="/login/phone"
              className="rounded-full border border-brand/40 bg-card px-4 py-2.5 text-center text-xs font-bold text-brand transition-all hover:border-brand hover:bg-brand-light/30 focus-visible:ring-2 focus-visible:ring-brand"
            >
              Continue with Phone OTP
            </Link>
          </div>

          <div className="mt-6 border-t border-card-border pt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-brand underline hover:text-brand-dark focus-visible:ring-1 focus-visible:ring-brand"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
