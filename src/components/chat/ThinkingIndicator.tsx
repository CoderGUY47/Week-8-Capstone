"use client";

import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ThinkingIndicator() {
  return (
    <div
      className="flex gap-3 w-full"
      aria-label="AI is thinking"
      aria-live="polite"
    >
      {/* Oxie avatar with bg — matches MessageBubble */}
      <div className="w-8 h-8 rounded-full bg-[#161a22] border border-white/10 flex items-center justify-center shrink-0 mt-1 select-none shadow-sm">
        <Image src="/images/oxie.png" alt="Oxie AI" width={24} height={24} className="object-contain" />
      </div>

      {/* Lottie loader + label */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161a22] border border-white/10 rounded-md">
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <DotLottieReact
            src="/animations/loading.lottie"
            loop
            autoplay
          />
        </div>
        <span className="text-[13.5px] text-white font-medium">
          Oxie is thinking…
        </span>
      </div>
    </div>
  );
}
