import { prisma } from "@/lib/db/client";
import { generateContent } from "@/lib/ai/gemini";
import { getPromptForSection } from "@/lib/ai/prompts";
import { BLUEPRINT_SECTIONS } from "@/lib/constants/sections";
import type { BlueprintSection } from "@/lib/constants/sections";

export interface GenerationProgress {
  section: BlueprintSection;
  status: "pending" | "generating" | "completed" | "failed";
  error?: string;
}

export interface GenerationResult {
  completed: BlueprintSection[];
  failed: { section: BlueprintSection; error: string }[];
}

/**
 * Generate a single section for a workspace.
 */
export async function generateSection(
  workspaceId: string,
  section: BlueprintSection,
  context: {
    startupName: string;
    startupIdea: string;
    industry?: string | null;
    startupStage?: string | null;
  },
): Promise<{ success: boolean; error?: string }> {
  // Mark as generating
  await prisma.section.updateMany({
    where: { workspaceId, type: section },
    data: { generationStatus: "generating" },
  });

  try {
    const prompt = getPromptForSection(section, context);
    const content = await generateContent(prompt);

    // Save content — use update on unique constraint instead of updateMany
    const existingSection = await prisma.section.findFirst({
      where: { workspaceId, type: section },
    });

    if (existingSection) {
      await prisma.section.update({
        where: { id: existingSection.id },
        data: {
          content,
          generationStatus: "completed",
          lastGeneratedAt: new Date(),
          currentVersion: existingSection.currentVersion + 1,
        },
      });
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error(`[AI] Section ${section} failed:`, errorMessage);

    // Mark as failed
    await prisma.section.updateMany({
      where: { workspaceId, type: section },
      data: { generationStatus: "failed" },
    });

    return { success: false, error: errorMessage };
  }
}

/**
 * Generate all blueprint sections for a workspace sequentially.
 * Saves each section as it completes. If one fails, continues with the rest.
 */
export async function generateBlueprint(
  workspaceId: string,
  context: {
    startupName: string;
    startupIdea: string;
    industry?: string | null;
    startupStage?: string | null;
  },
): Promise<GenerationResult> {
  const completed: BlueprintSection[] = [];
  const failed: { section: BlueprintSection; error: string }[] = [];

  for (const section of BLUEPRINT_SECTIONS) {
    const result = await generateSection(workspaceId, section, context);

    if (result.success) {
      completed.push(section);
    } else {
      failed.push({ section, error: result.error || "Generation failed" });
    }
  }

  // Update workspace timestamp
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { lastGeneratedAt: new Date() },
  });

  return { completed, failed };
}
