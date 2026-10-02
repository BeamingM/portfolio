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
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const sectionHeight = viewportH * 1.2;
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
  const total = galleryItems.length;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Sticky Viewport Stage Container */}
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center p-3 md:p-6 lg:p-8 pt-16 pb-16 overflow-hidden z-10 pointer-events-none">
        {/* Outer Viewfinder Calibration Frame (Stitch DNA) */}
        <div className="relative w-full h-full max-w-[1500px] max-h-[88vh] bg-[#F4F4F0] border border-[#E5E5DF] shadow-md flex flex-col overflow-hidden rounded-xs pointer-events-auto">
          {/* Precision Top Telemetry Ruler */}
          <div className="h-6 w-full border-b border-[#E5E5DF] flex items-center justify-between px-3 text-[#737373] font-mono text-[9px] md:text-[10px] bg-[#F9F9F7]/90 select-none z-20">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="text-[#FF3E00]">▶</span> 0.00° LEVEL
              </span>
              <span className="hidden sm:inline tracking-wider">GRID: 12-COL MATRICIAL</span>
              <span className="hidden md:inline text-[#121212] font-semibold">VIEWFINDER: 3:2</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">SENSOR: FULL-FRAME BSI</span>
              <span className="text-[#121212] font-semibold">REC: RAW [DNG 60MP]</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#FF3E00] rounded-full animate-pulse" /> BUFFER: 99+
              </span>
            </div>
          </div>

          {/* Stage Center Photographic Container with Corner Crosshairs */}
          <div className="relative flex-1 w-full h-full bg-[#E5E5DF]/30 flex items-center justify-center overflow-hidden p-2 md:p-6">
            {/* Viewfinder Reticles & Corner Crosshairs */}
            <div className="absolute inset-3 md:inset-6 pointer-events-none z-20 flex flex-col justify-between select-none">
              {/* Top Row Crosshairs */}
              <div className="flex justify-between items-start font-mono text-[#121212]/70 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-base leading-none font-light">+</span>
                  <span className="text-[9px] text-[#737373]">TL_01</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[#737373] text-[9px] tracking-wider">
                  <span>-- | -- 35MM -- | --</span>
                  <span className="text-[#121212] font-semibold">AF-LOCK</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-[#737373]">TR_02</span>
                  <span className="text-base leading-none font-light">+</span>
                </div>
              </div>

              {/* Center Optical Reticle Box */}
              <div className="self-center flex flex-col items-center justify-center pointer-events-none opacity-80">
                <div className="w-20 h-20 md:w-28 md:h-28 border border-[#121212]/20 relative flex items-center justify-center">
                  <div className="w-2 h-2 border border-[#121212]/50" />
                  <div className="w-0.5 h-2.5 bg-[#FF3E00] absolute top-0" />
                  <div className="w-0.5 h-2.5 bg-[#FF3E00] absolute bottom-0" />
                  <div className="h-0.5 w-2.5 bg-[#FF3E00] absolute left-0" />
                  <div className="h-0.5 w-2.5 bg-[#FF3E00] absolute right-0" />
                </div>
                <span className="text-[8px] font-mono text-[#737373] mt-1 tracking-widest bg-[#FBFBF9]/90 px-1 border border-[#E5E5DF]">
                  CENTROID TRACKING
                </span>
              </div>

              {/* Bottom Row Crosshairs */}
              <div className="flex justify-between items-end font-mono text-[#121212]/70 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-base leading-none font-light">+</span>
                  <span className="text-[9px] text-[#737373]">BL_03</span>
                </div>
                <div className="hidden md:flex items-center gap-3 text-[#737373] text-[9px] bg-[#FBFBF9]/80 px-2 py-0.5 border border-[#E5E5DF]">
                  <span>LAT 13.7563° N</span>
                  <span>·</span>
                  <span>LON 100.5018° E</span>
                  <span>·</span>
                  <span>ELEV 2.1M BKK</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-[#737373]">BR_04</span>
                  <span className="text-base leading-none font-light">+</span>
                </div>
              </div>
            </div>

            {/* Photographic Image Frame */}
            <div className="relative w-full h-full max-w-5xl aspect-[3/2] bg-[#121212] overflow-hidden border border-[#E5E5DF] shadow-lg flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.015 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.alt}
                    fill
                    priority={currentIndex === 0}
                    className="object-cover filter contrast-[1.05] select-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                  />

                  {/* Image Title HUD Overlay Pin */}
                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10 bg-[#FBFBF9]/95 backdrop-blur-sm border border-[#E5E5DF] p-2.5 md:p-3 text-left shadow-sm">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                      <span className="font-mono text-[9px] text-[#737373] uppercase tracking-wider">
                        SERIES: URBAN CONSTRUCTS
                      </span>
                    </div>
                    <h2 className="font-sans text-xs md:text-sm font-medium text-[#121212] tracking-tight">
                      {currentPhoto.title || `FRAME ${String(currentIndex + 1).padStart(2, "0")}`}
                    </h2>
                    <p className="font-mono text-[9px] text-[#737373] mt-0.5">
                      {currentPhoto.specs.location || "Bangkok, Thailand"} · 2026
                    </p>
                  </div>

                  {/* Exposure Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 bg-[#FBFBF9]/90 backdrop-blur-sm border border-[#E5E5DF] px-2 py-1 text-[#737373] font-mono text-[9px] flex items-center gap-1.5 shadow-xs">
                    <span className="text-[#FF3E00]">◎</span>
                    <span>
                      EXPOSURE {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Precision Bottom Telemetry Sub-Ruler */}
          <div className="h-6 w-full border-t border-[#E5E5DF] flex items-center justify-between px-3 text-[#737373] font-mono text-[9px] bg-[#F9F9F7]/90 select-none z-20">
            <div className="flex items-center gap-3">
              <span className="text-[#121212] font-semibold">[HISTOGRAM: BALANCED]</span>
              <div className="hidden sm:flex items-end gap-0.5 h-3">
                <span className="w-1 h-1.5 bg-[#121212]" />
                <span className="w-1 h-2 bg-[#121212]" />
                <span className="w-1 h-3 bg-[#121212]" />
                <span className="w-1 h-1 bg-[#121212]" />
                <span className="w-1 h-2.5 bg-[#121212]" />
                <span className="w-1 h-2 bg-[#121212]" />
                <span className="w-1 h-1 bg-[#121212]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>ZEBRA: 100% OFF</span>
              <span className="text-[#FF3E00] font-semibold">LUT: TE-NEUTRAL-MONO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Spacers to drive scroll position */}
      <div className="w-full">
        {galleryItems.map((item) => (
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
