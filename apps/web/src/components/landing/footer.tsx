"use client";

import { MagneticButton } from "@/components/ui/magnetic-button";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container flex flex-col items-center gap-8">
        {/* Magnetic CTA */}
        <MagneticButton>
          <a
            href="https://linkedin.com/in/sameer-walikar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center rounded-lg bg-gradient-to-b from-primary to-indigo-700 px-6 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 ring-offset-1 ring-offset-primary transition-transform duration-150 ring-inset hover:shadow-xl active:scale-[0.98]"
          >
            Talk to Founder
          </a>
        </MagneticButton>

        {/* Footer content */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:w-full">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FounderOS AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
