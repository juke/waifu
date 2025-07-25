'use client';

import { TippingComponent } from './TippingComponent';
import { RecentTips } from './RecentTips';
import { Leaderboard } from './Leaderboard';

export function CommunityActivity() {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden section-bg-community">
      {/* Redesigned attractive background with better visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/88 via-waifu-purple/6 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-waifu-pink/4 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 text-foreground">
            Community Activity
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support your waifu, see what the community is up to, and join the leaderboard!
          </p>
        </div>

        <div className="space-y-12 max-w-7xl mx-auto">
          {/* Tipping Component - Full Width Above */}
          <div className="max-w-2xl mx-auto">
            <TippingComponent />
          </div>

          {/* Recent Tips and Leaderboard - Two Columns Below */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <RecentTips />
            </div>

            <div className="space-y-6">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
