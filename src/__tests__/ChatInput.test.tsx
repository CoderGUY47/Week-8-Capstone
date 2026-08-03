import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/chat/ChatInput";

describe("ChatInput", () => {
  const defaultProps = {
    input: "",
    isLoading: false,
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    onStop: vi.fn(),
    hasError: false,
  };

  it("renders the textarea", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByLabelText("Chat message input")).toBeInTheDocument();
  });

  it("renders the placeholder text", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/ask Oxie anything/i)).toBeInTheDocument();
  });

  it("displays the send button", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTitle("Send message")).toBeInTheDocument();
  });

  it("send button is disabled when input is empty", () => {
    render(<ChatInput {...defaultProps} />);
    const sendBtn = screen.getByTitle("Send message");
    expect(sendBtn).toBeDisabled();
  });

  it("send button is enabled when input has text", () => {
    render(<ChatInput {...defaultProps} input="Hello" />);
    const sendBtn = screen.getByTitle("Send message");
    expect(sendBtn).not.toBeDisabled();
  });

  it("calls onInputChange when typing", async () => {
    const onInputChange = vi.fn();
    render(<ChatInput {...defaultProps} onInputChange={onInputChange} />);
    const textarea = screen.getByLabelText("Chat message input");
    await userEvent.type(textarea, "a");
    expect(onInputChange).toHaveBeenCalled();
  });

  it("shows stop button during streaming", () => {
    render(<ChatInput {...defaultProps} isLoading={true} />);
    expect(screen.getByTitle("Stop generation")).toBeInTheDocument();
  });

  it("calls onStop when stop button is clicked", async () => {
    const onStop = vi.fn();
    render(<ChatInput {...defaultProps} isLoading={true} onStop={onStop} />);
    const stopBtn = screen.getByTitle("Stop generation");
    await userEvent.click(stopBtn);
    expect(onStop).toHaveBeenCalled();
  });

  it("renders the model selector trigger", () => {
    render(<ChatInput {...defaultProps} />);
    // The default model name should be visible
    expect(screen.getByText("Oxie 3.7 Sonnet High")).toBeInTheDocument();
  });

  it("renders voice input button", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTitle("Voice input")).toBeInTheDocument();
  });

  it("renders resources button", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTitle("Resources")).toBeInTheDocument();
  });
});
