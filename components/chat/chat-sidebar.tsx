"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, History, FolderOpen, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatHistory } from "@/components/chat/chat-history-context";
import { ChatListItem } from "@/components/chat/chat-list-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoloCard } from "@/components/ui/holo-card";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ChatSidebar() {
    const { sessions, activeSessionId, setActiveSession, createSession, deleteSession, updateSessionTitle, clearAllSessions, storageMode } = useChatHistory();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.div
            initial={{ width: 320 }}
            animate={{ width: isCollapsed ? 60 : 320 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="h-full flex flex-col relative"
        >
            <HoloCard className="h-full flex flex-col p-0 overflow-hidden bg-black/40 backdrop-blur-xl border-cyan-500/20">

                {/* Header */}
                <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between shrink-0">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                <History size={16} className="text-cyan-400" />
                            </div>
                            <span className="font-mono text-sm font-bold text-cyan-100 tracking-wider">
                                HISTORY
                            </span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="ml-auto h-8 w-8 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>

                {/* New Chat Button */}
                <div className="p-4 shrink-0">
                    <Button
                        onClick={() => createSession()}
                        className={cn(
                            "w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all",
                            isCollapsed ? "px-0" : "justify-start gap-2"
                        )}
                    >
                        <Plus size={18} />
                        {!isCollapsed && "New Session"}
                    </Button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-hidden relative">
                    {!isCollapsed ? (
                        <ScrollArea className="h-full px-2">
                            <div className="flex flex-col gap-1 pb-4">
                                {sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
                                        <FolderOpen size={32} className="opacity-50" />
                                        <span className="text-xs">No active sessions</span>
                                    </div>
                                ) : (
                                    sessions.map((session) => (
                                        <ChatListItem
                                            key={session.id}
                                            session={session}
                                            isActive={session.id === activeSessionId}
                                            onSelect={() => setActiveSession(session.id)}
                                            onDelete={() => deleteSession(session.id)}
                                            onRename={(title) => updateSessionTitle(session.id, title)}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center gap-4 pt-4">
                            {/* Show active or recent icons when collapsed */}
                            {sessions.slice(0, 5).map(s => (
                                <div
                                    key={s.id}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
                                        s.id === activeSessionId
                                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_currentColor]"
                                            : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50"
                                    )}
                                    onClick={() => setActiveSession(s.id)}
                                    title={s.title}
                                >
                                    <span className="text-[10px] font-bold">{s.title.charAt(0).toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-cyan-500/10 shrink-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                {storageMode === 'local' ? (
                                    <>
                                        <Save size={12} className="text-green-500" />
                                        <span>Local Sync Active</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={12} className="text-amber-500" />
                                        <span>Browser Storage</span>
                                    </>
                                )}
                            </div>

                            {sessions.length > 0 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-red-400">
                                            <Trash2 size={14} />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-zinc-950 border-cyan-500/20">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-cyan-100">Clear All History?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-zinc-400">
                                                This will permanently delete all {sessions.length} chat sessions. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={clearAllSessions}
                                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                            >
                                                Delete All
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>

                                </AlertDialog>
                            )}
                        </div>
                    </div>
                )}
            </HoloCard>
        </motion.div>
    );
}
