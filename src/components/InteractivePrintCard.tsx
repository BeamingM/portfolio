"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";

interface InteractivePrintCardProps {
  photo: PhotoItem;
  priority?: boolean;
  onClick?: () => void;
}

export default function InteractivePrintCard({
  photo,
  priority = false,
  onClick,
}: InteractivePrintCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0, angle: 135 });

  // Handle Mouse Move for 3D Perspective Tilt & Optical Glossy Sheen
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0 to rect.width
    const y = e.clientY - rect.top;  // 0 to rect.height

    const xRatio = x / rect.width - 0.5;  // -0.5 to 0.5
    const yRatio = y / rect.height - 0.5; // -0.5 to 0.5

    // Smooth subtle tactile tilt angles (-3deg to +3deg)
    const rotateX = -yRatio * 6;
    const rotateY = xRatio * 6;

    // Glare position in percentage (0% to 100%)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    // Angle of optical specular reflection sweeping across the glossy paper
    const angle = Math.atan2(yRatio, xRatio) * (180 / Math.PI) + 135;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1, angle });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Shared RAF-throttled gyroscope listener for subtle mobile print tilt
  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return;
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    let rafId: number | null = null;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const g = e.gamma;
      const b = e.beta;
      if (g !== null && b !== null) {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const clampedGamma = Math.max(Math.min(g, 15), -15);
          const clampedBeta = Math.max(Math.min(b - 40, 15), -15);
          setTilt({
            x: -clampedBeta * 0.12,
            y: clampedGamma * 0.12,
          });
        });
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const handleClick = () => {
    triggerHaptic("light");
    onClick?.();
  };

  const isPortrait = (photo.height || 0) > (photo.width || 0) * 1.15;
  const aspectRatio = `${photo.width || (isPortrait ? 2 : 3)} / ${photo.height || (isPortrait ? 3 : 2)}`;

  // Dynamic museum drop shadow offset opposite to the light reflection vector
  const shadowX = -tilt.y * 1.6;
  const shadowY = Math.max(12, tilt.x * 1.6 + 26);

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full select-none"
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${photo.title || photo.alt} - ${photo.series}`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-figma-photo="true"
        data-photo-series={photo.series}
        data-photo-specs={`${photo.specs.camera || "Sony α7 III"} · ${photo.specs.lens || "35mm"}`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)`
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0px) scale(1)`,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `${shadowX}px ${shadowY}px 32px -8px rgba(0, 0, 0, 0.22), 0 8px 16px -4px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.7)`
            : "0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
          transition: isHovered
            ? "transform 0.15s ease-out, box-shadow 0.25s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out",
        }}
        className="w-full relative bg-[#FFFFFF] p-3 sm:p-4 md:p-5 pb-4 md:pb-5 border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-sm cursor-pointer group will-change-transform overflow-hidden"
      >
        {/* Full-Card Glossy Photo Paper Specular Sheen (Soft, authentic ambient reflection) */}
        <div
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 480px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.12) 32%, transparent 68%)`,
            mixBlendMode: "soft-light",
            transition: "opacity 0.25s ease-out",
          }}
          className="absolute inset-0 pointer-events-none z-20 rounded-sm"
          aria-hidden="true"
        />

        {/* Specular Clear-Coat Glaze Highlight (Clean white angle sweep, no HDR blowout) */}
        <div
          style={{
            opacity: isHovered ? 0.18 : 0,
            background: `linear-gradient(${glare.angle}deg, transparent 25%, rgba(255, 255, 255, 0.18) 47%, rgba(255, 255, 255, 0.32) 50%, rgba(255, 255, 255, 0.12) 53%, transparent 75%)`,
            mixBlendMode: "screen",
            transition: "opacity 0.25s ease-out",
          }}
          className="absolute inset-0 pointer-events-none z-20 rounded-sm"
          aria-hidden="true"
        />

        {/* Image Container with Photographic Paper Inset Bevel */}
        <div
          style={{ aspectRatio }}
          className="relative w-full bg-[#121212] overflow-hidden rounded-xs ring-1 ring-black/5 dark:ring-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 680px"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover select-none group-hover:scale-[1.015] transition-transform duration-700 ease-out"
          />

          {/* Micro-Vignette for Photographic Depth */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light bg-gradient-to-t from-black/50 via-transparent to-black/20"
            aria-hidden="true"
          />
        </div>

        {/* Clean Documentary Metadata Bar with Strict Priority: 1. Project (NO ELLIPSIS) > 2. Location > 3. Camera (NEVER 'SONY ...') */}
        <div className="mt-3 px-0.5 flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs text-[#6B6B67] border-t border-[#F0F0EA] pt-2.5 min-w-0">
          {/* Main Info Block (Priority 1: Project Name [NO TRUNCATION] + Priority 2: Location) */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            {/* Priority 1: Project Name — Styled with font-sans (Anuphan) for clean Thai & Latin typography */}
            <span className="font-sans font-bold tracking-wide text-[#121212] uppercase text-[11px] sm:text-xs shrink-0 whitespace-nowrap group-hover:text-[#FF9500] transition-colors">
              {photo.series}
            </span>

            {/* Separator */}
            <span className="text-[#D1D1CB] shrink-0">·</span>

            {/* Priority 2: Location — High priority, fills remaining width, only truncates if space completely runs out */}
            <span className="text-[#6B6B67] truncate min-w-0 tracking-wide text-[11px] sm:text-xs">
              {photo.specs.location}
            </span>
          </div>

          {/* Priority 3: Camera — Strictly complete Sony α7 III, NEVER truncated into ugly 'SONY ...' */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase shrink-0 whitespace-nowrap">
            <span className="font-semibold text-[#121212] shrink-0 whitespace-nowrap">
              Sony α7 III
            </span>
            {photo.specs.lens && (
              <span className="hidden 2xl:inline text-[#8C8C8C] shrink-0 whitespace-nowrap">
                · {photo.specs.lens}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
