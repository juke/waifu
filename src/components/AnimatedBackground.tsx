'use client';

import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'particles' | 'waves';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function AnimatedBackground({ 
  variant = 'gradient', 
  intensity = 'medium',
  className = "" 
}: AnimatedBackgroundProps) {
  
  if (variant === 'gradient') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-waifu-pink/10 via-transparent to-waifu-purple/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(var(--waifu-pink), 0.1), transparent, rgba(var(--waifu-purple), 0.1))",
              "linear-gradient(135deg, rgba(var(--waifu-purple), 0.1), transparent, rgba(var(--waifu-pink), 0.1))",
              "linear-gradient(225deg, rgba(var(--waifu-pink), 0.1), transparent, rgba(var(--waifu-purple), 0.1))",
              "linear-gradient(315deg, rgba(var(--waifu-purple), 0.1), transparent, rgba(var(--waifu-pink), 0.1))",
              "linear-gradient(45deg, rgba(var(--waifu-pink), 0.1), transparent, rgba(var(--waifu-purple), 0.1))"
            ]
          }}
          transition={{
            duration: intensity === 'low' ? 12 : intensity === 'medium' ? 8 : 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating orbs */}
        {[...Array(intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-waifu-gradient opacity-20 blur-xl"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.1, 0.3, 0.1, 0.2]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'waves') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${30 + i * 20}% ${40 + i * 15}%, rgba(var(--waifu-${i % 2 === 0 ? 'pink' : 'purple'}), 0.1) 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
