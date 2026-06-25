import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getWorkspace } from "@/lib/services/workspace.service";
import { SECTION_LABELS, SECTION_TYPES } from "@/lib/constants/sections";
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
  const label = SECTION_LABELS[section as SectionType];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{label}</h1>
          <p className="text-sm text-muted-foreground">{workspace.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {currentSection?.generationStatus ?? "pending"}
          </Badge>
          <Button disabled size="sm" variant="outline">
            Export
          </Button>
        </div>
      </div>

      {/* Content or Empty State */}
      {currentSection?.content ? (
        <div className="prose prose-invert max-w-none rounded-lg border border-border p-6">
          {currentSection.content}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-sm font-medium">No content yet</h3>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            AI generation will create {label.toLowerCase()} content for your
            startup.
          </p>
          <Button disabled className="mt-4" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Coming soon
          </p>
        </div>
      )}
    </div>
  );
}
