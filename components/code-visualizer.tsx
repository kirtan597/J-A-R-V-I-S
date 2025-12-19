
"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Activity, FileCode, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Log = {
    id: string;
    type: "info" | "success" | "warning" | "error" | "code";
    message: string;
    timestamp: string;
};

export function CodeVisualizer() {
    const [logs, setLogs] = useState<Log[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulated init sequence
        const initLogs: Log[] = [
            { id: '1', type: 'info', message: 'Initializing JARVIS Core Systems...', timestamp: new Date().toLocaleTimeString() },
            { id: '2', type: 'info', message: 'Loading Neural Models...', timestamp: new Date().toLocaleTimeString() },
            { id: '3', type: 'success', message: 'System Ready. Waiting for input.', timestamp: new Date().toLocaleTimeString() },
        ];
        setLogs(initLogs);

        const interval = setInterval(() => {
            // Add random "ambient" system logs to make it feel alive
            const ambientMessages = [
                "Scanning file system...",
                "Optimizing memory usage...",
                " analyzing context window...",
                "Ping: 12ms connected to Gateway",
            ];

            if (Math.random() > 0.8) {
                addLog("info", ambientMessages[Math.floor(Math.random() * ambientMessages.length)]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const addLog = (type: Log["type"], message: string) => {
        setLogs((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).substring(7),
                type,
                message,
                timestamp: new Date().toLocaleTimeString(),
            },
        ]);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <Card className="h-full bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white/90">Agent Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Status:</span>
                    <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                    <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                </div>
            </div>

            {/* Terminal View */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
                <div className="space-y-2">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3 group"
                            >
                                <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                                <div className={cn(
                                    "flex items-center gap-2",
                                    log.type === 'info' && "text-blue-300",
                                    log.type === 'success' && "text-green-400",
                                    log.type === 'warning' && "text-yellow-400",
                                    log.type === 'error' && "text-red-400",
                                    log.type === 'code' && "text-purple-300",
                                )}>
                                    {log.type === 'success' && <CheckCircle2 size={12} />}
                                    {log.type === 'code' && <FileCode size={12} />}
                                    {log.type === 'info' && <span className="text-blue-500">➜</span>}
                                    <span>{log.message}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Decorations */}
            <div className="p-2 border-t border-white/5 bg-black/40 flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                <span>Mem: 45MB / 512MB</span>
                <span>Threads: 4</span>
            </div>
        </Card>
    );
}
