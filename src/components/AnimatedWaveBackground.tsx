'use client';

interface AnimatedWaveBackgroundProps {
  className?: string;
}

export function AnimatedWaveBackground({ className = '' }: AnimatedWaveBackgroundProps) {



  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    >
      {/* Enhanced background layers with more visible animation */}
      {/* Primary gradient layer - static base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 120% 80% at 30% 40%,
            rgba(255, 105, 180, 0.15) 0%,
            transparent 50%
          ), radial-gradient(
            ellipse 100% 60% at 70% 60%,
            rgba(147, 112, 219, 0.12) 0%,
            transparent 50%
          )`,
          opacity: 0.9,
        }}
      />

      {/* Main animated layer - more visible */}
      <div
        className="absolute animate-wave-rotate-visible"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 105, 180, 0.20) 25%,
            transparent 50%,
            rgba(147, 112, 219, 0.18) 75%,
            transparent 100%
          )`,
          borderRadius: '50%',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          filter: 'blur(20px)',
          opacity: 0.8,
        }}
      />

      {/* Secondary animated layer - counter rotation */}
      <div
        className="absolute animate-wave-rotate-counter"
        style={{
          background: `conic-gradient(
            from 45deg,
            transparent 0%,
            rgba(147, 112, 219, 0.16) 30%,
            transparent 60%,
            rgba(255, 105, 180, 0.14) 90%,
            transparent 100%
          )`,
          borderRadius: '50%',
          width: '180%',
          height: '180%',
          top: '-40%',
          left: '-40%',
          filter: 'blur(18px)',
          opacity: 0.7,
        }}
      />

      {/* Pulsing accent layer */}
      <div
        className="absolute animate-wave-pulse-visible"
        style={{
          background: `radial-gradient(
            circle at center,
            oklch(0.78 0.28 330 / 0.12) 0%,
            oklch(0.68 0.28 280 / 0.08) 30%,
            transparent 60%
          )`,
          borderRadius: '50%',
          width: '160%',
          height: '160%',
          top: '-30%',
          left: '-30%',
          filter: 'blur(15px)',
          opacity: 0.6,
        }}
      />
    </div>
  );
}
