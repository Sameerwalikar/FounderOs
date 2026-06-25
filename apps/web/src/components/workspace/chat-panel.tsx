"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Copy,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ChatPanelProps {
  workspaceId: string;
}

export function ChatPanel({ workspaceId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/chat`);
        if (res.ok) {
          const { data } = await res.json();
          setMessages(data);
        }
      } catch {
        // Silently fail
      } finally {
        setInitialLoading(false);
      }
    }
    loadHistory();
  }, [workspaceId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  async function handleSend(messageText?: string) {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setInput("");
    setSuggestions([]);
    setLoading(true);
    setStreaming(true);
    setStreamContent("");

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/chat`, {
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
            } else if (data.type === "done") {
              setSuggestions(data.suggestions || []);
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
      const assistantMsg: ChatMessage = {
        id: `temp-${Date.now()}-assistant`,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
  }

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">AI Co-Founder</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Ask me anything about your startup. I have full context of your
              blueprint.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                "How can I reach PMF faster?",
                "Find weaknesses in my strategy",
                "What should I build first?",
                "Improve my value proposition",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border",
              )}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: simpleMarkdown(msg.content),
                  }}
                />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
              {msg.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => copyMessage(msg.content)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming response */}
        {streaming && streamContent && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="max-w-[80%] rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <div
                className="prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: simpleMarkdown(streamContent),
                }}
              />
              <Loader2 className="mt-2 h-3 w-3 animate-spin text-primary" />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {streaming && !streamContent && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="border-t border-border px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI co-founder..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {input.length}/2000 · Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

/** Simple markdown to HTML for chat messages */
function simpleMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, "<h4 class='font-semibold mt-3 mb-1'>$1</h4>")
    .replace(/^## (.*$)/gm, "<h3 class='font-semibold mt-3 mb-1'>$1</h3>")
    .replace(/^# (.*$)/gm, "<h3 class='font-bold mt-3 mb-1'>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='bg-muted px-1 rounded text-xs'>$1</code>")
    .replace(/^- (.*$)/gm, "<li class='ml-4'>• $1</li>")
    .replace(/^(\d+)\. (.*$)/gm, "<li class='ml-4'>$1. $2</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
