import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkspace } from "@/lib/services/workspace.service";
import { ChatPanel } from "@/components/workspace/chat-panel";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function AIChatPage({ params }: ChatPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const workspace = await getWorkspace(userId, id);
  if (!workspace) notFound();

  return (
    <div className="mx-auto h-[calc(100vh-10rem)] max-w-4xl">
      <ChatPanel workspaceId={workspace.id} />
    </div>
  );
}
