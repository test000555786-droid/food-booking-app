import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId") || user?.restaurantId;

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, tableId, sessionId, rating, comment } = await request.json();

    if (!restaurantId || !tableId || !sessionId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        restaurantId,
        tableId,
        sessionId,
        rating,
        comment: comment || null,
        isVisible: false,
      },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
