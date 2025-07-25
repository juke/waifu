'use client';

import { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { HeroSection } from '@/components/HeroSection';
import { TokenSale } from '@/components/TokenSale';
import { RecentTips } from '@/components/RecentTips';
import { Leaderboard } from '@/components/Leaderboard';

import { FAQ } from '@/components/FAQ';


export default function Home() {

  const handleWatchStream = () => {
    // Open Abstract stream in new tab
    window.open('https://abstract.stream/waifu', '_blank');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-waifu-pink/5 to-waifu-purple/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-waifu-neon/3 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-waifu-pink/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-waifu-purple/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header with Wallet Connection */}
      <header className="relative z-20 sticky top-0">
        <WalletConnection />
      </header>

      {/* Main Content with Enhanced Layout */}
      <main className="relative z-10 space-y-section">
        {/* Hero Section */}
        <section className="relative">
          <HeroSection onWatchStream={handleWatchStream} />
        </section>

        {/* Token Sale Section */}
        <section className="relative">
          <TokenSale />
        </section>

        {/* Community Activity Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 text-foreground">
                Community Activity
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what the community is up to and join the leaderboard!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="space-y-6">
                <RecentTips />
              </div>
              <div className="space-y-6">
                <Leaderboard />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative">
          <FAQ />
        </section>

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
                <span>© 2024 Waifu Stream</span>
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
