'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface CinematicSlideshowProps {
  images: string[];
  className?: string;
  children?: React.ReactNode;
}

export function CinematicSlideshow({ images, className = '', children }: CinematicSlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Performance optimization: Use Intersection Observer to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || images.length < 2) return;

    const cycleDuration = 10000; // 10 seconds per image for better visibility

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, cycleDuration);

    return () => {
      clearInterval(interval);
    };
  }, [isVisible, images.length]);

  // Enhanced CSS-based animation with better visibility
  const getImageStyle = (index: number) => {
    const isActive = index === currentIndex;
    const isNext = index === (currentIndex + 1) % images.length;
    const isPrev = index === (currentIndex - 1 + images.length) % images.length;

    if (isActive) {
      return {
        opacity: 1,
        transform: 'translateX(0) translateY(55px) scale(1.12)', // Increased scale for more drama
        zIndex: 2,
        transition: 'opacity 1.5s ease-in-out, transform 8s ease-in-out', // Longer, more visible animation
      };
    } else if (isNext) {
      return {
        opacity: 0,
        transform: 'translateX(50px) translateY(55px) scale(1.08)', // Increased movement and scale
        zIndex: 1,
        transition: 'opacity 1.5s ease-in-out, transform 1s ease-out',
      };
    } else if (isPrev) {
      return {
        opacity: 0,
        transform: 'translateX(-50px) translateY(55px) scale(1.08)', // Increased movement and scale
        zIndex: 1,
        transition: 'opacity 1.5s ease-in-out, transform 1s ease-out',
      };
    } else {
      return {
        opacity: 0,
        transform: 'translateX(0) translateY(55px) scale(1.05)',
        zIndex: 0,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {images.map((imageSrc, index) => (
        <div
          key={imageSrc}
          className="absolute inset-0 w-full h-full"
          style={{
            ...getImageStyle(index),
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        >
          <Image
            src={imageSrc}
            alt={`Waifu VTuber ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 40vw"
            style={{
              objectPosition: 'center top' // Focus on head area (push down to show head)
            }}
          />
        </div>
      ))}

      {/* Enhanced cinematic vignette overlay for more drama */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.15) 100%)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Overlay content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
