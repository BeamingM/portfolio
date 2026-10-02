"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { galleryItems, PhotoItem } from "@/config/gallery";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollytellingStageProps {
  onIndexChange: (index: number) => void;
  currentIndex: number;
}

export default function ScrollytellingStage({
  onIndexChange,
  currentIndex,
}: ScrollytellingStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const sectionHeight = viewportH * 1.2; // Each frame gets 120vh scroll distance
      const index = Math.min(
        galleryItems.length - 1,
        Math.max(0, Math.floor((scrollY + viewportH * 0.3) / sectionHeight))
      );
      onIndexChange(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, [onIndexChange]);

  const currentPhoto: PhotoItem = galleryItems[currentIndex] || galleryItems[0];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Sticky Viewport Stage Container */}
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden p-6 md:p-14 lg:p-20 z-10 pointer-events-none">
        {/* Gallery Image Canvas Frame */}
        <div className="relative w-full h-full max-w-6xl max-h-[82vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full rounded-xs overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200/50 flex items-center justify-center pointer-events-auto"
            >
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                priority={currentIndex === 0}
                className="object-cover md:object-contain select-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
              />

              {/* Viewfinder crosshairs / Technical watermark */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-white/50 tracking-widest uppercase pointer-events-none">
                [{currentPhoto.id.toUpperCase()}]
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-white/50 tracking-widest pointer-events-none">
                {currentPhoto.specs.year || "2026"} // RAW
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll Spacers to drive scroll position */}
      <div className="w-full">
        {galleryItems.map((item, idx) => (
          <div
            key={item.id}
            className="w-full h-[120vh] flex items-center justify-center"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
