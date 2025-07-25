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

            {/* Project Statistics */}
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
                <div className="text-xs text-muted-foreground">Community Members</div>
              </div>

              <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-colors">
                <div className="text-xl font-bold text-green-500">{totalETHTipped.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">ETH Tipped</div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleWatchStream}
                className="bg-waifu-gradient hover:bg-waifu-gradient-reverse text-white font-bold px-8 py-4 h-auto transition-all duration-300 hover:scale-105 flex-1"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Live Stream
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              <Button
                size="lg"
                onClick={handleTokenSale}
                variant="outline"
                className="border-waifu-pink/50 text-waifu-pink hover:bg-waifu-pink/10 hover:border-waifu-pink font-bold px-8 py-4 h-auto transition-all duration-300 hover:scale-105 flex-1"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy WAIFU Tokens
              </Button>
            </div>

          </div>

          {/* Hero Image - Right Side */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative">
              <Card className="border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm py-0">
                <CardContent className="p-0">
                  <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                    <CinematicSlideshow
                      images={['/hero/1.png', '/hero/2.png']}
                      className="w-full h-full"
                    >
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
