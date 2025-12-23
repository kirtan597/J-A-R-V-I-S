import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DataStreamProps {
    index: number;
}

export function DataStream({ index }: DataStreamProps) {
    const [streamData, setStreamData] = useState<{
        streamContent: string;
        left: string;
        duration: number;
        delay: number;
    } | null>(null);

    useEffect(() => {
        const characters = '01';
        const streamLength = 10 + Math.random() * 10;
        const content = Array.from({ length: Math.floor(streamLength) }, () =>
            characters[Math.floor(Math.random() * characters.length)]
        ).join('');

        setStreamData({
            streamContent: content,
            left: `${10 + (index * 15) % 90}%`,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2
        });
    }, [index]);

    if (!streamData) return null;

    return (
        <motion.div
            className="fixed top-0 font-mono text-xs text-cyan-400/20 whitespace-nowrap pointer-events-none"
            style={{ left: streamData.left }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: ['0vh', '110vh'],
                opacity: [0, 0.6, 0],
            }}
            transition={{
                duration: streamData.duration,
                repeat: Infinity,
                delay: streamData.delay,
                ease: 'linear',
            }}
        >
            {streamData.streamContent.split('').map((char, i) => (
                <div key={i}>{char}</div>
            ))}
        </motion.div>
    );
}
