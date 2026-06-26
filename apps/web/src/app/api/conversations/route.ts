import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createConversation,
  getUserConversations,
} from "@/lib/services/conversation.service";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await getUserConversations(userId);
  return NextResponse.json({ data: conversations });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const workspaceId = body.workspaceId as string | undefined;

  const conversation = await createConversation(userId, workspaceId);
  return NextResponse.json({ data: conversation }, { status: 201 });
}
