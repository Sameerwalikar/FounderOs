import type { Metadata } from "next";
import { Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mx-auto max-w-md text-center">
        <Rocket className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold">Your Workspaces</h1>
        <p className="mt-2 text-muted-foreground">
          No workspaces yet. Create your first one to get started.
        </p>
      </div>
    </div>
  );
}
