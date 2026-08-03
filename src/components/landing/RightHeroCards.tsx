"use client";

import { motion } from "framer-motion";
import { PiBrainBold } from "react-icons/pi";
import { BiCodeAlt } from "react-icons/bi";
import { AiOutlineBug } from "react-icons/ai";
import { MdOutlineDraw } from "react-icons/md";

/**
 * Right side column containing 2 continuous motion floating glassmorphic cards:
 * 1. Deep Reasoner (R1) Showcase Card.
 * 2. Starter Capabilities Card.
 */
export default function RightHeroCards() {
  return (
    <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 pt-16 self-end">
      {/* Card 3: Capabilities Showcase Card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.7, delay: 0.3 },
          x: { duration: 0.7, delay: 0.3 },
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
        }}
        className="p-4 rounded-md bg-white/10 backdrop-blur-xl border-none shadow-2xl shadow-indigo-950/40 flex flex-col gap-3 bg-gradient-to-br from-white/15 via-white/5 to-transparent transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <PiBrainBold className="w-4.5 h-4.5 text-indigo-300 shrink-0" />
          <span>Deep Reasoner (R1)</span>
        </div>
        <p className="text-[11.5px] text-slate-300 leading-relaxed">
          Chain-of-thought analysis for complex systems, database schemas, and
          architectural design patterns.
        </p>
      </motion.div>

      {/* Card 4: Quick Starter Prompts Preview Card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.7, delay: 0.45 },
          x: { duration: 0.7, delay: 0.45 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
        }}
        className="p-4 rounded-md bg-white/10 backdrop-blur-xl border-none shadow-2xl shadow-indigo-950/40 flex flex-col gap-2.5 bg-gradient-to-br from-white/15 via-white/5 to-transparent transition-all"
      >
        <span className="text-xs font-bold text-white">
          Starter Capabilities
        </span>
        <div className="flex flex-col gap-1.5 text-[11px] text-slate-200">
          <div className="p-2 rounded-[4px] bg-black/30 flex items-center justify-between border-none">
            <div className="flex items-center gap-1.5">
              <BiCodeAlt className="w-4 h-4 text-indigo-300 shrink-0" />
              <span>Write React Components</span>
            </div>
            <span className="text-[9.5px] font-bold text-indigo-300">TSX</span>
          </div>
          <div className="p-2 rounded-[4px] bg-black/30 flex items-center justify-between border-none">
            <div className="flex items-center gap-1.5">
              <AiOutlineBug className="w-4 h-4 text-indigo-300 shrink-0" />
              <span>Debug Stack Traces</span>
            </div>
            <span className="text-[9.5px] font-bold text-indigo-300">Logs</span>
          </div>
          <div className="p-2 rounded-[4px] bg-black/30 flex items-center justify-between border-none">
            <div className="flex items-center gap-1.5">
              <MdOutlineDraw className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Design Studio UI</span>
            </div>
            <span className="text-[9.5px] font-bold text-emerald-300">CSS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
