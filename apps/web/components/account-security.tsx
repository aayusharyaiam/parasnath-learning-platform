"use client";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import { toE164India } from "@parasnath/shared";
import type { Profile } from "@parasnath/shared";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccountSecurity({ profile }: { profile: Profile }) {
  const router = useRouter();

  // Phone linking state
  const [phoneInput, setPhoneInput] = useState(profile.phone?.replace(/^\+91/, "") ?? "");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"idle" | "otp_sent" | "done">("idle");
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [phoneBusy, setPhoneBusy] = useState(false);

  // Email update state
  const [email, setEmail] = useState(profile.email ?? "");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [emailBusy, setEmailBusy] = useState(false);

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  // ── Phone: Step 1 – send OTP via supabase.auth.updateUser ──
  async function sendPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setPhoneErr(null);
    setPhoneMsg(null);

    const cleaned = phoneInput.replace(/\D/g, "");
    if (cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      setPhoneErr("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setPhoneMsg("Demo mode: OTP would be sent to +91" + cleaned);
      setPhoneStep("otp_sent");
      return;
    }

    setPhoneBusy(true);
    try {
      const supabase = createClient();
      const e164 = toE164India(cleaned);
      const { error } = await supabase.auth.updateUser({ phone: e164 });
      if (error) {
        setPhoneErr(error.message);
        setPhoneBusy(false);
        return;
      }
      setPhoneStep("otp_sent");
      setPhoneMsg("OTP sent to +91" + cleaned + ". Enter it below to verify.");
    } catch (err) {
      setPhoneErr(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setPhoneBusy(false);
    }
  }

  // ── Phone: Step 2 – verify OTP ──
  async function verifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setPhoneErr(null);
    setPhoneMsg(null);

    if (!otp.trim() || otp.trim().length < 4) {
      setPhoneErr("Enter the OTP you received.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setPhoneMsg("Demo mode: Phone verified!");
      setPhoneStep("done");
      return;
    }

    setPhoneBusy(true);
    try {
      const supabase = createClient();
      const e164 = toE164India(phoneInput.replace(/\D/g, ""));

      // Verify the phone change OTP
      const { error } = await supabase.auth.verifyOtp({
        phone: e164,
        token: otp.trim(),
        type: "phone_change",
      });

      if (error) {
        setPhoneErr(error.message);
        setPhoneBusy(false);
        return;
      }

      // Also write to profiles table to keep it in sync
      await supabase.from("profiles").update({ phone: e164 }).eq("id", profile.id);

      setPhoneStep("done");
      setPhoneMsg(
        "Phone number verified and linked! You can now sign in with +91" +
          phoneInput.replace(/\D/g, "") +
          " + OTP."
      );
      setOtp("");
      router.refresh();
    } catch (err) {
      setPhoneErr(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setPhoneBusy(false);
    }
  }

  // ── Email update ──
  async function linkOrUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr(null);
    setEmailMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setEmailErr("Please enter a valid email address.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setEmailMessage("Demo Mode: Email update simulated.");
      return;
    }

    setEmailBusy(true);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const { error: err } = await supabase.auth.updateUser(
        { email: email.trim() },
        { emailRedirectTo: `${origin}/auth/callback` }
      );
      if (err) {
        setEmailErr(err.message);
        return;
      }
      setEmailMessage(
        "Verification email sent! Check your inbox and click the link to confirm. Once verified you can sign in with this email."
      );
    } catch (err) {
      setEmailErr(err instanceof Error ? err.message : "Failed to update email.");
    } finally {
      setEmailBusy(false);
    }
  }

  // ── Password ──
  async function setOrChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr(null);
    setPwMessage(null);

    if (!password || password.length < 6) {
      setPwErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPw) {
      setPwErr("Passwords do not match.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setPwMessage("Demo Mode: Password saved.");
      setPassword("");
      setConfirmPw("");
      return;
    }

    setPwBusy(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setPwErr(err.message);
        return;
      }
      setPwMessage("Password updated! You can now sign in with your email + password.");
      setPassword("");
      setConfirmPw("");
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPwBusy(false);
    }
  }

  async function linkGoogle() {
    if (!hasSupabaseConfig()) return;
    try {
      const supabase = createClient();
      const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: err } = await supabase.auth.linkIdentity({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      });
      if (err) setEmailErr(err.message);
    } catch (err) {
      setEmailErr(err instanceof Error ? err.message : "Google linking failed.");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-normal text-foreground focus-visible:ring-2 focus-visible:ring-brand outline-none";
  const btnCls =
    "rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 shrink-0";

  return (
    <div className="mt-10 rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-card-border pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Authentication &amp; Linked Identities
        </span>
        <h2 className="text-xl font-bold text-brand-dark mt-1">
          Account Security &amp; Sign-In Methods
        </h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Manage how you sign in. Link your phone, email, password, and Google to the same profile.
        </p>
      </div>

      {/* Linked Methods Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-card-border bg-background/80 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">📱 Phone Number</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                phoneStep === "done" || profile.phone
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {phoneStep === "done" ? "Verified" : profile.phone ? "Active" : "Not Linked"}
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {phoneStep === "done"
              ? "+91" + phoneInput.replace(/\D/g, "")
              : profile.phone || "None"}
          </p>
        </div>

        <div className="rounded-2xl border border-card-border bg-background/80 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">✉️ Email Address</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                profile.email ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {profile.email ? "Verified" : "Pending"}
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground truncate">
            {profile.email || "Add email below"}
          </p>
        </div>

        <div className="rounded-2xl border border-card-border bg-background/80 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">🌐 Google OAuth</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
              Supported
            </span>
          </div>
          <button
            type="button"
            onClick={linkGoogle}
            className="mt-1 w-full rounded-lg border border-card-border bg-card px-2.5 py-1 text-[11px] font-bold text-brand-dark hover:border-brand"
          >
            Link Google Account
          </button>
        </div>
      </div>

      {/* ── Phone Number Linking with OTP ── */}
      <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">
            {profile.phone ? "Update Phone Number" : "Link Phone Number (OTP Required)"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            After verification, you can sign in with phone + OTP from both Web and Mobile apps.
          </p>
        </div>

        {phoneMsg && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
            {phoneMsg}
          </div>
        )}
        {phoneErr && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 font-medium">
            {phoneErr}
          </div>
        )}

        {phoneStep !== "otp_sent" && phoneStep !== "done" && (
          <form onSubmit={sendPhoneOtp} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value.replace(/\D/g, ""));
                  setPhoneErr(null);
                }}
                placeholder="9876543210"
                className={`${inputCls} pl-12`}
              />
            </div>
            <button type="submit" disabled={phoneBusy} className={btnCls}>
              {phoneBusy ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {phoneStep === "otp_sent" && (
          <form onSubmit={verifyPhoneOtp} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setPhoneErr(null);
              }}
              placeholder="Enter 6-digit OTP"
              className={`${inputCls} flex-1 tracking-widest text-center text-base`}
            />
            <button type="submit" disabled={phoneBusy} className={btnCls}>
              {phoneBusy ? "Verifying..." : "Verify & Save"}
            </button>
            <button
              type="button"
              onClick={() => { setPhoneStep("idle"); setOtp(""); setPhoneErr(null); setPhoneMsg(null); }}
              className="text-xs text-muted-foreground underline"
            >
              Change number
            </button>
          </form>
        )}

        {phoneStep === "done" && (
          <button
            type="button"
            onClick={() => { setPhoneStep("idle"); setPhoneMsg(null); setPhoneErr(null); }}
            className="text-xs text-brand underline"
          >
            Link a different number
          </button>
        )}
      </div>

      {/* ── Email Update ── */}
      <form onSubmit={linkOrUpdateEmail} className="rounded-2xl border border-card-border/80 bg-background/40 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">
            {profile.email ? "Update Verified Email" : "Link Email Address"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A confirmation link will be sent. It activates only after you verify it.
          </p>
        </div>
        {emailMessage && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
            {emailMessage}
          </div>
        )}
        {emailErr && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 font-medium">
            {emailErr}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
            placeholder="you@example.com"
            className={`${inputCls} flex-1`}
          />
          <button type="submit" disabled={emailBusy} className={btnCls}>
            {emailBusy ? "Sending..." : "Send Verification Email"}
          </button>
        </div>
      </form>

      {/* ── Password ── */}
      <form onSubmit={setOrChangePassword} className="rounded-2xl border border-card-border/80 bg-background/40 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">Set or Change Password</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enables email + password sign-in across Web and Mobile.
          </p>
        </div>
        {pwMessage && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
            {pwMessage}
          </div>
        )}
        {pwErr && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 font-medium">
            {pwErr}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPwErr(null); }}
            placeholder="New password (min 6 chars)"
            className={inputCls}
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setPwErr(null); }}
            placeholder="Confirm new password"
            className={inputCls}
          />
        </div>
        <button type="submit" disabled={pwBusy} className={btnCls}>
          {pwBusy ? "Updating..." : "Set / Update Password"}
        </button>
      </form>
    </div>
  );
}
