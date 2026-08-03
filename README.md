# 🤖 Oxie AI — Production-Ready AI Assistant for Developers & Creators

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Tests](https://img.shields.io/badge/tests-47%20passed-success)](#)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-purple)](#)

---

## 📌 1. Project Brief

**Oxie AI** is a high-performance, real-time AI assistant built specifically for software engineers, technology professionals, and digital creators. Developers frequently context-switch between coding IDEs, search engines, documentation sites, and LLM chat interfaces when debugging or architecting systems. Oxie AI solves this fragmentation by combining low-latency streaming model responses with an automated, multi-tier real-time Web Search Tool (Google News RSS, Perplexity AI, Google CSE, Serper, Tavily, and DuckDuckGo). I built Oxie AI to bridge the gap between static LLM memory boundaries and live post-2024 web data, wrapped in an accessible, glassmorphic dark-theme user experience.

- **Live Production URL:** [https://oxie-ai.vercel.app](https://oxie-ai.vercel.app) *(Default deployment endpoint)*
- **Source Code Repository:** [https://github.com/CoderGUY47/capstone-project](https://github.com/CoderGUY47/capstone-project)

---

## 🚀 2. Quickstart & Local Setup

Running the project locally takes less than **1 minute** with standard package managers.

### Prerequisites
- Node.js 18.x or 20.x
- npm 9+ or pnpm

### One-Command Setup
```bash
# Clone repository
git clone https://github.com/CoderGUY47/capstone-project.git oxie-ai
cd oxie-ai

# Install dependencies and start development server
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ 3. Architecture Overview

Oxie AI uses the **Next.js 16 App Router** pattern with Server-Side Edge API routes, custom React 19 components, and stateful client persistence.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 Browser (Client Side)                  │
                  │  Next.js App Router (React 19, Tailwind v4, Geist)     │
                  └───────────┬────────────────────────────────┬───────────┘
                              │                                │
                     HTTP SSE Stream                     localStorage
                              │                         (Conversations)
                              ▼                                ▼
                  ┌────────────────────────────────────────────────────────┐
                  │            Next.js API Route (/api/chat)               │
                  │              (AI SDK v7 streamText Engine)             │
                  └───────────┬────────────────────────────────┬───────────┘
                              │                                │
                    OpenAI Compatible API               Tool Execution
                              │                                │
                              ▼                                ▼
                  ┌──────────────────────┐        ┌────────────────────────┐
                  │  OpenRouter Model    │        │ Multi-Tier Web Search  │
                  │  (Llama 3.3 70B)     │        │ (Google RSS, Serper,   │
                  └──────────────────────┘        │ Perplexity, Tavily, DDG)│
                                                  └────────────────────────┘
```

### Component Structure
- `src/app/page.tsx` — Landing page with Framer Motion ambient background glow, feature cards, and direct app navigation.
- `src/app/chat/page.tsx` — Main chat application container assembling the desktop sidebar, top toolbar, and active chat interface.
- `src/app/api/chat/route.ts` — Server-side streaming API route handler with tool calling support.
- `src/components/chat/ChatInterface.tsx` — Core chat orchestrator using `@ai-sdk/react`'s `useChat` hook, error boundary fallback, and streaming controls.
- `src/components/chat/MessageList.tsx` — Thread renderer with empty state welcome screen, starter prompt chips, and auto-scroll pinning.
- `src/components/chat/MessageBubble.tsx` — Message renderer with Markdown parser, code syntax highlighting, copy-to-clipboard, and feedback triggers.
- `src/components/chat/ChatInput.tsx` — Multi-modal input toolbar supporting model selection, voice input indicator, resource attachments, and auto-resizing textarea.
- `src/components/sidebar/Sidebar.tsx` — Collapsible navigation sidebar with search filtering, pin/star organization, and conversation management.

---

## 🧠 4. AI Integration Details

Oxie AI uses Vercel **AI SDK v7** (`ai` + `@ai-sdk/openai` + `@ai-sdk/react`) backed by **OpenRouter**.

### Model Choice & Rationale
- **Model:** `meta-llama/llama-3.3-70b-instruct:free`
- **Why:** Delivers SOTA coding, reasoning, and instruction-following capabilities with 70B parameters while keeping response times fast and accessible.

### Real-Time Web Search Tool (`getRecentNews`)
When users ask about news, current events, recent software releases, or facts beyond the training cutoff, the system automatically invokes the `getRecentNews` tool.
- **Failover Chain:**
  1. Google News RSS Feed (Zero-config live news) + Wikipedia MediaWiki API
  2. Perplexity AI Search (Sonar engine)
  3. Google Custom Search Engine (CSE)
  4. Google Serper API
  5. Tavily Search API
  6. DuckDuckGo HTML Fallback parser

### System Prompt Engineering
```ts
export const SYSTEM_PROMPT = `You are Oxie, an advanced, highly intelligent AI assistant. You excel in software engineering, technology, news, pop culture, entertainment, and real-time knowledge retrieval.

REAL-TIME SEARCH & TOOL CAPABILITIES:
- You have access to a tool named \`getRecentNews\` to fetch live news, current events, sports scores, tech updates, and real-world facts.
- Whenever a user asks about current events, news, politics, sports, or real-world facts, ALWAYS call the \`getRecentNews\` tool to retrieve live, verified search results.

Core Response Principles:
1. Direct Answer First: State the exact factual answer immediately in sentence 1 without preambles or conversational filler.
2. Factually Accurate & Cited: Use live search data to ensure accuracy.
3. Concise & Structured: Provide short, high-value bullet points for key details, dates, and core facts.`;
```

---

## 🧪 5. Testing & Quality Assurance

Oxie AI is tested using **Vitest** + **React Testing Library** + **jsdom**.

### Test Suite Execution
```bash
npm run test
```

### Coverage Report
```bash
npm run test:coverage
```

### Test Summary
- **Test Files:** 6 passed (100%)
- **Tests:** 47 passed (100%)
- **Component Coverage:**
  - `Sidebar.tsx`: **73.33%**
  - `MessageList.tsx`: **64.51%**
  - `ChatInput.tsx`: **63.23%**
  - `utils.ts`: **100%**
  - Overall Active Component Coverage: **≥50%**

---

## ♿ 6. Performance & Accessibility Audit

### Accessibility Compliance (WCAG 2.1 AA)
- **Skip Link:** Added `<a href="#main-content">Skip to main content</a>` in `layout.tsx` for keyboard users.
- **Focus Indicators:** Customized high-contrast focus ring (`outline: 2px solid #6366f1`) visible on keyboard tab navigation (`:focus-visible`).
- **ARIA Attributes:** Configured `aria-live="polite"` on message threads, `role="alert"` on error banners, and explicit `aria-label`s on all icon buttons.
- **Color Contrast:** All body text meets or exceeds WCAG 4.5:1 contrast against dark background `#0b0d10`.

### Concrete Improvement Made
- **Audit Finding:** WAVE flagged missing programmatic labels on icon-only toolbar buttons (`Voice Input`, `Audio Enable`, `Resources`, `Collapse Sidebar`).
- **Resolution:** Updated all icon buttons to include explicit `aria-label` and `title` attributes, ensuring full screen reader accessibility.

---

## 🛡️ 7. Resilience, Error Handling & Fallbacks

- **Stream Interruption:** If a SSE response is interrupted mid-stream, a glassmorphic single-line error banner appears with a one-click **"Retry last message"** action.
- **Network Outage:** Friendly network error messages prevent internal stack traces from leaking to the UI.
- **Rate Limit (429):** Automatic rate-limit detection notifies the user gracefully via toast notifications and UI banners.
- **404 & Crash Boundaries:** Custom dark-themed `error.tsx`, `not-found.tsx`, and `global-error.tsx` keep the app stable during unhandled runtime exceptions.

---

## 📋 8. Deployment Checklist & Rollback Plan

### Deployment Checklist (FE-11 Sign-off)
- [x] **Environment Variables Configured:** `OPENROUTER_API_KEY`, search credentials set in production platform.
- [x] **Production Build Verification:** Executed `npm run build` with zero TypeScript or Next.js errors.
- [x] **Unit & Integration Tests:** 47 tests passing with Vitest.
- [x] **Accessibility Verified:** WCAG 2.1 AA compliant keyboard navigation & ARIA roles.
- [x] **Error Handling Tested:** Verified fallback banners and retry mechanisms.
- [x] **Monitoring & Logs:** Vercel Function logs enabled for `/api/chat`.

### Rollback Plan
1. **Primary Rollback:** Redeploy previous git tag or commit from Vercel deployment dashboard in 1 click.
2. **Secondary Rollback:** Execute `git revert HEAD` and push to main branch to trigger automated CI/CD deployment.

---

## 💭 9. Reflection

### What was hardest? Why?
Integrating real-time streaming tool calls alongside UI state updates in AI SDK v7 was the most challenging part. Ensuring that tool results (web search data) were ingested silently on the server while streaming token by token back to the client required fine-tuning `streamText` parameters and message converters.

### What would you do differently next time?
I would implement server-side database persistence (e.g. Supabase or PostgreSQL with Prisma) rather than relying on browser `localStorage` for conversation persistence. While `localStorage` makes local development seamless, cross-device sync would provide a better multi-device user experience.

### One surprising thing learned
I was surprised by how effectively multi-tiered fallback search chains perform without third-party key dependencies when using structured RSS feed parsers combined with client-side failovers. It creates an almost zero-downtime search experience.
