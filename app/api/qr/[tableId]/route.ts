import { NextRequest, NextResponse } from "next/server";
import { generateQRCodeBuffer } from "@/lib/qr";

export async function GET(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const buffer = await generateQRCodeBuffer(params.tableId);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
