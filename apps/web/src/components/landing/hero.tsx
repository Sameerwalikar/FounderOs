import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Your AI Co-Founder
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Submit your startup idea in one sentence. Get a complete business
          blueprint with market research, strategy, architecture, and investor
          materials — all in minutes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
