import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiLock, FiMail, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

/**
 * Static Login Page — no client bundle, no hooks, no animations.
 * Loads instantly as a server-rendered HTML page.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4 select-none font-sans">
      {/* Back navigation */}
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline px-2.5 py-1.5 rounded-[4px] border border-black/10 hover:border-black/15 bg-white"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-black/10 rounded-md shadow-sm p-6 sm:p-8 flex flex-col gap-6">
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/images/oxie.png"
            alt="Oxie AI Logo"
            width={60}
            height={60}
            className="w-15 h-15 object-contain mb-1"
            priority
          />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Sign in to access your saved chats and AI projects.
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="/chat"
            className="flex items-center justify-center gap-2 h-9 px-3 bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 rounded-[4px] text-xs font-semibold text-slate-700 transition-colors no-underline"
          >
            <FcGoogle className="w-4 h-4" />
            <span>Google</span>
          </a>
          <a
            href="/chat"
            className="flex items-center justify-center gap-2 h-9 px-3 bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 rounded-[4px] text-xs font-semibold text-slate-700 transition-colors no-underline"
          >
            <FiGithub className="w-4 h-4 text-slate-900" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or with email
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Form */}
        <form action="/chat" method="get" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              Email address
            </label>
            <div className="relative flex items-center">
              <FiMail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                name="email"
                placeholder="you@example.com"
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-indigo-400 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Password
              </label>
              <a href="#" className="text-[11.5px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline no-underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                name="password"
                placeholder="••••••••"
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-indigo-400 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] border-none transition-colors cursor-pointer outline-none mt-1"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-black/10 text-xs text-slate-600">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline no-underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
