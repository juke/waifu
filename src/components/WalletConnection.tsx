'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, WifiOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletConnectionProps {
  isConnected?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function WalletConnection({ 
  isConnected = false, 
  address, 
  onConnect, 
  onDisconnect 
}: WalletConnectionProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full bg-card/80 backdrop-blur-sm border-b-2 border-border shadow-sm relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-waifu-gradient opacity-5"
        animate={{
          background: [
            "linear-gradient(90deg, var(--waifu-pink), var(--waifu-purple))",
            "linear-gradient(270deg, var(--waifu-purple), var(--waifu-pink))",
            "linear-gradient(90deg, var(--waifu-pink), var(--waifu-purple))"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-2xl font-bold font-serif bg-waifu-gradient bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Waifu Stream
            </motion.h1>
            <motion.div
              className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-waifu-pink" />
              VTuber Launchpad
            </motion.div>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isConnected ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                <Card className="border-waifu-pink shadow-waifu-pink relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-waifu-gradient opacity-5"
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="flex items-center gap-3 py-2 px-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Wallet className="w-4 h-4 text-waifu-pink" />
                      </motion.div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs text-muted-foreground">Connected</div>
                      <div className="text-sm font-mono">
                        {address ? formatAddress(address) : '0x...'}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onDisconnect}
                        className="border-waifu-pink hover:bg-waifu-pink/10"
                      >
                        <WifiOff className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Disconnect</span>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  onClick={onConnect}
                  className="bg-waifu-gradient hover:bg-waifu-gradient-reverse border-waifu-pink-border shadow-waifu-pink text-white font-semibold relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <Wallet className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Connect Wallet</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
