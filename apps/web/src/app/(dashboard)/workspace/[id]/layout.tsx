import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkspace } from "@/lib/services/workspace.service";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

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

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <WorkspaceSidebar
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        sections={workspace.sections.map((s) => ({
          type: s.type,
          status: s.generationStatus,
        }))}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <WorkspaceHeader
          name={workspace.name}
          status={workspace.status}
          createdAt={workspace.createdAt.toISOString()}
          updatedAt={workspace.updatedAt.toISOString()}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
