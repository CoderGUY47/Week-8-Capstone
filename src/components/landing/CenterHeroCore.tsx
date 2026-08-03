"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HiSparkles,
  HiArrowRight,
  HiCodeBracket,
  HiGlobeAlt,
} from "react-icons/hi2";

/**
 * Center hero section with animated Oxie bot logo (190px, no bg box),
 * model badge, headline, description, CTAs, and feature chips.
 */
export default function CenterHeroCore() {
  return (
    <div className="lg:col-span-6 flex flex-col items-center text-center gap-6">
      {/* Animated Oxie Logo WITH FRAMER MOTION FLOAT & ZERO BG CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <Image
            src="/images/oxie.png"
            alt="Oxie AI Bot"
            width={190}
            height={190}
            priority
            className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none"
          />
        </motion.div>

        {/* Badge Pill with border-none */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border-none text-xs font-semibold text-indigo-200 backdrop-blur-md shadow-md"
        >
          <HiSparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>Oxie 3.7 Sonnet</span>
        </motion.div>
      </motion.div>

      {/* Headline & Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col items-center gap-3.5 max-w-xl"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Build faster, explore deeper with{" "}
          <span className="text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-300 to-indigo-400">
            Oxie
          </span>
          .
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          A high-performance streaming AI assistant built for developers. Ask
          questions, debug code, explore architectures, and ship faster —
          powered by state-of-the-art models.
        </p>
      </motion.div>

      {/* CTAs with border-none buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-center justify-center gap-3.5 flex-wrap"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/chat"
            className="h-11 px-7 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-[4px] text-sm flex items-center gap-2 transition-all border-none shadow-xl shadow-indigo-600/40 no-underline cursor-pointer"
          >
            <span>Get Started</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <a
            href="https://github.com/CoderGUY47/capstone-project"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-7 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-[4px] text-sm flex items-center justify-center transition-all border-none backdrop-blur-md no-underline"
          >
            Learn more
          </a>
        </motion.div>
      </motion.div>

      {/* Features Chips with border-none */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-2"
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-[4px] bg-white/10 border-none text-xs font-semibold text-slate-200 backdrop-blur-sm shadow-sm"
        >
          <HiCodeBracket className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Real-time Code Streaming</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-[4px] bg-white/10 border-none text-xs font-semibold text-slate-200 backdrop-blur-sm shadow-sm"
        >
          <HiGlobeAlt className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>2026 Web Search & Docs</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
