import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserConversations } from "@/lib/services/conversation.service";
import { AiCofounderLayout } from "@/components/ai/ai-cofounder-layout";

export const metadata: Metadata = {
  title: "AI Co-Founder",
};

export default async function AiPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const conversations = await getUserConversations(userId);

  return <AiCofounderLayout initialConversations={conversations} />;
}
