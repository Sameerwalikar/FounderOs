"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BLUEPRINT_SECTIONS,
  SECTION_META,
} from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";

interface WorkspaceShellProps {
  children: React.ReactNode;
  workspaceId: string;
  workspaceName: string;
  industry?: string | null;
  startupStage?: string | null;
  completedSections: number;
  totalSections: number;
  hasGeneratedContent: boolean;
  sections: { type: string; status: string }[];
}

export function WorkspaceShell({
  children,
  workspaceId,
  workspaceName,
  industry,
  startupStage,
  completedSections,
  totalSections,
  hasGeneratedContent,
  sections,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const isComplete = completedSections === totalSections && totalSections > 0;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (response.body) {
        const reader = response.body.getReader();
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
        }
      }
    } catch {
      // Silently handle
    } finally {
      setGenerating(false);
      router.refresh();
    }
  }

  function handleExport() {
    window.open(`/api/workspaces/${workspaceId}/export`, "_blank");
  }

  function getStatusDot(type: string) {
    const section = sections.find((s) => s.type === type);
    if (section?.status === "completed") return "bg-green-500";
    if (section?.status === "generating") return "bg-blue-500 animate-pulse";
    if (section?.status === "failed") return "bg-red-500";
    return "bg-zinc-600";
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold">
                {workspaceName}
              </h1>
              {isComplete && (
                <Badge className="bg-green-500/10 text-[10px] text-green-500 border-green-500/20">
                  Complete
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {industry && <span>{industry}</span>}
              {industry && startupStage && <span>·</span>}
              {startupStage && <span className="capitalize">{startupStage}</span>}
              <span>·</span>
              <span>{completedSections}/{totalSections} sections</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {generating ? "Generating..." : hasGeneratedContent ? "Regenerate" : "Generate"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExport}
            disabled={!hasGeneratedContent}
            title="Export as Markdown"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Blueprint Tabs */}
      <div className="border-b border-border/50 overflow-x-auto">
        <nav className="flex gap-0.5 px-4 lg:px-6" aria-label="Blueprint sections">
          {BLUEPRINT_SECTIONS.map((type) => {
            const href = `/workspace/${workspaceId}/${type}`;
            const isActive = pathname === href;
            const meta = SECTION_META[type as SectionType];

            return (
              <Link
                key={type}
                href={href}
                className={cn(
                  "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    getStatusDot(type),
                  )}
                />
                {meta.label}
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
