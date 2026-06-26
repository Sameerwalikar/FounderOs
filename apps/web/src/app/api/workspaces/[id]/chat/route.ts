import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { getWorkspace } from "@/lib/services/workspace.service";
import {
  generateChatResponse,
  saveChatMessage,
  getMessages,
  getSuggestedActions,
} from "@/lib/ai/chat";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get or create a conversation for a workspace.
 */
async function getOrCreateConversation(userId: string, workspaceId: string) {
  let conversation = await prisma.conversation.findFirst({
    where: { userId, workspaceId },
    orderBy: { updatedAt: "desc" },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId, workspaceId, title: "Workspace Chat" },
    });
  }

  return conversation;
}

/**
 * GET /api/workspaces/[id]/chat — Get chat history
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);
  if (!workspace) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const conversation = await getOrCreateConversation(userId, id);
  const messages = await getMessages(conversation.id);
  return NextResponse.json({ data: messages });
}

/**
 * POST /api/workspaces/[id]/chat — Send a message and get streaming response
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);
  if (!workspace) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { message } = body;

  if (!message || typeof message !== "string" || message.length === 0) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 },
    );
  }

  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Message must be 2000 characters or fewer" },
      { status: 400 },
    );
  }

  const conversation = await getOrCreateConversation(userId, id);

  // Save user message
  await saveChatMessage(conversation.id, userId, "user", message);

  // Stream AI response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = generateChatResponse({
          workspaceId: id,
          userId,
          userMessage: message,
          conversationId: conversation.id,
        });

        for await (const chunk of generator) {
          fullResponse += chunk;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`),
          );
        }

        // Save the complete response
        await saveChatMessage(conversation.id, userId, "assistant", fullResponse);

        // Send suggestions
        const suggestions = getSuggestedActions(fullResponse);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "done", suggestions })}\n\n`,
          ),
        );
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "AI generation failed";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
