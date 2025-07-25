'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Coins, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, formatUnits } from 'viem';
import { CONTRACTS, TOKEN_CONFIG } from '@/lib/contracts';
import { useToast } from '@/components/ui/toast';

interface TokenSaleProps {
  onPurchaseSuccess?: () => void;
}

export function TokenSale({ onPurchaseSuccess }: TokenSaleProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const toast = useToast();

  // Contract interactions
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  // Log errors for debugging
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      setError(`Transaction failed: ${writeError.message}`);
    }
    if (receiptError) {
      console.error('Receipt error:', receiptError);
      setError(`Transaction receipt error: ${receiptError.message}`);
    }
  }, [writeError, receiptError]);

  // Read enhanced contract data
  const { data: saleStats, refetch: refetchSaleStats } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'getSaleStats',
  });

  const { data: rate } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'rate',
  });

  // Parse sale stats
  const totalTokensSold = saleStats ? Number(formatUnits(saleStats[0] as bigint, 18)) : 0;
  const totalETHRaised = saleStats ? Number(formatEther(saleStats[1] as bigint)) : 0;
  const totalBuyers = saleStats ? Number(saleStats[2]) : 0;
  const tokensAvailable = saleStats ? Number(formatUnits(saleStats[3] as bigint, 18)) : 1000000;

  // Calculate values for display
  const totalSupply = totalTokensSold + tokensAvailable;
  const progress = totalSupply > 0 ? (totalTokensSold / totalSupply) * 100 : 0;
  const priceInETH = rate ? 1 / Number(rate) : 0.001;

  // Transaction status
  const isLoading = isPending || isConfirming;

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





  const handleAmountChange = (value: string) => {
    setAmount(value);
    const eth = parseFloat(value) * priceInETH;
    setEthAmount(eth.toFixed(6));
    setError(null);
  };

  const handleEthAmountChange = (value: string) => {
    setEthAmount(value);
    const tokens = parseFloat(value) / priceInETH;
    setAmount(tokens.toFixed(0));
    setError(null);
  };

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setError(null);
      setHasShownSuccess(false); // Reset success flag for new purchase
      const tokenAmount = BigInt(amount);
      const ethValue = parseEther(ethAmount);

      console.log('Purchasing tokens:', { tokenAmount, ethValue, ethAmount });

      writeContract({
        ...CONTRACTS.TOKEN_SALE,
        functionName: 'buyTokens',
        value: ethValue, // Contract calculates tokens from ETH amount
      });
    } catch (err) {
      setError('Failed to initiate purchase. Please try again.');
      console.error('Purchase error:', err);
    }
  };

  // Reset form on successful transaction
  useEffect(() => {
    if (isConfirmed && !hasShownSuccess) {
      // Show success message
      toast.success(
        'Purchase Successful! 🎉',
        `You successfully purchased ${amount} WAIFU tokens for ${ethAmount} ETH!`
      );

      // Clear form
      setAmount('');
      setEthAmount('');
      setError(null);
      setHasShownSuccess(true);

      // Refresh sale stats
      refetchSaleStats();

      // Trigger refresh of parent components
      onPurchaseSuccess?.();
    }
  }, [isConfirmed, amount, ethAmount, hasShownSuccess]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      const errorMessage = writeError.message || 'Transaction failed';
      setError(errorMessage);
      toast.error('Transaction Failed', errorMessage);
    }
  }, [writeError, toast]);

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden section-bg-sale">
      {/* Enhanced complementary background with stronger visual distinction */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-waifu-purple/10 to-waifu-pink/8" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-waifu-neon/6 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-waifu-gradient/10 border border-waifu-pink/20 rounded-full text-sm font-medium text-waifu-pink mb-6">
              <Coins className="w-4 h-4" />
              Limited Time Offer
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-6 text-foreground">
              WAIFU Token Sale
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join the revolution of VTuber entertainment on the blockchain.
              <span className="block mt-2 text-waifu-pink font-semibold">
                Get your WAIFU tokens now and become part of the community!
              </span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Enhanced Sale Stats */}
            <div>
              <Card className="border-2 border-waifu-pink/30 shadow-waifu-pink relative overflow-hidden group hover:border-waifu-pink/50 transition-all duration-500 card-hover-glow">
                {/* Enhanced background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-waifu-pink/5 to-waifu-purple/5 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-waifu-neon/3 to-transparent pointer-events-none" />

                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-waifu-pink/10 rounded-lg group-hover:bg-waifu-pink/20 transition-colors duration-300">
                      <TrendingUp className="w-6 h-6 text-waifu-pink" />
                    </div>
                    <div>
                      <span className="text-foreground font-bold">Sale Progress</span>
                      <div className="text-sm text-muted-foreground font-normal">
                        Live token sale statistics
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-8 relative z-10">
                {/* Enhanced Progress Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">Sale Progress</h4>
                      <p className="text-sm text-muted-foreground">Track the token sale in real-time</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-waifu-pink">{progress.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Custom Progress Bar with Better Contrast */}
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-50" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {totalTokensSold.toLocaleString()} sold
                      </span>
                      <span className="text-muted-foreground">
                        {tokensAvailable.toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Analytics Grid */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">Sale Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-waifu-pink/10 to-waifu-pink/5 rounded-xl border border-waifu-pink/20 hover:border-waifu-pink/40 transition-all duration-300 group">
                      <div className="text-2xl font-bold text-waifu-pink group-hover:scale-110 transition-transform duration-300">
                        {totalETHRaised.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">ETH Raised</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-waifu-purple/10 to-waifu-purple/5 rounded-xl border border-waifu-purple/20 hover:border-waifu-purple/40 transition-all duration-300 group">
                      <div className="text-2xl font-bold text-waifu-purple group-hover:scale-110 transition-transform duration-300">
                        {totalBuyers}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Members</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                      <div className="text-xl font-bold text-blue-500 group-hover:scale-110 transition-transform duration-300">
                        {priceInETH.toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">ETH per Token</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
                      <div className="text-xl font-bold text-green-500 group-hover:scale-110 transition-transform duration-300">
                        {totalBuyers > 0 ? (totalETHRaised / totalBuyers).toFixed(3) : '0'}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Avg Purchase</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Enhanced Purchase Interface */}
            <div>
              <Card className="border-2 border-waifu-purple/30 shadow-waifu-purple relative overflow-hidden group hover:border-waifu-purple/50 transition-all duration-500 card-hover-glow">
                {/* Enhanced background */}
                <div className="absolute inset-0 bg-gradient-to-br from-waifu-purple/5 to-waifu-pink/5 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-waifu-neon/3 to-transparent pointer-events-none" />

                <CardHeader className="relative z-10 pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-waifu-purple/10 rounded-lg group-hover:bg-waifu-purple/20 transition-colors duration-300">
                      <Coins className="w-6 h-6 text-waifu-purple" />
                    </div>
                    <div>
                      <span className="text-foreground font-bold">Buy WAIFU Tokens</span>
                      <div className="text-sm text-muted-foreground font-normal">
                        Join the community today
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    <span className="text-muted-foreground">
                      Enter the amount you want to purchase.
                    </span>
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">Token Amount</label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="border-waifu-purple/30 focus:border-waifu-purple h-12 text-lg"
                      />
                      <p className="text-xs text-muted-foreground">Minimum: 100 WAIFU</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">ETH Amount</label>
                      <Input
                        type="number"
                        placeholder="1.0"
                        value={ethAmount}
                        onChange={(e) => handleEthAmountChange(e.target.value)}
                        className="border-waifu-purple/30 focus:border-waifu-purple h-12 text-lg"
                      />
                      <p className="text-xs text-muted-foreground">Current rate: {priceInETH.toFixed(6)} ETH/token</p>
                    </div>
                  </div>

                  {amount && ethAmount && (
                    <div className="p-4 bg-gradient-to-r from-waifu-purple/10 to-waifu-pink/10 border border-waifu-purple/20 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-3">Purchase Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">You will receive:</span>
                          <span className="font-bold text-waifu-purple text-lg">{amount} WAIFU</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total cost:</span>
                          <span className="font-bold text-foreground text-lg">{ethAmount} ETH</span>
                        </div>
                        <div className="pt-2 border-t border-border/30">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Rate:</span>
                            <span className="text-sm font-medium">{priceInETH.toFixed(6)} ETH per WAIFU</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-red-500/20 rounded-full">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-600 dark:text-red-400">Error</h5>
                          <p className="text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-green-500/20 rounded-full">
                          <span className="text-green-500 text-lg">✅</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-600 dark:text-green-400">Success!</h5>
                          <p className="text-sm text-green-600/80 dark:text-green-400/80">
                            Purchase successful! Tokens have been added to your wallet.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handlePurchase}
                    disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isLoading}
                    className="w-full bg-waifu-gradient hover:bg-waifu-gradient-reverse border-2 border-waifu-purple-border shadow-waifu-purple text-white font-bold py-4 h-auto text-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    {!isConnected ? (
                      'Connect Wallet to Purchase'
                    ) : isLoading ? (
                      isPending ? 'Confirming Transaction...' : 'Processing Purchase...'
                    ) : (
                      `Purchase ${amount || '0'} WAIFU Tokens`
                    )}
                  </Button>

                  {!isConnected && (
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-sm text-muted-foreground text-center">
                        Connect your wallet to participate in the token sale
                      </p>
                    </div>
                  )}

                  {/* Add to Wallet Helper */}
                  {isConnected && (
                    <div className="pt-4 border-t border-border/30">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Don&apos;t see WAIFU in your wallet?</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addTokenToWallet}
                          className="h-auto px-3 py-1 text-sm hover:text-waifu-purple hover:bg-waifu-purple/10 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Token
                        </Button>
                      </div>
                    </div>
                  )}
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
