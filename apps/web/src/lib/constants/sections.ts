export const SECTION_TYPES = [
  "overview",
  "market-research",
  "competitors",
  "business-model",
  "architecture",
  "database",
  "api-design",
  "ui-ux",
  "marketing",
  "roadmap",
  "pitch-deck",
  "files",
  "ai-chat",
  "notes",
  "settings",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_LABELS: Record<SectionType, string> = {
  overview: "Overview",
  "market-research": "Market Research",
  competitors: "Competitors",
  "business-model": "Business Model",
  architecture: "Architecture",
  database: "Database",
  "api-design": "API Design",
  "ui-ux": "UI/UX",
  marketing: "Marketing",
  roadmap: "Roadmap",
  "pitch-deck": "Pitch Deck",
  files: "Files",
  "ai-chat": "AI Chat",
  notes: "Notes",
  settings: "Settings",
};
