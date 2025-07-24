'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Users, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onWatchStream?: () => void;
}

export function HeroSection({ onWatchStream }: HeroSectionProps) {
  const handleWatchStream = () => {
    // Open Abstract stream in new tab
    window.open('https://abstract.stream/waifu', '_blank');
    onWatchStream?.();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };





  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-waifu-pink/10 to-waifu-purple/10" />



      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Hero Content */}
          <motion.div className="space-y-6 lg:space-y-8 order-2 lg:order-1" variants={itemVariants}>
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight"
                variants={itemVariants}
              >
                <span className="bg-waifu-gradient bg-clip-text text-transparent text-waifu-glow">
                  Meet Your
                </span>
                <br />
                <span className="text-foreground">
                  Waifu VTuber
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground max-w-lg"
                variants={itemVariants}
              >
                Join the 24/7 live stream experience on Abstract.
                Buy tokens, tip your favorite waifu, and be part of the community!
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div
              className="flex flex-wrap gap-4 sm:gap-6"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-semibold">LIVE</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.05, color: "var(--waifu-pink)" }}
              >
                <Users className="w-4 h-4" />
                <span>1,234 viewers</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.05, color: "var(--waifu-purple)" }}
              >
                <Zap className="w-4 h-4" />
                <span>24/7 streaming</span>
              </motion.div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button
                size="lg"
                onClick={handleWatchStream}
                className="bg-waifu-gradient hover:bg-waifu-gradient-reverse border-waifu-pink-border shadow-waifu-pink text-white font-bold text-lg px-8 py-6 h-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Live Stream
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-waifu-purple hover:bg-waifu-purple/10 text-lg px-8 py-6 h-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="order-1 lg:order-2"
            variants={itemVariants}
          >
            <Card className="border-waifu-purple shadow-waifu-purple overflow-hidden bg-waifu-gradient/10">
              <CardContent className="p-0">
                <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">
                  <Image
                    src="/hero/1.png"
                    alt="Waifu VTuber Character"
                    fill
                    className="object-contain object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />

                  {/* Simple overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-waifu-purple/20 via-transparent to-waifu-pink/20"></div>

                  {/* Simple live indicator */}
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
