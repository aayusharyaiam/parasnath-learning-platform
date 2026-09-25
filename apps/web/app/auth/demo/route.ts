import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const action = searchParams.get("action");
  const cookieStore = await cookies();

  if (action === "logout") {
    cookieStore.delete("parasnath_demo_user");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (role === "admin" || role === "student" || role === "teacher") {
    cookieStore.set("parasnath_demo_user", role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
