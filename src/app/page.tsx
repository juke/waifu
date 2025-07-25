'use client';

import { useState, useCallback } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { HeroSection } from '@/components/HeroSection';
import { TokenSale } from '@/components/TokenSale';
import { CommunityActivity } from '@/components/CommunityActivity';
import { FAQ } from '@/components/FAQ';


export default function Home() {
  const [heroRefreshKey, setHeroRefreshKey] = useState(0);
  const [communityRefreshKey, setCommunityRefreshKey] = useState(0);

  const handleWatchStream = () => {
    // Open Abstract stream in new tab
    window.open('https://abstract.stream/waifu', '_blank');
  };

  const handleTokenSale = () => {
    // Scroll to token sale section
    const tokenSaleSection = document.getElementById('token-sale');
    if (tokenSaleSection) {
      tokenSaleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePurchaseSuccess = useCallback(() => {
    // Trigger refresh of HeroSection stats and CommunityActivity components
    setHeroRefreshKey(prev => prev + 1);
    setCommunityRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Simplified base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Header with Wallet Connection */}
      <header className="relative z-20 sticky top-0">
        <WalletConnection />
      </header>

      {/* Main Content with Enhanced Layout */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative">
          <HeroSection
            key={`hero-${heroRefreshKey}`}
            onWatchStream={handleWatchStream}
            onTokenSale={handleTokenSale}
          />
        </section>

        {/* Enhanced Section Divider */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-waifu-pink/25 to-transparent"></div>
        </div>

        {/* Token Sale Section */}
        <section className="relative" id="token-sale">
          <TokenSale onPurchaseSuccess={handlePurchaseSuccess} />
        </section>

        {/* Enhanced Section Divider */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-waifu-purple/25 to-transparent"></div>
        </div>

        {/* Community Activity Section */}
        <section className="relative">
          <CommunityActivity key={`community-${communityRefreshKey}`} />
        </section>

        {/* Enhanced Section Divider */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-waifu-pink/25 to-transparent"></div>
        </div>

        {/* FAQ Section */}
        <FAQ />

      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t-2 border-waifu-pink/20 bg-gradient-to-r from-card/90 to-card/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-waifu-pink/5 to-waifu-purple/5" />
        <div className="relative py-12">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6">
              <div className="flex-center gap-2">
                <div className="w-8 h-8 bg-waifu-gradient rounded-full flex-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-waifu-gradient">
                  Waifu Stream
                </h3>
              </div>

              <p className="text-muted-foreground max-w-md mx-auto">
                Join the future of VTuber entertainment on the blockchain.
                Built with love for the community.
              </p>

              <div className="flex-center gap-6 text-sm text-muted-foreground">
                <span>© 2025 Waifu Stream</span>
                <span>•</span>
                <span>Built with ❤️ for VTubers</span>
                <span>•</span>
                <span>Powered by Abstract</span>
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground/70">
                  This is a testnet application. Use only testnet ETH.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
