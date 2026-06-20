import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const table = await prisma.table.update({
      where: { id: params.tableId },
      data: {
        tableNumber: data.tableNumber ? parseInt(data.tableNumber) : undefined,
        label: data.label,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: "Failed to update table" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.table.delete({
      where: { id: params.tableId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete table" }, { status: 500 });
  }
}
