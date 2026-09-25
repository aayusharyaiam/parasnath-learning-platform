"use client";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import type { Profile } from "@parasnath/shared";
import { useState } from "react";

export function AccountSecurity({ profile }: { profile: Profile }) {
  const [email, setEmail] = useState(profile.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function linkOrUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setBusy(true);
    setError(null);
    setEmailMessage(null);

    if (!hasSupabaseConfig()) {
      setBusy(false);
      setEmailMessage("Demo Mode: Email update simulated. In live Supabase, a verification link is sent.");
      return;
    }

    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
      const { error: err } = await supabase.auth.updateUser(
        { email: email.trim() },
        { emailRedirectTo: `${origin}/auth/callback` }
      );
      setBusy(false);

      if (err) {
        setError(err.message);
        return;
      }

      setEmailMessage(
        "Verification email sent! Please check your inbox and click the link to verify this email address. Once verified, you can sign in using this email or Google."
      );
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Failed to update email.");
    }
  }

  async function setOrChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    setError(null);
    setPwMessage(null);

    if (!hasSupabaseConfig()) {
      setBusy(false);
      setPwMessage("Demo Mode: Password saved. In live Supabase, password is encrypted with bcrypt.");
      setPassword("");
      setConfirmPw("");
      return;
    }

    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      setBusy(false);

      if (err) {
        setError(err.message);
        return;
      }

      setPwMessage("Password updated successfully! You can now log in using this password.");
      setPassword("");
      setConfirmPw("");
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Failed to update password.");
    }
  }

  async function linkGoogle() {
    setBusy(true);
    setError(null);

    if (!hasSupabaseConfig()) {
      setBusy(false);
      setEmailMessage("Demo Mode: Google linking requires live Supabase credentials.");
      return;
    }

    try {
      const supabase = createClient();
      const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: err } = await supabase.auth.linkIdentity({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      });
      setBusy(false);

      if (err) setError(err.message);
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Google linking failed.");
    }
  }

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
          Manage how you sign in. You can link your phone number, verified email address, password, and Google account to the same profile.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 font-medium">
          {error}
        </div>
      )}

      {/* Linked Methods Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-card-border bg-background/80 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">📱 Phone Number</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${profile.phone ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
              {profile.phone ? "Active" : "Not Linked"}
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground">{profile.phone || "None"}</p>
        </div>

        <div className="rounded-2xl border border-card-border bg-background/80 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">✉️ Email Address</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${profile.email ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {profile.email ? "Verified" : "Pending Link"}
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground truncate">{profile.email || "Add email below"}</p>
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
            disabled={busy}
            className="mt-1 w-full rounded-lg border border-card-border bg-card px-2.5 py-1 text-[11px] font-bold text-brand-dark hover:border-brand"
          >
            Link Google Account
          </button>
        </div>
      </div>

      {/* Link or Update Verified Email */}
      <form onSubmit={linkOrUpdateEmail} className="rounded-2xl border border-card-border/80 bg-background/40 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">
            {profile.email ? "Update Verified Email" : "Link Email Address (Verification Required)"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A confirmation link will be sent to this email. It is only activated after you verify it.
          </p>
        </div>

        {emailMessage && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
            {emailMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@school.edu"
            className="flex-1 rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-normal text-foreground focus-visible:ring-2 focus-visible:ring-brand"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 shrink-0"
          >
            {busy ? "Sending link..." : "Send Verification Email"}
          </button>
        </div>
      </form>

      {/* Set or Change Password */}
      <form onSubmit={setOrChangePassword} className="rounded-2xl border border-card-border/80 bg-background/40 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">
            Set or Change Account Password
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enables you to sign in with your email and password across both Web and Mobile apps.
          </p>
        </div>

        {pwMessage && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
            {pwMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-normal text-foreground focus-visible:ring-2 focus-visible:ring-brand"
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            className="rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-normal text-foreground focus-visible:ring-2 focus-visible:ring-brand"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
          >
            {busy ? "Updating password..." : "Set / Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
