'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, ShoppingCart } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { CinematicSlideshow } from './CinematicSlideshow';

interface HeroSectionProps {
  onWatchStream?: () => void;
  onTokenSale?: () => void;
}

export function HeroSection({ onWatchStream, onTokenSale }: HeroSectionProps) {

  // Get core analytics for project stats
  const { data: saleStats } = useReadContract({
    ...CONTRACTS.TOKEN_SALE,
    functionName: 'getSaleStats',
  });

  const { data: tippingStats } = useReadContract({
    ...CONTRACTS.TIPPING,
    functionName: 'getTippingStats',
  });

  // Parse stats for display
  const totalTokensSold = saleStats ? Number(formatUnits(saleStats[0] as bigint, 18)) : 0;
  const totalETHRaised = saleStats ? Number(formatEther(saleStats[1] as bigint)) : 0;
  const totalBuyers = saleStats ? Number(saleStats[2]) : 0;
  const totalETHTipped = tippingStats ? Number(formatEther(tippingStats[0] as bigint)) : 0;

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
      {/* Enhanced background with increased visual impact */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-waifu-pink/8 to-background/92" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-waifu-purple/4 to-transparent" />

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-18 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">

          {/* Hero Content - Left Side */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">

            {/* Live Badge */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-sm font-medium text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live on Abstract Testnet
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-[1.1]">
                <span className="block text-waifu-gradient">
                  Meet Your
                </span>
                <span className="block text-foreground">
                  Web3 AI Waifu
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Join the 24/7 AI stream experience on Abstract blockchain.
                <span className="block mt-2 text-waifu-pink font-semibold">
                  Buy tokens, tip your waifu and build the community!
                </span>
              </p>
            </div>

            {/* Project Statistics - Improved Mobile Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl hover:bg-card/90 hover:border-waifu-pink/30 transition-all duration-300 group">
                <div className="text-xl sm:text-2xl font-bold text-waifu-pink group-hover:scale-105 transition-transform">{totalETHRaised.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground font-medium">ETH Raised</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl hover:bg-card/90 hover:border-waifu-purple/30 transition-all duration-300 group">
                <div className="text-xl sm:text-2xl font-bold text-waifu-purple group-hover:scale-105 transition-transform">{totalTokensSold.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-medium">Tokens Sold</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl hover:bg-card/90 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="text-xl sm:text-2xl font-bold text-blue-500 group-hover:scale-105 transition-transform">{totalBuyers}</div>
                <div className="text-xs text-muted-foreground font-medium">Members</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl hover:bg-card/90 hover:border-green-500/30 transition-all duration-300 group">
                <div className="text-lg sm:text-xl font-bold text-green-500 group-hover:scale-105 transition-transform">{totalETHTipped.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground font-medium">ETH Tipped</div>
              </div>
            </div>

            {/* Call to Action Buttons - Improved Hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA - Watch Stream */}
              <Button
                size="lg"
                onClick={handleWatchStream}
                className="bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold px-8 py-4 h-auto transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl sm:flex-[2]"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Live Stream
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              {/* Secondary CTA - Token Sale */}
              <Button
                size="lg"
                onClick={handleTokenSale}
                variant="outline"
                className="border-2 border-waifu-pink/60 text-waifu-pink hover:bg-waifu-pink/15 hover:border-waifu-pink font-bold px-8 py-4 h-auto transition-all duration-300 hover:scale-105 sm:flex-1"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy WAIFU Tokens
              </Button>
            </div>

          </div>

          {/* Hero Image - Right Side */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative group">
              <Card className="border-2 border-border/40 overflow-hidden bg-gradient-to-br from-card/30 via-card/40 to-card/35 backdrop-blur-sm py-0 hover:border-waifu-pink/30 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] xl:h-[600px]">
                    <CinematicSlideshow
                      images={['/hero/1.png', '/hero/2.png']}
                      className="w-full h-full"
                    >
                      {/* Enhanced overlay with better gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>

                      {/* Live indicator - Better positioning */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg border border-red-400/50">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          LIVE
                        </div>
                      </div>

                      {/* Viewer count - Better styling */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-white/20">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          # viewers
                        </div>
                      </div>

                      {/* Floating Action Button - Properly positioned overlay */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                        <Button
                          size="lg"
                          onClick={handleWatchStream}
                          className="bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold px-6 py-3 h-auto transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm border-2 border-white/30 hover:border-white/50 group-hover:shadow-waifu-pink"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Watch Live Stream
                          <ExternalLink className="w-4 h-4 ml-2" />
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
