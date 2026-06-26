export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    credits: 10,
    maxWorkspaces: 1,
    features: [
      "1 Workspace",
      "10 AI Credits/month",
      "Generate Startup Blueprint",
      "Limited AI Chat",
    ],
    popular: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 99,
    credits: 250,
    maxWorkspaces: -1, // unlimited
    features: [
      "Unlimited Workspaces",
      "250 AI Credits/month",
      "Unlimited AI Chat",
      "PDF Export",
      "Markdown Export",
      "Section Regeneration",
      "Version History",
      "Priority AI Queue",
    ],
    popular: true,
  },
  scale: {
    id: "scale",
    name: "Scale",
    price: 299,
    credits: 800,
    maxWorkspaces: -1,
    features: [
      "Everything in Pro",
      "800 AI Credits",
      "Faster AI Generation",
      "Premium Blueprint Templates",
      "Advanced Startup Analysis",
      "Priority Support",
      "Early Access Features",
    ],
    popular: false,
  },
  team: {
    id: "team",
    name: "Team",
    price: 699,
    credits: 2500,
    maxWorkspaces: -1,
    features: [
      "Everything in Scale",
      "2500 AI Credits",
      "Shared Workspaces",
      "Invite Team Members",
      "Team Billing",
      "Usage Analytics",
      "Admin Controls",
    ],
    popular: false,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const CREDIT_COSTS = {
  GENERATE_BLUEPRINT: 9,
  CHAT_MESSAGE: 1,
  REGENERATE_SECTION: 1,
} as const;
