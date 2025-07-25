'use client';

import { Button } from '@/components/ui/button';
import { Wallet, WifiOff, Sparkles, AlertTriangle, Coins } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useReadContract } from 'wagmi';
import { abstractTestnet } from '@/lib/wagmi';
import { useEffect, useState } from 'react';
import { CONTRACTS } from '@/lib/contracts';
import { formatTokenBalance } from '@/lib/utils';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  // Get user's WAIFU token balance
  const { data: waifuBalance } = useReadContract({
    ...CONTRACTS.WAIFU_TOKEN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Debug logging
  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
    if (error) {
      console.error('Wallet connection error:', error);
    }
    if (isConnected) {
      console.log('Wallet connected:', { address, chainId });
    }
  }, [connectors, error, isConnected, address, chainId]);

  // Check if user is on the correct network
  useEffect(() => {
    if (isConnected && chainId !== abstractTestnet.id) {
      setShowNetworkWarning(true);
    } else {
      setShowNetworkWarning(false);
    }
  }, [isConnected, chainId]);

  const handleConnect = () => {
    try {
      console.log('Attempting to connect wallet...');
      console.log('Available connectors:', connectors);

      // Try to find injected connector (MetaMask, etc.)
      let targetConnector = connectors.find(connector =>
        connector.id === 'injected' ||
        connector.name.toLowerCase().includes('injected') ||
        connector.name.toLowerCase().includes('metamask')
      );

      // If no injected connector found, use the first available
      if (!targetConnector && connectors.length > 0) {
        targetConnector = connectors[0];
      }

      if (targetConnector) {
        console.log('Connecting with connector:', targetConnector.name);
        connect({ connector: targetConnector });
      } else {
        console.error('No wallet connectors available');
        alert('No wallet connectors found. Please make sure MetaMask or another wallet is installed.');
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: abstractTestnet.id });
  };
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-card/90 to-card/80 backdrop-blur-md border-b-2 border-waifu-pink/20 shadow-lg relative overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-waifu-pink/8 to-waifu-purple/8" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-waifu-neon/3 to-transparent" />

      <div className="container mx-auto px-4 py-1 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:flex-nowrap">
          {/* Enhanced Brand Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-waifu-gradient rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold font-serif text-waifu-gradient">
                  Waifu Stream
                </h1>
                <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-waifu-pink" />
                  <span className="font-medium">VTuber Launchpad</span>
                  <span className="px-1.5 py-0.5 bg-waifu-pink/10 border border-waifu-pink/20 rounded-full text-xs font-semibold text-waifu-pink">
                    TESTNET
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Connection Section */}
          <div className="flex items-center gap-2">
            {/* Enhanced Network Warning */}
            {showNetworkWarning && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm">
                <div className="p-0.5 bg-yellow-500/20 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Wrong Network</span>
                  <span className="text-xs text-muted-foreground">Switch to Abstract Testnet</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleSwitchNetwork}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-2 py-1 h-auto text-xs transition-all duration-300 hover:scale-105"
                >
                  Switch
                </Button>
              </div>
            )}

            {isConnected ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-background/90 to-card/90 border border-waifu-pink/30 rounded-lg px-2 sm:px-3 py-2 shadow-lg backdrop-blur-sm hover:border-waifu-pink/50 transition-all duration-300 flex-wrap sm:flex-nowrap min-w-0">
                {/* Connection Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div
                      className={`w-2 h-2 rounded-full ${showNetworkWarning ? 'bg-yellow-500' : 'bg-green-500'} shadow-sm`}
                    />
                    <div
                      className={`absolute inset-0 w-2 h-2 rounded-full ${showNetworkWarning ? 'bg-yellow-500' : 'bg-green-500'} animate-ping opacity-75`}
                    />
                  </div>
                  <div className="p-1 bg-waifu-pink/10 rounded">
                    <Wallet className="w-4 h-4 text-waifu-pink" />
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="hidden sm:block text-xs font-semibold text-foreground">
                    Connected
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {address ? formatAddress(address) : '0x...'}
                  </div>
                </div>

                {/* WAIFU Token Balance - Hidden on mobile */}
                {waifuBalance && waifuBalance > BigInt(0) && (
                  <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-waifu-purple/10 to-waifu-pink/10 border border-waifu-purple/20 rounded px-2 py-1 min-w-0">
                    <div className="p-0.5 bg-waifu-purple/20 rounded flex-shrink-0">
                      <Coins className="w-3 h-3 text-waifu-purple" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-xs font-medium text-muted-foreground leading-none">
                        WAIFU
                      </div>
                      <div className="text-xs font-bold text-waifu-purple truncate leading-none">
                        {formatTokenBalance(waifuBalance)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Disconnect Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-red-500 hover:text-red-600 px-1.5 sm:px-2 py-1 h-auto transition-all duration-300 hover:scale-105 flex-shrink-0"
                >
                  <WifiOff className="w-3 h-3 sm:mr-1" />
                  <span className="hidden md:inline text-xs">Disconnect</span>
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={handleConnect}
                  disabled={isPending}
                  size="sm"
                  className="bg-waifu-gradient hover:bg-waifu-gradient-reverse border border-waifu-pink-border shadow-waifu-pink text-white font-bold px-3 sm:px-4 py-2 h-auto relative overflow-hidden group disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                    <div className="p-0.5 bg-white/20 rounded-full">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs sm:text-sm font-bold leading-none">
                        {isPending ? 'Connecting...' : 'Connect'}
                      </span>
                      <span className="hidden sm:block text-xs opacity-90 leading-none">
                        {isPending ? 'Please wait...' : 'Start your journey'}
                      </span>
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
