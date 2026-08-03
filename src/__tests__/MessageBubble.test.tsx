import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageBubble from "@/components/chat/MessageBubble";
import type { UIMessage } from "ai";

// Mock react-syntax-highlighter
vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: { children: string }) => <pre data-testid="syntax-highlighter">{children}</pre>,
}));
vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  oneDark: {},
}));

function createMessage(role: "user" | "assistant", text: string, id?: string): UIMessage {
  return {
    id: id || `msg-${Date.now()}`,
    role,
    parts: [{ type: "text" as const, text }],
    createdAt: new Date(),
  } as UIMessage;
}

describe("MessageBubble", () => {
  it("renders user message text", () => {
    const msg = createMessage("user", "Hello, Oxie!");
    render(<MessageBubble message={msg} />);
    expect(screen.getByText("Hello, Oxie!")).toBeInTheDocument();
  });

  it("renders assistant message text", () => {
    const msg = createMessage("assistant", "Hi there! How can I help?");
    render(<MessageBubble message={msg} />);
    expect(screen.getByText("Hi there! How can I help?")).toBeInTheDocument();
  });

  it("shows user avatar with OX initials", () => {
    const msg = createMessage("user", "Test message");
    render(<MessageBubble message={msg} />);
    expect(screen.getByText("OX")).toBeInTheDocument();
  });

  it("shows assistant avatar image", () => {
    const msg = createMessage("assistant", "Test response");
    render(<MessageBubble message={msg} />);
    const img = screen.getByAltText("Oxie AI");
    expect(img).toBeInTheDocument();
  });

  it("renders copy button", () => {
    const msg = createMessage("assistant", "Some response");
    render(<MessageBubble message={msg} />);
    expect(screen.getByLabelText("Copy text")).toBeInTheDocument();
  });

  it("renders like and dislike buttons for assistant messages", () => {
    const msg = createMessage("assistant", "AI response");
    render(<MessageBubble message={msg} />);
    expect(screen.getByLabelText("Like response")).toBeInTheDocument();
    expect(screen.getByLabelText("Dislike response")).toBeInTheDocument();
  });

  it("does not render like/dislike for user messages", () => {
    const msg = createMessage("user", "User message");
    render(<MessageBubble message={msg} />);
    expect(screen.queryByLabelText("Like response")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Dislike response")).not.toBeInTheDocument();
  });

  it("renders a timestamp", () => {
    const msg = createMessage("user", "Time check");
    render(<MessageBubble message={msg} />);
    // The timestamp shows the current time in HH:MM format
    const timeRegex = /\d{1,2}:\d{2}\s?(AM|PM)?/i;
    const timeElements = screen.getAllByText(timeRegex);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it("applies user styling (indigo bg) for user messages", () => {
    const msg = createMessage("user", "Styled user message");
    render(<MessageBubble message={msg} />);
    const bubble = screen.getByText("Styled user message").closest("div");
    expect(bubble?.className).toContain("bg-indigo-600");
  });

  it("applies assistant styling (dark bg) for assistant messages", () => {
    const msg = createMessage("assistant", "Styled assistant message");
    render(<MessageBubble message={msg} />);
    const text = screen.getByText("Styled assistant message");
    const bubble = text.closest("[class*='bg-']");
    expect(bubble?.className).toContain("bg-[#161a22]");
  });
});
