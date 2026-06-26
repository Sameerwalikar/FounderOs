"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BackgroundGrid } from "@/components/landing/background-grid";

const floatingCards = [
  {
    title: "Market Research",
    content: (
      <div className="mt-2 flex items-end gap-1">
        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm bg-primary/60"
            style={{ height: `${h * 0.4}px` }}
          />
        ))}
      </div>
    ),
    // Top-left, touching globe border
    className: "top-[60px] left-[10px]",
    delay: 0,
  },
  {
    title: "Revenue Forecast",
    content: (
      <div className="mt-2">
        <p className="text-2xl font-bold text-green-500">₹2.4Cr ARR</p>
        <p className="text-xs text-muted-foreground">Projected Year 2</p>
      </div>
    ),
    // Top-right, touching globe border
    className: "top-[40px] right-[10px]",
    delay: 0.5,
  },
  {
    title: "SWOT Analysis",
    content: (
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Strengths</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Weakness</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">Opportunity</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Threats</span>
        </div>
      </div>
    ),
    // Bottom-left, touching globe border
    className: "bottom-[60px] left-[10px]",
    delay: 1,
  },
  {
    title: "Startup Score",
    content: (
      <div className="mt-2">
        <p className="text-3xl font-bold text-primary">
          86<span className="text-lg text-muted-foreground">/100</span>
        </p>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[86%] rounded-full bg-primary" />
        </div>
      </div>
    ),
    // Bottom-right, touching globe border
    className: "bottom-[40px] right-[10px]",
    delay: 1.5,
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-20">
      <BackgroundGrid />

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Content */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
             
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Build Your Startup with an{" "}
              <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-500 dark:from-white dark:via-indigo-300 dark:to-indigo-500 bg-clip-text text-transparent">
  AI Co-Founder
</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Generate market research, business models, technical architecture,
              development roadmaps, and investor pitch decks — all in minutes
              from a single sentence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link href="/sign-up">
                <HoverBorderGradient containerClassName="rounded-full">
                  Start Building →
                </HoverBorderGradient>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full px-8 text-base"
                >
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
            >
              <span>10,000+ Ideas Analyzed</span>
              <span className="hidden sm:inline">·</span>
              <span>AI-Powered</span>
              <span className="hidden sm:inline">·</span>
              <span>Trusted by Founders</span>
            </motion.div>
          </div>

          {/* Right side - Globe + Floating Cards */}
          <div className="relative hidden h-[540px] lg:block">
            {/* Radial glow behind globe */}
            <div
              className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle, hsl(239 84% 67% / 0.6) 0%, hsl(217 91% 60% / 0.3) 50%, transparent 70%)",
              }}
            />

            {/* Globe (center) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative h-[260px] w-[260px]">
                {/* Globe wireframe */}
                <div className="absolute inset-0 rounded-full border border-primary/20" />
                <div className="absolute inset-3 rounded-full border border-primary/15" />
                <div className="absolute inset-6 rounded-full border border-primary/10" />

                {/* Horizontal lines */}
                <div className="absolute left-0 right-0 top-1/4 border-t border-primary/10" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-primary/15" />
                <div className="absolute left-0 right-0 top-3/4 border-t border-primary/10" />

                {/* Vertical ellipses */}
                <div className="absolute inset-0 rounded-full border border-primary/10" style={{ transform: "rotateY(60deg)" }} />
                <div className="absolute inset-0 rounded-full border border-primary/10" style={{ transform: "rotateY(-60deg)" }} />
                <div className="absolute inset-0 rounded-full border border-primary/15" style={{ transform: "rotateY(30deg)" }} />
                <div className="absolute inset-0 rounded-full border border-primary/15" style={{ transform: "rotateY(-30deg)" }} />

                {/* Globe fill */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-blue-500/5" />

                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border border-dashed border-primary/20"
                />

                {/* Pulsing dots on globe */}
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-[30%] top-[35%] h-2 w-2 rounded-full bg-primary"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  className="absolute left-[60%] top-[25%] h-2 w-2 rounded-full bg-blue-500"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                  className="absolute left-[45%] top-[65%] h-2 w-2 rounded-full bg-green-500"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="absolute left-[70%] top-[55%] h-1.5 w-1.5 rounded-full bg-amber-500"
                />
              </div>
            </motion.div>

            {/* Floating cards positioned around the globe (corners) */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: card.delay },
                  scale: { duration: 0.5, delay: card.delay },
                  y: {
                    duration: 4 + card.delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: card.delay,
                  },
                }}
                className={`absolute w-48 rounded-xl border border-border/60 bg-card/90 p-3.5 shadow-lg backdrop-blur-sm ${card.className}`}
              >
                <p className="text-[11px] font-medium text-muted-foreground">
                  {card.title}
                </p>
                {card.content}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
