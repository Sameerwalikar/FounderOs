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
    className: "top-8 left-4",
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
    className: "top-2 right-0",
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
    className: "bottom-16 left-8",
    delay: 1,
  },
  {
    title: "Startup Score",
    content: (
      <div className="mt-2">
        <p className="text-3xl font-bold text-primary">86<span className="text-lg text-muted-foreground">/100</span></p>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[86%] rounded-full bg-primary" />
        </div>
      </div>
    ),
    className: "bottom-4 right-4",
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
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
                🚀 AI Startup Operating System
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Build Your Startup with an{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
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
                <Button variant="outline" size="lg" className="h-11 rounded-full px-8 text-base">
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

          {/* Right side - Floating Cards (desktop only) */}
          <div className="relative hidden h-[500px] lg:block">
            {/* Radial glow behind cards */}
            <div
              className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
              style={{
                background: "radial-gradient(circle, hsl(239 84% 67% / 0.6) 0%, hsl(217 91% 60% / 0.3) 50%, transparent 70%)",
              }}
            />

            {floatingCards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -12, 0],
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
                className={`absolute w-56 rounded-xl border border-border/60 bg-card p-4 shadow-xl ${card.className}`}
              >
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                {card.content}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
