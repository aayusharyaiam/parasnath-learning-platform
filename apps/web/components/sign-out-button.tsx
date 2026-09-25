"use client";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    // Clear demo cookie
    document.cookie = "parasnath_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    if (hasSupabaseConfig()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Continue
      }
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      Sign out
    </button>
  );
}
