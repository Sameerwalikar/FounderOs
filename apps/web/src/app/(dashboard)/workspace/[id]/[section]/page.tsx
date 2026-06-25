import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Clock, Sparkles } from "lucide-react";
import { getWorkspace } from "@/lib/services/workspace.service";
import { SECTION_META, SECTION_TYPES } from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const statusLabel =
    currentSection?.generationStatus === "completed"
      ? "Generated"
      : currentSection?.generationStatus === "generating"
        ? "Generating..."
        : "Not generated";

  const statusVariant =
    currentSection?.generationStatus === "completed"
      ? "default"
      : "secondary";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{meta.label}</h1>
            <p className="text-sm text-muted-foreground">{meta.description}</p>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
      </div>

      {/* Content or Empty State */}
      {currentSection?.content ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            {currentSection.content}
          </div>
          {currentSection.lastGeneratedAt && (
            <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last updated{" "}
              {new Date(currentSection.lastGeneratedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
              <Sparkles className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="mt-5 text-base font-semibold">
              Ready to generate
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Our AI will analyze your startup idea and generate comprehensive{" "}
              {meta.label.toLowerCase()} content tailored to your concept.
            </p>
            <Button disabled className="mt-6" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
            <p className="mt-3 text-xs text-muted-foreground/60">
              AI generation coming soon — uses 1 credit per section
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
