"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowUp,
  Bot,
  Copy,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  workspaceId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  messages: { id: string; content: string; createdAt: string | Date }[];
  workspace: { name: string } | null;
}

interface AiCofounderLayoutProps {
  initialConversations: Conversation[];
}

function groupByDate(conversations: Conversation[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 Days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    if (date >= today) {
      groups[0]!.items.push(conv);
    } else if (date >= yesterday) {
      groups[1]!.items.push(conv);
    } else if (date >= weekAgo) {
      groups[2]!.items.push(conv);
    } else {
      groups[3]!.items.push(conv);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

export function AiCofounderLayout({ initialConversations }: AiCofounderLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  // Load conversation messages
  const loadConversation = useCallback(async (convId: string) => {
    setActiveId(convId);
    setMessages([]);
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      if (res.ok) {
        const { data } = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  async function handleNewChat() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const { data } = await res.json();
        setConversations((prev) => [data, ...prev]);
        setActiveId(data.id);
        setMessages([]);
        inputRef.current?.focus();
      }
    } catch {
      // Silently fail
    }
  }

  async function handleSend(messageText?: string) {
    const text = messageText || input.trim();
    if (!text || loading) return;

    let targetId = activeId;

    // If no active conversation, create one
    if (!targetId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const { data } = await res.json();
          setConversations((prev) => [data, ...prev]);
          targetId = data.id;
          setActiveId(data.id);
        } else {
          return;
        }
      } catch {
        return;
      }
    }

    setInput("");
    setLoading(true);
    setStreaming(true);
    setStreamContent("");

    // Add user message immediately
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`/api/conversations/${targetId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let readerDone = false;

      while (!readerDone) {
        const result = await reader.read();
        readerDone = result.done;
        if (readerDone) break;

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "chunk") {
              fullContent += data.content;
              setStreamContent(fullContent);
            } else if (data.type === "error") {
              fullContent += `\n\n⚠️ Error: ${data.error}`;
              setStreamContent(fullContent);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      // Add assistant message
      const assistantMsg: Message = {
        id: `temp-${Date.now()}-assistant`,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Update conversation title in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId && c.title === "New Chat"
            ? { ...c, title: text.slice(0, 80) + (text.length > 80 ? "..." : ""), updatedAt: new Date().toISOString() }
            : c.id === targetId
              ? { ...c, updatedAt: new Date().toISOString() }
              : c,
        ),
      );
    } catch {
      const errorMsg: Message = {
        id: `temp-${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setStreaming(false);
      setStreamContent("");
      inputRef.current?.focus();
    }
  }

  async function handleDelete(convId: string) {
    try {
      await fetch(`/api/conversations/${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeId === convId) {
        setActiveId(null);
        setMessages([]);
      }
    } catch {
      // Silently fail
    }
  }

  async function handleRename(convId: string) {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await fetch(`/api/conversations/${convId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: editTitle.trim() } : c)),
      );
    } catch {
      // Silently fail
    } finally {
      setEditingId(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
  }

  const grouped = groupByDate(conversations);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-border/50 bg-card/30 transition-all duration-200",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border/50 p-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Chats
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNewChat}
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {grouped.map((group) => (
            <div key={group.label}>
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer transition-colors",
                      activeId === conv.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                    onClick={() => loadConversation(conv.id)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    {editingId === conv.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRename(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(conv.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 bg-transparent text-xs outline-none border-b border-primary"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="flex-1 truncate text-xs">
                        {conv.title}
                      </span>
                    )}
                    {/* Actions */}
                    <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(conv.id);
                          setEditTitle(conv.title);
                        }}
                        className="rounded p-0.5 hover:bg-accent"
                        title="Rename"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conv.id);
                        }}
                        className="rounded p-0.5 hover:bg-destructive/20 text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {conversations.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              
            </div>
            <span className="text-sm font-semibold">AI Co-Founder</span>
          </div>
        </div>

        {/* Messages or Welcome */}
        {!activeId && messages.length === 0 ? (
          <WelcomeScreen onSend={handleSend} />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-16">
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    {msg.role === "assistant" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {msg.role === "assistant" ? (
                        <div className="prose-container">
                          <MarkdownRenderer content={msg.content} />
                          <button
                            type="button"
                            onClick={() => copyMessage(msg.content)}
                            className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm pt-1.5">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Streaming response */}
                {streaming && streamContent && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <MarkdownRenderer content={streamContent} />
                      <Loader2 className="mt-2 h-3 w-3 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                {/* Typing indicator */}
                {streaming && !streamContent && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border/50 px-4 py-4 lg:px-16">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your AI co-founder..."
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                    disabled={loading}
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                  AI Co-Founder can make mistakes. Verify important info.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Welcome Screen shown when no conversation is active */
function WelcomeScreen({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function adjustHeight(reset?: boolean) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) {
      textarea.style.height = "60px";
      return;
    }
    textarea.style.height = "60px";
    const newHeight = Math.max(60, Math.min(textarea.scrollHeight, 200));
    textarea.style.height = `${newHeight}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSend(input.trim());
        setInput("");
        adjustHeight(true);
      }
    }
  }

  const actionButtons = [
    { icon: <Bot className="w-4 h-4" />, label: "Build MVP Roadmap" },
    { icon: <MessageSquare className="w-4 h-4" />, label: "Pitch Deck Help" },
    { icon: <Send className="w-4 h-4" />, label: "Marketing Strategy" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold tracking-tight">
          What can I help you build?
        </h1>

        {/* V0-style Input */}
        <div className="w-full">
          <div className="relative rounded-xl border border-border bg-card">
            <div className="overflow-y-auto">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI Co-Founder a question..."
                className="w-full resize-none bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0 min-h-[60px]"
                style={{ overflow: "hidden" }}
              />
            </div>
            <div className="flex items-center justify-between p-3">
              <div />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (input.trim()) {
                      onSend(input.trim());
                      setInput("");
                      adjustHeight(true);
                    }
                  }}
                  className={cn(
                    "rounded-lg p-1.5 text-sm transition-colors border border-border",
                    input.trim()
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {actionButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => onSend(btn.label)}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

