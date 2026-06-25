"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { INDUSTRIES, STARTUP_STAGES, STAGE_LABELS } from "@/lib/validators/workspace";

export function CreateWorkspaceDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [startupStage, setStartupStage] = useState<string>("idea");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ideaCount = idea.length;
  const isValid = name.length >= 1 && ideaCount >= 10 && ideaCount <= 500;

  function resetForm() {
    setName("");
    setIdea("");
    setIndustry("");
    setStartupStage("idea");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Startup name is required");
      return;
    }
    if (ideaCount < 10) {
      setError("Your idea must be at least 10 characters");
      return;
    }
    if (ideaCount > 500) {
      setError("Your idea must be 500 characters or fewer");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          idea,
          industry: industry || undefined,
          startupStage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create workspace");
        return;
      }

      const { data } = await res.json();
      setOpen(false);
      resetForm();
      router.push(`/dashboard/workspace/${data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Startup
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Create New Startup</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about your startup idea.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Startup Name */}
          <div>
            <label
              htmlFor="startup-name"
              className="text-sm font-medium"
            >
              Startup Name
            </label>
            <Input
              id="startup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. FoodSaver, LawyerAI, DesignFlow"
              disabled={loading}
              className="mt-1.5"
              maxLength={100}
            />
          </div>

          {/* Startup Idea */}
          <div>
            <label
              htmlFor="startup-idea"
              className="text-sm font-medium"
            >
              Startup Idea
            </label>
            <textarea
              id="startup-idea"
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                setError("");
              }}
              placeholder="e.g. A platform that helps restaurants reduce food waste by connecting them with local food banks and shelters in real-time..."
              className="mt-1.5 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
            <span
              className={cn(
                "mt-1 block text-xs",
                ideaCount > 500 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {ideaCount}/500
            </span>
          </div>

          {/* Industry & Stage row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="industry"
                className="text-sm font-medium"
              >
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading}
              >
                <option value="">Select...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="stage"
                className="text-sm font-medium"
              >
                Stage
              </label>
              <select
                id="stage"
                value={startupStage}
                onChange={(e) => setStartupStage(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading}
              >
                {STARTUP_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Startup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
