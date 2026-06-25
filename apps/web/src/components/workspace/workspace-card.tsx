"use client";

import { useRouter } from "next/navigation";
import { Archive, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface WorkspaceCardProps {
  id: string;
  name: string;
  idea: string;
  industry?: string | null;
  updatedAt: string;
  sectionsCompleted: number;
  totalSections: number;
}

export function WorkspaceCard({
  id,
  name,
  idea,
  industry,
  updatedAt,
  sectionsCompleted,
  totalSections,
}: WorkspaceCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const relativeTime = getRelativeTime(new Date(updatedAt));

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
      className="group relative cursor-pointer transition-all hover:border-border/80 hover:shadow-sm"
      onClick={() => router.push(`/dashboard/workspace/${id}`)}
    >
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-semibold">{name}</h3>
          {industry && (
            <Badge variant="secondary" className="mt-1 text-[10px]">
              {industry}
            </Badge>
          )}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
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
              className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-border bg-popover py-1 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                onClick={() => {
                  const newName = prompt("Enter new name:", name);
                  if (
                    newName &&
                    newName.length >= 1 &&
                    newName.length <= 100
                  ) {
                    fetch(`/api/workspaces/${id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: newName }),
                    }).then(() => router.refresh());
                  }
                  setMenuOpen(false);
                }}
              >
                <Pencil className="h-3 w-3" /> Rename
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                onClick={handleArchive}
                disabled={loading}
              >
                <Archive className="h-3 w-3" /> Archive
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-xs text-muted-foreground">{idea}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {sectionsCompleted}/{totalSections} sections
          </span>
          <span>{relativeTime}</span>
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
