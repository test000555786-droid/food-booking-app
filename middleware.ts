import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySupabaseHeaders, updateSession } from "@/lib/supabase/middleware";
import { StaffRole } from "./types";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const decodedJson = atob(payload);
    return JSON.parse(decodedJson);
  } catch (e) {
    return null;
  }
}

const STAFF_PATHS = ["/staff/dashboard", "/staff/tables"];
const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/menu",
  "/admin/categories",
  "/admin/tables",
  "/admin/orders",
  "/admin/reports",
  "/admin/reviews",
  "/admin/staff",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseResponse = await updateSession(request);

  const redirectWithSupabase = (targetPath: string) =>
    applySupabaseHeaders(
      NextResponse.redirect(new URL(targetPath, request.url)),
      supabaseResponse
    );

  const jsonWithSupabase = (body: unknown, init: ResponseInit) =>
    applySupabaseHeaders(NextResponse.json(body, init), supabaseResponse);

  // Allow public paths
  if (pathname === "/") return supabaseResponse;
  if (pathname.startsWith("/menu/")) return supabaseResponse;
  if (pathname.startsWith("/api/menu")) return supabaseResponse;
  if (pathname.startsWith("/api/qr/")) return supabaseResponse;
  if (pathname.startsWith("/api/reviews") && request.method === "POST") {
    return supabaseResponse;
  }

  // Check auth token for protected routes
  const token = request.cookies.get("tablescan-token")?.value;

  // Staff login page
  if (pathname === "/staff") {
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        return redirectWithSupabase("/staff/dashboard");
      }
    }
    return supabaseResponse;
  }

  // Admin login page
  if (pathname === "/admin") {
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        return redirectWithSupabase("/admin/dashboard");
      }
    }
    return supabaseResponse;
  }

  // Staff routes
  if (STAFF_PATHS.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return redirectWithSupabase("/staff");
    }
    const payload = decodeJwt(token);
    if (!payload) {
      return redirectWithSupabase("/staff");
    }
    // STAFF, MANAGER, and ADMIN can access staff routes
    if (payload.role === StaffRole.STAFF || payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return supabaseResponse;
    }
    return redirectWithSupabase("/staff");
  }

  // Admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return redirectWithSupabase("/admin");
    }
    const payload = decodeJwt(token);
    if (!payload) {
      return redirectWithSupabase("/admin");
    }
    // Only MANAGER and ADMIN can access admin routes
    if (payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return supabaseResponse;
    }
    // STAFF gets redirected to staff dashboard
    return redirectWithSupabase("/staff/dashboard");
  }

  // API route protection
  if (
    pathname.startsWith("/api/orders") || 
    pathname.startsWith("/api/waiter-calls") ||
    pathname.match(/^\/api\/tables\/[^\/]+\/session$/)
  ) {
    return supabaseResponse; // These are called by customers too
  }

  if (
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/tables") ||
    pathname.startsWith("/api/reports") ||
    pathname.startsWith("/api/staff-users")
  ) {
    if (!token) {
      return jsonWithSupabase({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = decodeJwt(token);
    if (!payload) {
      return jsonWithSupabase({ error: "Invalid token" }, { status: 401 });
    }
    // Only MANAGER and ADMIN for admin API routes
    if (payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return supabaseResponse;
    }
    return jsonWithSupabase({ error: "Forbidden" }, { status: 403 });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sounds/|uploads/).*)",
  ],
};
