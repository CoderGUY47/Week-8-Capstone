"use client";

import { useState, useCallback, useEffect } from "react";
import { UIMessage } from "ai";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { BiCrown } from "react-icons/bi";
import { PiUserCircleDuotone } from "react-icons/pi";
import Sidebar from "@/components/sidebar/Sidebar";
import SidebarMobile from "@/components/sidebar/SidebarMobile";
import ChatInterface from "@/components/chat/ChatInterface";
import { Conversation } from "@/components/sidebar/ConversationItem";
import { toast } from "react-toastify";

/**
 * /chat page
 * ----------
 * Assembles the full chat layout:
 *   Desktop:  [Sidebar 280px] [ChatInterface flex-1]
 *   Tablet:   [SidebarMobile 64px] [ChatInterface flex-1]
 *   Mobile:   [ChatInterface full-width]
 *
 * Conversation persistence: localStorage (stretch goal addressed).
 * Each conversation stores its messages so a refresh doesn't lose history.
 */

const STORAGE_KEY = "oxie-ai-conversations";
const ACTIVE_KEY = "oxie-ai-active-conversation";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Hydrate Date objects
    return parsed.map((c: Conversation) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Quota exceeded or private mode — fail silently
  }
}

function generateTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  // v7: extract text from parts
  const content = firstUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
  return content.length > 45 ? content.slice(0, 45) + "\u2026" : content || "New conversation";
}

function createNewConversation(): Conversation {
  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "New conversation",
    messages: [],
    createdAt: new Date(),
  };
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState(0); // Forces ChatInterface remount on new chat

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadConversations();
    if (saved.length > 0) {
      setConversations(saved);
      const savedActive = localStorage.getItem(ACTIVE_KEY);
      const validActive = saved.find((c) => c.id === savedActive);
      setActiveId(validActive ? validActive.id : saved[0].id);
    } else {
      // First visit: create a default conversation
      const first = createNewConversation();
      setConversations([first]);
      setActiveId(first.id);
    }
  }, []);

  // Persist whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
    if (activeId) {
      localStorage.setItem(ACTIVE_KEY, activeId);
    }
  }, [conversations, activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  // ── Handlers ────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    const newConv = createNewConversation();
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setChatKey((k) => k + 1); // Remount ChatInterface with empty messages
    toast.success("✨ New conversation started");
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
    setChatKey((k) => k + 1); // Remount ChatInterface with saved messages
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
          setChatKey((k) => k + 1);
        }
        return next;
      });
      toast.warn("🗑️ Conversation deleted");
    },
    [activeId]
  );

  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    toast.info("✏️ Conversation renamed");
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPinned = !c.pinned;
          toast.info(nextPinned ? "📌 Conversation pinned" : "📌 Conversation unpinned");
          return { ...c, pinned: nextPinned };
        }
        return c;
      })
    );
  }, []);

  const handleClearAll = useCallback(() => {
    if (!confirm("Clear all conversations? This cannot be undone.")) return;
    const newConv = createNewConversation();
    setConversations([newConv]);
    setActiveId(newConv.id);
    setChatKey((k) => k + 1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    toast.warn("🧹 All conversations cleared");
  }, []);

  // Called by ChatInterface after each streamed message
  const handleConversationUpdate = useCallback(
    (messages: UIMessage[]) => {
      if (!activeId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages, title: generateTitle(messages) }
            : c
        )
      );
    },
    [activeId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0d10] text-white dark">
      {/* Desktop sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAll={handleClearAll}
        onTogglePin={handleTogglePin}
      />

      {/* Chat area */}
      <main id="main-content" className="flex flex-col flex-1 overflow-hidden min-w-0 bg-[#0b0d10] text-white" role="main" aria-label="Chat area">
        {/* Top Bar Navigation Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0f1218]/80 backdrop-blur-md text-white" role="banner">
          <div className="flex-1" />

          {/* Center Plan Pill with BiCrown */}
          <button
            type="button"
            aria-label="Current plan: Free. Click to upgrade."
            className="flex items-center gap-1.5 px-3 py-1 bg-[#161a22] rounded-sm text-xs font-semibold text-white hover:text-white cursor-pointer transition-colors border border-white/10 hover:border-white/20"
          >
            <BiCrown className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            <span>Free plan</span>
            <span className="text-white/60 font-bold">· Upgrade</span>
          </button>

          {/* Right Account Link Button with PiUserCircleDuotone */}
          <div className="flex-1 flex justify-end">
            <Link
              href="/login"
              aria-label="Log in to your account"
              className="w-8 h-8 rounded-full bg-[#161a22] hover:bg-[#1f2430] border border-white/10 hover:border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none no-underline focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0b0d10]"
            >
              <PiUserCircleDuotone className="w-7 h-7 text-white" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <ChatInterface
          key={chatKey} // Remounts to reset useChat state
          initialMessages={activeConversation?.messages ?? []}
          onConversationUpdate={handleConversationUpdate}
        />
      </main>
    </div>
  );
}
