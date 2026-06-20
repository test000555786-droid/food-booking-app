import { NextRequest, NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const socketId = formData.get("socket_id") as string;
    const channel = formData.get("channel_name") as string;

    if (!socketId || !channel) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const auth = pusher.authorizeChannel(socketId, channel);

    return NextResponse.json(auth);
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
