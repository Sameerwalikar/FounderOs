"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkspaceActionsProps {
  workspace: {
    id: string;
    name: string;
    status: string;
  };
  action: "rename" | "archive" | "unarchive" | "delete" | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function WorkspaceActions({
  workspace,
  action,
  onClose,
  onUpdate,
}: WorkspaceActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(workspace.name);
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState("");

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!newName.trim()) {
      setError("Workspace name cannot be empty");
      return;
    }
    if (newName.length > 100) {
      setError("Workspace name must be 100 characters or fewer");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to rename workspace");
        return;
      }

      onClose();
      onUpdate();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleArchive() {
    setIsLoading(true);
    try {
      const newStatus = action === "archive" ? "archived" : "active";
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update workspace");
        return;
      }

      onClose();
      onUpdate();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete workspace");
        return;
      }

      onClose();
      onUpdate();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (action === "rename") {
    return (
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent onClose={onClose}>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>
              Enter a new name for your workspace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename} className="space-y-4">
            <div className="space-y-2">
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="Workspace name"
                maxLength={100}
                disabled={isLoading}
                aria-label="Workspace name"
              />
              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Rename
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  if (action === "archive" || action === "unarchive") {
    const isArchiving = action === "archive";
    return (
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent onClose={onClose}>
          <DialogHeader>
            <DialogTitle>
              {isArchiving ? "Archive" : "Unarchive"} Workspace
            </DialogTitle>
            <DialogDescription>
              {isArchiving
                ? "This workspace will be moved to your archived list. You can restore it later."
                : "This workspace will be restored to your active list."}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchive}
              disabled={isLoading}
              variant={isArchiving ? "default" : "default"}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isArchiving ? "Archive" : "Unarchive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (action === "delete") {
    const canDelete = confirmName === workspace.name;
    return (
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent onClose={onClose}>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Workspace
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All sections and content will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">
              Type <strong>{workspace.name}</strong> to confirm deletion:
            </p>
            <Input
              value={confirmName}
              onChange={(e) => {
                setConfirmName(e.target.value);
                setError("");
              }}
              placeholder="Type workspace name to confirm"
              disabled={isLoading}
              aria-label="Confirm workspace name"
            />
            {error && (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || !canDelete}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
