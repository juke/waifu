'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePublicClient } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { Trophy, Crown, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TipperStats {
  address: string;
  ethTipped: bigint;
  waifuTipped: bigint;
  totalValue: number; // For ranking
}

export function Leaderboard() {
  const [topTippers, setTopTippers] = useState<TipperStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchTopTippers = async () => {
      if (!publicClient) return;

      try {
        setLoading(true);
        setError(null);

        // Get all ETH tip events
        const ethTipLogs = await publicClient.getLogs({
          address: CONTRACTS.TIPPING.address,
          event: {
            type: 'event',
            name: 'ETHTipped',
            inputs: [
              { name: 'from', type: 'address', indexed: true },
              { name: 'to', type: 'address', indexed: true },
              { name: 'amount', type: 'uint256', indexed: false },
              { name: 'message', type: 'string', indexed: false },
            ],
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        // Get all Token tip events
        const tokenTipLogs = await publicClient.getLogs({
          address: CONTRACTS.TIPPING.address,
          event: {
            type: 'event',
            name: 'TokensTipped',
            inputs: [
              { name: 'from', type: 'address', indexed: true },
              { name: 'to', type: 'address', indexed: true },
              { name: 'amount', type: 'uint256', indexed: false },
              { name: 'message', type: 'string', indexed: false },
            ],
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        // Aggregate tips by address
        const tipperMap = new Map<string, { ethTipped: bigint; waifuTipped: bigint }>();

        // Process ETH tips
        for (const log of ethTipLogs) {
          if (log.args) {
            const from = log.args.from as string;
            const amount = log.args.amount as bigint;
            const existing = tipperMap.get(from) || { ethTipped: 0n, waifuTipped: 0n };
            tipperMap.set(from, {
              ...existing,
              ethTipped: existing.ethTipped + amount,
            });
          }
        }

        // Process Token tips
        for (const log of tokenTipLogs) {
          if (log.args) {
            const from = log.args.from as string;
            const amount = log.args.amount as bigint;
            const existing = tipperMap.get(from) || { ethTipped: 0n, waifuTipped: 0n };
            tipperMap.set(from, {
              ...existing,
              waifuTipped: existing.waifuTipped + amount,
            });
          }
        }

        // Convert to array and calculate total value for ranking
        const tippersArray: TipperStats[] = Array.from(tipperMap.entries()).map(([address, stats]) => {
          const ethValue = Number(formatEther(stats.ethTipped));
          const waifuValue = Number(formatUnits(stats.waifuTipped, 18)) * 0.001; // Rough conversion
          return {
            address,
            ethTipped: stats.ethTipped,
            waifuTipped: stats.waifuTipped,
            totalValue: ethValue + waifuValue,
          };
        });

        // Sort by total value and take top 5
        const sortedTippers = tippersArray
          .filter(tipper => tipper.totalValue > 0)
          .sort((a, b) => b.totalValue - a.totalValue)
          .slice(0, 5);

        setTopTippers(sortedTippers);
      } catch (error) {
        console.error('Error fetching top tippers:', error);
        setError('Failed to load leaderboard. Please check your connection.');
        // Set empty array to prevent infinite loading
        setTopTippers([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if publicClient is available and no error
    if (publicClient && !error) {
      fetchTopTippers();
    }
  }, [publicClient, error]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 1: return <Medal className="w-4 h-4 text-gray-400" />;
      case 2: return <Medal className="w-4 h-4 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div>
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <span className="text-foreground font-bold">Top Tippers</span>
              <div className="text-sm text-muted-foreground font-normal">
                Community leaderboard
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
              <div className="text-center py-6 text-muted-foreground">
                <div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-yellow-500 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : topTippers.length > 0 ? (
              <div className="space-y-4">
                {topTippers.map((tipper, index) => {
                  const ethAmount = Number(formatEther(tipper.ethTipped));
                  const waifuAmount = Number(formatUnits(tipper.waifuTipped, 18));

                  return (
                    <div
                      key={tipper.address}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border-yellow-500/30 hover:border-yellow-500/50'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-gray-400/30 hover:border-gray-400/50'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-600/10 to-orange-700/5 border-orange-600/30 hover:border-orange-600/50'
                          : 'bg-gradient-to-r from-muted/30 to-muted/20 border-border/30 hover:border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`p-2 rounded-lg ${
                          index === 0 ? 'bg-yellow-500/20' :
                          index === 1 ? 'bg-gray-400/20' :
                          index === 2 ? 'bg-orange-600/20' :
                          'bg-muted/50'
                        }`}>
                          {getRankIcon(index)}
                        </div>
                        <div className="text-center">
                          <div className={`font-bold text-lg ${getRankColor(index)}`}>
                            #{index + 1}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : index === 2 ? 'Third' : 'Supporter'}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-1">
                          {formatAddress(tipper.address)}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {ethAmount > 0 && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-medium">
                              {ethAmount.toFixed(3)} ETH
                            </span>
                          )}
                          {waifuAmount > 0 && (
                            <span className="px-2 py-1 bg-waifu-purple/10 text-waifu-purple border border-waifu-purple/20 rounded-full text-xs font-medium">
                              {waifuAmount.toLocaleString()} WAIFU
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-foreground">
                          {(ethAmount + waifuAmount * 0.001).toFixed(3)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Value</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tippers yet. Be the first to make it to the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
