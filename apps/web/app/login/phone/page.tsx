"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toE164India } from "@parasnath/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PhoneLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validatePhone() {
    setPhoneError(null);
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned || cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return false;
    }
    return true;
  }

  function validateOtp() {
    setOtpError(null);
    if (!otp.trim() || otp.trim().length < 4) {
      setOtpError("Please enter the verification code sent to your phone.");
      return false;
    }
    return true;
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePhone()) return;

    setBusy(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: toE164India(phone),
      });
      setBusy(false);

      if (err) {
        setServerError(err.message);
        return;
      }
      setSent(true);
    } catch (e) {
      setBusy(false);
      setServerError(e instanceof Error ? e.message : "Failed to send OTP.");
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!validateOtp()) return;

    setBusy(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.verifyOtp({
        phone: toE164India(phone),
        token: otp.trim(),
        type: "sms",
      });
      setBusy(false);

      if (err) {
        setServerError(err.message);
        return;
      }

      router.replace("/app");
      router.refresh();
    } catch (e) {
      setBusy(false);
      setServerError(e instanceof Error ? e.message : "Verification failed.");
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
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark mb-4 focus-visible:ring-1 focus-visible:ring-brand"
          >
            ← Back to sign-in options
          </Link>

          <h1 className="text-2xl font-extrabold text-brand-dark">Phone OTP Sign In</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Passwordless authentication with 10-digit Indian mobile number.
          </p>

          {serverError ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-900"
            >
              {serverError}
            </div>
          ) : null}

          {!sent ? (
            <form onSubmit={sendOtp} className="mt-6 flex flex-col gap-4" noValidate>
              <div className="space-y-1">
                <label
                  htmlFor="login-phone"
                  className="text-xs font-bold text-foreground"
                >
                  Mobile Number (India +91)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-muted-foreground">
                    +91
                  </span>
                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    aria-required="true"
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? "phone-err" : undefined}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      if (phoneError) setPhoneError(null);
                    }}
                    className={`w-full rounded-xl border bg-background pl-12 pr-3.5 py-2.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                      phoneError ? "border-red-500 bg-red-50/30" : "border-card-border"
                    }`}
                  />
                </div>
                {phoneError && (
                  <p id="phone-err" role="alert" className="text-[11px] font-medium text-red-600">
                    {phoneError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
              >
                {busy ? "Sending SMS OTP..." : "Send SMS OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="mt-6 flex flex-col gap-4" noValidate>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                OTP sent to <strong>+91 {phone}</strong>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="login-otp"
                  className="text-xs font-bold text-foreground"
                >
                  Verification Code (OTP)
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="6-digit code"
                  aria-required="true"
                  aria-invalid={Boolean(otpError)}
                  aria-describedby={otpError ? "otp-err" : undefined}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (otpError) setOtpError(null);
                  }}
                  className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-center text-lg tracking-widest font-mono text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
                    otpError ? "border-red-500 bg-red-50/30" : "border-card-border"
                  }`}
                />
                {otpError && (
                  <p id="otp-err" role="alert" className="text-[11px] font-medium text-red-600">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
              >
                {busy ? "Verifying..." : "Verify & Enter App"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setOtp("");
                }}
                className="text-center text-xs text-brand underline hover:text-brand-dark"
              >
                Change mobile number
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-card-border pt-4 text-center text-xs text-muted-foreground">
            Prefer passwords?{" "}
            <Link
              href="/login/email"
              className="font-bold text-brand underline hover:text-brand-dark"
            >
              Sign in with email
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
