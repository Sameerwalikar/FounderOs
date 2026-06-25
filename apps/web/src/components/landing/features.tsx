import {
  BarChart3,
  Brain,
  Code2,
  FileText,
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Product Analysis",
    description:
      "Get instant feedback on your startup idea with problem validation and value proposition refinement.",
  },
  {
    icon: Target,
    title: "Market Research",
    description:
      "Competitor analysis, SWOT breakdown, and market sizing generated from your single-sentence idea.",
  },
  {
    icon: BarChart3,
    title: "Business Strategy",
    description:
      "Complete Business Model Canvas, revenue models, and pricing strategy tailored to your domain.",
  },
  {
    icon: Code2,
    title: "Technical Architecture",
    description:
      "Tech stack recommendations, database schema, and API design based on your product requirements.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Plan",
    description:
      "Go-to-market strategy with SEO keywords, launch checklist, and social media playbook.",
  },
  {
    icon: Lightbulb,
    title: "UI/UX Design",
    description:
      "User flows, wireframe descriptions, landing page copy, and design system recommendations.",
  },
  {
    icon: Rocket,
    title: "Development Roadmap",
    description:
      "Phased MVP plan with milestones, timelines, and feature prioritization by impact and effort.",
  },
  {
    icon: FileText,
    title: "Investor Pitch Deck",
    description:
      "Presentation-ready slides with speaker notes covering problem, solution, market, and financials.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to launch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            10 specialized AI modules work together to generate a complete
            startup blueprint from a single sentence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-border"
              >
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
