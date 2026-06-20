import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { JWTPayload, SessionUser, StaffRole } from "@/types";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "tablescan-dev-secret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get("tablescan-token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.staffUser.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      restaurantId: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as StaffRole,
    restaurantId: user.restaurantId,
  };
}

export async function getSessionUserFromCookies(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("tablescan-token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.staffUser.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      restaurantId: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as StaffRole,
    restaurantId: user.restaurantId,
  };
}

export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set("tablescan-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.set("tablescan-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export function hasRole(userRole: StaffRole, requiredRole: StaffRole): boolean {
  const hierarchy: Record<StaffRole, number> = {
    [StaffRole.STAFF]: 0,
    [StaffRole.MANAGER]: 1,
    [StaffRole.ADMIN]: 2,
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}
