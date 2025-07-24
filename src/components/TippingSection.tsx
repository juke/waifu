'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Gift, Sparkles, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface TippingSectionProps {
  onTip?: (amount: string, currency: 'ETH' | 'WAIFU') => void;
  isConnected?: boolean;
  isLoading?: boolean;
  waifuBalance?: string;
  ethBalance?: string;
}

export function TippingSection({
  onTip,
  isConnected = false,
  isLoading = false,
  waifuBalance = '0',
  ethBalance = '0'
}: TippingSectionProps) {
  const [ethAmount, setEthAmount] = useState('');
  const [waifuAmount, setWaifuAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'ETH' | 'WAIFU'>('ETH');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
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



  const quickAmounts = {
    ETH: ['0.001', '0.01', '0.1', '1.0'],
    WAIFU: ['100', '500', '1000', '5000']
  };

  const handleQuickAmount = (amount: string) => {
    if (selectedCurrency === 'ETH') {
      setEthAmount(amount);
    } else {
      setWaifuAmount(amount);
    }
  };

  const handleTip = () => {
    const amount = selectedCurrency === 'ETH' ? ethAmount : waifuAmount;
    if (amount && parseFloat(amount) > 0) {
      onTip?.(amount, selectedCurrency);
    }
  };

  const getCurrentAmount = () => {
    return selectedCurrency === 'ETH' ? ethAmount : waifuAmount;
  };



  const getCurrentBalance = () => {
    return selectedCurrency === 'ETH' ? ethBalance : waifuBalance;
  };

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-waifu-pink/10 to-waifu-purple/10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto"
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
                Support Your Waifu
              </span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Show your appreciation with tips! Every contribution helps keep the stream going.
            </motion.p>
          </motion.div>

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

              <CardHeader className="text-center relative z-10">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-waifu-pink fill-current" />
                  Send a Tip
                </CardTitle>
                <CardDescription>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Choose your preferred currency and amount
                  </motion.span>
                </CardDescription>
              </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs 
                value={selectedCurrency} 
                onValueChange={(value) => setSelectedCurrency(value as 'ETH' | 'WAIFU')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ETH" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    ETH
                  </TabsTrigger>
                  <TabsTrigger value="WAIFU" className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    WAIFU
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ETH" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">ETH Amount</label>
                      <span className="text-xs text-muted-foreground">
                        Balance: {parseFloat(ethBalance).toFixed(4)} ETH
                      </span>
                    </div>
                    <Input
                      type="number"
                      placeholder="0.01"
                      value={ethAmount}
                      onChange={(e) => setEthAmount(e.target.value)}
                      className="border-waifu-pink/50 focus:border-waifu-pink"
                      step="0.001"
                      min="0"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="WAIFU" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">WAIFU Amount</label>
                      <span className="text-xs text-muted-foreground">
                        Balance: {parseFloat(waifuBalance).toLocaleString()} WAIFU
                      </span>
                    </div>
                    <Input
                      type="number"
                      placeholder="100"
                      value={waifuAmount}
                      onChange={(e) => setWaifuAmount(e.target.value)}
                      className="border-waifu-purple/50 focus:border-waifu-purple"
                      step="1"
                      min="0"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick amounts</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts[selectedCurrency].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      className={`border-${selectedCurrency === 'ETH' ? 'waifu-pink' : 'waifu-purple'}/50 hover:bg-${selectedCurrency === 'ETH' ? 'waifu-pink' : 'waifu-purple'}/10`}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tip Preview */}
              {getCurrentAmount() && parseFloat(getCurrentAmount()) > 0 && (
                <div className="p-4 bg-waifu-gradient/10 rounded-lg border border-waifu-pink/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">You're sending:</span>
                    <span className="font-semibold">
                      {getCurrentAmount()} {selectedCurrency}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Your waifu will be so happy! 💖
                  </div>
                </div>
              )}

              {/* Send Tip Button */}
              <Button
                onClick={handleTip}
                disabled={
                  !isConnected || 
                  !getCurrentAmount() || 
                  parseFloat(getCurrentAmount()) <= 0 || 
                  parseFloat(getCurrentAmount()) > parseFloat(getCurrentBalance()) ||
                  isLoading
                }
                className="w-full bg-waifu-gradient hover:bg-waifu-gradient-reverse border-waifu-pink-border shadow-waifu-pink text-white font-semibold"
                size="lg"
              >
                <Gift className="w-4 h-4 mr-2" />
                {!isConnected ? (
                  'Connect Wallet to Tip'
                ) : isLoading ? (
                  'Sending Tip...'
                ) : (
                  `Send ${getCurrentAmount()} ${selectedCurrency} Tip`
                )}
              </Button>

              {!isConnected && (
                <p className="text-xs text-muted-foreground text-center">
                  Connect your wallet to send tips to your favorite waifu
                </p>
              )}

              {isConnected && parseFloat(getCurrentAmount()) > parseFloat(getCurrentBalance()) && (
                <p className="text-xs text-destructive text-center">
                  Insufficient {selectedCurrency} balance
                </p>
              )}
            </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
