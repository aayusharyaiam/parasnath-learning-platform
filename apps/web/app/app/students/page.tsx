import { DEMO_PROFILES, getClasses, getProfile } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentsPage() {
  const me = await getProfile();
  if (!me || (me.role !== "teacher" && me.role !== "admin")) redirect("/app");

  let students = [
    DEMO_PROFILES.student,
    {
      id: "demo-student-2",
      email: "priya.patel@parasnath.edu",
      phone: "+919811223344",
      full_name: "Priya Patel",
      role: "student" as const,
      class_id: "class-10-id",
      section: "A",
      roll_number: "12",
      school_name: "Parasnath Public School",
      profile_completed_at: "2026-09-01T00:00:00Z",
    },
    {
      id: "demo-student-3",
      email: "rohit.sharma@parasnath.edu",
      phone: "+919822334455",
      full_name: "Rohit Sharma",
      role: "student" as const,
      class_id: "class-9-id",
      section: "B",
      roll_number: "05",
      school_name: "Parasnath Public School",
      profile_completed_at: "2026-09-01T00:00:00Z",
    },
  ];

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, phone, email, section, school_name, role, class_id, roll_number, profile_completed_at")
        .eq("role", "student")
        .order("full_name");
      if (data && data.length) {
        students = data as typeof students;
      }
    } catch {
      // Fallback to sample students
    }
  }

  const classMap = Object.fromEntries((await getClasses()).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Enrolled Students</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Student roster for Classes 9 &amp; 10. Filtered by active school enrollments.
          </p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">
          Total Students: {students.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-card-border bg-card shadow-xs">
        <table className="w-full text-left text-xs" aria-label="Students Roster">
          <thead className="border-b border-card-border bg-background/80 text-brand-dark font-bold">
            <tr>
              <th className="px-5 py-3.5">Student Name</th>
              <th className="px-5 py-3.5">Class / Grade</th>
              <th className="px-5 py-3.5">Section</th>
              <th className="px-5 py-3.5">Roll No</th>
              <th className="px-5 py-3.5">Phone (OTP Contact)</th>
              <th className="px-5 py-3.5">School Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {students.map((row, i) => (
              <tr key={i} className="hover:bg-brand-light/20 transition-colors">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  {row.full_name ?? "—"}
                </td>
                <td className="px-5 py-3.5 font-medium text-foreground">
                  {row.class_id ? (classMap[row.class_id] ?? "Class 10") : "Class 10"}
                </td>
                <td className="px-5 py-3.5 font-semibold text-brand">
                  {row.section ?? "A"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {row.roll_number ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-foreground font-mono">
                  {row.phone ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {row.school_name ?? "Parasnath School"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <p>💡 Tip: Use the Question Paper Generator to assign homework directly to these students.</p>
        <Link href="/app/papers" className="text-brand font-semibold underline">
          Go to Paper Generator →
        </Link>
      </div>
    </div>
  );
}
