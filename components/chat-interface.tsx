
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, AlertCircle, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HoloCard } from "@/components/ui/holo-card";
import { motion, AnimatePresence } from "framer-motion";
import { useChatHistory } from "@/components/chat/chat-history-context";
import { ChatMessage } from "@/types/chat";

interface ChatInterfaceProps {
    onStatusChange?: (status: "idle" | "thinking" | "speaking" | "error") => void;
}

export function ChatInterface({ onStatusChange }: ChatInterfaceProps) {
    const { sessions, activeSessionId, createSession, addMessageToSession } = useChatHistory();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Get active session messages or show empty state (could be a welcome message if desired)
    const activeSession = sessions.find(s => s.id === activeSessionId);

    // Convert stored JSON timestamps (strings) back to Date objects for display if needed, 
    // or just keep them as strings if we adjust the display logic. 
    // The existing UI uses .toLocaleTimeString() on a Date object, so we'll parse.
    const storedMessages = activeSession ? activeSession.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
    })) : [
        {
            role: "model",
            text: "Initial systems check complete. **JARVIS** remains ready to serve.",
            timestamp: new Date(),
        } as const
    ];

    // Merge streaming content
    const messages = [...storedMessages];
    if (streamingContent) {
        messages.push({
            role: "model",
            text: streamingContent,
            timestamp: new Date()
        });
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length, streamingContent, activeSessionId]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessageText = input.trim();
        setInput("");
        setIsLoading(true);
        onStatusChange?.("thinking");

        let currentSessionId = activeSessionId;

        // Create session if none exists
        if (!currentSessionId) {
            currentSessionId = await createSession(userMessageText);
        }

        const userMsg: ChatMessage = {
            role: "user",
            text: userMessageText,
            timestamp: new Date().toISOString()
        };

        // Optimistically add user message
        await addMessageToSession(currentSessionId, userMsg);

        try {
            // Prepare history for API
            // Note: We intentionally exclude the current new message from history passed to API 
            // if the API expects previous context, but usually chat APIs want the full conversation or up to the new prompt.
            // Adjusting based on standard patterns: usually you send the *new* message separate from *history*.
            const history = activeSession ? activeSession.messages.map((m) => ({ role: m.role, parts: m.text })) : [];

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: history,
                    message: userMessageText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";
            let isFirstChunk = true;

            onStatusChange?.("speaking");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                accumulatedResponse += text;
                setStreamingContent(accumulatedResponse);
            }

            setStreamingContent(""); // Clear local stream

            // Final message save
            const modelMsg: ChatMessage = {
                role: "model",
                text: accumulatedResponse,
                timestamp: new Date().toISOString()
            };
            await addMessageToSession(currentSessionId, modelMsg);

        } catch (error: any) {
            console.error("Chat error:", error);
            onStatusChange?.("error");

            const errorMsg: ChatMessage = {
                role: "model",
                text: `**System Alert**: ${error.message || "Connection failed. Please check logs."}`,
                timestamp: new Date().toISOString()
            };
            if (currentSessionId) {
                await addMessageToSession(currentSessionId, errorMsg);
            }
        } finally {
            setIsLoading(false);
            setStreamingContent("");
            onStatusChange?.("idle");
        }
    };

    const CopyButton = ({ text }: { text: string }) => {
        const [copied, setCopied] = useState(false);
        return (
            <button
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-zinc-400 transition-colors"
                title="Copy Code"
            >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
        )
    }

    return (
        <HoloCard className="flex flex-col h-full border-none shadow-none bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "flex gap-4 max-w-4xl mx-auto w-full",
                                msg.role === "user" ? "flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-[0_0_10px_currentColor]",
                                msg.role === "user"
                                    ? "bg-violet-950/50 border-violet-500/50 text-violet-300"
                                    : "bg-cyan-950/50 border-cyan-500/50 text-cyan-300"
                            )}>
                                {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                            </div>

                            {/* Content */}
                            <div className={cn(
                                "flex-1 max-w-[85%]",
                                msg.role === "user" ? "text-right" : "text-left"
                            )}>
                                <div className={cn(
                                    "inline-block text-sm p-4 rounded-2xl backdrop-blur-sm border shadow-sm",
                                    msg.role === "user"
                                        ? "bg-violet-900/10 border-violet-500/20 text-violet-100 rounded-tr-none"
                                        : "bg-cyan-950/10 border-cyan-500/20 text-cyan-50 rounded-tl-none shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                                )}>
                                    {msg.role === "model" ? (
                                        <div className="markdown-prose">
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        const codeString = String(children).replace(/\n$/, "");
                                                        return !inline && match ? (
                                                            <div className="relative rounded-lg overflow-hidden my-3 border border-cyan-500/20 shadow-lg group">
                                                                <div className="bg-black/80 px-4 py-2 text-[10px] text-cyan-500 font-mono border-b border-cyan-500/10 flex items-center justify-between uppercase tracking-wider">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                                                        <span className="ml-2">{match[1]}</span>
                                                                    </div>
                                                                </div>
                                                                <CopyButton text={codeString} />
                                                                <SyntaxHighlighter
                                                                    style={vscDarkPlus}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    customStyle={{ margin: 0, borderRadius: 0, background: 'rgba(0,0,0,0.6)', fontSize: '12px' }}
                                                                    {...props}
                                                                >
                                                                    {codeString}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code className="bg-cyan-950/30 border border-cyan-500/20 px-1 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    )}
                                </div>
                                <div className="mt-1 text-[10px] text-zinc-500 font-mono opacity-50 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="relative max-w-4xl mx-auto flex items-end gap-2"
                >
                    <div className="relative flex-1 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Initialize query..."
                            className="relative bg-black border-zinc-800 text-cyan-100 placeholder:text-zinc-600 min-h-[50px] pl-4 pr-12 rounded-lg focus-visible:ring-0 focus-visible:border-cyan-500/50 transition-all font-mono"
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        size="icon"
                        className="h-[50px] w-[50px] bg-cyan-900/20 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </HoloCard>
    );
}
