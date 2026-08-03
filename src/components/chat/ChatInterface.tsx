"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage, DefaultChatTransport } from "ai";
import { useCallback, useEffect, useState, useRef } from "react";
import { FiRefreshCw, FiAlertCircle, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

interface ChatInterfaceProps {
  /** Initial messages to load (e.g. from a saved conversation) */
  initialMessages?: UIMessage[];
  /** Called when conversation messages update for persistence */
  onConversationUpdate?: (messages: UIMessage[]) => void;
}

/**
 * Maps raw error messages to user-friendly descriptions.
 * Never leaks internal server details to the UI.
 */
function getFriendlyError(err?: Error): string {
  if (!err) return "Something went wrong. Please try again.";
  const msg = err.message?.toLowerCase() ?? "";
  if (msg.includes("rate limit") || msg.includes("429"))
    return "You've hit the rate limit. Please wait a moment and try again.";
  if (msg.includes("aborted") || msg.includes("abort")) return ""; // suppress abort errors — user intentionally stopped
  if (
    msg.includes("network") ||
    msg.includes("fetch") ||
    msg.includes("failed to fetch")
  )
    return "Network error. Check your connection and try again.";
  if (msg.includes("stream") || msg.includes("interrupted"))
    return "The response was interrupted mid-stream. Retry to continue.";
  if (msg.includes("500") || msg.includes("server error"))
    return "The server encountered an error. Please try again.";
  if (msg.includes("401") || msg.includes("authentication"))
    return "Authentication error. The API key may be invalid.";
  return "Something went wrong. Please try again.";
}

export default function ChatInterface({
  initialMessages = [],
  onConversationUpdate,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const onConversationUpdateRef = useRef(onConversationUpdate);

  useEffect(() => {
    onConversationUpdateRef.current = onConversationUpdate;
  }, [onConversationUpdate]);

  const { messages, status, error, stop, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: initialMessages,
    onError: (err) => {
      // Suppress abort errors (user clicked Stop)
      if (err?.name === "AbortError" || err?.message?.includes("aborted"))
        return;
      console.error("[ChatInterface] Stream error:", err);
      const friendlyMsg = getFriendlyError(err);
      if (friendlyMsg) {
        toast.error(`⚠️ ${friendlyMsg}`);
      }
      setErrorDismissed(false);
      setIsRetrying(false);
    },
    onFinish: ({ messages: finalMessages }) => {
      onConversationUpdateRef.current?.(finalMessages);
      setIsRetrying(false);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasError = status === "error" && !!error && !errorDismissed;
  const friendlyError = getFriendlyError(error);
  const showError = hasError && !!friendlyError; // hide if friendlyError is empty string (abort)

  // ── Handlers ────────────────────────────────────────────────────

  const handleStop = useCallback(() => {
    stop();
    setTimeout(() => {
      onConversationUpdateRef.current?.(messages);
    }, 50);
  }, [stop, messages]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = inputValue.trim();
      if (!text || isLoading) return;
      setErrorDismissed(false);
      sendMessage({ text });
      setInputValue("");
    },
    [inputValue, isLoading, sendMessage],
  );

  const handleRetry = useCallback(() => {
    if (isLoading || isRetrying) return;
    setIsRetrying(true);
    setErrorDismissed(false);
    regenerate();
  }, [isLoading, isRetrying, regenerate]);

  const handleRegenerate = useCallback(() => {
    if (isLoading) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const text = lastUser.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    if (text) sendMessage({ text });
  }, [messages, isLoading, sendMessage]);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">

      {/* Message thread */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Regenerate button — shown after last assistant message completes */}
      {messages.length > 0 &&
        messages.at(-1)?.role === "assistant" &&
        !isLoading && (
          <div className="flex justify-center pb-1">
            <button
              id="regenerate-btn"
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all outline-none cursor-pointer"
            >
              <FiRefreshCw className="w-3 h-3 text-white" />
              Regenerate response
            </button>
          </div>
        )}

      {/* ── Glassmorphic Single-Line Error Banner (FE-08) ────────────── */}
      {showError && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-3">
          <div
            id="chat-error-banner"
            role="alert"
            aria-live="assertive"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl shadow-black/40"
          >
            {/* Left: Icon + One Line Message */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs font-semibold text-white truncate leading-none">
                {friendlyError}
              </p>
            </div>

            {/* Right Actions: Single-Line Retry Button + Dismiss Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                id="retry-btn"
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-1.5 text-[11.5px] font-bold text-indigo-300 hover:text-white underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRetrying ? (
                  <>
                    <FiRefreshCw className="w-3 h-3 animate-spin text-indigo-300" />
                    <span>Retrying…</span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="w-3 h-3 text-indigo-300" />
                    <span>Retry last message</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setErrorDismissed(true)}
                className="text-white/60 hover:text-white cursor-pointer transition-colors p-0.5"
                aria-label="Dismiss error"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput
        input={inputValue}
        isLoading={isLoading}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onStop={handleStop}
        hasError={showError}
      />
    </div>
  );
}
