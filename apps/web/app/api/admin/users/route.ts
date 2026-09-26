import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { data: profile } = await sessionClient.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Account creation is not configured. Set SUPABASE_SECRET_KEY on the server." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fullName = typeof body?.full_name === "string" ? body.full_name.trim() : "";
  const role = body?.role;
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !fullName || !["student", "teacher", "admin"].includes(role)) {
    return NextResponse.json({ error: "Enter a valid email, name, role, and password (at least 8 characters)." }, { status: 400 });
  }

  const adminClient = createSupabaseClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    role,
  }, { onConflict: "id" });
  if (profileError) {
    await adminClient.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: `Account created but profile setup failed: ${profileError.message}` }, { status: 500 });
  }
  return NextResponse.json({ id: data.user.id });
}
