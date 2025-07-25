'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';

export function AdminPanel() {
  const { address, isConnected } = useAccount();
  const [fundAmount, setFundAmount] = useState('1000000'); // Default 1M tokens
  const [error, setError] = useState<string | null>(null);

  // Contract interactions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check WAIFU token balance of TokenSale contract
  const {
    data: tokenSaleBalance,
    refetch: refetchTokenSaleBalance,
    error: tokenSaleBalanceError,
    isLoading: tokenSaleBalanceLoading
  } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'balanceOf',
    args: [CONTRACTS.TOKEN_SALE.address],
  });

  // Debug logging
  console.log('Contract addresses:', {
    WAIFU_TOKEN: CONTRACTS.WAIFU_TOKEN.address,
    TOKEN_SALE: CONTRACTS.TOKEN_SALE.address,
    tokenSaleBalance: tokenSaleBalance?.toString(),
    tokenSaleBalanceError: tokenSaleBalanceError,
    tokenSaleBalanceLoading: tokenSaleBalanceLoading,
  });

  // Check WAIFU token balance of current user
  const {
    data: userBalance,
    error: userBalanceError,
    isLoading: userBalanceLoading
  } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // More debug logging
  console.log('User balance check:', {
    userBalance: userBalance?.toString(),
    userBalanceError: userBalanceError,
    userBalanceLoading: userBalanceLoading,
    address: address,
  });

  // Check TokenSale rate
  const { data: rate } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'rate',
  });

  // Test if WAIFU token contract exists by reading its name
  const { data: tokenName, error: tokenNameError } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'name',
  });

  // Test if WAIFU token contract exists by reading its symbol
  const { data: tokenSymbol, error: tokenSymbolError } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'symbol',
  });

  console.log('Token contract test:', {
    tokenName,
    tokenNameError,
    tokenSymbol,
    tokenSymbolError,
  });

  const handleFundContract = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setError(null);
      const amount = parseUnits(fundAmount, 18); // WAIFU has 18 decimals

      console.log('Funding TokenSale contract with:', {
        amount: amount.toString(),
        fundAmount,
        to: CONTRACTS.TOKEN_SALE.address
      });

      writeContract({
        ...CONTRACTS.WAIFU_TOKEN,
        functionName: 'transfer',
        args: [CONTRACTS.TOKEN_SALE.address, amount],
      });
    } catch (err) {
      setError('Failed to fund contract. Please try again.');
      console.error('Fund error:', err);
    }
  };

  // Refetch balances when transaction is confirmed
  if (isConfirmed) {
    refetchTokenSaleBalance();
  }

  const isLoading = isPending || isConfirming;

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-waifu-purple/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-waifu-purple/10 rounded-lg">
            <span className="text-2xl">🔧</span>
          </div>
          <div>
            <span className="text-foreground font-bold">Admin Panel</span>
            <div className="text-sm text-muted-foreground font-normal">
              Manage TokenSale contract funding
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Enhanced Current Balances */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Current Balances</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-waifu-purple/30 bg-gradient-to-br from-waifu-purple/5 to-waifu-purple/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-waifu-purple/20 rounded-lg">
                    <span className="text-lg">🏪</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">TokenSale Contract</h4>
                    <p className="text-sm text-muted-foreground">Available for sale</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-waifu-purple font-mono">
                    {tokenSaleBalance ? Number(formatUnits(tokenSaleBalance as bigint, 18)).toLocaleString() : '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">WAIFU tokens</p>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {CONTRACTS.TOKEN_SALE.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-waifu-pink/30 bg-gradient-to-br from-waifu-pink/5 to-waifu-pink/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-waifu-pink/20 rounded-lg">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Your Balance</h4>
                    <p className="text-sm text-muted-foreground">Available to transfer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-waifu-pink font-mono">
                    {userBalance ? Number(formatUnits(userBalance as bigint, 18)).toLocaleString() : '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">WAIFU tokens</p>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Rate: {rate ? rate.toString() : '0'} WAIFU per ETH
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Fund Contract Form */}
        <Card className="border border-border/50 bg-card/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-lg">💰</span>
              Fund TokenSale Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Amount to Transfer (WAIFU tokens)
              </label>
              <Input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="1000000"
                className="font-mono text-lg h-12 border-waifu-purple/30 focus:border-waifu-purple"
              />
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Transfer tokens from your wallet to enable token sales
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFundAmount('100000')}
                    className="h-8 px-3 text-xs"
                  >
                    100K
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFundAmount('1000000')}
                    className="h-8 px-3 text-xs"
                  >
                    1M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFundAmount('10000000')}
                    className="h-8 px-3 text-xs"
                  >
                    10M
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleFundContract}
              disabled={!isConnected || isLoading || !fundAmount}
              className="w-full bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold py-3 h-auto text-lg transition-all duration-300 hover:scale-105"
              size="lg"
            >
              {isLoading
                ? (isPending ? 'Confirming Transaction...' : 'Processing Transfer...')
                : `Transfer ${fundAmount ? Number(fundAmount).toLocaleString() : '0'} WAIFU Tokens`
              }
            </Button>

            {error && (
              <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-red-500/20 rounded-full">
                    <span className="text-red-500 text-lg">⚠️</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-600 dark:text-red-400">Transfer Failed</h5>
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
                    <h5 className="font-semibold text-green-600 dark:text-green-400">Transfer Successful!</h5>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      TokenSale contract has been funded. Users can now purchase tokens.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Enhanced Instructions & Debug Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📋</span>
                <h3 className="font-semibold text-foreground">Instructions</h3>
              </div>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Ensure you have WAIFU tokens in your connected wallet</li>
                <li>Enter the amount of tokens to transfer to the TokenSale contract</li>
                <li>Click the transfer button and confirm the transaction in your wallet</li>
                <li>Once confirmed, users will be able to purchase tokens from the sale!</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border border-gray-500/30 bg-gradient-to-br from-gray-500/5 to-gray-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔍</span>
                <h3 className="font-semibold text-foreground">Contract Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Token Name:</p>
                  <p className="text-muted-foreground font-mono">{tokenName || 'Loading...'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Token Symbol:</p>
                  <p className="text-muted-foreground font-mono">{tokenSymbol || 'Loading...'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Network:</p>
                  <p className="text-muted-foreground">Abstract Testnet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
