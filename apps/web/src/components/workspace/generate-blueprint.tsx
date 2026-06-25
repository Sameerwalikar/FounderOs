"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_META } from "@/lib/constants/sections";
import type { BlueprintSection } from "@/lib/constants/sections";
import { cn } from "@/lib/utils";

interface GenerateBlueprintProps {
  workspaceId: string;
  hasGeneratedContent: boolean;
}

type SectionStatus = "pending" | "generating" | "completed" | "failed";

interface SectionProgress {
  section: BlueprintSection;
  status: SectionStatus;
  error?: string;
}

const BLUEPRINT_ORDER: BlueprintSection[] = [
  "overview",
  "product-analysis",
  "market-research",
  "business-model",
  "technical-architecture",
  "ui-ux",
  "marketing",
  "roadmap",
  "pitch-deck",
];

export function GenerateBlueprint({
  workspaceId,
  hasGeneratedContent,
}: GenerateBlueprintProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<SectionProgress[]>([]);
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setDone(false);
    setProgress(
      BLUEPRINT_ORDER.map((section) => ({ section, status: "pending" })),
    );

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start generation");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let readerDone = false;

      while (!readerDone) {
        const result = await reader.read();
        readerDone = result.done;
        if (readerDone) break;

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          try {
            const data = JSON.parse(json);

            if (data.status === "done") {
              setDone(true);
              continue;
            }

            setProgress((prev) =>
              prev.map((p) =>
                p.section === data.section
                  ? { ...p, status: data.status, error: data.error }
                  : p,
              ),
            );
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setGenerating(false);
      router.refresh();
    }
  }

  const completedCount = progress.filter((p) => p.status === "completed").length;
  const totalCount = BLUEPRINT_ORDER.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Show generate button if not generating and no progress
  if (!generating && progress.length === 0 && !done) {
    return (
      <Button onClick={handleGenerate} size="lg" className="gap-2">
        <Sparkles className="h-4 w-4" />
        {hasGeneratedContent ? "Regenerate Blueprint" : "Generate Blueprint"}
      </Button>
    );
  }

  // Show progress panel
  return (
    <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {done ? "Blueprint Complete" : "Generating Blueprint..."}
        </h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Section list */}
      <div className="space-y-2">
        {progress.map(({ section, status, error }) => {
          const meta = SECTION_META[section];
          const Icon = meta.icon;
          return (
            <div
              key={section}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                status === "generating" && "bg-primary/5",
                status === "completed" && "text-muted-foreground",
              )}
            >
              {/* Status icon */}
              {status === "pending" && (
                <div className="h-4 w-4 rounded-full border border-border" />
              )}
              {status === "generating" && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {status === "completed" && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {status === "failed" && (
                <X className="h-4 w-4 text-destructive" />
              )}

              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{meta.label}</span>

              {status === "generating" && (
                <span className="text-xs text-primary">Generating...</span>
              )}
              {status === "failed" && (
                <span className="text-xs text-destructive" title={error}>
                  Failed
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Done actions */}
      {done && (
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => {
              setProgress([]);
              setDone(false);
            }}
          >
            View Blueprint
          </Button>
          {progress.some((p) => p.status === "failed") && (
            <Button size="sm" variant="outline" onClick={handleGenerate}>
              Retry Failed
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
