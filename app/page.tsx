"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Code, Activity, Zap,
  BrainCircuit, Network, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "@/components/chat/chat-container";
import { CodeVisualizer } from "@/components/code-visualizer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { JarvisCore } from "@/components/ui/jarvis-core";
import { HoloCard } from "@/components/ui/holo-card";
import { ChatHistoryProvider } from "@/components/chat/chat-history-context";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

// New design imports
import { NeuralCore } from "@/components/landing/neural-core";
import { TerminalText } from "@/components/landing/terminal-text";
import { CapabilityCard } from "@/components/landing/capability-card";
import { DataStream } from "@/components/landing/data-stream";

export default function Home() {
  // App Logic States
  const [isLaunched, setIsLaunched] = useState(false);
  const [jarvisStatus, setJarvisStatus] = useState<"idle" | "thinking" | "speaking" | "error">("idle");

  // Landing Page Visual States
  const [glitch, setGlitch] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [particles, setParticles] = useState<{ id: number; left: string; top: string; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Initial glitch effect on mount
    setGlitch(true);
    const glitchTimeout = setTimeout(() => setGlitch(false), 500);
    const contentTimeout = setTimeout(() => setShowContent(true), 300);

    // Generate particles on client side
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);

    return () => {
      clearTimeout(glitchTimeout);
      clearTimeout(contentTimeout);
    };
  }, []);

  const handleInitialize = () => {
    // Trigger pulse and flash effect
    const flashDiv = document.createElement('div');
    flashDiv.className = 'fixed inset-0 bg-cyan-400/20 z-[100] pointer-events-none';
    document.body.appendChild(flashDiv);

    setTimeout(() => {
      flashDiv.remove();
      setIsLaunched(true);
    }, 300);
  };

  const capabilities = [
    {
      icon: BrainCircuit,
      title: 'AI Agent Control',
      description: 'Advanced neural network orchestration with autonomous decision-making capabilities',
    },
    {
      icon: Network,
      title: 'Machine Learning Intelligence',
      description: 'Real-time pattern recognition and predictive analytics across distributed systems',
    },
    {
      icon: Shield,
      title: 'Secure Blockchain Operations',
      description: 'Military-grade encryption with decentralized ledger verification protocols',
    },
    {
      icon: Zap,
      title: 'System Automation',
      description: 'Lightning-fast execution of complex workflows with zero human intervention',
    },
  ];

  return (
    <ChatHistoryProvider>
      <main className="min-h-screen text-cyan-50 font-sans selection:bg-cyan-500/30 overflow-hidden bg-black">
        {isLaunched && <AnimatedBackground />}
        {!isLaunched && <SmoothScroll />}

        <AnimatePresence mode="wait">
          {!isLaunched ? (
            // === NEW CINEMATIC LANDING PAGE ===
            <motion.div
              key="landing"
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 text-white overflow-hidden overflow-y-auto"
            >
              {/* Grid Background */}
              <div
                className="fixed inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />

              {/* Animated Grid Lines */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  className="fixed left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none"
                  style={{ top: `${20 * (i + 1)}%` }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}

              {/* Scanline Effect */}
              <motion.div
                className="fixed inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none z-50"
                animate={{
                  y: ['0vh', '100vh'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Glitch Overlay */}
              {glitch && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/20"
                    animate={{
                      opacity: [1, 0.5, 1, 0],
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  />
                </div>
              )}

              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-20 pt-20"
              >
                {/* Top Status Bar */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute top-8 left-0 right-0 px-8"
                >
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
                      />
                      <span className="font-mono text-xs text-green-400">SYSTEM ONLINE</span>
                    </div>
                    <div className="font-mono text-xs text-cyan-400/60">
                      SESSION: {new Date().toISOString().split('T')[0]}
                    </div>
                  </div>
                </motion.div>

                {/* Neural Core */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                  className="mb-12 scale-75 md:scale-100"
                >
                  <NeuralCore />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-center mb-6 px-4"
                >
                  <motion.h1
                    className="text-5xl md:text-8xl font-black mb-2 tracking-wider font-orbitron"
                    style={{
                      textShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
                      background: 'linear-gradient(to bottom, #ffffff, #06b6d4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                    animate={{
                      textShadow: [
                        '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
                        '0 0 50px rgba(6, 182, 212, 0.7), 0 0 100px rgba(6, 182, 212, 0.5)',
                        '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    JARVIS
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-2xl text-cyan-100/80 font-light tracking-wide mb-4 font-rajdhani"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    Autonomous AI × Machine Learning × Blockchain Intelligence
                  </motion.p>
                </motion.div>

                {/* Terminal Status */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mb-8 px-6 py-4 rounded-lg border border-green-500/30 bg-black/40 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <TerminalText
                    lines={[
                      'Neural Core Online',
                      'Blockchain Nodes Synced',
                      'Agent Permissions Loaded',
                      'Awaiting Command...',
                    ]}
                    delay={1500}
                  />
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  onClick={handleInitialize}
                  className="group relative px-8 md:px-12 py-4 font-bold text-lg md:text-xl tracking-wider overflow-hidden font-rajdhani cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm" />

                  {/* Border */}
                  <div
                    className="absolute inset-0 border-2 border-cyan-400"
                    style={{
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(6, 182, 212, 0.1)',
                    }}
                  />

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-colors duration-300"
                    style={{
                      boxShadow: '0 0 40px rgba(6, 182, 212, 0)',
                    }}
                    whileHover={{
                      boxShadow: '0 0 40px rgba(6, 182, 212, 0.8)',
                    }}
                  />

                  {/* Scan animation */}
                  <motion.div
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    animate={{
                      y: [0, 56, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* Button text */}
                  <span className="relative z-10 text-cyan-100 group-hover:text-white transition-colors flex items-center gap-2 md:gap-3">
                    <span className="font-mono text-sm text-cyan-400">&gt;</span>
                    <span className="hidden sm:inline">INITIALIZE SYSTEM</span>
                    <span className="sm:hidden">INITIALIZE</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  </span>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                </motion.button>

                {/* Scroll Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-cyan-400/60 font-mono">SCROLL TO EXPLORE</span>
                    <div className="w-6 h-10 border-2 border-cyan-400/30 rounded-full flex justify-center pt-2">
                      <motion.div
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Capabilities Section */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative max-w-7xl mx-auto px-8 pb-32"
              >
                {/* Section Header */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <div className="inline-block px-6 py-2 border border-cyan-500/30 bg-cyan-500/5 rounded-full mb-6">
                    <span className="font-mono text-sm text-cyan-400">SYSTEM CAPABILITIES</span>
                  </div>
                  <h2
                    className="text-5xl font-bold mb-4 font-orbitron"
                    style={{
                      textShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    Elite Command Center
                  </h2>
                  <p className="text-cyan-100/60 text-lg max-w-2xl mx-auto">
                    Military-grade intelligence infrastructure designed for next-generation AI operations
                  </p>
                </motion.div>

                {/* Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capabilities.map((capability, index) => (
                    <CapabilityCard
                      key={index}
                      icon={capability.icon}
                      title={capability.title}
                      description={capability.description}
                      index={index}
                    />
                  ))}
                </div>

                {/* Bottom Status Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-20 pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-cyan-400/60"
                >
                  <div>JARVIS v2.0.1 | Neural Architecture</div>
                  <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                    <span>Security: MAXIMUM</span>
                    <span>Uptime: 99.99%</span>
                    <span>Latency: &lt;10ms</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Ambient Particles */}
              {particles.map((particle) => (
                <motion.div
                  key={`particle-${particle.id}`}
                  className="fixed w-1 h-1 bg-cyan-400/30 rounded-full pointer-events-none"
                  style={{
                    left: particle.left,
                    top: particle.top,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}

              {/* Data Streams */}
              {[...Array(6)].map((_, i) => (
                <DataStream key={`stream-${i}`} index={i} />
              ))}
            </motion.div>
          ) : (
            // === MAIN DASHBOARD (Existing) ===
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex h-screen p-2 md:p-4 gap-4 overflow-hidden"
            >
              {/* LEFT: SIDEBAR (Chat History) */}
              <div className="hidden md:block h-full z-20">
                <ChatSidebar />
              </div>

              {/* MIDDLE: MAIN CONTENT AREA (Status + Chat) */}
              <div className="flex-1 flex gap-4 min-w-0">
                {/* STATUS & CONTROLS */}
                <div className="hidden lg:flex w-64 flex-col gap-4 shrink-0">
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

                {/* CHAT INTERFACE */}
                <div className="flex-1 min-w-0 relative h-full">
                  <ChatContainer onStatusChange={setJarvisStatus} />
                </div>
              </div>

              {/* RIGHT: AGENT TERMINAL */}
              <div className="hidden xl:block w-80 shrink-0">
                <CodeVisualizer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ChatHistoryProvider>
  );
}
