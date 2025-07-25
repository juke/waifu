'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Play, Gift, Plus } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits, formatEther, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';

interface HeroSectionProps {
  onWatchStream?: () => void;
}

export function HeroSection({ onWatchStream }: HeroSectionProps) {
  const { address, isConnected } = useAccount();
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [tipType, setTipType] = useState<'ETH' | 'WAIFU'>('ETH');
  const [needsApproval, setNeedsApproval] = useState(false);

  // Contract interactions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Get core analytics
  const { data: saleStats } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'getSaleStats',
  });

  const { data: tippingStats } = useReadContract({
    ...CONTRACTS.TIPPING,
    functionName: 'getTippingStats',
  });

  // Get user's WAIFU balance
  const { data: waifuBalance } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get current allowance
  const { data: allowance } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.TIPPING.address] : undefined,
  });

  // Parse stats
  const totalTokensSold = saleStats ? Number(formatUnits(saleStats[0] as bigint, 18)) : 0;
  const totalETHRaised = saleStats ? Number(formatEther(saleStats[1] as bigint)) : 0;
  const totalBuyers = saleStats ? Number(saleStats[2]) : 0;
  const totalETHTipped = tippingStats ? Number(formatEther(tippingStats[0] as bigint)) : 0;
  const totalTippers = tippingStats ? Number(tippingStats[2]) : 0;

  const handleWatchStream = () => {
    window.open('https://abstract.stream/waifu', '_blank');
    onWatchStream?.();
  };

  const addTokenToWallet = async () => {
    try {
      // @ts-ignore - ethereum is injected by MetaMask
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACTS.WAIFU_TOKEN.address,
            symbol: 'WAIFU',
            decimals: 18,
            image: '', // You can add a token logo URL here
          },
        },
      });
    } catch (error) {
      console.error('Failed to add token to wallet:', error);
    }
  };

  // Clear tip amount when switching tip types
  useEffect(() => {
    setTipAmount('');
  }, [tipType]);

  // Handle transaction completion
  useEffect(() => {
    if (isConfirmed && needsApproval && tipType === 'WAIFU') {
      // Approval confirmed, now tip with tokens
      console.log('Approval confirmed, now tipping with tokens...');
      const tokenAmount = parseUnits(tipAmount, 18);
      writeContract({
        ...CONTRACTS.TIPPING,
        functionName: 'tipTokens',
        args: [tokenAmount, tipMessage || 'Thanks for the great stream!'],
      });
      setNeedsApproval(false);
    }
  }, [isConfirmed, needsApproval, tipType, tipAmount, tipMessage, writeContract]);

  const handleTip = () => {
    if (!tipAmount || !isConnected) return;

    console.log('Tipping with:', { tipType, tipAmount, tipMessage }); // Debug log

    if (tipType === 'ETH') {
      console.log('Calling tipETH function'); // Debug log
      const ethValue = parseEther(tipAmount);
      writeContract({
        ...CONTRACTS.TIPPING,
        functionName: 'tipETH',
        args: [tipMessage || 'Thanks for the great stream!'],
        value: ethValue,
      });
    } else {
      const tokenAmount = parseUnits(tipAmount, 18);
      const userBalance = waifuBalance ? Number(formatUnits(waifuBalance as bigint, 18)) : 0;
      const currentAllowance = allowance ? Number(formatUnits(allowance as bigint, 18)) : 0;

      console.log('WAIFU Tip Debug:', {
        tipAmount,
        tokenAmount: tokenAmount.toString(),
        userBalance,
        currentAllowance,
        tippingContractAddress: CONTRACTS.TIPPING.address,
        waifuTokenAddress: CONTRACTS.WAIFU_TOKEN.address
      });

      // Check if user has enough balance
      if (userBalance < Number(tipAmount)) {
        alert(`Insufficient WAIFU balance. You have ${userBalance.toFixed(2)} WAIFU but trying to tip ${tipAmount}`);
        return;
      }

      // Check if we need approval or can tip directly
      if (currentAllowance >= Number(tipAmount)) {
        console.log('Sufficient allowance, tipping directly');
        writeContract({
          ...CONTRACTS.TIPPING,
          functionName: 'tipTokens',
          args: [tokenAmount, tipMessage || 'Thanks for the great stream!'],
        });
      } else {
        console.log('Need to approve tokens first, then tip');
        setNeedsApproval(true);
        writeContract({
          ...CONTRACTS.WAIFU_TOKEN,
          functionName: 'approve',
          args: [CONTRACTS.TIPPING.address, tokenAmount],
        });
      }
    }
  };







  return (
    <section className="relative overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-waifu-pink/5 to-waifu-purple/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-waifu-pink/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-waifu-purple/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">

          {/* Hero Content - Left Side */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">

            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-sm font-medium text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live on Abstract Testnet
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-[1.1]">
                <span className="block text-waifu-gradient">
                  Meet Your
                </span>
                <span className="block text-foreground">
                  Waifu VTuber
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Join the 24/7 live stream experience on Abstract blockchain.
                <span className="block mt-2 text-waifu-pink font-semibold">
                  Buy tokens, tip your waifu, and build the community!
                </span>
              </p>
            </div>

            {/* Redesigned Live Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-colors">
                <div className="text-2xl font-bold text-waifu-pink">{totalETHRaised.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">ETH Raised</div>
              </div>

              <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-colors">
                <div className="text-2xl font-bold text-waifu-purple">{totalTokensSold.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Tokens Sold</div>
              </div>

              <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-colors">
                <div className="text-2xl font-bold text-blue-500">{totalBuyers}</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>

              <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-colors">
                <div className="text-xl font-bold text-green-500">{totalETHTipped.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">ETH Tipped</div>
              </div>
            </div>

            {/* User Balance - Separate if connected */}
            {isConnected && waifuBalance && (
              <div className="p-4 bg-waifu-gradient/10 border border-waifu-pink/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Your WAIFU Balance</span>
                  <span className="text-xl font-bold text-waifu-pink">
                    {Number(formatUnits(waifuBalance as bigint, 18)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Enhanced Quick Tip Interface */}
            <div>
              <Card className="bg-gradient-to-br from-waifu-pink/10 via-waifu-purple/5 to-waifu-purple/10 border-waifu-pink/30 hover:border-waifu-pink/50 transition-all duration-300 card-subtle-glow">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-waifu-gradient rounded-lg">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Quick Tip</h3>
                        <p className="text-sm text-muted-foreground">Support your favorite waifu instantly</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Tabs value={tipType} onValueChange={(value) => setTipType(value as 'ETH' | 'WAIFU')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-background/50">
                          <TabsTrigger value="ETH" className="data-[state=active]:bg-waifu-pink data-[state=active]:text-white">
                            ETH
                          </TabsTrigger>
                          <TabsTrigger value="WAIFU" className="data-[state=active]:bg-waifu-purple data-[state=active]:text-white">
                            WAIFU
                          </TabsTrigger>
                        </TabsList>

                        <div className="mt-4 space-y-3">
                          <TabsContent value="ETH" className="mt-0">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Amount (ETH)</label>
                              <Input
                                placeholder="0.01"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(e.target.value)}
                                type="number"
                                step="0.001"
                                className="border-waifu-pink/30 focus:border-waifu-pink"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="WAIFU" className="mt-0">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Amount (WAIFU)</label>
                              <Input
                                placeholder="100"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(e.target.value)}
                                type="number"
                                className="border-waifu-purple/30 focus:border-waifu-purple"
                              />
                            </div>
                          </TabsContent>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Message (Optional)</label>
                            <Input
                              placeholder="Thanks for the amazing stream! 💖"
                              value={tipMessage}
                              onChange={(e) => setTipMessage(e.target.value)}
                              className="border-border/50 focus:border-waifu-accent"
                            />
                          </div>

                          <Button
                            onClick={handleTip}
                            disabled={!isConnected || !tipAmount || isPending}
                            className="w-full bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-semibold py-3 transition-all duration-300 hover:scale-105"
                            size="lg"
                          >
                            {isPending
                              ? (needsApproval ? 'Approving...' : 'Sending Tip...')
                              : (tipType === 'WAIFU' && !needsApproval ? 'Approve & Tip' : `Tip ${tipType}`)
                            }
                          </Button>
                        </div>
                      </Tabs>

                      {/* Enhanced Add to Wallet Helper */}
                      {isConnected && (
                        <div className="pt-4 border-t border-border/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Don&apos;t see WAIFU in your wallet?</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={addTokenToWallet}
                              className="h-auto px-3 py-1 text-sm hover:text-waifu-pink hover:bg-waifu-pink/10 transition-all duration-300"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Token
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Hero Image - Right Side */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative">
              <Card className="border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                    <Image
                      src="/hero/1.png"
                      alt="Waifu VTuber Character"
                      fill
                      className="object-contain object-center"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />

                    {/* Simple overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>

                    {/* Live indicator */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>

                    {/* Viewer count */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        {totalBuyers + 127} viewers
                      </div>
                    </div>

                    {/* Watch Live Stream Button Overlay */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                      <Button
                        size="lg"
                        onClick={handleWatchStream}
                        className="bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold px-6 py-3 h-auto transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Watch Live Stream
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
