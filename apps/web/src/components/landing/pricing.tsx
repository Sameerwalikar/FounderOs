"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    credits: "10 Credits",
    features: [
      "10 AI Credits/month",
      "1 Workspace",
      "Basic Startup Blueprint",
      "Limited AI Chat",
      "Community Support",
    ],
    cta: "Get Started",
    highlighted: false,
    tag: null,
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    credits: "250 Credits",
    features: [
      "250 AI Credits/month",
      "Unlimited Workspaces",
      "Unlimited AI Chat",
      "PDF Export",
      "Markdown Export",
      "Blueprint Regeneration",
      "Version History",
      "Priority AI Queue",
    ],
    cta: "Start Pro",
    highlighted: true,
    tag: "Popular",
  },
  {
    name: "Scale",
    price: "₹299",
    period: "/month",
    credits: "800 Credits",
    features: [
      "800 AI Credits/month",
      "Everything in Pro",
      "Advanced Startup Analysis",
      "Faster AI Generation",
      "Premium Templates",
      "Priority Support",
      "Early Access Features",
    ],
    cta: "Start Scale",
    highlighted: false,
    tag: null,
  },
  {
    name: "Team",
    price: "₹699",
    period: "/month",
    credits: "2500 Credits",
    features: [
      "2500 AI Credits/month",
      "Everything in Scale",
      "Team Collaboration",
      "Shared Workspaces",
      "Invite Members",
      "Team Analytics",
      "Admin Controls",
    ],
    cta: "Start Team",
    highlighted: false,
    tag: null,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                plan.highlighted
                  ? "border-primary bg-card shadow-lg hover:bg-white dark:hover:bg-zinc-900"
                  : "border-border/50 bg-card hover:bg-white dark:hover:bg-zinc-900",
              )}
            >
              {/* Tag badge */}
              {plan.tag && (
                <span className="absolute left-3 top-3 rounded-full bg-green-400 px-3 py-1 text-[11px] font-medium text-black">
                  {plan.tag}
                </span>
              )}

              {/* Wrapper with animated spacing */}
              <div className="flex flex-col items-center gap-4">
                {/* Credits display (shrinks on hover like card-image) */}
                <div className="flex h-[100px] w-full items-center justify-center rounded-lg bg-muted/50 transition-all duration-300 group-hover:h-[60px]">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <p className="text-xs text-muted-foreground">{plan.period}</p>
                  </div>
                </div>

                {/* Plan info */}
                <div className="w-full text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    {plan.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {plan.credits}
                  </p>
                </div>

                {/* Features */}
                <ul className="w-full space-y-2">
                  {plan.features.slice(0, 5).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-xs text-muted-foreground/60">
                      +{plan.features.length - 5} more features
                    </li>
                  )}
                </ul>

                {/* CTA Button (slides up on hover) */}
                <Link href="/sign-up" className="w-full">
                  <button
                    type="button"
                    className={cn(
                      "mt-2 w-full rounded-full py-2.5 text-sm font-medium transition-all duration-300 group-hover:mt-0",
                      plan.highlighted
                        ? "bg-foreground text-background hover:bg-green-400 hover:text-black"
                        : "bg-foreground text-background hover:bg-green-400 hover:text-black",
                    )}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
