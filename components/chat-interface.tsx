
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Terminal, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "model";
    text: string;
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "model",
            text: "Hello. I am JARVIS. How may I assist you with your code today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: messages.map((m) => ({ role: m.role, parts: m.text })),
                    message: userMessage,
                }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

            setMessages((prev) => [...prev, { role: "model", text: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                accumulatedResponse += text;

                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = accumulatedResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    text: "**Error**: Failed to connect to JARVIS systems.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-full bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h2 className="font-bold text-white tracking-wide">JARVIS</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-cyan-300/70 font-mono">SYSTEM ONLINE</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex gap-4 max-w-[90%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                                msg.role === "user"
                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            )}
                        >
                            {msg.role === "user" ? (
                                <User className="w-5 h-5" />
                            ) : (
                                <Bot className="w-5 h-5" />
                            )}
                        </div>
                        <div
                            className={cn(
                                "p-3 rounded-lg text-sm leading-relaxed border",
                                msg.role === "user"
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-100"
                                    : "bg-cyan-950/30 border-cyan-500/10 text-cyan-100"
                            )}
                        >
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !inline && match ? (
                                            <div className="rounded-md overflow-hidden my-2 border border-white/10">
                                                <div className="bg-black/50 px-3 py-1 text-xs text-gray-400 border-b border-white/10 flex items-center gap-2">
                                                    <Terminal size={12} />
                                                    {match[1]}
                                                </div>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code
                                                className="bg-black/30 px-1 py-0.5 rounded text-cyan-300 font-mono text-xs"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command or query..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500/50"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30 shadow-[0_0_10px_rgba(8,145,178,0.3)] transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}
