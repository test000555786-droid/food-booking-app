import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerOrderUpdated } from "@/lib/pusher";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string; itemId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the order item, making sure it belongs to the order
    await prisma.orderItem.delete({
      where: { 
        id: params.itemId,
        orderId: params.orderId
      },
    });

    // Fetch the updated order
    let order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If no items left, cancel the order automatically
    if (order.items.length === 0 && order.status !== "CANCELLED") {
      order = await prisma.order.update({
        where: { id: params.orderId },
        data: { status: "CANCELLED" },
        include: {
          table: true,
          items: { include: { menuItem: true } },
        },
      });
    }

    // Trigger real-time event to update dashboards and client screens
    await triggerOrderUpdated(order.restaurantId, order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to delete order item:", error);
    return NextResponse.json({ error: "Failed to delete order item" }, { status: 500 });
  }
}
