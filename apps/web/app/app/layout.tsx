import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { getProfile, getSessionUser } from "@/lib/data";
import { isProfileComplete, navForRole } from "@parasnath/shared";
import { CrisisHelplineModal } from "@/components/crisis-helpline-modal";
import { SlaBadge } from "@/components/sla-badge";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  if (!profile || !isProfileComplete(profile)) redirect("/complete-profile");

  const nav = navForRole(profile.role);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Top Navigation */}
      <header className="flex items-center justify-between border-b border-card-border bg-brand-dark px-4 py-3 text-white md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white font-bold text-xs">
            P
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">Parasnath Learning</p>
            <p className="text-[10px] text-white/70 capitalize">{profile.role} · {profile.full_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrisisHelplineModal />
          <SignOutButton />
        </div>
      </header>

      {/* Mobile Horizontal Nav Bar */}
      <nav className="flex overflow-x-auto border-b border-card-border bg-card px-2 py-2 md:hidden">
        <div className="flex gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-brand-light hover:text-brand focus-visible:ring-2 focus-visible:ring-brand"
            >
              {item.label}
              {item.comingSoon ? (
                <span className="ml-1 rounded-sm bg-accent-light px-1 py-0.2 text-[9px] font-bold uppercase text-accent">
                  soon
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-brand-dark px-5 py-6 text-white">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white font-bold">
            P
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Parasnath</p>
            <p className="text-[11px] text-emerald-200 capitalize font-medium">
              {profile.role} Portal
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="my-4 rounded-xl bg-white/5 p-3 border border-white/10">
          <p className="text-xs font-bold text-white truncate">{profile.full_name}</p>
          <p className="text-[11px] text-white/70 truncate">{profile.school_name || "School Student"}</p>
          {profile.section && (
            <span className="mt-1.5 inline-block rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-medium text-emerald-100">
              Sec {profile.section} {profile.roll_number ? `· Roll ${profile.roll_number}` : ""}
            </span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{item.label}</span>
              {item.comingSoon ? (
                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                  soon
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div className="flex justify-center">
            <CrisisHelplineModal />
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        <header className="hidden md:flex items-center justify-between border-b border-card-border bg-card/60 px-8 py-3">
          <SlaBadge />
          <div className="flex items-center gap-4 text-xs">
            <Link href="/faq" className="text-muted-foreground hover:text-brand font-medium">
              5 FAQs
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-brand font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-brand font-medium">
              Terms
            </Link>
          </div>
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
