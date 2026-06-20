import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerCallResolved } from "@/lib/pusher";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const call = await prisma.waiterCall.update({
      where: { id: params.callId },
      data: { isResolved: true, resolvedAt: new Date() },
    });

    await triggerCallResolved(user.restaurantId, params.callId);

    return NextResponse.json(call);
  } catch {
    return NextResponse.json({ error: "Failed to resolve call" }, { status: 500 });
  }
}
