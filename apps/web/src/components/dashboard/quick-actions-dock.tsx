"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, MessageSquare, Plus, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface QuickActionsDockProps {
  workspaceId: string;
}

interface DockItem {
  icon: ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
}

export function QuickActionsDock({ workspaceId }: QuickActionsDockProps) {
  const items: DockItem[] = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: "Generate Blueprint",
      description: "AI-powered startup plan",
      href: `/workspace/${workspaceId}/overview`,
      color: "text-primary",
      bgColor: "bg-primary/10 group-hover:bg-primary/20",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chat with Co-Founder",
      description: "Ask anything about your startup",
      href: "/dashboard/ai",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
    },
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Create New Startup",
      description: "Start a fresh workspace",
      href: "/dashboard",
      color: "text-green-500",
      bgColor: "bg-green-500/10 group-hover:bg-green-500/20",
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: "Export Blueprint",
      description: "Download as Markdown",
      href: `/workspace/${workspaceId}/overview`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 group-hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{
            y: -6,
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={item.href}
            className="group flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${item.bgColor} ${item.color}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
