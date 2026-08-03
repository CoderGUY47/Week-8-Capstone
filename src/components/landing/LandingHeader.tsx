"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";


/**
 * Top bar header component with logo, brand title, and Get Started CTA button.
 */
export default function LandingHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-2"
    >
      <div className="flex items-center gap-3">
        {/* Logo without any background box */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/oxie.png"
            alt="Oxie Logo"
            width={38}
            height={38}
            className="object-contain"
            priority
          />
        </motion.div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-none">
            Oxie
          </h2>
          <span className="text-[11.5px] text-slate-300 font-medium">
            Your intelligent AI companion
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/login"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[4px] text-xs font-semibold border-none backdrop-blur-md transition-all no-underline flex items-center gap-1.5"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[4px] text-xs font-semibold border-none shadow-lg shadow-indigo-600/30 transition-all no-underline flex items-center gap-1.5"
          >
            Sign Up
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
