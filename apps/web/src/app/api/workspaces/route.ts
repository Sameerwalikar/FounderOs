import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createWorkspaceSchema } from "@/lib/validators/workspace";
import {
  createWorkspace,
  getUserWorkspaces,
  searchWorkspaces,
} from "@/lib/services/workspace.service";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q");
  const status =
    (req.nextUrl.searchParams.get("status") as "active" | "archived") ||
    "active";

  if (query) {
    const workspaces = await searchWorkspaces(userId, query);
    return NextResponse.json({ data: workspaces });
  }

  const workspaces = await getUserWorkspaces(userId, status);
  return NextResponse.json({ data: workspaces });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createWorkspaceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const workspace = await createWorkspace(userId, parsed.data);
    return NextResponse.json({ data: workspace }, { status: 201 });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace. Please try again." },
      { status: 500 },
    );
  }
}
