import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="flex items-center gap-3 pl-12 md:pl-0">
        <span className="text-sm text-muted-foreground">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-xs">
          10 credits
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}
