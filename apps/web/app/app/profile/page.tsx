import { ProfileForm } from "@/components/profile-form";
import { AccountSecurity } from "@/components/account-security";
import { getClasses, getProfile, getSubjects } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const [classes, subjects] = await Promise.all([getClasses(), getSubjects()]);

  let selectedSubjectIds: string[] = [];

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { data: rows } = await supabase
        .from("profile_subjects")
        .select("subject_id")
        .eq("profile_id", profile.id);
      selectedSubjectIds = (rows ?? []).map((r) => r.subject_id);
    } catch {
      selectedSubjectIds = subjects.slice(0, 3).map((s) => s.id);
    }
  } else {
    selectedSubjectIds = subjects.slice(0, 3).map((s) => s.id);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-dark">My Academic Details</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Update your student information, enrolled subjects, and security credentials.
        </p>
      </div>

      <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
        <ProfileForm
          profile={profile}
          classes={classes}
          subjects={subjects}
          selectedSubjectIds={selectedSubjectIds}
        />
      </div>

      {/* Account Security, Verification & Multiple Sign-in Providers */}
      <AccountSecurity profile={profile} />
    </div>
  );
}
