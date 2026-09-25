"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate() {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match. Please re-enter.");
      valid = false;
    }

    return valid;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setServerError(null);
    setMessage(null);

    const supabase = createClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setBusy(false);

    if (err) {
      setServerError(err.message);
      return;
    }

    if (data.session) {
      router.replace("/thank-you?from=register");
    } else {
      setMessage(
        "Account created! If email confirmation is enabled, please check your inbox to activate your account. Otherwise, sign in directly.",
      );
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
      >
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Student &amp; Teacher Registration
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-dark">
            Create Account
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Create your account to access NCERT Class 9 &amp; 10 learning materials, tests, and AI tools.
          </p>

          {serverError ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-900"
            >
              {serverError}
            </div>
          ) : null}

          {message ? (
            <div
              role="status"
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-900"
            >
              {message}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div className="space-y-1">
              <label
                htmlFor="reg-email"
                className="text-xs font-bold text-foreground"
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "reg-email-err" : undefined}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                  emailError ? "border-red-500 bg-red-50/30" : "border-card-border"
                }`}
                placeholder="student@school.edu"
              />
              {emailError && (
                <p id="reg-email-err" role="alert" className="text-[11px] font-medium text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="reg-password"
                className="text-xs font-bold text-foreground"
              >
                Password (min 6 characters)
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "reg-pw-err" : undefined}
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
                <p id="reg-pw-err" role="alert" className="text-[11px] font-medium text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="reg-confirm"
                className="text-xs font-bold text-foreground"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={Boolean(confirmError)}
                aria-describedby={confirmError ? "reg-conf-err" : undefined}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError(null);
                }}
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                  confirmError ? "border-red-500 bg-red-50/30" : "border-card-border"
                }`}
                placeholder="••••••••"
              />
              {confirmError && (
                <p id="reg-conf-err" role="alert" className="text-[11px] font-medium text-red-600">
                  {confirmError}
                </p>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-brand underline hover:text-brand-dark">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand underline hover:text-brand-dark">
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
            >
              {busy ? "Creating account..." : "Create Account & Continue"}
            </button>
          </form>

          <div className="mt-6 border-t border-card-border pt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-brand underline hover:text-brand-dark"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
