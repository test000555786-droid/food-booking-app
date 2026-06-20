import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { triggerWaiterCall, triggerBillRequest } from "@/lib/pusher";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const calls = await prisma.waiterCall.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Manually join tables to avoid schema sync issues on Windows
    const tableIds = [...new Set(calls.map((c) => c.tableId))];
    const tables = await prisma.table.findMany({
      where: { id: { in: tableIds } },
    });
    const tableMap = new Map(tables.map((t) => [t.id, t]));

    const callsWithTable = calls.map((c) => ({
      ...c,
      table: tableMap.get(c.tableId) || null,
    }));

    return NextResponse.json({ calls: callsWithTable });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tableId, type } = await request.json();

    if (!tableId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get table to find restaurant
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const call = await prisma.waiterCall.create({
      data: { tableId, type },
    });

    const callWithTable = { ...call, table };

    // Trigger real-time event
    if (type === "BILL") {
      await triggerBillRequest(table.restaurantId, callWithTable);
    } else {
      await triggerWaiterCall(table.restaurantId, callWithTable);
    }

    return NextResponse.json(callWithTable);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create call" }, { status: 500 });
  }
}

