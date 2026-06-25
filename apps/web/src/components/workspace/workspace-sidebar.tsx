"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BLUEPRINT_SECTIONS,
  SECTION_META,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function getStatusColor(type: string) {
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
        return "bg-zinc-600";
    }
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="border-b border-border p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>
        <h2 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">
          {workspaceName}
        </h2>
      </div>

      {/* Blueprint Sections */}
      <nav className="flex-1 overflow-y-auto p-2" aria-label="Blueprint sections">
        <p className="mb-1 px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Blueprint
        </p>
        {BLUEPRINT_SECTIONS.map((type) => {
          const href = `/dashboard/workspace/${workspaceId}/${type}`;
          const isActive = pathname === href;
          const meta = SECTION_META[type as SectionType];
          const Icon = meta.icon;

          return (
            <Link
              key={type}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{meta.label}</span>
              <span
                className={cn(
                  "ml-auto h-1.5 w-1.5 shrink-0 rounded-full",
                  getStatusColor(type),
                )}
                aria-hidden="true"
              />
            </Link>
          );
        })}

        {/* Utility sections */}
        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          {(["ai-chat", "files", "settings"] as const).map((type) => {
            const href = `/dashboard/workspace/${workspaceId}/${type}`;
            const isActive = pathname === href;
            const meta = SECTION_META[type];
            const Icon = meta.icon;

            return (
              <Link
                key={type}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{meta.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-[4.25rem] z-40 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card lg:hidden"
        aria-label="Open workspace navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 inline-flex h-7 w-7 items-center justify-center rounded-md lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
