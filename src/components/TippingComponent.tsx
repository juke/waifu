'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Plus } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { useToast } from '@/components/ui/toast';

interface TippingComponentProps {
  onTipSuccess?: () => void;
}

export function TippingComponent({ onTipSuccess }: TippingComponentProps) {
  const { address, isConnected } = useAccount();
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [tipType, setTipType] = useState<'ETH' | 'WAIFU'>('ETH');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const toast = useToast();

  // Contract interactions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Get user's WAIFU balance
  const { data: waifuBalance, refetch: refetchBalance } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.TIPPING.address] : undefined,
  });

  // Get tipping stats for refresh
  const { data: tippingStats, refetch: refetchTippingStats } = useReadContract({
    ...CONTRACTS.TIPPING,
    functionName: 'getTippingStats',
  });

  const addTokenToWallet = async () => {
    try {
      // ethereum is injected by MetaMask
      await (window as { ethereum?: { request: (params: { method: string; params: unknown }) => Promise<unknown> } }).ethereum?.request({
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
    } else if (isConfirmed && !needsApproval && !hasShownSuccess) {
      // Transaction completed successfully
      const tipTypeText = tipType === 'ETH' ? 'ETH' : 'WAIFU tokens';
      const message = tipMessage || 'Thanks for the great stream!';

      toast.success(
        'Tip Sent Successfully! 🎉',
        `Your ${tipAmount} ${tipTypeText} tip has been sent with message: "${message}"`
      );

      // Clear form
      setTipAmount('');
      setTipMessage('');
      setHasShownSuccess(true);

      // Refresh data
      refetchBalance();
      refetchAllowance();
      refetchTippingStats();

      // Trigger refresh of parent components
      onTipSuccess?.();
    }
  }, [isConfirmed, needsApproval, tipType, tipAmount, tipMessage, writeContract, hasShownSuccess]);

  const handleTip = () => {
    if (!tipAmount || !isConnected) return;

    // Reset success flag for new tip
    setHasShownSuccess(false);

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
        toast.error(
          'Insufficient Balance',
          `You have ${userBalance.toFixed(2)} WAIFU but trying to tip ${tipAmount} WAIFU`
        );
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
    <Card className="bg-gradient-to-br from-waifu-pink/10 via-waifu-purple/5 to-waifu-purple/10 border-waifu-pink/30 hover:border-waifu-pink/50 transition-all duration-300 card-subtle-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-waifu-gradient rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-foreground font-bold">Tip Your Waifu</span>
            <div className="text-sm text-muted-foreground font-normal">
              Support your favorite VTuber instantly
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Balance Display */}
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

            {/* Add to Wallet Helper */}
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

                {/* Test Toast Button - Remove after testing */}
                <div className="mt-2 text-center">
                  <Button
                    onClick={() => toast.success('🎉 Toast Test', 'Toast system is working correctly!')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Test Toast System
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
