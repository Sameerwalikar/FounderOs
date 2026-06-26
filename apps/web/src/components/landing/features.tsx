"use client";

import {
  BarChart3,
  Brain,
  Code2,
  FileText,
  Lightbulb,
  Palette,
  Target,
  TrendingUp,
} from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const features = [
  {
    icon: Brain,
    title: "AI Product Analysis",
    description:
      "Get instant feedback on your startup idea with problem validation and value proposition refinement.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Target,
    title: "Market Research",
    description:
      "Competitor analysis, SWOT breakdown, and market sizing generated from your single-sentence idea.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Business Strategy",
    description:
      "Complete Business Model Canvas, revenue models, and pricing strategy tailored to your domain.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Code2,
    title: "Technical Architecture",
    description:
      "Tech stack recommendations, database schema, and API design based on your product requirements.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    title: "Marketing Plan",
    description:
      "Go-to-market strategy with SEO keywords, launch checklist, and social media playbook.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "User flows, wireframe descriptions, landing page copy, and design system recommendations.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Lightbulb,
    title: "Development Roadmap",
    description:
      "Phased MVP plan with milestones, timelines, and feature prioritization by impact and effort.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: FileText,
    title: "Investor Pitch Deck",
    description:
      "Presentation-ready slides with speaker notes covering problem, solution, market, and financials.",
    color: "text-red-500",
    bg: "bg-red-500/10",
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

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <CardContainer key={feature.title} className="inter-var">
                <CardBody className="relative h-auto w-full rounded-xl border border-border/50 bg-card p-6 transition-shadow group-hover/card:shadow-2xl group-hover/card:shadow-primary/[0.05] dark:border-white/[0.1]">
                  <CardItem translateZ="50">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                  </CardItem>
                  <CardItem translateZ="40" className="mt-4">
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="30"
                    className="mt-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    {feature.description}
                  </CardItem>
                  <CardItem
                    translateZ="20"
                    className="mt-4 text-[11px] font-medium text-primary"
                  >
                    Learn more →
                  </CardItem>
                </CardBody>
              </CardContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
}
