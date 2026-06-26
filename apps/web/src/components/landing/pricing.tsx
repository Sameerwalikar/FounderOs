"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Get started with basic AI features",
    features: [
      "10 AI Credits/month",
      "1 Workspace",
      "Basic Startup Blueprint",
      "Limited AI Chat",
      "Community Support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    description: "Full power for serious founders",
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
  },
  {
    name: "Scale",
    price: "₹299",
    period: "/month",
    description: "For growing startups that need more",
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
  },
  {
    name: "Team",
    price: "₹699",
    period: "/month",
    description: "Collaborate with your co-founders",
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
                "relative rounded-xl border p-6 transition-transform duration-200 hover:-translate-y-1",
                plan.highlighted
                  ? "scale-105 border-primary bg-card shadow-2xl"
                  : "border-border/50 bg-card shadow-sm hover:shadow-md"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
