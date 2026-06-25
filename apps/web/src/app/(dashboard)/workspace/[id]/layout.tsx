import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkspace } from "@/lib/services/workspace.service";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);
  if (!workspace) notFound();

  const blueprintSections = workspace.sections.filter(
    (s) => s.type !== "ai-chat" && s.type !== "files" && s.type !== "settings",
  );
  const completedCount = blueprintSections.filter(
    (s) => s.generationStatus === "completed",
  ).length;

  return (
    <WorkspaceShell
      workspaceId={workspace.id}
      workspaceName={workspace.name}
      industry={workspace.industry}
      startupStage={workspace.startupStage}
      completedSections={completedCount}
      totalSections={blueprintSections.length}
      hasGeneratedContent={completedCount > 0}
      sections={workspace.sections.map((s) => ({
        type: s.type,
        status: s.generationStatus,
      }))}
    >
      {children}
    </WorkspaceShell>
  );
}
