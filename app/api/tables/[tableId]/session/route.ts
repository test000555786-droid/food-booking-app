import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    // End any existing active session for this table
    await prisma.tableSession.updateMany({
      where: { tableId: params.tableId, endedAt: null },
      data: { endedAt: new Date() },
    });

    // Create new session
    const session = await prisma.tableSession.create({
      data: { tableId: params.tableId },
    });

    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const { sessionId } = await request.json();

    await prisma.tableSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
}
