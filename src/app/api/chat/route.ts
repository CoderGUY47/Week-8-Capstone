/**
 * app/api/chat/route.ts
 * ============================================================
 * Server-side streaming chat route handler (AI SDK v7).
 *
 * Receives: POST { messages: UIMessage[] }
 * Returns:  UI message stream via result.toUIMessageStreamResponse()
 *
 * v7 pattern:
 *   streamText(...).toUIMessageStreamResponse()
 * which replaces the v3/v4 pattern of result.toDataStreamResponse()
 *
 * The API key NEVER touches the client bundle — it lives only
 * in process.env on the server / edge runtime.
 * ============================================================
 */

import { streamText, convertToModelMessages, tool, isStepCount } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { searchWeb } from "@/lib/search";
import {
  createOpenRouterProvider,
  MODEL_ID,
  SYSTEM_PROMPT,
  TEMPERATURE,
  MAX_OUTPUT_TOKENS,
} from "@/lib/ai-config";

// Use Node.js runtime for full telemetry & streaming support
export const runtime = "nodejs";

// Allow up to 60 seconds for long responses
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Create the OpenRouter-backed provider (OpenAI-compatible)
    const openrouter = createOpenRouterProvider();

    const dynamicSystem = `Today's Date: ${new Date().toISOString().split("T")[0]}. MANDATE: State the direct, accurate answer immediately on line 1 without preambles. Rely on getRecentNews tool for real-world news and current events.\n\n${SYSTEM_PROMPT}`;

    const result = streamText({
      model: openrouter(MODEL_ID),
      system: dynamicSystem,
      // v7: convertToModelMessages is async — must be awaited
      messages: await convertToModelMessages(messages),
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      stopWhen: isStepCount(3),
      tools: {
        getRecentNews: tool({
          description:
            "Search the web for real-time news, current events, recent movie releases, technology updates, or facts after 2024.",
          inputSchema: z.object({
            query: z
              .string()
              .describe("The search query to look up live news or facts"),
          }),
          execute: async ({ query }: { query: string }) => {
            console.log(`[Oxie Tool Call] Searching web for: "${query}"`);
            const results = await searchWeb(query);
            return results;
          },
        }),
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "oxie-ai-chat-stream",
      },
    });

    // toUIMessageStreamResponse() is the v7 counterpart to v4's toDataStreamResponse()
    // It produces the SSE format that @ai-sdk/react's useChat expects
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
