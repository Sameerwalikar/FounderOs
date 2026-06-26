import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Rocket,
  Zap,
} from "lucide-react";
import { getUserWorkspaces } from "@/lib/services/workspace.service";
import { getOrCreateSubscription } from "@/lib/billing/subscription.service";
import { PLANS } from "@/lib/constants/plans";
import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { WorkspaceSearch } from "@/components/workspace/workspace-search";
import { Badge } from "@/components/ui/badge";
import { QuickActionsDock } from "@/components/dashboard/quick-actions-dock";

export const metadata: Metadata = {
  title: "Dashboard",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const workspaces = await getUserWorkspaces(userId);
  const subscription = await getOrCreateSubscription(userId);
  const firstName = user?.firstName || "Founder";
  const mostRecent = workspaces[0];

  const planName =
    PLANS[subscription.plan as keyof typeof PLANS]?.name || "Free";
  const creditsRemaining = subscription.creditsRemaining;
  const creditsTotal = subscription.monthlyCredits;


  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Welcome Section */}
      <div className="animate-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            {mostRecent ? (
              <p className="text-sm text-muted-foreground">
                Continue building &ldquo;{mostRecent.name}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ready to build your next big thing?
              </p>
            )}
            {/* Inline credits badge */}
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary" className="gap-1.5 font-normal">
                <Zap className="h-3 w-3 text-primary" />
                {creditsRemaining}/{creditsTotal} credits
              </Badge>
              <Badge variant="outline" className="font-normal">
                {planName} plan
              </Badge>
            </div>
          </div>
          <CreateWorkspaceDialog />
        </div>
      </div>

      {/* Quick Actions Dock */}
      {mostRecent && <QuickActionsDock workspaceId={mostRecent.id} />}

      {/* Search */}
      {workspaces.length > 3 && (
        <div className="mt-8">
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
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Workspaces
            </h2>
            <span className="text-xs text-muted-foreground">
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      )}
    </div>
  );
}
