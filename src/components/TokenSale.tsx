'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenSaleProps {
  onPurchase?: (amount: string) => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

export function TokenSale({ onPurchase, isConnected = false, isLoading = false }: TokenSaleProps) {
  const [amount, setAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');

  // Mock data - replace with real data from smart contract
  const tokenPrice = 0.001; // ETH per token
  const totalSupply = 1000000;
  const soldTokens = 250000;
  const progress = (soldTokens / totalSupply) * 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };



  const handleAmountChange = (value: string) => {
    setAmount(value);
    const eth = parseFloat(value) * tokenPrice;
    setEthAmount(eth.toFixed(6));
  };

  const handleEthAmountChange = (value: string) => {
    setEthAmount(value);
    const tokens = parseFloat(value) / tokenPrice;
    setAmount(tokens.toFixed(0));
  };

  const handlePurchase = () => {
    if (amount && parseFloat(amount) > 0) {
      onPurchase?.(amount);
    }
  };

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-waifu-pink/5 to-waifu-purple/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >

          {/* Enhanced Section Header */}
          <motion.div
            className="text-center mb-8 lg:mb-12"
            variants={cardVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold font-serif mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="bg-waifu-gradient bg-clip-text text-transparent">
                Token Sale
              </span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Get your WAIFU tokens now! Support your favorite VTuber and join the community.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-6 lg:gap-8"
            variants={containerVariants}
          >

            {/* Enhanced Sale Stats */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-waifu-pink shadow-waifu-pink relative overflow-hidden group">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-waifu-gradient opacity-5"
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-5 h-5 text-waifu-pink" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Sale Progress
                    </motion.span>
                  </CardTitle>
                  <CardDescription>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {soldTokens.toLocaleString()} / {totalSupply.toLocaleString()} tokens sold
                    </motion.span>
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-waifu-pink/10 rounded-lg border border-waifu-pink/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-waifu-pink" />
                      <span className="text-sm text-muted-foreground">Price</span>
                    </div>
                    <div className="font-bold text-lg">{tokenPrice} ETH</div>
                    <div className="text-xs text-muted-foreground">per token</div>
                  </div>
                  
                  <div className="text-center p-4 bg-waifu-purple/10 rounded-lg border border-waifu-purple/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-waifu-purple" />
                      <span className="text-sm text-muted-foreground">Remaining</span>
                    </div>
                    <div className="font-bold text-lg">{(totalSupply - soldTokens).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">tokens</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            {/* Enhanced Purchase Interface */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-waifu-purple shadow-waifu-purple relative overflow-hidden group">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-waifu-gradient opacity-5"
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Coins className="w-5 h-5 text-waifu-purple" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Buy WAIFU Tokens
                  </motion.span>
                </CardTitle>
                <CardDescription>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Enter the amount you want to purchase
                  </motion.span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token Amount</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="border-waifu-purple/50 focus:border-waifu-purple"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ETH Amount</label>
                  <Input
                    type="number"
                    placeholder="1.0"
                    value={ethAmount}
                    onChange={(e) => handleEthAmountChange(e.target.value)}
                    className="border-waifu-purple/50 focus:border-waifu-purple"
                  />
                </div>

                {amount && ethAmount && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span>You will receive:</span>
                      <span className="font-semibold">{amount} WAIFU</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total cost:</span>
                      <span className="font-semibold">{ethAmount} ETH</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePurchase}
                  disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isLoading}
                  className="w-full bg-waifu-gradient hover:bg-waifu-gradient-reverse border-waifu-purple-border shadow-waifu-purple text-white font-semibold"
                  size="lg"
                >
                  {!isConnected ? (
                    'Connect Wallet to Purchase'
                  ) : isLoading ? (
                    'Processing...'
                  ) : (
                    'Purchase Tokens'
                  )}
                </Button>

                {!isConnected && (
                  <p className="text-xs text-muted-foreground text-center">
                    Connect your wallet to participate in the token sale
                  </p>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
