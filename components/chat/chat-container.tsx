"use client";

import { useState } from "react";
import { useChatHistory } from "@/components/chat/chat-history-context";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { HoloCard } from "@/components/ui/holo-card";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { ChatMessageProps } from "./chat-message";

interface ChatContainerProps {
    onStatusChange?: (status: "idle" | "thinking" | "speaking" | "error") => void;
}

export function ChatContainer({ onStatusChange }: ChatContainerProps) {
    const { sessions, activeSessionId, createSession, addMessageToSession } = useChatHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");

    // Get active session messages
    const activeSession = sessions.find(s => s.id === activeSessionId);

    // Convert stored messages for display
    const storedMessages: ChatMessageProps[] = activeSession ? activeSession.messages.map(m => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp // MessageList/ChatMessage handles string or Date
    })) : [
        {
            role: "model",
            text: "Initial systems check complete. **JARVIS** remains ready to serve.",
            timestamp: new Date().toISOString(),
        }
    ];

    // Merge streaming content
    const displayMessages = [...storedMessages];
    if (streamingContent) {
        displayMessages.push({
            role: "model",
            text: streamingContent,
            timestamp: new Date().toISOString()
        });
    }

    const sendMessage = async (userMessageText: string) => {
        if (isLoading) return;

        setIsLoading(true);
        onStatusChange?.("thinking");

        let currentSessionId = activeSessionId;

        // Create session if none exists
        if (!currentSessionId) {
            currentSessionId = await createSession(userMessageText);
        }

        const userMsg: ChatMessageType = {
            role: "user",
            text: userMessageText,
            timestamp: new Date().toISOString()
        };

        // Optimistically add user message
        await addMessageToSession(currentSessionId, userMsg);

        try {
            // Prepare history for API
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
                if (response.status === 429) {
                    throw new Error("I'm thinking too fast! Please wait a moment (Rate Limit).");
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

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
            const modelMsg: ChatMessageType = {
                role: "model",
                text: accumulatedResponse,
                timestamp: new Date().toISOString()
            };
            await addMessageToSession(currentSessionId, modelMsg);

        } catch (error: any) {
            console.error("Chat error:", error);
            onStatusChange?.("error");

            const errorMsg: ChatMessageType = {
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

    return (
        <HoloCard className="h-full border-none shadow-none bg-transparent overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
                <MessageList
                    messages={displayMessages}
                    className="flex-1 min-h-0"
                />
                <ChatInput
                    onSend={sendMessage}
                    disabled={isLoading}
                />
            </div>
        </HoloCard>
    );
}
