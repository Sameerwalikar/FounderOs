"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function WorkspaceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(value: string) {
    setQuery(value);
    // Future: debounce and filter workspaces client-side or via API
    // For now this is a UI placeholder that will be connected to search API
    if (!value.trim()) {
      router.refresh();
    }
  }

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search workspaces..."
        className="pl-9"
        aria-label="Search workspaces"
      />
    </div>
  );
}
