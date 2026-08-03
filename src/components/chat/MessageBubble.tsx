"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { FiCopy, FiCheck, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface MessageBubbleProps {
  message: UIMessage;
}

type LikeState = "none" | "liked" | "disliked";

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [likeState, setLikeState] = useState<LikeState>("none");

  // Extract text from parts (v7 UIMessage)
  const textContent = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  const handleCopy = useCallback(() => {
    if (!textContent) return;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    toast.success("📋 Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [textContent]);

  const handleLike = useCallback(() => {
    setLikeState((prev: LikeState) => {
      const next = prev === "liked" ? "none" : "liked";
      if (next === "liked") toast.info("👍 Feedback recorded: Liked");
      return next;
    });
  }, []);

  const handleDislike = useCallback(() => {
    setLikeState((prev: LikeState) => {
      const next = prev === "disliked" ? "none" : "disliked";
      if (next === "disliked") toast.info("👎 Feedback recorded: Disliked");
      return next;
    });
  }, []);

  return (
    <div
      className={cn(
        "flex gap-3 w-full items-start",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar with bg */}
      {isUser ? (
        <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-1 select-none border border-indigo-500/40 shadow-sm">
          OX
        </span>
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#161a22] border border-white/10 flex items-center justify-center shrink-0 mt-1 select-none shadow-sm">
          <Image
            src="/images/oxie.png"
            alt="Oxie AI"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      )}

      {/* Content column */}
      <div
        className={cn(
          "flex flex-col gap-1.5 max-w-[82%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Bubble */}
        <div
          className={cn(
            "px-3.5 py-2 rounded-md text-[14.5px] leading-relaxed border break-words [overflow-wrap:anywhere] min-w-0 max-w-full overflow-x-auto custom-scrollbar text-white",
            isUser
              ? "bg-indigo-600 text-white border-indigo-500/30"
              : "bg-[#161a22] border-white/10 text-white",
          )}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-white">
              {textContent}
            </span>
          ) : (
            <StreamingMarkdown content={textContent} />
          )}
        </div>

        {/* Action bar */}
        <div
          className={cn(
            "flex items-center gap-1 w-full text-white",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          <button
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11.5px] font-medium transition-colors border cursor-pointer text-white",
              copied
                ? "bg-[#1e2330] border-white/20 text-white"
                : "hover:bg-[#1e2330] border-transparent hover:border-white/10 text-white",
            )}
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy text"}
            aria-label="Copy text"
          >
            {copied ? (
              <>
                <FiCheck className="w-3 h-3 text-white" />
                <span className="text-white">Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3 h-3 text-white" />
                <span className="text-white">Copy</span>
              </>
            )}
          </button>

          {!isUser && (
            <>
              <button
                className={cn(
                  "w-6.5 h-6.5 rounded-sm flex items-center justify-center transition-colors border cursor-pointer text-white",
                  likeState === "liked"
                    ? "bg-[#1e2330] border-white/20 text-white"
                    : "hover:bg-[#1e2330] border-transparent hover:border-white/10 text-white",
                )}
                onClick={handleLike}
                title={likeState === "liked" ? "Liked" : "Like response"}
                aria-label="Like response"
              >
                <FiThumbsUp className="w-3 h-3 text-white" />
              </button>

              <button
                className={cn(
                  "w-6.5 h-6.5 rounded-sm flex items-center justify-center transition-colors border cursor-pointer text-white",
                  likeState === "disliked"
                    ? "bg-red-900/40 border-red-500/30 text-white"
                    : "hover:bg-[#1e2330] border-transparent hover:border-white/10 text-white",
                )}
                onClick={handleDislike}
                title={
                  likeState === "disliked" ? "Disliked" : "Dislike response"
                }
                aria-label="Dislike response"
              >
                <FiThumbsDown className="w-3 h-3 text-white" />
              </button>
            </>
          )}

          {/* Region-based Local Time */}
          <span className="text-[10.5px] text-white/60 font-normal ml-1 select-none">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Code block with Copy button ───────────────────────────── */
function CodeBlock({
  codeString,
  language,
}: {
  codeString: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-md border border-white/10 overflow-hidden bg-[#161a22]">
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1e28] border-b border-white/10">
        <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
          {language}
        </span>
        <button
          className="flex items-center gap-1.5 text-[11.5px] text-white/60 hover:text-white font-medium cursor-pointer border border-transparent hover:border-white/15 rounded-sm px-2 py-0.5 transition-colors"
          onClick={handleCopyCode}
        >
          {copied ? (
            <FiCheck className="w-3 h-3 text-white" />
          ) : (
            <FiCopy className="w-3 h-3 text-white" />
          )}
          <span className="text-white">{copied ? "Copied" : "Copy code"}</span>
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "14px",
            fontSize: "13.5px",
            backgroundColor: "#161a22",
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ── Streaming-safe Markdown renderer ─────────────────────── */
function closeDanglingFences(content: string): string {
  const fenceCount = (content.match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) {
    return content + "\n```";
  }
  return content;
}

function StreamingMarkdown({ content }: { content: string }) {
  const safeContent = closeDanglingFences(content);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          const isBlock = codeString.includes("\n") || !!match;

          return isBlock ? (
            <CodeBlock
              codeString={codeString}
              language={match ? match[1] : "text"}
            />
          ) : (
            <code
              className="bg-slate-100 text-slate-800 border border-black/10 px-1.5 py-0.5 rounded-[4px] text-[12px] font-mono font-semibold"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {safeContent}
    </ReactMarkdown>
  );
}
