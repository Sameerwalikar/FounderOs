import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles } from "lucide-react";

interface WorkspaceHeaderProps {
  name: string;
  industry?: string | null;
  startupStage?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function WorkspaceHeader({
  name,
  industry,
  startupStage,
  status: _status,
  createdAt,
  updatedAt,
}: WorkspaceHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-semibold">{name}</h2>
          {industry && (
            <Badge variant="secondary" className="text-[10px]">
              {industry}
            </Badge>
          )}
          {startupStage && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {startupStage}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Created {formatDate(createdAt)}</span>
          <span>·</span>
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Sparkles className="mr-1.5 h-3 w-3" />
          Generate Blueprint
        </Button>
        <Button variant="outline" size="sm" disabled>
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Regenerate
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Download className="mr-1.5 h-3 w-3" />
          Export
        </Button>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
