import Link from "next/link";
import { getProfile } from "@/lib/data";
import { CrisisHelplineModal } from "@/components/crisis-helpline-modal";

export default async function AppHomePage() {
  const profile = await getProfile();
  const name = profile?.full_name ?? "Student";
  const role = profile?.role ?? "student";

  const studentRooms = [
    {
      href: "/app/study",
      title: "1. Study NCERT Topics",
      desc: "Class 9 & 10 chapters, maps, diagrams, and micro-topic learning modules.",
      badge: "Step 1: Learn",
      icon: "📖",
    },
    {
      href: "/app/tests",
      title: "2. Competency Micro-Tests",
      desc: "Assertion-Reason, statement questions, and previous-year board questions.",
      badge: "Step 2: Test",
      icon: "🎯",
    },
    {
      href: "/app/written",
      title: "3. Written Practice & Upload",
      desc: "Write answers in notebook, snap photos or scan PDF for teacher verification.",
      badge: "Step 3: Write",
      icon: "✍️",
    },
    {
      href: "/app/ai",
      title: "4. AI Learning & Mind-Maps",
      desc: "Instant concept simplifier, flowchart synthesizer, and visual diagrams.",
      badge: "Step 4: AI Help",
      icon: "🤖",
    },
    {
      href: "/app/videos",
      title: "5. Video Lectures & Notes",
      desc: "Topic-wise teacher video explanations, PDF handouts, and revision sheets.",
      badge: "Step 5: Media",
      icon: "🎥",
    },
    {
      href: "/app/progress",
      title: "6. Progress & Mastery",
      desc: "Track completed topics, test accuracy, teacher feedback, and weak areas.",
      badge: "Step 6: Insights",
      icon: "📊",
    },
  ];

  const teacherRooms = [
    {
      href: "/app/students",
      title: "1. My Enrolled Students",
      desc: "View student rosters by class and section with contact details.",
      badge: "Active",
      icon: "👥",
    },
    {
      href: "/app/papers",
      title: "2. Question Paper Generator",
      desc: "Generate custom test papers, blueprints, and export to Google Docs/PDF.",
      badge: "Soon",
      icon: "📝",
    },
    {
      href: "/app/checking",
      title: "3. Verify Written Answers",
      desc: "Mark student notebook scans with digital pen notes and assign scores.",
      badge: "Soon",
      icon: "🔍",
    },
    {
      href: "/app/questions",
      title: "4. Question & Answer Bank",
      desc: "Import questions from Google Docs and organize by NCERT standards.",
      badge: "Soon",
      icon: "📚",
    },
    {
      href: "/app/performance",
      title: "5. Class Analytics & Diagnostics",
      desc: "Track syllabus completion, class averages, and identify students needing help.",
      badge: "Soon",
      icon: "📈",
    },
  ];

  const rooms = role === "student" ? studentRooms : teacherRooms;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              {role} Workspace · Academic Year 2026–27
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-brand-dark">
              Welcome back, {name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {profile?.school_name || "Parasnath Learning"} · {profile?.section ? `Section ${profile.section}` : "Classes 9 & 10"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/profile"
              className="rounded-full border border-card-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-card-border/30 focus-visible:ring-2 focus-visible:ring-brand"
            >
              Edit Details
            </Link>
          </div>
        </div>

        {/* Learning Cycle Guidance */}
        <div className="mt-6 rounded-2xl border border-emerald-800/15 bg-emerald-50/70 p-4">
          <p className="text-xs font-bold text-emerald-950">
            🎯 Foundation Build Active
          </p>
          <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
            Your login, database profile, and NCERT curriculum structures are live.
            Click on any room below to explore the interactive architecture, feature blueprints, and sample question mocks.
          </p>
        </div>
      </div>

      {/* Grid of Learning Rooms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-dark">
            {role === "student" ? "NCERT 7-Step Learning Rooms" : "Teacher Academic Hub"}
          </h2>
          <span className="text-xs text-muted-foreground">
            Classes 9 &amp; 10 Curriculum
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              key={room.href}
              href={room.href}
              className="group rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-all hover:border-brand/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {room.icon}
                  </span>
                  <span className="rounded-md bg-accent-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                    {room.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-brand-dark group-hover:text-brand transition-colors">
                  {room.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {room.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-brand pt-2 border-t border-card-border/60">
                <span>Explore Prototype Room</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Student Wellbeing card */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-950">
            Student Mental Wellbeing &amp; 24/7 Crisis Support
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            Exams and schoolwork can be stressful. Confidential, toll-free guidance is always available.
          </p>
        </div>
        <CrisisHelplineModal />
      </div>
    </div>
  );
}
