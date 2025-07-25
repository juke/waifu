'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePublicClient } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { Clock, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TipEvent {
  from: string;
  amount: bigint;
  message: string;
  timestamp: number;
  isETH: boolean;
  blockNumber: bigint;
}

export function RecentTips() {
  const [recentTips, setRecentTips] = useState<TipEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchRecentTips = async () => {
      if (!publicClient) return;

      try {
        setLoading(true);
        setError(null);

        // Get recent ETH tip events
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

        // Get recent Token tip events
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

        // Combine and process events
        const allTips: TipEvent[] = [];

        // Process ETH tips
        for (const log of ethTipLogs) {
          if (log.args) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            allTips.push({
              from: log.args.from as string,
              amount: log.args.amount as bigint,
              message: log.args.message as string,
              timestamp: Number(block.timestamp),
              isETH: true,
              blockNumber: log.blockNumber,
            });
          }
        }

        // Process Token tips
        for (const log of tokenTipLogs) {
          if (log.args) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            allTips.push({
              from: log.args.from as string,
              amount: log.args.amount as bigint,
              message: log.args.message as string,
              timestamp: Number(block.timestamp),
              isETH: false,
              blockNumber: log.blockNumber,
            });
          }
        }

        // Sort by block number (most recent first) and take last 5
        const sortedTips = allTips
          .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
          .slice(0, 5);

        setRecentTips(sortedTips);
      } catch (error) {
        console.error('Error fetching recent tips:', error);
        setError('Failed to load recent tips. Please check your connection.');
        // Set empty array to prevent infinite loading
        setRecentTips([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if publicClient is available
    if (publicClient) {
      fetchRecentTips();
    }
  }, [publicClient]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-waifu-pink/10 rounded-lg">
              <Gift className="w-5 h-5 text-waifu-pink" />
            </div>
            <div>
              <span className="text-foreground font-bold">Recent Tips</span>
              <div className="text-sm text-muted-foreground font-normal">
                Latest community support
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
              <div className="text-center py-6 text-muted-foreground">
                <div className="animate-spin w-6 h-6 border-2 border-waifu-pink border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading recent tips...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-waifu-pink hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : recentTips.length > 0 ? (
              <div className="space-y-4">
                {recentTips.map((tip) => (
                  <div
                    key={`${tip.from}-${tip.blockNumber}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/20 hover:from-muted/50 hover:to-muted/30 transition-all duration-300 border border-border/30"
                  >
                    <div className="p-2 bg-waifu-pink/10 rounded-lg flex-shrink-0">
                      <Gift className="w-4 h-4 text-waifu-pink" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">
                          {formatAddress(tip.from)}
                        </span>
                        <span className="text-xs text-muted-foreground">tipped</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg">
                          {tip.isETH
                            ? `${Number(formatEther(tip.amount)).toFixed(3)} ETH`
                            : `${Number(formatUnits(tip.amount, 18)).toLocaleString()} WAIFU`
                          }
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tip.isETH
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            : 'bg-waifu-purple/10 text-waifu-purple border border-waifu-purple/20'
                        }`}>
                          {tip.isETH ? 'ETH' : 'WAIFU'}
                        </span>
                      </div>

                      {/* Message section - always present to maintain consistent spacing */}
                      <div className="flex items-start justify-between min-h-[20px]">
                        <div className="flex-1 mr-2">
                          {tip.message && tip.message !== 'Thanks for the great stream!' && (
                            <p className="text-sm text-muted-foreground italic truncate">
                              &ldquo;{tip.message}&rdquo;
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(tip.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tips yet. Be the first to tip!</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
