import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getWorkspace } from "@/lib/services/workspace.service";
import { SECTION_META } from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workspaces/[id]/export — Export workspace as Markdown
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

  // Build markdown document
  let markdown = `# ${workspace.name}\n\n`;
  markdown += `> ${workspace.idea}\n\n`;
  if (workspace.industry) markdown += `**Industry:** ${workspace.industry}\n`;
  if (workspace.startupStage) markdown += `**Stage:** ${workspace.startupStage}\n`;
  markdown += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;

  for (const section of workspace.sections) {
    if (section.content && section.generationStatus === "completed") {
      const meta = SECTION_META[section.type as SectionType];
      const label = meta?.label || section.type;
      markdown += `# ${label}\n\n`;
      markdown += `${section.content}\n\n`;
      markdown += `---\n\n`;
    }
  }

  // Return as downloadable markdown file
  const filename = `${workspace.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-blueprint.md`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
