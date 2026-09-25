"use client";

import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@parasnath/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  section: string | null;
  school_name: string | null;
};

export function RoleSelect({ user }: { user: Row }) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(user.role);
  const [busy, setBusy] = useState(false);

  async function onChange(next: UserRole) {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role: next })
      .eq("id", user.id);
    setBusy(false);
    if (!error) {
      setRole(next);
      router.refresh();
    }
  }

  return (
    <select
      disabled={busy}
      value={role}
      onChange={(e) => onChange(e.target.value as UserRole)}
      className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm"
    >
      <option value="student">student</option>
      <option value="teacher">teacher</option>
      <option value="admin">admin</option>
    </select>
  );
}
