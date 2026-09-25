import { redirect } from "next/navigation";
import { getClasses, getProfile, getSessionUser, getSubjects } from "@/lib/data";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import { isProfileComplete } from "@parasnath/shared";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile | Parasnath Learning",
  description:
    "Set up your student or teacher profile, select Class 9 or 10, section, and enrolled NCERT subjects.",
};

export default async function CompleteProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (isProfileComplete(profile)) redirect("/app");

  const [classes, subjects] = await Promise.all([getClasses(), getSubjects()]);
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("profile_subjects")
    .select("subject_id")
    .eq("profile_id", profile.id);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Step 2 of 2
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-dark sm:text-3xl">
            Complete Your Academic Profile
          </h1>
          <p className="mt-2 mb-6 text-xs text-muted-foreground leading-relaxed">
            Please fill in your school details to unlock class materials, topic tests, and personalized study tools. You can update these anytime.
          </p>
          <ProfileForm
            profile={profile}
            classes={classes}
            subjects={subjects}
            selectedSubjectIds={(rows ?? []).map((r) => r.subject_id)}
            submitLabel="Save & Enter Learning App"
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
