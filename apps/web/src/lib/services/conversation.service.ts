import { prisma } from "@/lib/db/client";

export async function createConversation(userId: string, workspaceId?: string) {
  return prisma.conversation.create({
    data: { userId, workspaceId: workspaceId || null, title: "New Chat" },
  });
}

export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { take: 1, orderBy: { createdAt: "desc" } },
      workspace: { select: { name: true } },
    },
    take: 50,
  });
}

export async function getConversation(userId: string, conversationId: string) {
  return prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      workspace: { select: { id: true, name: true, idea: true, industry: true } },
    },
  });
}

export async function updateConversationTitle(
  userId: string,
  conversationId: string,
  title: string,
) {
  return prisma.conversation.updateMany({
    where: { id: conversationId, userId },
    data: { title },
  });
}

export async function deleteConversation(userId: string, conversationId: string) {
  return prisma.conversation.deleteMany({
    where: { id: conversationId, userId },
  });
}
