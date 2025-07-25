'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

interface CinematicSlideshowProps {
  images: string[];
  className?: string;
  children?: React.ReactNode;
}

export function CinematicSlideshow({ images, className = '', children }: CinematicSlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || images.length < 2) return;

    const container = containerRef.current;
    const imageElements = container.querySelectorAll('.slideshow-image');
    
    if (imageElements.length < 2) return;

    // Create GSAP timeline with seamless looping
    const tl = gsap.timeline({
      repeat: -1,
      ease: "none" // Ensure consistent timing
    });
    timelineRef.current = tl;

    // Set initial states - start with first image visible and positioned
    gsap.set(imageElements, {
      opacity: 0,
      scale: 1.10,
      x: 0,
      y: 55, // Focus on head area (push image down)
      rotation: 0
    });

    gsap.set(imageElements[0], {
      opacity: 1,
      x: -40, // Start first image from left (index 0 = even = startX: -40)
      y: 55,  // Match the animation Y position
      scale: 1.10, // Match the animation scale
      zIndex: 2
    });

    gsap.set(imageElements[1], {
      opacity: 0, // Second image starts hidden
      x: 40, // Prepare second image to start from right (index 1 = odd = startX: 40)
      y: 55, // Match the animation Y position
      scale: 1.10, // Match the animation scale
      zIndex: 1
    });

    // Dynamic cinematic animation sequence for each image
    images.forEach((_, index) => {
      const currentImage = imageElements[index];
      const nextImage = imageElements[(index + 1) % images.length];

      // Alternating horizontal movement patterns with dramatic zoom
      const isEvenIndex = index % 2 === 0;
      const movement = {
        startX: isEvenIndex ? -40 : 40,  // Start from left or right
        endX: isEvenIndex ? 40 : -40,    // Pan to opposite side
        startScale: 1.10,                // Initial dramatic zoom
        endScale: 1.20,                  // Final dramatic zoom
        y: 55                            // Focus on head area (push image down)
      };

      const startTime = index * 12; // Increased duration for smoother transitions

      // Dramatic cinematic movement with horizontal pan (10 seconds display)
      tl.to(currentImage, {
        x: movement.endX,
        y: movement.y,
        scale: movement.endScale,
        duration: 10,
        ease: "power1.inOut"
      }, startTime)

      // Enhanced fade transition - fade out current image (1.5 seconds)
      .to(currentImage, {
        opacity: 0,
        scale: movement.endScale + 0.05,
        duration: 1.5,
        ease: "power2.inOut"
      }, startTime + 10)

      // Prepare next image with opposite starting position
      .set(nextImage, {
        zIndex: 2,
        opacity: 0,
        scale: 1.10,
        x: isEvenIndex ? 40 : -40, // Next image starts from opposite side
        y: 55
      }, startTime + 10.5) // Start after current image begins fading

      // Fade in next image smoothly (1.5 seconds)
      .to(nextImage, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
      }, startTime + 10.5)

      // Reset current image for next cycle
      .set(currentImage, {
        zIndex: 1,
        scale: 1.10,
        x: movement.startX,
        y: 55,
        opacity: 0
      }, startTime + 12);
    });

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%'
      }}
    >
      {images.map((imageSrc, index) => (
        <div
          key={imageSrc}
          className="slideshow-image absolute inset-0 w-full h-full"
          style={{
            opacity: index === 0 ? 1 : 0,
            zIndex: index === 0 ? 2 : 1,
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        >
          <Image
            src={imageSrc}
            alt={`Waifu VTuber ${index + 1}`}
            fill
            className="object-cover object-center transition-gpu"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 40vw"
            style={{
              objectPosition: 'center top' // Focus on head area (push down to show head)
            }}
          />
        </div>
      ))}

      {/* Enhanced cinematic vignette overlay for dramatic zoom */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.15) 100%)',
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
