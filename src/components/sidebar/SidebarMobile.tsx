"use client";

import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiSliders } from "react-icons/fi";
import { PiCirclesThreePlus, PiUserCircleDuotone } from "react-icons/pi";

interface SidebarMobileProps {
  onNewChat: () => void;
}

export default function SidebarMobile({ onNewChat }: SidebarMobileProps) {
  return (
    <aside className="w-15 h-full bg-[#12151c] border-r border-white/10 hidden lg:hidden md:flex flex-col items-center py-4 gap-3 shrink-0 select-none text-white">
      {/* Brand logo */}
      <div className="w-8 h-8 flex items-center justify-center">
        <Image
          src="/images/oxie.png"
          alt="Oxie Logo"
          width={22}
          height={22}
          className="object-contain"
        />
      </div>

      {/* New chat primary button with PiCirclesThreePlus icon */}
      <button
        type="button"
        onClick={onNewChat}
        title="New chat"
        className="w-8 h-8 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center border border-indigo-500/30 cursor-pointer transition-colors outline-none"
      >
        <PiCirclesThreePlus className="w-4.5 h-4.5 text-white" />
      </button>

      {/* Search */}
      <button
        type="button"
        title="Search"
        className="w-8 h-8 rounded-sm text-white/60 hover:text-white hover:bg-[#161a22] flex items-center justify-center border border-white/10 hover:border-white/20 bg-[#161a22] cursor-pointer transition-colors outline-none"
      >
        <FiSearch className="w-4 h-4 text-white/60 hover:text-white" />
      </button>

      <div className="flex-1" />

      {/* Settings */}
      <button
        type="button"
        title="Settings"
        className="w-8 h-8 rounded-sm text-white/60 hover:text-white hover:bg-[#161a22] flex items-center justify-center border border-white/10 hover:border-white/20 bg-[#161a22] cursor-pointer transition-colors outline-none"
      >
        <FiSliders className="w-4 h-4 text-white/60 hover:text-white" />
      </button>

      {/* Free user icon link */}
      <Link
        href="/login"
        title="New User - Log in"
        className="w-8 h-8 rounded-sm flex items-center justify-center text-white hover:bg-[#161a22] border border-white/10 hover:border-white/20 transition-colors"
      >
        <PiUserCircleDuotone className="w-6.5 h-6.5 text-white" />
      </Link>
    </aside>
  );
}
