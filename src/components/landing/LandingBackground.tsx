"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Background component using home-bg.jpg as the full-screen background image,
 * layered with ambient pulsing glow orbs and a decorative SVG grid overlay.
 */
export default function LandingBackground() {
  return (
    <>
      {/* ── Full-Screen Background Image ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/home-bg.jpg"
          alt="Landing Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Rich multi-layer gradient overlay for depth and readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(7,10,18,0.82) 0%, rgba(13,18,43,0.75) 30%, rgba(20,27,66,0.65) 60%, rgba(32,43,120,0.5) 85%, rgba(70,85,232,0.35) 100%)",
          }}
        />
        {/* Bottom fade for footer readability */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* ── Animated Background Ambient Glow Orbs ── */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/6 w-106 h-106 rounded-full bg-gray-800 blur-3xl pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-gray-800 blur-3xl pointer-events-none z-0"
      />

      {/* ── Decorative Grid Overlay ── */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={800} stroke="white" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`h${i}`} y1={i * 50} x1={0} y2={i * 50} x2={800} stroke="white" strokeWidth="0.5" />
        ))}
      </svg>
    </>
  );
}
