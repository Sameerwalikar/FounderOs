import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Rocket } from "lucide-react";
import { getUserWorkspaces } from "@/lib/services/workspace.service";
import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { WorkspaceSearch } from "@/components/workspace/workspace-search";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const workspaces = await getUserWorkspaces(userId);
  const firstName = user?.firstName || "there";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      {/* Search */}
      {workspaces.length > 0 && (
        <div className="mt-6">
          <WorkspaceSearch />
        </div>
      )}

      {/* Workspace Grid or Empty State */}
      {workspaces.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-gradient-to-b from-card/80 to-card/20 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Rocket className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">
            Create your first startup blueprint
          </h2>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            Enter your startup idea and let our AI co-founder generate a
            complete business plan, market research, architecture, and more.
          </p>
          <div className="mt-6">
            <CreateWorkspaceDialog />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => {
            const blueprintSections = w.sections.filter(
              (s) =>
                s.type !== "ai-chat" &&
                s.type !== "files" &&
                s.type !== "settings",
            );
            return (
              <WorkspaceCard
                key={w.id}
                id={w.id}
                name={w.name}
                idea={w.idea}
                industry={w.industry}
                startupStage={w.startupStage}
                updatedAt={w.updatedAt.toISOString()}
                sectionsCompleted={
                  blueprintSections.filter(
                    (s) => s.generationStatus === "completed",
                  ).length
                }
                totalSections={blueprintSections.length}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
