import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerCallResolved, triggerBillSettled } from "@/lib/pusher";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the call first so we can check if it's a BILL type
    const existingCall = await prisma.waiterCall.findUnique({
      where: { id: params.callId },
      include: { table: true },
    });

    if (!existingCall) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Mark the call as resolved
    const call = await prisma.waiterCall.update({
      where: { id: params.callId },
      data: { isResolved: true, resolvedAt: new Date() },
    });

    // Fire call-resolved event so staff UI removes it
    await triggerCallResolved(user.restaurantId, params.callId);

    // If it's a BILL request: end ALL active sessions for this table and notify the customers
    if (existingCall.type === "BILL") {
      await prisma.tableSession.updateMany({
        where: {
          tableId: existingCall.tableId,
          endedAt: null,
        },
        data: { endedAt: new Date() },
      });

      // Notify all customer devices at this table that the bill is settled
      await triggerBillSettled(user.restaurantId, existingCall.tableId);
    }

    return NextResponse.json(call);
  } catch (error) {
    console.error("Resolve call error:", error);
    return NextResponse.json({ error: "Failed to resolve call" }, { status: 500 });
  }
}
