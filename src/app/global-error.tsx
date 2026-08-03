"use client";

import { useEffect } from "react";

/**
 * global-error.tsx — Root-level error boundary.
 * Catches errors that escape the root layout.
 * MUST render its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          background: "#0b0d10",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(127, 29, 29, 0.4)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🔥
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", margin: 0 }}>
            Application error
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.6, margin: 0 }}>
            A critical error occurred. This has been logged. Refresh the page to continue.
          </p>
        </div>
        <button
          onClick={retry}
          style={{
            padding: "10px 24px",
            background: "#4f46e5",
            color: "white",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload app
        </button>
      </body>
    </html>
  );
}

export const unstable_retry = true;
