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

    const tables = await prisma.table.findMany({
      where: { restaurantId },
      orderBy: { tableNumber: "asc" },
    });

    return NextResponse.json({ tables });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tableNumber, label } = await request.json();

    const table = await prisma.table.create({
      data: {
        restaurantId: user.restaurantId,
        tableNumber: parseInt(tableNumber),
        label: label || null,
      },
    });

    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 });
  }
}
