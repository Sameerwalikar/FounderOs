import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="FounderOS"
            className="h-8 w-8 rounded-md"
          />
          <span className="text-base font-semibold tracking-tight">
            FounderOS
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            About
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm transition-all duration-200 hover:bg-accent/80 hover:text-foreground"
            >
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-border/80 text-sm transition-all duration-200 hover:border-foreground/30 hover:bg-accent/50"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
