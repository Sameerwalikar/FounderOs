"use client";

import { useRouter } from "next/navigation";
import { Archive, Check, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STAGE_LABELS } from "@/lib/validators/workspace";

interface WorkspaceCardProps {
  id: string;
  name: string;
  idea: string;
  industry?: string | null;
  startupStage?: string | null;
  updatedAt: string;
  sectionsCompleted: number;
  totalSections: number;
}

export function WorkspaceCard({
  id,
  name,
  idea,
  industry,
  startupStage,
  updatedAt,
  sectionsCompleted,
  totalSections,
}: WorkspaceCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const relativeTime = getRelativeTime(new Date(updatedAt));
  const stageLabel = startupStage
    ? STAGE_LABELS[startupStage as keyof typeof STAGE_LABELS]
    : null;

  const isComplete = sectionsCompleted === totalSections && totalSections > 0;
  const progressPercent =
    totalSections > 0 ? (sectionsCompleted / totalSections) * 100 : 0;

  async function handleArchive() {
    setLoading(true);
    await fetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });
    router.refresh();
    setLoading(false);
    setMenuOpen(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this workspace? This cannot be undone.",
      )
    ) {
      return;
    }
    setLoading(true);
    await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
    setMenuOpen(false);
  }

  return (
    <Card
      className="group relative cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      onClick={() => router.push(`/workspace/${id}`)}
    >
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="line-clamp-1 font-semibold">{name}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {industry && (
              <Badge variant="secondary" className="text-[10px]">
                {industry}
              </Badge>
            )}
            {stageLabel && (
              <Badge variant="outline" className="text-[10px]">
                {stageLabel}
              </Badge>
            )}
            {isComplete && (
              <Badge className="bg-green-500/10 text-[10px] text-green-500 border-green-500/20">
                <Check className="mr-0.5 h-2.5 w-2.5" />
                Complete
              </Badge>
            )}
          </div>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Workspace actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border bg-popover py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
                onClick={() => {
                  const newName = prompt("Enter new name:", name);
                  if (newName && newName.length >= 1 && newName.length <= 100) {
                    fetch(`/api/workspaces/${id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: newName }),
                    }).then(() => router.refresh());
                  }
                  setMenuOpen(false);
                }}
              >
                <Pencil className="h-3.5 w-3.5" /> Rename
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
                onClick={handleArchive}
                disabled={loading}
              >
                <Archive className="h-3.5 w-3.5" /> Archive
              </button>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{idea}</p>

        {/* Progress Section */}
        <div className="mt-4 space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete ? "bg-green-500" : "bg-primary",
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-medium",
                isComplete ? "text-green-500" : "text-muted-foreground",
              )}
            >
              {isComplete
                ? "Blueprint Complete"
                : sectionsCompleted > 0
                  ? `${sectionsCompleted} / ${totalSections} Sections`
                  : "Not generated"}
            </span>
            <span className="text-muted-foreground">{relativeTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
