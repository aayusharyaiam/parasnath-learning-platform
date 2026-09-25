"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function EmailLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate() {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address (e.g. name@school.edu).");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      valid = false;
    }

    return valid;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setServerError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);

    if (err) {
      setServerError(err.message);
      return;
    }

    router.replace("/app");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
      >
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark mb-4 focus-visible:ring-1 focus-visible:ring-brand"
          >
            ← Back to sign-in options
          </Link>

          <h1 className="text-2xl font-extrabold text-brand-dark">Email Sign In</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter your registered email address and password.
          </p>

          {serverError ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-900"
            >
              {serverError}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="text-xs font-bold text-foreground"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-err" : undefined}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                  emailError ? "border-red-500 bg-red-50/30" : "border-card-border"
                }`}
                placeholder="student@parasnath.edu"
              />
              {emailError && (
                <p id="email-err" role="alert" className="text-[11px] font-medium text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="login-password"
                className="text-xs font-bold text-foreground"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "pw-err" : undefined}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                  passwordError ? "border-red-500 bg-red-50/30" : "border-card-border"
                }`}
                placeholder="••••••••"
              />
              {passwordError && (
                <p id="pw-err" role="alert" className="text-[11px] font-medium text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in to Learning"}
            </button>
          </form>

          <div className="mt-6 border-t border-card-border pt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-brand underline hover:text-brand-dark"
            >
              Register here
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
