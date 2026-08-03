import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatInterface from "@/components/chat/ChatInterface";

// Mock useChat from @ai-sdk/react
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => ({
    messages: [],
    status: "ready",
    error: undefined,
    stop: vi.fn(),
    sendMessage: vi.fn(),
    regenerate: vi.fn(),
  })),
}));

// Mock ai module with proper class constructor
vi.mock("ai", () => ({
  DefaultChatTransport: class DefaultChatTransport {
    constructor() {}
  },
}));

// Mock react-syntax-highlighter
vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}));
vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  oneDark: {},
}));

describe("ChatInterface", () => {
  it("renders the chat interface container", () => {
    render(<ChatInterface />);
    // Should render MessageList (with empty state) and ChatInput
    expect(screen.getByText("What can we tackle together?")).toBeInTheDocument();
  });

  it("renders the chat input area", () => {
    render(<ChatInterface />);
    expect(screen.getByLabelText("Chat message input")).toBeInTheDocument();
  });

  it("does not show error banner by default", () => {
    render(<ChatInterface />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the send button", () => {
    render(<ChatInterface />);
    expect(screen.getByTitle("Send message")).toBeInTheDocument();
  });

  it("does not show regenerate button when no messages", () => {
    render(<ChatInterface />);
    expect(screen.queryByText("Regenerate response")).not.toBeInTheDocument();
  });
});
