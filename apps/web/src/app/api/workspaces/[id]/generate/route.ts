import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getWorkspace } from "@/lib/services/workspace.service";
import { generateSection } from "@/lib/ai/orchestrator";
import { BLUEPRINT_SECTIONS } from "@/lib/constants/sections";
import type { BlueprintSection } from "@/lib/constants/sections";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/workspaces/[id]/generate
 * Generate all blueprint sections (or a specific section if ?section= is provided).
 * Uses streaming to report progress section by section.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check if a specific section was requested
  const body = await req.json().catch(() => ({}));
  const requestedSection = body.section as BlueprintSection | undefined;

  const sectionsToGenerate = requestedSection
    ? [requestedSection]
    : [...BLUEPRINT_SECTIONS];

  // Validate requested section
  if (requestedSection && !BLUEPRINT_SECTIONS.includes(requestedSection)) {
    return NextResponse.json(
      { error: "Invalid section type" },
      { status: 400 },
    );
  }

  const context = {
    startupName: workspace.name,
    startupIdea: workspace.idea,
    industry: workspace.industry,
    startupStage: workspace.startupStage,
  };

  // Stream progress using SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const section of sectionsToGenerate) {
        // Send "generating" status
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ section, status: "generating" })}\n\n`,
          ),
        );

        const result = await generateSection(workspace.id, section, context);

        if (result.success) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ section, status: "completed" })}\n\n`,
            ),
          );
        } else {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ section, status: "failed", error: result.error })}\n\n`,
            ),
          );
        }
      }

      // Send completion signal
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "done" })}\n\n`),
      );
      controller.close();
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
