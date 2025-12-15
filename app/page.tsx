"use client";

import React from "react";
import {
  Terminal,
  ArrowRight,
  Paperclip,
  Sparkles,
  Layout,
  Github,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  const handleInterview = () => {
    router.push("/interview");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Subtle top gradient for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] opacity-70" />

        {/* The "Planet" Glow at the bottom - positioned to peek up from the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-blue-600/10 blur-[120px] rounded-t-full" />

        {/* Fine border line for the curvature effect (optional, subtle) */}
        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[200%] h-[600px] rounded-[100%] border-t border-white/5 opacity-50" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 relative z-50">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="bg-white text-black p-1 rounded-md">
            <Terminal size={20} fill="currentColor" className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">interviewee</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
          <Link href="#" className="hover:text-white transition-colors">
            Community
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Enterprise
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Resources <span className="text-[10px]">▼</span>
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Careers
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile/Extra Icons hidden for simplicity or matching screenshot */}
          <div className="hidden md:flex items-center gap-4 text-gray-400">
            <Github
              size={20}
              className="hover:text-white cursor-pointer transition-colors"
            />
          </div>
          <button className="text-sm font-medium hover:text-white text-gray-300 transition-colors">
            Sign in
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
            Get started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 pt-24 pb-32 max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              I²
            </span>
            <span>Introducing Interviewee beta 1</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
          Let's <span className="text-blue-400 inline-block">interview</span>{" "}
          you...
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
          Interview with AI to get a personalized interview.
        </p>

        {/* Input Area */}
        <div className="w-full max-w-3xl relative group mx-auto">
          {/* Glow effect behind the input */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-100 transition duration-500"></div>

          <div className="relative bg-[#0f0f0f] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[160px]">
            <textarea
              placeholder="Let's have an interview with you..."
              className="w-full flex-1 bg-transparent text-white p-6 resize-none outline-none text-lg placeholder:text-gray-600 font-light"
            />

            <div className="flex items-center justify-between px-4 py-3 bg-transparent">
              <p className="text-gray-600 text-sm">
                Tip: You can send your github link to get a personalized
                interview
              </p>

              <div className="flex items-center gap-4">
                <button onClick={handleInterview} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer">
                  Let's Interview
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
