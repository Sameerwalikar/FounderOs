import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateContentStream } from "@/lib/ai/gemini";
import { getConversation } from "@/lib/services/conversation.service";
import { SECTION_META } from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await params;
  const body = await req.json();
  const message = (body.message as string)?.trim();

  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // Verify conversation belongs to user
  const conversation = await getConversation(userId, conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Save user message
  await prisma.chatMessage.create({
    data: {
      conversationId,
      userId,
      role: "user",
      content: message,
    },
  });

  // Build context
  let systemPrompt: string;
  if (conversation.workspace) {
    const workspaceContext = await buildWorkspaceContext(conversation.workspace.id);
    systemPrompt = `You are an AI Co-Founder. You have context about the user's startup:\n\n${workspaceContext}\n\nProvide specific, actionable advice referencing this context. Format responses in clean Markdown.`;
  } else {
    systemPrompt = `You are an AI Co-Founder helping startup founders with strategy, product, marketing, tech, and fundraising. Give actionable, specific advice. Format responses in clean Markdown.`;
  }

  // Build recent history
  const recentMessages = conversation.messages.slice(-10);
  let historyContext = "";
  if (recentMessages.length > 0) {
    historyContext = "\n\n## Recent Conversation\n\n";
    for (const msg of recentMessages) {
      const role = msg.role === "user" ? "User" : "AI Co-Founder";
      historyContext += `**${role}:** ${msg.content.slice(0, 500)}\n\n`;
    }
  }

  const fullPrompt = `${systemPrompt}${historyContext}\n\n**User's Message:**\n${message}`;

  // Stream response via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = "";
      try {
        for await (const chunk of generateContentStream(fullPrompt)) {
          fullContent += chunk;
          const event = `data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`;
          controller.enqueue(encoder.encode(event));
        }

        // Save assistant message
        await prisma.chatMessage.create({
          data: {
            conversationId,
            userId,
            role: "assistant",
            content: fullContent,
          },
        });

        // Auto-generate title from first message if still "New Chat"
        if (conversation.title === "New Chat") {
          const title = message.slice(0, 80) + (message.length > 80 ? "..." : "");
          await prisma.conversation.updateMany({
            where: { id: conversationId, userId },
            data: { title },
          });
        }

        // Update conversation timestamp
        await prisma.conversation.updateMany({
          where: { id: conversationId, userId },
          data: { updatedAt: new Date() },
        });

        const doneEvent = `data: ${JSON.stringify({ type: "done" })}\n\n`;
        controller.enqueue(encoder.encode(doneEvent));
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        const errorEvent = `data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
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

async function buildWorkspaceContext(workspaceId: string): Promise<string> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { sections: true },
  });

  if (!workspace) return "";

  let context = `**Startup Name:** ${workspace.name}\n`;
  context += `**Startup Idea:** ${workspace.idea}\n`;
  if (workspace.industry) context += `**Industry:** ${workspace.industry}\n`;
  if (workspace.startupStage) context += `**Stage:** ${workspace.startupStage}\n`;
  context += `\n---\n\n`;

  for (const section of workspace.sections) {
    if (section.content && section.generationStatus === "completed") {
      const meta = SECTION_META[section.type as SectionType];
      const label = meta?.label || section.type;
      const truncated =
        section.content.length > 2000
          ? section.content.slice(0, 2000) + "\n...(truncated)"
          : section.content;
      context += `## ${label}\n\n${truncated}\n\n---\n\n`;
    }
  }

  return context;
}
