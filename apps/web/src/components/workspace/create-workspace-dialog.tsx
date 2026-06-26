"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
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
      router.push(`/workspace/${data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <HoverBorderGradient
        containerClassName="rounded-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 inline h-4 w-4" />
        Create Startup
      </HoverBorderGradient>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="mx-4 flex w-full max-w-[400px] flex-col gap-3 rounded-2xl border border-zinc-700/50 bg-[#1a1a1a] p-6 shadow-2xl"
      >
        {/* Title with pulse dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-500" />
          </span>
          <p className="text-2xl font-semibold tracking-tight text-indigo-400">
            Create Startup
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          Tell us about your startup idea and we&apos;ll build your blueprint.
        </p>

        {/* Startup Name */}
        <label className="relative mt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            maxLength={100}
            disabled={loading}
            className="peer w-full rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3 pb-2 pt-5 text-sm text-white outline-none transition-colors focus:border-indigo-500 placeholder-shown:pt-3"
          />
          <span className="absolute left-3 top-1 text-[11px] font-medium text-indigo-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-indigo-400">
            Startup Name
          </span>
        </label>

        {/* Startup Idea */}
        <label className="relative">
          <textarea
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              setError("");
            }}
            placeholder=" "
            disabled={loading}
            rows={3}
            className="peer w-full resize-none rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3 pb-2 pt-5 text-sm text-white outline-none transition-colors focus:border-indigo-500 placeholder-shown:pt-3"
          />
          <span className="absolute left-3 top-1 text-[11px] font-medium text-indigo-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-indigo-400">
            Startup Idea
          </span>
          <span
            className={cn(
              "block text-right text-[11px]",
              ideaCount > 500 ? "text-red-400" : "text-zinc-500",
            )}
          >
            {ideaCount}/500
          </span>
        </label>

        {/* Industry & Stage */}
        <div className="flex gap-2">
          <label className="relative flex-1">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-indigo-500"
            >
              <option value="">Industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </label>

          <label className="relative flex-1">
            <select
              value={startupStage}
              onChange={(e) => setStartupStage(e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-indigo-500"
            >
              {STARTUP_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
            disabled={loading}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={!isValid || loading}
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
            Create Startup
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-500">
          Your startup blueprint will be generated using AI
        </p>
      </form>
    </div>
  );
}
