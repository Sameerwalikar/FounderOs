import { prisma } from "@/lib/db/client";
import { generateContentStream } from "@/lib/ai/gemini";
import { SECTION_META } from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";

interface ChatContext {
  workspaceId: string;
  userId: string;
  userMessage: string;
  conversationId: string;
}

/**
 * Build the full workspace context for the AI chat.
 */
async function buildWorkspaceContext(workspaceId: string): Promise<string> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { sections: true },
  });

  if (!workspace) throw new Error("Workspace not found");

  let context = `# Startup Context\n\n`;
  context += `**Startup Name:** ${workspace.name}\n`;
  context += `**Startup Idea:** ${workspace.idea}\n`;
  if (workspace.industry) context += `**Industry:** ${workspace.industry}\n`;
  if (workspace.startupStage) context += `**Stage:** ${workspace.startupStage}\n`;
  context += `\n---\n\n`;

  for (const section of workspace.sections) {
    if (section.content && section.generationStatus === "completed") {
      const meta = SECTION_META[section.type as SectionType];
      const label = meta?.label || section.type;
      // Truncate very long sections to stay within token limits
      const truncated = section.content.length > 2000
        ? section.content.slice(0, 2000) + "\n...(truncated)"
        : section.content;
      context += `## ${label}\n\n${truncated}\n\n---\n\n`;
    }
  }

  return context;
}

/**
 * Get recent chat history for context (last 10 messages).
 */
async function getChatHistory(conversationId: string): Promise<string> {
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (messages.length === 0) return "";

  const reversed = messages.reverse();
  let history = "## Recent Conversation\n\n";
  for (const msg of reversed) {
    const role = msg.role === "user" ? "User" : "AI Co-Founder";
    history += `**${role}:** ${msg.content.slice(0, 300)}\n\n`;
  }
  return history;
}

const SYSTEM_PROMPT = `You are FounderOS AI — an expert AI Co-Founder and startup advisor.

You have complete access to the user's startup workspace including all generated content.

Your role:
- Act as a senior startup advisor who deeply understands this specific startup
- Reference specific content from the workspace when answering
- Give actionable, specific advice (not generic platitudes)
- Be direct, concise, and practical
- Format responses in clean Markdown with headings, lists, and bold text

Never make up data or ignore the workspace context.`;

/**
 * Generate a chat response with full workspace context (streaming).
 */
export async function* generateChatResponse(
  ctx: ChatContext,
): AsyncGenerator<string> {
  const workspaceContext = await buildWorkspaceContext(ctx.workspaceId);
  const chatHistory = await getChatHistory(ctx.conversationId);

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${workspaceContext}\n\n${chatHistory}\n\n**User's Question:**\n${ctx.userMessage}`;

  yield* generateContentStream(fullPrompt);
}

/**
 * Save a message to chat history.
 */
export async function saveChatMessage(
  conversationId: string,
  userId: string,
  role: "user" | "assistant",
  content: string,
) {
  return prisma.chatMessage.create({
    data: { conversationId, userId, role, content },
  });
}

/**
 * Get chat history for a conversation.
 */
export async function getMessages(conversationId: string) {
  return prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
}

/**
 * Generate suggested follow-up actions.
 */
export function getSuggestedActions(lastResponse: string): string[] {
  const suggestions: string[] = [];

  if (lastResponse.includes("business model") || lastResponse.includes("revenue")) {
    suggestions.push("Improve my pricing strategy");
  }
  if (lastResponse.includes("competitor") || lastResponse.includes("market")) {
    suggestions.push("Analyze more competitors");
  }
  if (lastResponse.includes("MVP") || lastResponse.includes("roadmap")) {
    suggestions.push("Prioritize my MVP features");
  }
  if (lastResponse.includes("investor") || lastResponse.includes("pitch")) {
    suggestions.push("Prepare for investor objections");
  }

  const defaults = [
    "Find weaknesses in my strategy",
    "Suggest ways to reach PMF faster",
    "What should I build first?",
    "Improve my value proposition",
  ];
  for (const d of defaults) {
    if (!suggestions.includes(d) && suggestions.length < 4) {
      suggestions.push(d);
    }
  }

  return suggestions.slice(0, 4);
}
