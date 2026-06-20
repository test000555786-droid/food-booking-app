import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";
import { StaffRole } from "./types";

const PUBLIC_PATHS = ["/", "/menu", "/api/menu", "/api/auth/login"];
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

  // Allow public paths
  if (pathname === "/") return NextResponse.next();
  if (pathname.startsWith("/menu/")) return NextResponse.next();
  if (pathname.startsWith("/api/menu")) return NextResponse.next();
  if (pathname.startsWith("/api/qr/")) return NextResponse.next();
  if (pathname.startsWith("/api/reviews") && request.method === "POST") {
    return NextResponse.next();
  }

  // Check auth token for protected routes
  const token = request.cookies.get("tablescan-token")?.value;

  // Staff login page
  if (pathname === "/staff") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Admin login page
  if (pathname === "/admin") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Staff routes
  if (STAFF_PATHS.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/staff", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/staff", request.url));
    }
    // STAFF, MANAGER, and ADMIN can access staff routes
    if (payload.role === StaffRole.STAFF || payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/staff", request.url));
  }

  // Admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Only MANAGER and ADMIN can access admin routes
    if (payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return NextResponse.next();
    }
    // STAFF gets redirected to staff dashboard
    return NextResponse.redirect(new URL("/staff/dashboard", request.url));
  }

  // API route protection
  if (
    pathname.startsWith("/api/orders") || 
    pathname.startsWith("/api/waiter-calls") ||
    pathname.match(/^\/api\/tables\/[^\/]+\/session$/)
  ) {
    return NextResponse.next(); // These are called by customers too
  }

  if (
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/tables") ||
    pathname.startsWith("/api/reports") ||
    pathname.startsWith("/api/staff-users")
  ) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Only MANAGER and ADMIN for admin API routes
    if (payload.role === StaffRole.MANAGER || payload.role === StaffRole.ADMIN) {
      return NextResponse.next();
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sounds/|uploads/).*)",
  ],
};
