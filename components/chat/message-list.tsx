import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatMessage, ChatMessageProps } from "./chat-message";
import { cn } from "@/lib/utils";

interface MessageListProps {
    messages: ChatMessageProps[];
    className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);


    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;

        // Update isAtBottom ref based on scroll position
        // used to determine if we should auto-scroll on new content
        // TOLERANCE: 20px
        isAtBottomRef.current = distanceToBottom <= 20;
    };



    const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            const maxScrollTop = scrollHeight - clientHeight;

            if (behavior === "smooth") {
                scrollRef.current.scrollTo({ top: maxScrollTop, behavior: "smooth" });
            } else {
                scrollRef.current.scrollTop = maxScrollTop;
            }
        }
    };

    useEffect(() => {
        // When messages change (new message or streaming update)
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        // 1. If user just sent a message, force scroll to bottom
        if (lastMessage.role === "user") {
            scrollToBottom("smooth");
            return;
        }

        // 2. If receiving AI response (streaming or done)
        // Only scroll if the user was strictly at the bottom before the update
        if (isAtBottomRef.current) {
            scrollToBottom("auto");
        }
    }, [messages]); // Dependency on messages array (which changes ref on update)

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            onWheel={(e) => {
                // If user scrolls UP, break the auto-scroll lock immediately
                if (e.deltaY < 0) {
                    isAtBottomRef.current = false;
                }
            }}
            onTouchMove={() => {
                // Touch usage often implies looking around; safeguard against auto-snap
                // We rely on handleScroll to re-enable isAtBottomRef if they hit the bottom
                // But while moving, if they are not at bottom, we shouldn't snap
                if (scrollRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                    const distance = scrollHeight - scrollTop - clientHeight;
                    if (distance > 20) {
                        isAtBottomRef.current = false;
                    }
                }
            }}
            className={cn(
                "flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent",
                className
            )}
            style={{
                scrollbarGutter: 'stable',
                overscrollBehavior: 'contain',
                overflowAnchor: 'none'
            }}
        >
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index} // Using index is safe here as this is a append-only list for this view
                    {...msg}
                />
            ))}
            {/* Sentinel for scrolling */}
            <div ref={messagesEndRef} className="h-px w-full" />
        </div>
    );
}
