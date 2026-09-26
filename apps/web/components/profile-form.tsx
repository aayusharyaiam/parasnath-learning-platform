"use client";

import { createClient } from "@/lib/supabase/client";
import {
  SCHOOL_DEFAULT_NAME,
  toE164India,
  type Profile,
  type SchoolClass,
  type Subject,
} from "@parasnath/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  profile: Profile;
  classes: SchoolClass[];
  subjects: Subject[];
  selectedSubjectIds: string[];
  submitLabel?: string;
};

export function ProfileForm({
  profile,
  classes,
  subjects,
  selectedSubjectIds,
  submitLabel = "Save Profile",
}: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone?.replace(/^\+91/, "") ?? "");
  const [classId, setClassId] = useState(profile.class_id ?? classes[0]?.id ?? "");
  const [section, setSection] = useState(profile.section ?? "");
  const [schoolName, setSchoolName] = useState(
    profile.school_name ?? SCHOOL_DEFAULT_NAME,
  );
  const [rollNumber, setRollNumber] = useState(profile.roll_number ?? "");
  const [picked, setPicked] = useState<string[]>(selectedSubjectIds);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (minimum 2 characters).";
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (!cleanedPhone || cleanedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (!classId) {
      errs.classId = "Please select your class.";
    }

    if (!section.trim()) {
      errs.section = "Please enter your section (e.g. A, B, or C).";
    }

    if (!schoolName.trim()) {
      errs.schoolName = "Please specify your school name.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function toggleSubject(id: string) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const e164 = toE164India(phone);

      const { error: err } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: e164,
          class_id: classId,
          section: section.trim().toUpperCase(),
          school_name: schoolName.trim(),
          roll_number: rollNumber.trim() || null,
          profile_completed_at: new Date().toISOString(),
          email: profile.email,
        })
        .eq("id", profile.id);

      if (err) {
        setBusy(false);
        setServerError(err.message);
        return;
      }

      await supabase.from("profile_subjects").delete().eq("profile_id", profile.id);
      if (picked.length) {
        const { error: subErr } = await supabase.from("profile_subjects").insert(
          picked.map((subject_id) => ({
            profile_id: profile.id,
            subject_id,
          })),
        );
        if (subErr) {
          setBusy(false);
          setServerError(subErr.message);
          return;
        }
      }

      setBusy(false);
      router.replace("/app");
      router.refresh();
    } catch (e) {
      setBusy(false);
      setServerError(e instanceof Error ? e.message : "Failed to update profile");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5" noValidate>
      {serverError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-900"
        >
          {serverError}
        </div>
      ) : null}

      {/* Full Name */}
      <div className="space-y-1">
        <label htmlFor="prof-name" className="text-xs font-bold text-foreground">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="prof-name"
          type="text"
          required
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "err-name" : undefined}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
            errors.fullName ? "border-red-500 bg-red-50/30" : "border-card-border"
          }`}
          placeholder="e.g. Aarav Sharma"
        />
        {errors.fullName && (
          <p id="err-name" role="alert" className="text-[11px] font-medium text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label htmlFor="prof-phone" className="text-xs font-bold text-foreground">
          Mobile Number (India +91) <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-xs font-bold text-muted-foreground">
            +91
          </span>
          <input
            id="prof-phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            className={`w-full rounded-xl border bg-background pl-12 pr-3.5 py-2.5 text-sm font-normal text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
              errors.phone ? "border-red-500 bg-red-50/30" : "border-card-border"
            }`}
            placeholder="9876543210"
          />
        </div>
        {errors.phone && (
          <p id="err-phone" role="alert" className="text-[11px] font-medium text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Class and Section row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="prof-class" className="text-xs font-bold text-foreground">
            Class / Grade <span className="text-red-500">*</span>
          </label>
          <select
            id="prof-class"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.classId)}
            aria-describedby={errors.classId ? "err-class" : undefined}
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              if (errors.classId) setErrors((prev) => ({ ...prev, classId: "" }));
            }}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
              errors.classId ? "border-red-500 bg-red-50/30" : "border-card-border"
            }`}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p id="err-class" role="alert" className="text-[11px] font-medium text-red-600">
              {errors.classId}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="prof-section" className="text-xs font-bold text-foreground">
            Section <span className="text-red-500">*</span>
          </label>
          <input
            id="prof-section"
            type="text"
            required
            maxLength={3}
            aria-required="true"
            aria-invalid={Boolean(errors.section)}
            aria-describedby={errors.section ? "err-sec" : undefined}
            value={section}
            onChange={(e) => {
              setSection(e.target.value.toUpperCase());
              if (errors.section) setErrors((prev) => ({ ...prev, section: "" }));
            }}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
              errors.section ? "border-red-500 bg-red-50/30" : "border-card-border"
            }`}
            placeholder="A"
          />
          {errors.section && (
            <p id="err-sec" role="alert" className="text-[11px] font-medium text-red-600">
              {errors.section}
            </p>
          )}
        </div>
      </div>

      {/* School Name & Roll Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="prof-school" className="text-xs font-bold text-foreground">
            School Name <span className="text-red-500">*</span>
          </label>
          <input
            id="prof-school"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.schoolName)}
            aria-describedby={errors.schoolName ? "err-school" : undefined}
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
              if (errors.schoolName) setErrors((prev) => ({ ...prev, schoolName: "" }));
            }}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand ${
              errors.schoolName ? "border-red-500 bg-red-50/30" : "border-card-border"
            }`}
            placeholder="Parasnath Public School"
          />
          {errors.schoolName && (
            <p id="err-school" role="alert" className="text-[11px] font-medium text-red-600">
              {errors.schoolName}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="prof-roll" className="text-xs font-bold text-foreground">
            Roll Number (optional)
          </label>
          <input
            id="prof-roll"
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand"
            placeholder="e.g. 24"
          />
        </div>
      </div>

      {/* Subjects Selection */}
      <fieldset className="space-y-2 rounded-2xl border border-card-border/80 bg-background/50 p-4">
        <legend className="text-xs font-bold text-foreground px-1">
          Enrolled Subjects (Class 9 &amp; 10 NCERT)
        </legend>
        <p className="text-[11px] text-muted-foreground">
          Select all subjects you are currently studying or teaching:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {subjects.map((s) => {
            const on = picked.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggleSubject(s.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-brand ${
                  on
                    ? "bg-brand text-white shadow-xs"
                    : "border border-card-border bg-card text-foreground hover:border-brand/40"
                }`}
              >
                {on ? "✓ " : "+ "}
                {s.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {profile.role !== "student" ? (
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
          <strong>Assigned Role:</strong> {profile.role.toUpperCase()} (Managed by school administrator).
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
        >
          {busy ? "Saving details..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
