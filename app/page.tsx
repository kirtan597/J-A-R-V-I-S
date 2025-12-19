
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat-interface";
import { CodeVisualizer } from "@/components/code-visualizer";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <AnimatePresence mode="wait">
        {!isLaunched ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center relative z-10 p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-[2rem] blur-lg -z-10" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 text-center mb-6"
            >
              JARVIS <span className="text-cyan-400">AI</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl text-center mb-10 leading-relaxed"
            >
              A fully autonomous, production-ready AI coding assistant.
              <br />
              Generated 100% by Google Antigravity.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                size="lg"
                onClick={() => setIsLaunched(true)}
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 h-auto rounded-full font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 group"
              >
                Launch System
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex gap-6 p-6 h-screen max-h-screen z-10"
          >
            {/* Left Panel: Chat */}
            <div className="w-full md:w-1/2 lg:w-[45%] h-full">
              <ChatInterface />
            </div>

            {/* Right Panel: Visualizer */}
            <div className="hidden md:block w-full md:w-1/2 lg:w-[55%] h-full">
              <CodeVisualizer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
