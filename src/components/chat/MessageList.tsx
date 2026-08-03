"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { UIMessage } from "ai";
import { HiSparkles } from "react-icons/hi2";
import { BiLogoReact, BiGame } from "react-icons/bi";
import { AiTwotoneBug } from "react-icons/ai";
import { FaLaptopCode } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";
import JumpToLatest from "./JumpToLatest";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

const BOTTOM_THRESHOLD = 80;

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distFromBottom < BOTTOM_THRESHOLD;
    isPinnedRef.current = atBottom;
    setShowJump(!atBottom);
  }, []);

  useEffect(() => {
    if (isPinnedRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const jumpToLatest = useCallback(() => {
    isPinnedRef.current = true;
    setShowJump(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const lastMsg = messages.at(-1);
  const showThinking = isLoading && lastMsg?.role === "user";

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto py-10 scroll-smooth"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-6 min-h-full">
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <EmptyState />
        )}

        {/* Message bubbles */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Thinking indicator */}
        {showThinking && <ThinkingIndicator />}

        {/* Invisible scroll anchor */}
        <div ref={bottomRef} aria-hidden="true" style={{ height: 1 }} />
      </div>

      {/* Jump to latest affordance */}
      {showJump && <JumpToLatest onClick={jumpToLatest} />}
    </div>
  );
}

/* ── Modern Welcome Screen with Starter Prompt Chips ─────────────────── */
function EmptyState() {
  const starterPrompts = [
    {
      title: "Write a React component",
      subtitle: "Tailwind UI component with TypeScript",
      icon: BiLogoReact,
      prompt: "Create a modern React component with TypeScript and Tailwind CSS for a dashboard widget.",
    },
    {
      title: "Debug a complex error",
      subtitle: "Paste your stack trace or logs",
      icon: AiTwotoneBug,
      prompt: "I have a bug in my code. Help me analyze the stack trace and fix the root cause.",
    },
    {
      title: "Architect an API pipeline",
      subtitle: "REST, GraphQL or Next.js API route",
      icon: FaLaptopCode,
      prompt: "Design a clean RESTful API endpoint architecture in Next.js App Router with error handling.",
    },
    {
      title: "Build a game logic script",
      subtitle: "Canvas, WebGL or state engine",
      icon: BiGame,
      prompt: "Write a game loop script in TypeScript with collision detection and state management.",
    },
  ];

  const handlePromptClick = (prompt: string) => {
    window.dispatchEvent(new CustomEvent("starter-prompt", { detail: prompt }));
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto py-12 text-center select-none max-w-2xl mx-auto">
      {/* Main Oxie Logo + Headline */}
      <div className="flex flex-col items-center gap-2.5 mb-8">
        <Image
          src="/images/oxie.png"
          alt="Oxie AI Logo"
          width={190}
          height={190}
          className="w-[190px] h-[190px] object-contain mb-2"
          priority
        />
        <h1 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">
          What can we tackle together?
        </h1>
        <p className="text-white/60 text-sm max-w-md">
          Ask Oxie for coding, architecture design, debugging, or choose a prompt to get started.
        </p>
      </div>

      {/* Quick Starter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {starterPrompts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(item.prompt)}
              className="flex items-center gap-3.5 p-4 rounded-md bg-[#161a22] border border-white/10 hover:border-white/20 hover:bg-[#1f2432] transition-colors cursor-pointer group text-left outline-none shadow-sm"
            >
              <Icon className="w-7 h-7 text-white group-hover:text-white shrink-0 transition-colors" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13.5px] font-semibold text-white group-hover:text-white leading-snug">
                  {item.title}
                </span>
                <span className="text-[11.5px] text-white/60 group-hover:text-white truncate">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
