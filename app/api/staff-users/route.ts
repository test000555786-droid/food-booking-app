import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId") || user.restaurantId;

    const users = await prisma.staffUser.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        restaurantId: true,
      },
    });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.staffUser.create({
      data: {
        restaurantId: user.restaurantId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: role || "STAFF",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        restaurantId: true,
      },
    });

    return NextResponse.json(newUser);
  } catch {
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
