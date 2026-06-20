import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, emoji } = await request.json();

    const count = await prisma.category.count({
      where: { restaurantId: user.restaurantId },
    });

    const category = await prisma.category.create({
      data: {
        restaurantId: user.restaurantId,
        name: name.trim(),
        emoji: emoji || null,
        sortOrder: count,
      },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
