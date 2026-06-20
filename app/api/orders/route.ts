import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerNewOrder } from "@/lib/pusher";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    
    // If sessionId is provided, it's a customer requesting their own tab
    if (sessionId) {
      const orders = await prisma.order.findMany({
        where: { sessionId },
        include: {
          table: true,
          items: { include: { menuItem: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }

    // Otherwise, it requires staff authentication
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: Record<string, unknown> = { restaurantId: user.restaurantId };
    if (status) {
      where.status = status;
    } else {
      // Default: exclude served and cancelled for staff dashboard
      where.status = { notIn: ["SERVED", "CANCELLED"] };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { restaurantId, tableId, sessionId, items, specialRequest } = data;

    if (!restaurantId || !tableId || !sessionId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get today's order count for order number
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    const orderNumber = todayCount + 1;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableId,
        sessionId,
        orderNumber,
        specialRequest: specialRequest || null,
        items: {
          create: items.map((item: { menuItemId: string; quantity: number; note?: string }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: 0, // Will be set from menu item
            note: item.note || null,
          })),
        },
      },
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
    });

    // Update unit prices
    for (const item of order.items) {
      if (item.menuItem) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { unitPrice: item.menuItem.price },
        });
      }
    }

    // Trigger real-time event
    await triggerNewOrder(restaurantId, order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
