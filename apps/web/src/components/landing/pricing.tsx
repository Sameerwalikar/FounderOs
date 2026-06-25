import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try FounderOS with limited credits",
    features: [
      "10 credits per month",
      "3 workspaces",
      "Product analysis module",
      "Market research module",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "Full access for serious founders",
    features: [
      "100 credits per month",
      "20 workspaces",
      "All 10 AI modules",
      "AI Chat assistant",
      "PDF & Markdown export",
      "Version history (50)",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$79",
    description: "For startup teams",
    features: [
      "200 credits per month",
      "50 workspaces",
      "All Pro features",
      "Team collaboration",
      "Shared workspaces",
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
            Simple pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg"
                  : "border-border/50 bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
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
