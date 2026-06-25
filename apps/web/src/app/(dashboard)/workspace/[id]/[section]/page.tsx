import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Clock, Sparkles } from "lucide-react";
import { getWorkspace } from "@/lib/services/workspace.service";
import {
  SECTION_META,
  SECTION_TYPES,
  BLUEPRINT_SECTIONS,
} from "@/lib/constants/sections";
import type { SectionType, BlueprintSection } from "@/lib/constants/sections";
import { Badge } from "@/components/ui/badge";
import { GenerateBlueprint } from "@/components/workspace/generate-blueprint";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

interface SectionPageProps {
  params: Promise<{ id: string; section: string }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id, section } = await params;

  if (!SECTION_TYPES.includes(section as SectionType)) {
    notFound();
  }

  const workspace = await getWorkspace(userId, id);
  if (!workspace) notFound();

  const currentSection = workspace.sections.find((s) => s.type === section);
  const meta = SECTION_META[section as SectionType];
  const Icon = meta.icon;

  const isBlueprint = BLUEPRINT_SECTIONS.includes(section as BlueprintSection);
  const hasContent = Boolean(currentSection?.content);
  const hasAnyGeneratedContent = workspace.sections.some(
    (s) => s.generationStatus === "completed",
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {meta.label}
            </h1>
            <p className="text-sm text-muted-foreground">{meta.description}</p>
          </div>
        </div>
        {isBlueprint && currentSection?.generationStatus === "completed" && (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            Generated
          </Badge>
        )}
        {isBlueprint && currentSection?.generationStatus === "failed" && (
          <Badge variant="destructive">Failed</Badge>
        )}
      </div>

      {/* Content */}
      {hasContent ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6 lg:p-8">
            <MarkdownRenderer content={currentSection!.content!} />
          </div>
          {currentSection?.lastGeneratedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Generated{" "}
              {new Date(currentSection.lastGeneratedAt).toLocaleString()}
            </div>
          )}
        </div>
      ) : isBlueprint ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-gradient-to-b from-card/80 to-card/20 px-8 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-5 text-base font-semibold">
            Generate {meta.label}
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Click the button below to have AI analyze your startup idea and
            create detailed {meta.label.toLowerCase()} content.
          </p>
          <div className="mt-6">
            <GenerateBlueprint
              workspaceId={workspace.id}
              hasGeneratedContent={hasAnyGeneratedContent}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/60 px-8 py-16">
          <Icon className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-sm font-medium">{meta.label}</h3>
          <p className="mt-2 max-w-xs text-center text-xs text-muted-foreground">
            {meta.description}
          </p>
        </div>
      )}
    </div>
  );
}
