import {
  BarChart3,
  Brain,
  Code2,
  FileText,
  Lightbulb,
  type LucideIcon,
  MessageSquare,
  Palette,
  PieChart,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";

/**
 * Blueprint sections — the core AI-generated content areas.
 * Each section is independently generated, edited, and versioned.
 */
export const BLUEPRINT_SECTIONS = [
  "overview",
  "product-analysis",
  "market-research",
  "business-model",
  "technical-architecture",
  "ui-ux",
  "marketing",
  "roadmap",
  "pitch-deck",
] as const;

export type BlueprintSection = (typeof BLUEPRINT_SECTIONS)[number];

/**
 * All section types including utility sections.
 */
export const SECTION_TYPES = [
  ...BLUEPRINT_SECTIONS,
  "ai-chat",
  "files",
  "settings",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export interface SectionMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const SECTION_META: Record<SectionType, SectionMeta> = {
  overview: {
    label: "Overview",
    description: "Startup summary, problem statement, value proposition, and key assumptions",
    icon: Lightbulb,
  },
  "product-analysis": {
    label: "Product Analysis",
    description: "Target audience, user personas, competitive positioning, and feature priorities",
    icon: Brain,
  },
  "market-research": {
    label: "Market Research",
    description: "Market size, trends, competitors, SWOT analysis, and growth potential",
    icon: Target,
  },
  "business-model": {
    label: "Business Model",
    description: "Business Model Canvas, revenue streams, pricing strategy, and cost structure",
    icon: PieChart,
  },
  "technical-architecture": {
    label: "Technical Architecture",
    description: "Tech stack, system design, database schema, and API structure",
    icon: Code2,
  },
  "ui-ux": {
    label: "UI/UX",
    description: "User flows, wireframes, design system, and landing page copy",
    icon: Palette,
  },
  marketing: {
    label: "Marketing",
    description: "Go-to-market strategy, SEO, launch checklist, and social media plan",
    icon: TrendingUp,
  },
  roadmap: {
    label: "Roadmap",
    description: "Development phases, milestones, timelines, and feature prioritization",
    icon: BarChart3,
  },
  "pitch-deck": {
    label: "Pitch Deck",
    description: "Investor slides, speaker notes, financial projections, and funding strategy",
    icon: FileText,
  },
  "ai-chat": {
    label: "AI Chat",
    description: "Chat with your AI co-founder about your startup",
    icon: MessageSquare,
  },
  files: {
    label: "Files",
    description: "Upload and manage documents related to your startup",
    icon: FileText,
  },
  settings: {
    label: "Settings",
    description: "Workspace settings, rename, archive, or delete",
    icon: Rocket,
  },
};
