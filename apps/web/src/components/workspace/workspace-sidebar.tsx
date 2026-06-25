"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SECTION_LABELS,
  SECTION_TYPES,
} from "@/lib/constants/sections";
import type { SectionType } from "@/lib/constants/sections";

interface WorkspaceSidebarProps {
  workspaceId: string;
  workspaceName: string;
  sections: { type: string; status: string }[];
}

export function WorkspaceSidebar({
  workspaceId,
  workspaceName,
  sections,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();

  function getStatusDot(type: string) {
    const section = sections.find((s) => s.type === type);
    const status = section?.status ?? "pending";

    switch (status) {
      case "completed":
        return "bg-green-500";
      case "generating":
        return "bg-blue-500 animate-pulse";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  }

  return (
    <aside className="hidden w-56 flex-col border-r border-border bg-card lg:flex">
      <div className="border-b border-border p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Dashboard
        </Link>
        <h2 className="mt-2 line-clamp-1 text-sm font-semibold">
          {workspaceName}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Workspace sections">
        {SECTION_TYPES.map((type) => {
          const href = `/dashboard/workspace/${workspaceId}/${type}`;
          const isActive = pathname === href;
          const label = SECTION_LABELS[type as SectionType];

          return (
            <Link
              key={type}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", getStatusDot(type))}
                aria-hidden="true"
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
