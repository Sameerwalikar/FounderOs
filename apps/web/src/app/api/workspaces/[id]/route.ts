import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateWorkspaceSchema } from "@/lib/validators/workspace";
import {
  getWorkspace,
  renameWorkspace,
  archiveWorkspace,
  unarchiveWorkspace,
  deleteWorkspace,
} from "@/lib/services/workspace.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  return NextResponse.json({ data: workspace });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateWorkspaceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    if (parsed.data.name) {
      await renameWorkspace(userId, id, parsed.data.name);
    }

    if (parsed.data.status === "archived") {
      await archiveWorkspace(userId, id);
    } else if (parsed.data.status === "active") {
      await unarchiveWorkspace(userId, id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update workspace:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteWorkspace(userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete workspace:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 },
    );
  }
}
