import { ThemeToggle } from "@/components/shared/theme-toggle";

export function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="text-sm text-muted-foreground">Dashboard</div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
