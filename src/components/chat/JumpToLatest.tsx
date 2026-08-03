"use client";

import { FiArrowDown } from "react-icons/fi";

interface JumpToLatestProps {
  onClick: () => void;
}

export default function JumpToLatest({ onClick }: JumpToLatestProps) {
  return (
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
      <button
        id="jump-to-latest-btn"
        onClick={onClick}
        aria-label="Jump to latest message"
        className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white border border-black/10 hover:border-black/15 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer outline-none"
      >
        <FiArrowDown className="w-3.5 h-3.5" />
        Jump to latest
      </button>
    </div>
  );
}
