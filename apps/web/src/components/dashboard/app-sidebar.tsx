"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ai", label: "AI Co-Founder", icon: MessageSquare },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  creditsRemaining?: number;
  creditsTotal?: number;
}

export function AppSidebar({
  creditsRemaining,
  creditsTotal,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const creditPercent =
    creditsRemaining !== undefined && creditsTotal
      ? (creditsRemaining / creditsTotal) * 100
      : null;

  return (
    <aside className="flex w-14 flex-col items-center border-r border-border/50 bg-card/50 py-4 lg:w-56 lg:items-stretch lg:px-3">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 px-2 lg:justify-start"
      >
        <img src="/logo.png" alt="FounderOS" className="h-8 w-8 shrink-0 rounded-lg" />
        <span className="hidden text-sm font-bold tracking-tight lg:block">
          FounderOS
        </span>
      </Link>

      {/* Separator */}
      <div className="mx-2 mt-5 border-t border-border/40 lg:mx-0" />

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Main">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href ||
                pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors lg:justify-start lg:px-3",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              {/* Active left accent */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="mx-2 border-t border-border/40 lg:mx-0" />

      {/* Bottom: Credits + Theme + User */}
      <div className="mt-3 flex flex-col items-center gap-3 lg:items-stretch">
        {/* Credits mini-bar */}
        {creditPercent !== null && (
          <div className="hidden w-full flex-col gap-1 px-1 lg:flex">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Credits</span>
              <span>
                {creditsRemaining}/{creditsTotal}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  creditPercent > 30 ? "bg-primary" : "bg-amber-500",
                )}
                style={{ width: `${creditPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <div className="flex justify-center">
          {mounted && (
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            />
          )}
          {!mounted && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          )}
        </div>
      </div>
    </aside>
  );
}
