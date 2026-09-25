import { getClasses, getProfile, getSubjects } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function AdminClassesPage() {
  const me = await getProfile();
  if (!me || me.role !== "admin") redirect("/app");
  const [classes, subjects] = await Promise.all([getClasses(), getSubjects()]);

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <section>
        <h1 className="text-2xl font-semibold text-brand-dark">Classes</h1>
        <ul className="mt-4 space-y-2">
          {classes.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-black/5 bg-card px-4 py-3 text-sm"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-dark">Subjects</h2>
        <ul className="mt-4 space-y-2">
          {subjects.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-black/5 bg-card px-4 py-3 text-sm"
            >
              {s.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
