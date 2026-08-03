import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageList from "@/components/chat/MessageList";
import type { UIMessage } from "ai";

// Mock react-syntax-highlighter
vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}));
vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  oneDark: {},
}));

function createMessage(role: "user" | "assistant", text: string): UIMessage {
  return {
    id: `msg-${Math.random().toString(36).slice(2)}`,
    role,
    parts: [{ type: "text" as const, text }],
    createdAt: new Date(),
  } as UIMessage;
}

describe("MessageList", () => {
  it("renders the empty state when no messages", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(screen.getByText("What can we tackle together?")).toBeInTheDocument();
  });

  it("renders starter prompt cards in empty state", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(screen.getByText("Write a React component")).toBeInTheDocument();
    expect(screen.getByText("Debug a complex error")).toBeInTheDocument();
    expect(screen.getByText("Architect an API pipeline")).toBeInTheDocument();
    expect(screen.getByText("Build a game logic script")).toBeInTheDocument();
  });

  it("renders message bubbles when messages are provided", () => {
    const messages = [
      createMessage("user", "Hello world"),
      createMessage("assistant", "Hi! How can I help?"),
    ];
    render(<MessageList messages={messages} isLoading={false} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Hi! How can I help?")).toBeInTheDocument();
  });

  it("does not show empty state when messages exist", () => {
    const messages = [createMessage("user", "Test")];
    render(<MessageList messages={messages} isLoading={false} />);
    expect(screen.queryByText("What can we tackle together?")).not.toBeInTheDocument();
  });

  it("has correct aria attributes for accessibility", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    const container = screen.getByRole("log");
    expect(container).toHaveAttribute("aria-label", "Chat messages");
    expect(container).toHaveAttribute("aria-live", "polite");
  });

  it("renders the Oxie logo in empty state", () => {
    render(<MessageList messages={[]} isLoading={false} />);
    expect(screen.getByAltText("Oxie AI Logo")).toBeInTheDocument();
  });
});
