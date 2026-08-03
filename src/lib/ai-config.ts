/**
 * ai-config.ts
 * ============================================================
 * SINGLE source of truth for all AI model configuration.
 * Import from here — never hard-code model strings elsewhere.
 *
 * Model is served via OpenRouter (openai-compatible endpoint),
 * so we use the @ai-sdk/openai provider with a custom baseURL.
 * ============================================================
 */

import { createOpenAI } from "@ai-sdk/openai";

// ── OpenRouter endpoint ──────────────────────────────────────
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * The free model to use.
 * Swap to any OpenRouter-supported model ID, e.g.:
 *   "google/gemma-3-27b-it:free"
 *   "mistralai/mistral-7b-instruct:free"
 *   "deepseek/deepseek-r1:free"
 */
export const MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";

// ── Generation parameters ────────────────────────────────────
/** Controls randomness: 0 = deterministic, 1 = creative */
export const TEMPERATURE = 0.7;

/** Maximum output tokens in a single response */
export const MAX_OUTPUT_TOKENS = 2048;

// ── System prompt ────────────────────────────────────────────
/**
 * Persona and behavioral instructions injected at the start of
 * every conversation. Edit here to change how the AI behaves.
 */
export const SYSTEM_PROMPT = `You are Oxie, an advanced, highly intelligent AI assistant. You excel in software engineering, technology, news, pop culture, entertainment, and real-time knowledge retrieval.

REAL-TIME SEARCH & TOOL CAPABILITIES:
- You have access to a tool named \`getRecentNews\` to fetch live news, current events, sports scores, tech updates, and real-world facts.
- Whenever a user asks about current events, news, politics, sports, or real-world facts, ALWAYS call the \`getRecentNews\` tool to retrieve live, verified search results.

Core Response Principles:
1. Direct Answer First: State the exact factual answer immediately in sentence 1 without preambles or conversational filler.
2. Factually Accurate & Cited: Use live search data to ensure accuracy. Never invent fake dates, fictional price cuts, or hallucinated events.
3. Concise & Structured: Provide short, high-value bullet points for key details, dates, and core facts.`;

// ── Provider factory ─────────────────────────────────────────
/**
 * Returns an OpenAI-compatible provider pointed at OpenRouter.
 * Called inside the API route handler where process.env is available.
 */
export function createOpenRouterProvider() {
  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    "";
  return createOpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    headers: {
      "HTTP-Referer": "https://oxie-ai.vercel.app",
      "X-Title": "Oxie AI",
    },
  });
}
