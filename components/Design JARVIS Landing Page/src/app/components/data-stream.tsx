import { motion } from 'motion/react';

interface DataStreamProps {
  index: number;
}

export function DataStream({ index }: DataStreamProps) {
  const characters = '01';
  const streamLength = 10 + Math.random() * 10;
  const left = `${10 + (index * 15) % 90}%`;
  const duration = 3 + Math.random() * 4;
  const delay = Math.random() * 2;

  return (
    <motion.div
      className="fixed top-0 font-mono text-xs text-cyan-400/20 whitespace-nowrap pointer-events-none"
      style={{ left }}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      {Array.from({ length: streamLength }, (_, i) => (
        <div key={i}>
          {characters[Math.floor(Math.random() * characters.length)]}
        </div>
      ))}
    </motion.div>
  );
}
