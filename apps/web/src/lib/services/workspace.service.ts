import { prisma } from "@/lib/db/client";
import { SECTION_TYPES } from "@/lib/constants/sections";
import type { CreateWorkspaceInput } from "@/lib/validators/workspace";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export async function createWorkspace(
  userId: string,
  input: CreateWorkspaceInput,
) {
  const slug = generateSlug(input.name);

  return prisma.workspace.create({
    data: {
      userId,
      name: input.name,
      idea: input.idea,
      industry: input.industry || null,
      startupStage: input.startupStage,
      slug,
      sections: {
        create: SECTION_TYPES.map((type) => ({ type })),
      },
    },
    include: { sections: true },
  });
}

export async function getUserWorkspaces(
  userId: string,
  status: "active" | "archived" = "active",
) {
  return prisma.workspace.findMany({
    where: {
      userId,
      status,
      deletedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    include: {
      sections: {
        select: { type: true, generationStatus: true },
      },
    },
  });
}

export async function searchWorkspaces(userId: string, query: string) {
  return prisma.workspace.findMany({
    where: {
      userId,
      status: "active",
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { idea: { contains: query, mode: "insensitive" } },
        { industry: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      sections: {
        select: { type: true, generationStatus: true },
      },
    },
  });
}

export async function getWorkspace(userId: string, workspaceId: string) {
  return prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      userId,
      deletedAt: null,
    },
    include: {
      sections: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function renameWorkspace(
  userId: string,
  workspaceId: string,
  name: string,
) {
  const slug = generateSlug(name);
  return prisma.workspace.updateMany({
    where: { id: workspaceId, userId, deletedAt: null },
    data: { name, slug },
  });
}

export async function archiveWorkspace(userId: string, workspaceId: string) {
  return prisma.workspace.updateMany({
    where: { id: workspaceId, userId, deletedAt: null },
    data: { status: "archived", archivedAt: new Date() },
  });
}

export async function unarchiveWorkspace(userId: string, workspaceId: string) {
  return prisma.workspace.updateMany({
    where: { id: workspaceId, userId, deletedAt: null },
    data: { status: "active", archivedAt: null },
  });
}

export async function deleteWorkspace(userId: string, workspaceId: string) {
  return prisma.workspace.updateMany({
    where: { id: workspaceId, userId },
    data: { deletedAt: new Date(), status: "deleted" },
  });
}
