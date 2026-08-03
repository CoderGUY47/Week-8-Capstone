"use client";

import { useRef, useEffect, KeyboardEvent, useCallback, useState } from "react";
import {
  FiChevronDown,
  FiSend,
  FiCheck,
  FiZap,
  FiCpu,
  FiGlobe,
} from "react-icons/fi";
import { BiSolidSend } from "react-icons/bi";
import { PiCirclesThreePlus } from "react-icons/pi";
import { TbUnlink } from "react-icons/tb";
import { RiGalleryLine } from "react-icons/ri";
import { LuAudioLines } from "react-icons/lu";
import {
  LiaMicrophoneSolid,
  LiaMicrophoneSlashSolid,
  LiaAirbnb,
} from "react-icons/lia";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";

type ButtonState = "idle" | "composing" | "streaming" | "stopped" | "error";

interface ModelItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
}

interface AttachedFile {
  name: string;
  isImage: boolean;
}

const MODELS: ModelItem[] = [
  {
    id: "oxie-3.7-sonnet",
    name: "Oxie 3.7 Sonnet High",
    badge: "Default",
    description: "Fastest coding, debugging & general intelligence",
    icon: FiZap,
  },
  {
    id: "oxie-deepthink-r1",
    name: "Oxie DeepThink (R1)",
    badge: "Reasoning",
    description: "Deep chain-of-thought math & architecture planning",
    icon: FiCpu,
  },
  {
    id: "oxie-search-2026",
    name: "Oxie Live Search (2026)",
    badge: "Realtime",
    description: "Fetches live web news, documentation & 2026 data",
    icon: FiGlobe,
  },
];

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
  hasError?: boolean;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
  hasError = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Model dropdown open state
  const [isModelOpen, setIsModelOpen] = useState(false);

  // Close model dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target as Node)
      ) {
        setIsModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // State for working Voice & Audio features & File attachments
  const [selectedModel, setSelectedModel] = useState<ModelItem>(MODELS[0]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Compute button state
  const buttonState: ButtonState = (() => {
    if (hasError) return "error";
    if (isLoading) return "streaming";
    if (input.trim().length > 0) return "composing";
    return "idle";
  })();

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Listen for starter-prompt custom events from empty state
  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      onInputChange(prompt);
      textareaRef.current?.focus();
    };
    window.addEventListener("starter-prompt", handler);
    return () => window.removeEventListener("starter-prompt", handler);
  }, [onInputChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isLoading && input.trim()) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [isLoading, input, onSubmit],
  );

  const handleButtonClick = useCallback(() => {
    if (buttonState === "streaming") {
      onStop();
    } else if (buttonState === "composing") {
      onSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [buttonState, onStop, onSubmit]);

  // Working File Attachment Handler
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newItems: AttachedFile[] = files.map((f) => ({
        name: f.name,
        isImage: f.type.startsWith("image/"),
      }));
      setAttachedFiles((prev) => [...prev, ...newItems]);
    }
  };

  // Working Voice Input Toggle
  const handleVoiceToggle = () => {
    setIsRecordingVoice((prev) => !prev);
  };

  // Working Audio Toggle
  const handleAudioToggle = () => {
    setIsAudioEnabled((prev) => !prev);
  };

  const codeFiles = attachedFiles.filter((f) => !f.isImage);
  const imageFiles = attachedFiles.filter((f) => f.isImage);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      {/* Hidden file input for attachment upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />

      <form onSubmit={onSubmit} className="block w-full">
        {/* Main Input Box: Always sleek #161a22 container without red overlays */}
        <div className="w-full bg-[#161a22] border border-white/10 focus-within:border-white/20 rounded-md p-3 flex flex-col gap-2.5 relative transition-colors shadow-sm">
          {/* Active Voice Recording Indicator */}
          {isRecordingVoice && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/40 text-indigo-300 rounded-sm text-xs font-semibold border border-indigo-500/30">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <DotLottieReact
                  src="/animations/audio-recording.lottie"
                  loop
                  autoplay
                  style={{ width: 24, height: 24 }}
                />
              </div>
              <span>Listening to voice prompt…</span>
              <button
                type="button"
                onClick={() => setIsRecordingVoice(false)}
                className="ml-auto bg-transparent border-0 text-indigo-300 cursor-pointer font-bold text-xs hover:underline"
              >
                Stop
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            id="chat-input"
            className="w-full bg-transparent border-0 outline-none resize-none text-[15px] text-white placeholder-white/60 min-h-10 max-h-50 leading-relaxed p-0"
            placeholder="Type / for skills or ask Oxie anything…"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Chat message input"
            aria-multiline="true"
            suppressHydrationWarning
          />

          <div className="flex items-center justify-between pt-1 gap-2 border-t border-white/10">
            {/* Left: LiaAirbnb icon + Resources button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAttachmentClick}
                title="Airbnb option"
                className="w-7 h-7 rounded-sm flex items-center justify-center text-white hover:text-white hover:bg-[#1e2330] border border-white/10 hover:border-white/20 cursor-pointer transition-colors shrink-0 bg-[#161a22]"
              >
                <LiaAirbnb className="w-4.5 h-4.5 text-white" />
              </button>

              <button
                type="button"
                onClick={handleAttachmentClick}
                title="Resources"
                className="h-7 px-2 rounded-sm flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white hover:bg-[#1e2330] border border-white/10 hover:border-white/20 cursor-pointer transition-colors shrink-0 bg-[#161a22]"
              >
                <HiOutlineInboxArrowDown className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Resources</span>
              </button>

              {/* Code/Text files badge with TbUnlink icon */}
              {codeFiles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] bg-[#1e2330] text-white px-2 py-0.5 rounded-sm font-semibold border border-white/10">
                  <TbUnlink className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">
                    {codeFiles.length} file{codeFiles.length > 1 ? "s" : ""}
                  </span>
                </span>
              )}

              {/* Image files badge with RiGalleryLine icon */}
              {imageFiles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] bg-indigo-950/40 text-white px-2 py-0.5 rounded-sm font-semibold border border-indigo-500/30">
                  <RiGalleryLine className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">
                    {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""}
                  </span>
                </span>
              )}
            </div>

            {/* Right: Model Selector + Voice + Audio + Send Toolbar */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* ── Model Selector Dropdown ── */}
              <div className="relative" ref={modelDropdownRef}>
                {/* Selector Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsModelOpen((v) => !v)}
                  className={cn(
                    "flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-sm text-[12.5px] font-semibold cursor-pointer select-none transition-colors border text-white",
                    isModelOpen
                      ? "bg-[#1e2330] text-white border-white/20"
                      : "bg-[#161a22] text-white hover:bg-[#1e2330] hover:text-white border-white/10 hover:border-white/20",
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0 text-white">
                    <selectedModel.icon className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span className="truncate max-w-35 text-white">
                      {selectedModel.name}
                    </span>
                  </div>
                  <FiChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-white shrink-0 transition-transform duration-200",
                      isModelOpen && "rotate-180 text-white",
                    )}
                  />
                </button>

                {/* Dropdown Menu Popup Card */}
                {isModelOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-75 bg-[#161a22] border border-white/15 rounded-md shadow-2xl p-1.5 z-50 text-white">
                    {/* Model Options */}
                    {MODELS.map((model) => {
                      const isSelected = selectedModel.id === model.id;
                      const isLocked = model.id !== "oxie-3.7-sonnet";
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            if (!isLocked) {
                              setSelectedModel(model);
                              setIsModelOpen(false);
                            }
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 rounded-sm cursor-pointer transition-colors text-left border text-white",
                            isSelected
                              ? "bg-[#1e2330] text-white font-semibold border-white/15"
                              : "text-white hover:bg-[#1a1e28] hover:text-white border-transparent hover:border-white/10",
                          )}
                        >
                          {/* Left: Name + Badge + Description */}
                          <div className="flex flex-col gap-0.5 min-w-0 text-white">
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="font-bold text-[13px] leading-none text-white">
                                {model.name}
                              </span>
                              {model.badge !== "Default" && (
                                <span className="inline-flex items-center text-[9.5px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-900/60 text-white border border-indigo-500/30 leading-none">
                                  {model.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11.5px] mt-0.5 leading-snug font-normal text-white">
                              {model.description}
                            </span>
                          </div>

                          {/* Right: Upgrade Button or Checkmark */}
                          <div className="shrink-0 ml-3 text-white">
                            {isLocked ? (
                              <span className="inline-flex items-center text-[11px] font-semibold text-white border border-white/10 rounded-sm px-2.5 py-0.5 bg-[#1a1e28] hover:bg-[#222736] hover:border-white/20 transition-colors">
                                Upgrade
                              </span>
                            ) : isSelected ? (
                              <FiCheck className="w-4 h-4 text-white stroke-[2.5]" />
                            ) : null}
                          </div>
                        </button>
                      );
                    })}

                    {/* Separator */}
                    <div className="my-1 h-px bg-white/10 mx-1" />

                    {/* Effort option */}
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 rounded-sm text-white hover:bg-[#1a1e28] hover:text-white transition-colors border border-transparent hover:border-white/10 text-left"
                    >
                      <span className="font-bold text-[13px] text-white">
                        Effort
                      </span>
                      <div className="flex items-center gap-1 text-white text-[12px]">
                        <span className="text-white">High</span>
                        <FiChevronDown className="w-3.5 h-3.5 text-white -rotate-90" />
                      </div>
                    </button>

                    {/* More models option */}
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 rounded-sm text-white hover:bg-[#1a1e28] hover:text-white transition-colors border border-transparent hover:border-white/10 text-left"
                    >
                      <span className="font-bold text-[13px] text-white">
                        More models
                      </span>
                      <FiChevronDown className="w-3.5 h-3.5 text-white -rotate-90" />
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Mic Button — 3-state: idle → recording (indigo lottie) → slash */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={cn(
                  "w-9 h-9 rounded-sm flex items-center justify-center border cursor-pointer transition-colors shrink-0 overflow-hidden bg-[#161a22]",
                  isRecordingVoice
                    ? "bg-indigo-950/40 border-indigo-500/50 hover:bg-indigo-900/50 text-indigo-300"
                    : "text-slate-300 hover:text-white hover:bg-[#1e2330] border-white/10 hover:border-white/20",
                )}
                title={isRecordingVoice ? "Stop recording" : "Voice input"}
              >
                {isRecordingVoice ? (
                  <DotLottieReact
                    src="/animations/audio-recording.lottie"
                    loop
                    autoplay
                    style={{ width: 28, height: 28 }}
                  />
                ) : (
                  <LiaMicrophoneSolid className="w-5 h-5" />
                )}
              </button>

              {/* Audio Lines Toggle Button */}
              <button
                type="button"
                onClick={handleAudioToggle}
                className={cn(
                  "w-9 h-9 rounded-sm flex items-center justify-center border cursor-pointer transition-colors shrink-0 overflow-hidden bg-[#161a22]",
                  isAudioEnabled
                    ? "text-indigo-300 bg-indigo-950/40 border-indigo-500/50 hover:bg-indigo-900/50"
                    : "text-slate-300 hover:text-white hover:bg-[#1e2330] border-white/10 hover:border-white/20",
                )}
                title={isAudioEnabled ? "Audio enabled" : "Audio muted"}
              >
                {isAudioEnabled ? (
                  <DotLottieReact
                    src="/animations/audio-recording.lottie"
                    loop
                    autoplay
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <LuAudioLines className="w-5 h-5" />
                )}
              </button>

              {/* Send / Stop Button */}
              {buttonState === "streaming" ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="w-9 h-9 rounded-sm flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 cursor-pointer transition-colors shrink-0 overflow-hidden"
                  title="Stop generation"
                >
                  <DotLottieReact
                    src="/animations/loading.lottie"
                    loop
                    autoplay
                    style={{
                      width: 28,
                      height: 28,
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={buttonState === "idle"}
                  className={cn(
                    "w-9 h-9 rounded-sm flex items-center justify-center border transition-colors shrink-0",
                    buttonState === "composing"
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-500/30 cursor-pointer shadow-sm"
                      : "bg-[#1f2430] text-slate-500 border-white/10 cursor-not-allowed",
                  )}
                  title="Send message"
                >
                  <BiSolidSend className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
