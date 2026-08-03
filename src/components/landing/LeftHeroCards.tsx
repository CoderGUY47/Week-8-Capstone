"use client";

import { motion } from "framer-motion";
import { FiTerminal, FiZap, FiCpu } from "react-icons/fi";

/**
 * Left side column containing 2 continuous motion floating glassmorphic cards:
 * 1. Live Code Streaming Terminal preview card.
 * 2. Performance Stats card.
 */
export default function LeftHeroCards() {
  return (
    <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 pt-16 self-end">
      {/* Card 1: Code Streaming Terminal Preview */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.7, delay: 0.3 },
          x: { duration: 0.7, delay: 0.3 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="p-4 rounded-md bg-white/10 backdrop-blur-xl border-none shadow-2xl shadow-indigo-950/40 flex flex-col gap-2.5 bg-gradient-to-br from-white/15 via-white/5 to-transparent transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTerminal className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-white font-mono">
              live-agent.ts
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border-none">
            Streaming
          </span>
        </div>
        <div className="font-mono text-[11px] text-indigo-200 leading-relaxed bg-black/40 p-2.5 rounded-[4px] backdrop-blur-md">
          <span className="text-indigo-400">const</span> agent ={" "}
          <span className="text-indigo-400">new</span> OxieStream(&#123;
          <br />
          &nbsp;&nbsp;model:{" "}
          <span className="text-emerald-300">&quot;oxie-3.7-sonnet&quot;</span>,
          <br />
          &nbsp;&nbsp;effort:{" "}
          <span className="text-emerald-300">&quot;high&quot;</span>,<br />
          &#125;);
        </div>
      </motion.div>

      {/* Card 2: Performance Stats Card */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.7, delay: 0.45 },
          x: { duration: 0.7, delay: 0.45 },
          y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="p-4 rounded-md bg-white/10 backdrop-blur-xl border-none shadow-2xl shadow-indigo-950/40 flex flex-col gap-3 bg-gradient-to-br from-white/15 via-white/5 to-transparent transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <FiZap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-white">
              45ms Latency
            </span>
            <span className="text-[11px] text-slate-300">
              Instant stream responses
            </span>
          </div>
        </div>
        <div className="h-px bg-white/10 w-full" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <FiCpu className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-white">
              99.8% Accuracy
            </span>
            <span className="text-[11px] text-slate-300">
              Validated code generation
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
