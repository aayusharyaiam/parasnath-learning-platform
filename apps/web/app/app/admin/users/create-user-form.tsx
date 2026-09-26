"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateUserForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error ?? "Could not create account.");
      return;
    }
    setMessage("Account created successfully.");
    formElement.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-card-border bg-card p-5 sm:grid-cols-2">
      <h2 className="sm:col-span-2 text-base font-bold text-brand-dark">Create account</h2>
      <input name="full_name" required minLength={2} placeholder="Full name" className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm" />
      <input name="email" required type="email" placeholder="Email address" className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm" />
      <input name="password" required type="password" minLength={8} placeholder="Temporary password (8+ characters)" className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm" />
      <select name="role" defaultValue="student" className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm">
        <option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option>
      </select>
      {error ? <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-green-700 sm:col-span-2">{message}</p> : null}
      <button disabled={busy} className="w-fit rounded-full bg-brand px-5 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? "Creating…" : "Create account"}</button>
    </form>
  );
}
