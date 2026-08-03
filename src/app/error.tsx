"use client";

import { useEffect } from "react";

/**
 * error.tsx — Route-level error boundary.
 * Catches runtime errors thrown inside the route (not global crashes).
 */
export default function ChatError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[Route Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0d10] px-6 text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-2xl select-none">
        ⚠️
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-white/60 leading-relaxed">
          {error?.message?.includes("network") || error?.message?.includes("fetch")
            ? "A network error occurred. Check your connection and try again."
            : "An unexpected error occurred while loading the chat."}
        </p>
        {error?.digest && (
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={retry}
        className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors cursor-pointer border border-indigo-500/30"
      >
        Try again
      </button>
    </div>
  );
}

export const unstable_retry = true;
