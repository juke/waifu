'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Zap } from 'lucide-react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 12, className = "" }: FloatingParticlesProps) {
  const icons = [Heart, Star, Sparkles, Zap];
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => {
        const Icon = icons[i % icons.length];
        const delay = i * 0.5;
        const duration = 8 + (i % 4) * 2;
        const size = 12 + (i % 3) * 8;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 8.33) % 100}%`,
              top: `${(i * 13) % 100}%`,
            }}
            initial={{ 
              opacity: 0,
              scale: 0,
              rotate: 0
            }}
            animate={{
              opacity: [0, 0.6, 0.3, 0.6, 0],
              scale: [0, 1, 1.2, 1, 0],
              rotate: [0, 180, 360],
              y: [-20, -40, -60, -80, -100],
              x: [0, 10, -10, 5, 0]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          >
            <Icon 
              className={`text-waifu-pink/30 fill-current`}
              style={{ width: size, height: size }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
