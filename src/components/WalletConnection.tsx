'use client';

import { Button } from '@/components/ui/button';
import { Wallet, WifiOff, Sparkles, AlertTriangle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { abstractTestnet } from '@/lib/wagmi';
import { useEffect, useState } from 'react';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  // Removed balance logic as requested

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

      <div className="container mx-auto px-4 py-5 relative z-10">
        <div className="flex items-center justify-between">
          {/* Enhanced Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-waifu-gradient rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-waifu-gradient">
                  Waifu Stream
                </h1>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-waifu-pink" />
                  <span className="font-medium">VTuber Launchpad</span>
                  <span className="px-2 py-1 bg-waifu-pink/10 border border-waifu-pink/20 rounded-full text-xs font-semibold text-waifu-pink">
                    TESTNET
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Connection Section */}
          <div className="flex items-center gap-4">
            {/* Enhanced Network Warning */}
            {showNetworkWarning && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="p-1 bg-yellow-500/20 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Wrong Network</span>
                  <span className="text-xs text-muted-foreground">Please switch to Abstract Testnet</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleSwitchNetwork}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 h-auto text-xs transition-all duration-300 hover:scale-105"
                >
                  Switch Network
                </Button>
              </div>
            )}

            {isConnected ? (
              <div className="flex items-center gap-4 bg-gradient-to-r from-background/90 to-card/90 border-2 border-waifu-pink/30 rounded-xl px-5 py-3 shadow-lg backdrop-blur-sm hover:border-waifu-pink/50 transition-all duration-300">
                {/* Connection Status Indicator */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-3 h-3 rounded-full ${showNetworkWarning ? 'bg-yellow-500' : 'bg-green-500'} shadow-sm`}
                    />
                    <div
                      className={`absolute inset-0 w-3 h-3 rounded-full ${showNetworkWarning ? 'bg-yellow-500' : 'bg-green-500'} animate-ping opacity-75`}
                    />
                  </div>
                  <div className="p-2 bg-waifu-pink/10 rounded-lg">
                    <Wallet className="w-5 h-5 text-waifu-pink" />
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    Connected
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {address ? formatAddress(address) : '0x...'}
                  </div>
                </div>

                {/* Disconnect Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-red-500 hover:text-red-600 px-3 py-2 h-auto transition-all duration-300 hover:scale-105"
                >
                  <WifiOff className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={handleConnect}
                  disabled={isPending}
                  size="lg"
                  className="bg-waifu-gradient hover:bg-waifu-gradient-reverse border-2 border-waifu-pink-border shadow-waifu-pink text-white font-bold px-6 py-3 h-auto relative overflow-hidden group disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-full">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-base font-bold">
                        {isPending ? 'Connecting...' : 'Connect Wallet'}
                      </span>
                      <span className="text-xs opacity-90">
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
