import { z } from "zod";

export const INDUSTRIES = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-Commerce",
  "AI/ML",
  "Marketplace",
  "Social",
  "Developer Tools",
  "CleanTech",
  "FoodTech",
  "PropTech",
  "InsurTech",
  "Gaming",
  "Media",
  "Other",
] as const;

export const STARTUP_STAGES = [
  "idea",
  "validation",
  "mvp",
  "growth",
  "scale",
] as const;

export const STAGE_LABELS: Record<(typeof STARTUP_STAGES)[number], string> = {
  idea: "Idea Stage",
  validation: "Validation",
  mvp: "Building MVP",
  growth: "Growth",
  scale: "Scaling",
};

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Startup name is required")
    .max(100, "Startup name must be 100 characters or fewer"),
  idea: z
    .string()
    .min(10, "Your idea must be at least 10 characters")
    .max(500, "Your idea must be 500 characters or fewer"),
  industry: z.string().optional(),
  startupStage: z.enum(STARTUP_STAGES).default("idea"),
});

export const renameWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name cannot be empty")
    .max(100, "Workspace name must be 100 characters or fewer"),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name cannot be empty")
    .max(100, "Workspace name must be 100 characters or fewer")
    .optional(),
  status: z.enum(["active", "archived"]).optional(),
  industry: z.string().optional(),
  startupStage: z.enum(STARTUP_STAGES).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type RenameWorkspaceInput = z.infer<typeof renameWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
