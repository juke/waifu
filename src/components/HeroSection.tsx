'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, ShoppingCart, TrendingUp, Users, Coins, Heart } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { CinematicSlideshow } from './CinematicSlideshow';
import { AnimatedWaveBackground } from './AnimatedWaveBackground';

interface HeroSectionProps {
  onWatchStream?: () => void;
  onTokenSale?: () => void;
}

interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

function StatCard({ value, label, color, isLoading, icon }: StatCardProps) {
  // Define color classes to ensure they're included in Tailwind build
  const colorClasses = {
    'waifu-pink': {
      text: 'text-waifu-pink',
      border: 'hover:border-waifu-pink/40',
      shadow: 'hover:shadow-waifu-pink/10',
      bg: 'from-waifu-pink/5',
      loadingBg: 'bg-waifu-pink/20'
    },
    'waifu-purple': {
      text: 'text-waifu-purple',
      border: 'hover:border-waifu-purple/40',
      shadow: 'hover:shadow-waifu-purple/10',
      bg: 'from-waifu-purple/5',
      loadingBg: 'bg-waifu-purple/20'
    },
    'blue-500': {
      text: 'text-blue-500',
      border: 'hover:border-blue-500/40',
      shadow: 'hover:shadow-blue-500/10',
      bg: 'from-blue-500/5',
      loadingBg: 'bg-blue-500/20'
    },
    'green-500': {
      text: 'text-green-500',
      border: 'hover:border-green-500/40',
      shadow: 'hover:shadow-green-500/10',
      bg: 'from-green-500/5',
      loadingBg: 'bg-green-500/20'
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className="group relative">
      {/* Beautiful glass morphism stats card */}
      <div className={`text-center p-3 sm:p-4 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl ${colors.border} transition-all duration-300 hover:from-white/30 hover:via-white/20 hover:to-white/10 hover:border-white/30 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5`}>
        {/* Beautiful colored gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} via-transparent to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-300 rounded-xl`} />

        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />

        <div className="relative z-10">
          {/* Icon with subtle glow effect */}
          {icon && (
            <div className={`flex justify-center mb-2 ${colors.text} transition-all duration-300 group-hover:scale-110 drop-shadow-sm`}>
              {icon}
            </div>
          )}

          {/* Value with enhanced styling */}
          <div className={`text-xl sm:text-2xl font-bold ${colors.text} transition-all duration-300 group-hover:scale-105 ${isLoading ? 'animate-pulse' : ''} drop-shadow-sm`}>
            {isLoading ? (
              <div className={`h-7 sm:h-8 w-16 sm:w-20 mx-auto ${colors.loadingBg} rounded-lg animate-pulse`} />
            ) : (
              value
            )}
          </div>

          {/* Label with better contrast */}
          <div className="text-xs text-gray-700 font-semibold mt-1.5 transition-colors duration-300 group-hover:text-gray-800 opacity-90">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ onWatchStream, onTokenSale }: HeroSectionProps) {

  // Get core analytics for project stats
  const { data: saleStats, isLoading: saleStatsLoading } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'getSaleStats',
  });

  const { data: tippingStats, isLoading: tippingStatsLoading } = useReadContract({
    ...CONTRACTS.TIPPING,
    functionName: 'getTippingStats',
  });

  // Parse stats for display
  const totalTokensSold = saleStats ? Number(formatUnits(saleStats[0] as bigint, 18)) : 0;
  const totalETHRaised = saleStats ? Number(formatEther(saleStats[1] as bigint)) : 0;
  const totalBuyers = saleStats ? Number(saleStats[2]) : 0;
  const totalETHTipped = tippingStats ? Number(formatEther(tippingStats[0] as bigint)) : 0;

  const isStatsLoading = saleStatsLoading || tippingStatsLoading;

  const handleWatchStream = () => {
    window.open('https://abstract.stream/waifu', '_blank');
    onWatchStream?.();
  };

  const handleTokenSale = () => {
    // Scroll to token sale section
    const tokenSaleSection = document.getElementById('token-sale');
    if (tokenSaleSection) {
      tokenSaleSection.scrollIntoView({ behavior: 'smooth' });
    }
    onTokenSale?.();
  };





  return (
    <section className="relative overflow-hidden section-bg-hero">
      {/* Animated wave background */}
      <AnimatedWaveBackground />

      {/* Simplified background for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-waifu-pink/8 to-background/95" />

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-18 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">

          {/* Hero Content - Left Side */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8 order-2 lg:order-1">

            {/* Live Badge */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-sm font-medium text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live on Abstract Testnet
              </div>
            </div>

            {/* Main Title - Enhanced Typography */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-[1.1]">
                <span className="block text-waifu-gradient drop-shadow-sm">
                  Meet Your
                </span>
                <span className="block text-foreground">
                  Web3 AI Waifu
                </span>
              </h1>

              <div className="space-y-3">
                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Join the 24/7 AI stream experience on Abstract blockchain.
                </p>
                <p className="text-lg sm:text-xl text-waifu-pink font-semibold max-w-2xl mx-auto lg:mx-0">
                  Buy tokens, tip your waifu and build the community!
                </p>
              </div>
            </div>

            {/* Project Statistics - Enhanced with Icons and Loading States */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 pb-1">
              <StatCard
                value={totalETHRaised.toFixed(3)}
                label="ETH Raised"
                color="waifu-pink"
                isLoading={isStatsLoading}
                icon={<TrendingUp className="w-5 h-5" />}
              />

              <StatCard
                value={totalTokensSold.toLocaleString()}
                label="Tokens Sold"
                color="waifu-purple"
                isLoading={isStatsLoading}
                icon={<Coins className="w-5 h-5" />}
              />

              <StatCard
                value={totalBuyers}
                label="Members"
                color="blue-500"
                isLoading={isStatsLoading}
                icon={<Users className="w-5 h-5" />}
              />

              <StatCard
                value={totalETHTipped.toFixed(4)}
                label="ETH Tipped"
                color="green-500"
                isLoading={isStatsLoading}
                icon={<Heart className="w-5 h-5" />}
              />
            </div>

            {/* Call to Action Buttons - Optimized for Performance */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA - Watch Stream */}
              <Button
                size="lg"
                onClick={handleWatchStream}
                className="group bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold px-6 py-3 h-auto transition-colors duration-200 shadow-lg border-2 border-white/20 hover:border-white/40"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Live Stream
                <ExternalLink className="w-3 h-3 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>

              {/* Secondary CTA - Token Sale - Removed backdrop-blur for performance */}
              <Button
                size="lg"
                onClick={handleTokenSale}
                className="group bg-white/10 border-2 border-waifu-pink text-waifu-pink hover:bg-waifu-pink hover:text-white font-bold px-6 py-3 h-auto transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy WAIFU Tokens
              </Button>
            </div>

          </div>

          {/* Hero Image - Right Side */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative group">
              {/* Enhanced Card with balanced performance and visual appeal */}
              <Card className="border-2 border-border/40 overflow-hidden bg-gradient-to-br from-card/30 via-card/40 to-card/35 backdrop-blur-sm py-0 hover:border-waifu-pink/40 hover:shadow-lg hover:shadow-waifu-pink/10 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] xl:h-[600px]">
                    <CinematicSlideshow
                      images={['/hero/1.png', '/hero/2.png']}
                      className="w-full h-full"
                    >
                      {/* Simplified overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>

                      {/* Live indicator - Removed backdrop-blur for performance */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-2 bg-red-500/95 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg border border-red-400/50">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          LIVE
                        </div>
                      </div>

                      {/* Viewer count - Removed backdrop-blur for performance */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-white/20">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          # viewers
                        </div>
                      </div>

                      {/* Floating Action Button - Optimized for performance */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                        <Button
                          onClick={handleWatchStream}
                          className="group bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-semibold px-4 py-2 text-sm h-auto transition-colors duration-200 shadow-xl backdrop-blur-sm border border-white/30 hover:border-white/50"
                        >
                          <Play className="w-4 h-4 mr-1.5" />
                          Watch Live
                          <ExternalLink className="w-3 h-3 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </CinematicSlideshow>
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
