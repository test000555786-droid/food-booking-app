import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      // Try to get from session
      const user = await getSessionUser(request);
      if (!user) {
        return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 });
      }
      // Fall through with user.restaurantId
    }

    const targetRestaurantId = restaurantId || (await getSessionUser(request))?.restaurantId;

    if (!targetRestaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId: targetRestaurantId, isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    const items = await prisma.menuItem.findMany({
      where: { restaurantId: targetRestaurantId },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ categories, items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const item = await prisma.menuItem.create({
      data: {
        restaurantId: user.restaurantId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl || null,
        isVeg: data.isVeg ?? true,
        isAvailable: data.isAvailable ?? true,
        isBestseller: data.isBestseller ?? false,
        isSpicy: data.isSpicy ?? false,
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
