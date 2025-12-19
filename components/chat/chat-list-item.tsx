"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Edit2, Check, X, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatListItemProps {
    session: ChatSession;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRename: (newTitle: string) => void;
}

export function ChatListItem({ session, isActive, onSelect, onDelete, onRename }: ChatListItemProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [editedTitle, setEditedTitle] = useState(session.title);

    const handleRename = () => {
        if (editedTitle.trim()) {
            onRename(editedTitle.trim());
            setIsRenaming(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleRename();
        if (e.key === "Escape") {
            setEditedTitle(session.title);
            setIsRenaming(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all mx-2",
                isActive
                    ? "bg-cyan-950/40 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                    : "hover:bg-white/5 border border-transparent"
            )}
            onClick={() => !isRenaming && onSelect()}
        >
            <MessageSquare
                size={16}
                className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-cyan-400"
                )}
            />

            {isRenaming ? (
                <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="h-7 text-xs bg-black/50 border-cyan-500/50 focus-visible:ring-0 px-2"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                        onClick={handleRename}
                    >
                        <Check size={12} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={() => {
                            setEditedTitle(session.title);
                            setIsRenaming(false);
                        }}
                    >
                        <X size={12} />
                    </Button>
                </div>
            ) : (
                <div className="flex-1 min-w-0 flex items-center justify-between group/item">
                    <div className="flex flex-col truncate">
                        <span className={cn(
                            "text-sm font-medium truncate",
                            isActive ? "text-cyan-100" : "text-zinc-400 group-hover:text-cyan-200"
                        )}>
                            {session.title}
                        </span>
                        <span className="text-[10px] text-zinc-600 truncate">
                            {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/item:opacity-100 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-cyan-500/20">
                            <DropdownMenuItem
                                className="text-xs hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setIsRenaming(true);
                                }}
                            >
                                <Edit2 className="mr-2 h-3 w-3" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="mr-2 h-3 w-3" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </motion.div>
    );
}
