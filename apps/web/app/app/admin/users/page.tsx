import { RoleSelect } from "./role-select";
import { DEMO_PROFILES, getProfile } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@parasnath/shared";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const me = await getProfile();
  if (!me || me.role !== "admin") redirect("/app");

  let users = Object.values(DEMO_PROFILES);

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, role, section, school_name")
        .order("created_at", { ascending: false });
      if (data && data.length) {
        users = data as typeof users;
      }
    } catch {
      // Fallback to demo users
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-dark">User Role &amp; Access Manager</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Promote or assign permissions for teachers, students, and school administrators.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-card-border bg-card shadow-xs">
        <table className="w-full text-left text-xs" aria-label="Users Access Management">
          <thead className="border-b border-card-border bg-background/80 text-brand-dark font-bold">
            <tr>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Phone</th>
              <th className="px-5 py-3.5">School / Section</th>
              <th className="px-5 py-3.5">Role Permission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {users.map((row) => (
              <tr key={row.id} className="hover:bg-brand-light/20 transition-colors">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  {row.full_name ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground font-mono">
                  {row.email ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-foreground font-mono">
                  {row.phone ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {row.school_name ?? "Parasnath"} · {row.section ?? "General"}
                </td>
                <td className="px-5 py-3.5">
                  <RoleSelect
                    user={{
                      id: row.id,
                      full_name: row.full_name,
                      email: row.email,
                      phone: row.phone,
                      role: row.role as UserRole,
                      section: row.section,
                      school_name: row.school_name,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
