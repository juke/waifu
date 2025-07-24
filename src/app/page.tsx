'use client';

import { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { HeroSection } from '@/components/HeroSection';
import { TokenSale } from '@/components/TokenSale';
import { TippingSection } from '@/components/TippingSection';

import { motion } from 'framer-motion';

export default function Home() {
  // Mock wallet state - replace with real wallet integration
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waifuBalance, setWaifuBalance] = useState('1000');
  const [ethBalance, setEthBalance] = useState('2.5');

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setAddress('0x1234567890123456789012345678901234567890');
      setIsLoading(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
  };

  const handlePurchase = async (amount: string) => {
    setIsLoading(true);
    console.log('Purchasing tokens:', amount);
    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false);
      // Update balances after purchase
    }, 2000);
  };

  const handleTip = async (amount: string, currency: 'ETH' | 'WAIFU') => {
    setIsLoading(true);
    console.log('Sending tip:', amount, currency);
    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false);
      // Update balances after tip
      if (currency === 'ETH') {
        setEthBalance(prev => (parseFloat(prev) - parseFloat(amount)).toString());
      } else {
        setWaifuBalance(prev => (parseFloat(prev) - parseFloat(amount)).toString());
      }
    }, 2000);
  };

  const handleWatchStream = () => {
    console.log('Opening stream in new tab');
  };

  return (
    <motion.div
      className="min-h-screen bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-waifu-pink/5 to-waifu-purple/5" />

      {/* Header with Wallet Connection */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <WalletConnection
          isConnected={isConnected}
          address={address}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection onWatchStream={handleWatchStream} />

        {/* Token Sale Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <TokenSale
            onPurchase={handlePurchase}
            isConnected={isConnected}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Tipping Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <TippingSection
            onTip={handleTip}
            isConnected={isConnected}
            isLoading={isLoading}
            waifuBalance={waifuBalance}
            ethBalance={ethBalance}
          />
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        className="border-t-2 border-border bg-card/80 backdrop-blur-sm py-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.p
            className="text-muted-foreground text-sm"
            whileHover={{ scale: 1.05, color: "var(--waifu-pink)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            © 2024 Waifu Stream. Built with ❤️ for the VTuber community.
          </motion.p>
        </div>
      </motion.footer>
    </motion.div>
  );
}
