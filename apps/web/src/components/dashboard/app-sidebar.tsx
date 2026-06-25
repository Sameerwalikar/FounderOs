"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CreditCard, LayoutDashboard, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="flex w-14 flex-col items-center border-r border-border/50 bg-card/50 py-4 lg:w-56 lg:items-stretch lg:px-3">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 px-2 lg:justify-start"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          F
        </span>
        <span className="hidden text-sm font-bold tracking-tight lg:block">
          FounderOS
        </span>
      </Link>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Main">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors lg:justify-start lg:px-3",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme + User */}
      <div className="mt-auto flex flex-col items-center gap-3 lg:items-stretch">
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
