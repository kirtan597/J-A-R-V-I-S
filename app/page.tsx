
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronRight, Command, Layout, Code, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat-interface";
import { CodeVisualizer } from "@/components/code-visualizer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { JarvisCore } from "@/components/ui/jarvis-core";
import { HoloCard } from "@/components/ui/holo-card";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [jarvisStatus, setJarvisStatus] = useState<"idle" | "thinking" | "speaking" | "error">("idle");

  return (
    <main className="min-h-screen text-cyan-50 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {!isLaunched ? (
          // === CINEMATIC LANDING PAGE ===
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="h-screen flex flex-col items-center justify-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-[80px] opacity-40 animate-pulse" />
                <JarvisCore status="idle" className="w-48 h-48" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              JARVIS
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cyan-400/80 text-xl md:text-2xl font-mono tracking-widest uppercase mb-12"
            >
              Neural Interface v2.5
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => setIsLaunched(true)}
                className="relative group bg-transparent overflow-hidden rounded-none border border-cyan-500/50 px-12 py-8"
              >
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine opacity-0 group-hover:opacity-100" />

                <span className="relative z-10 flex items-center gap-3 text-cyan-300 font-mono text-lg tracking-widest group-hover:text-white transition-colors">
                  INITIALIZE SYSTEM <ChevronRight />
                </span>

                {/* Button Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-400" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          // === MAIN DASHBOARD ===
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex h-screen p-2 md:p-4 gap-4 overflow-hidden"
          >
            {/* LEFT: STATUS & CONTROLS */}
            <div className="hidden lg:flex w-80 flex-col gap-4">
              <HoloCard className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <JarvisCore status={jarvisStatus} />
                <div className="mt-6 text-center">
                  <h2 className="text-cyan-400 font-bold tracking-widest text-lg">JARVIS</h2>
                  <p className="text-cyan-700 font-mono text-xs uppercase animate-pulse">
                    {jarvisStatus === "idle" ? "Standby" : jarvisStatus.toUpperCase()}
                  </p>
                </div>
              </HoloCard>

              <div className="flex-1 flex flex-col gap-4">
                <HoloCard className="flex-1 p-4">
                  <h3 className="text-cyan-500 text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-2">
                    <Activity size={14} /> Active Modules
                  </h3>
                  <div className="space-y-3">
                    {['Reasoning Engine', 'Gemini 2.5 Bridge', 'Sandbox Environment', 'Memory Context'].map((item) => (
                      <div key={item} className="flex items-center justify-between text-xs text-cyan-200/70 border-b border-cyan-900/30 pb-2">
                        <span>{item}</span>
                        <span className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_5px_currentColor]" />
                      </div>
                    ))}
                  </div>
                </HoloCard>

                <div className="grid grid-cols-2 gap-4">
                  <HoloCard className="p-4 flex flex-col items-center justify-center gap-2 aspect-square cursor-pointer hover:bg-cyan-500/10">
                    <Code className="text-cyan-400" />
                    <span className="text-[10px] text-cyan-600 uppercase font-bold">Snippets</span>
                  </HoloCard>
                  <HoloCard className="p-4 flex flex-col items-center justify-center gap-2 aspect-square cursor-pointer hover:bg-cyan-500/10">
                    <Zap className="text-cyan-400" />
                    <span className="text-[10px] text-cyan-600 uppercase font-bold">Actions</span>
                  </HoloCard>
                </div>
              </div>
            </div>

            {/* MIDDLE: CHAT INTERFACE */}
            <div className="flex-1 min-w-0 relative">
              <ChatInterface onStatusChange={setJarvisStatus} />
            </div>

            {/* RIGHT: AGENT TERMINAL */}
            <div className="hidden xl:block w-96">
              <CodeVisualizer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
