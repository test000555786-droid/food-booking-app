import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerOrderUpdated } from "@/lib/pusher";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
    });

    // Trigger real-time event
    await triggerOrderUpdated(order.restaurantId, order);

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
