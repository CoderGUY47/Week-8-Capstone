import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "@/components/sidebar/Sidebar";
import type { Conversation } from "@/components/sidebar/ConversationItem";

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "First conversation",
    messages: [],
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "conv-2",
    title: "Second conversation",
    messages: [],
    createdAt: new Date("2026-01-02"),
    pinned: true,
  },
];

describe("Sidebar", () => {
  const defaultProps = {
    conversations: mockConversations,
    activeConversationId: "conv-1",
    onNewChat: vi.fn(),
    onSelectConversation: vi.fn(),
    onDeleteConversation: vi.fn(),
    onRenameConversation: vi.fn(),
    onClearAll: vi.fn(),
    onTogglePin: vi.fn(),
  };

  it("renders the Oxie logo and brand name", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Oxie")).toBeInTheDocument();
    expect(screen.getByAltText("Oxie AI Logo")).toBeInTheDocument();
  });

  it("renders the New Chat button", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("New chat")).toBeInTheDocument();
  });

  it("calls onNewChat when New Chat is clicked", async () => {
    const onNewChat = vi.fn();
    render(<Sidebar {...defaultProps} onNewChat={onNewChat} />);
    const newChatBtn = screen.getByText("New chat");
    await userEvent.click(newChatBtn);
    expect(onNewChat).toHaveBeenCalledTimes(1);
  });

  it("renders navigation items", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Chats")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Artifacts")).toBeInTheDocument();
  });

  it("renders pinned conversations under Starred section", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Second conversation")).toBeInTheDocument();
  });

  it("renders conversation titles", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("First conversation")).toBeInTheDocument();
    expect(screen.getByText("Second conversation")).toBeInTheDocument();
  });

  it("renders the footer with user info", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("New User")).toBeInTheDocument();
    expect(screen.getByText("Free plan")).toBeInTheDocument();
  });

  it("renders the Log in link", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("renders search button", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByTitle("Search chats")).toBeInTheDocument();
  });

  it("renders collapse/expand button", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByTitle("Collapse sidebar")).toBeInTheDocument();
  });
});
