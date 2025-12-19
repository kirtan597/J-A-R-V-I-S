
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JarvisCoreProps {
    status: "idle" | "thinking" | "speaking" | "error";
    className?: string;
}

export function JarvisCore({ status, className }: JarvisCoreProps) {
    const color = status === "error" ? "red" : status === "thinking" ? "violet" : "cyan";

    return (
        <div className={cn("relative flex items-center justify-center w-32 h-32", className)}>
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={cn(
                    "absolute inset-0 rounded-full border-2 border-dashed opacity-30",
                    `border-${color}-500`
                )}
            />

            {/* Middle Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={cn(
                    "absolute inset-2 rounded-full border border-t-transparent opacity-40",
                    `border-${color}-400`
                )}
            />

            {/* Core Energy */}
            <motion.div
                animate={{
                    scale: status === "speaking" ? [1, 1.2, 1] : [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: status === "speaking" ? 0.5 : 2, repeat: Infinity }}
                className={cn(
                    "absolute inset-8 rounded-full blur-md bg-gradient-to-br",
                    status === "error" ? "from-red-500 to-orange-600" :
                        status === "thinking" ? "from-violet-500 to-purple-600" :
                            "from-cyan-400 to-blue-600"
                )}
            />

            {/* Solid Center */}
            <div className={cn(
                "absolute inset-10 rounded-full bg-white/10 backdrop-blur-sm border shadow-[0_0_20px_currentColor]",
                `border-${color}-300 text-${color}-400`
            )} />

        </div>
    );
}
