"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Shuffle } from "lucide-react";

interface PhotoDeckStackProps {
  items: PhotoItem[];
  onSelectPhoto?: (item: PhotoItem) => void;
}

interface StackCardProps {
  photo: PhotoItem;
  offset: number;
  exitDirection: "left" | "right";
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelectPhoto?: (item: PhotoItem) => void;
}

const STATIC_ROTATIONS = [0, -3.2, 2.8, -1.6];

function StackCard({
  photo,
  offset,
  exitDirection,
  onSwipeLeft,
  onSwipeRight,
  onSelectPhoto,
}: StackCardProps) {
  const isTop = offset === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0, angle: 135 });
  const [isExiting, setIsExiting] = useState(false);

  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-320, 320], [-22, 22]);
  const dragOpacity = useTransform(dragX, [-500, -250, 0, 250, 500], [0, 0.88, 1, 0.88, 0]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTop || !cardRef.current || isExiting) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xRatio = x / rect.width - 0.5;
      const yRatio = y / rect.height - 0.5;

      // Smooth tilt angles (-9deg to +9deg)
      const rotateX = -yRatio * 18;
      const rotateY = xRatio * 18;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      // Angle of optical specular reflection sweeping across glossy surface
      const angle = Math.atan2(yRatio, xRatio) * (180 / Math.PI) + 135;

      setTilt({ x: rotateX, y: rotateY });
      setGlare({ x: glareX, y: glareY, opacity: 1, angle });
    },
    [isTop, isExiting]
  );

  const handleMouseEnter = () => isTop && !isExiting && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const isPortrait = (photo.height || 0) > (photo.width || 0) * 1.15;
  const shadowX = -tilt.y * 1.5;
  const shadowY = Math.max(16, tilt.x * 1.5 + 32);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragDistanceRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop || isExiting) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartRef.current && isTop && !isExiting) {
      const dist = Math.hypot(
        e.clientX - pointerStartRef.current.x,
        e.clientY - pointerStartRef.current.y
      );
      dragDistanceRef.current = dist;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isTop || isExiting || dragDistanceRef.current >= 10) {
      e.stopPropagation();
      return;
    }
    triggerHaptic("light");
    onSelectPhoto?.(photo);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (!isTop || isExiting) return;
    const threshold = 55;
    const velocityThreshold = 220;
    const isFlickLeft = info.offset.x < -threshold || info.velocity.x < -velocityThreshold;
    const isFlickRight = info.offset.x > threshold || info.velocity.x > velocityThreshold;

    if (isFlickLeft) {
      setIsExiting(true);
      triggerHaptic("snap");
      animate(dragX, -750, {
        type: "spring",
        stiffness: 280,
        damping: 24,
        velocity: info.velocity.x,
        onComplete: () => {
          onSwipeLeft();
        },
      });
    } else if (isFlickRight) {
      setIsExiting(true);
      triggerHaptic("snap");
      animate(dragX, 750, {
        type: "spring",
        stiffness: 280,
        damping: 24,
        velocity: info.velocity.x,
        onComplete: () => {
          onSwipeRight();
        },
      });
    } else {
      // Rebound gently back to center
      animate(dragX, 0, {
        type: "spring",
        stiffness: 420,
        damping: 28,
      });
    }
  };

  const rot = STATIC_ROTATIONS[offset] || 0;
  const scale = 1 - offset * 0.055;
  const translateY = offset * 14;

  if (!isTop) {
    return (
      <motion.div
        key={photo.id}
        initial={{ scale: scale * 0.98, y: translateY + 6, rotate: rot, opacity: 0 }}
        animate={{
          scale,
          y: translateY,
          rotate: rot,
          opacity: 1 - offset * 0.22,
          filter: `blur(${offset * 0.8}px)`,
        }}
        exit={{
          x: exitDirection === "left" ? -750 : 750,
          rotate: exitDirection === "left" ? -28 : 28,
          opacity: 0,
          transition: { type: "spring", stiffness: 280, damping: 24 },
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{
          zIndex: 30 - offset,
        }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <div
          className="w-full h-full bg-[#FFFFFF] p-3 sm:p-5 border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-sm flex flex-col justify-between overflow-hidden"
          style={{
            boxShadow:
              "0 24px 48px -10px rgba(0, 0, 0, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="relative w-full flex-1 bg-[#121212] rounded-xs overflow-hidden opacity-90 ring-1 ring-black/5 dark:ring-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 80vw, 500px"
              className={`select-none ${isPortrait ? "object-contain bg-black/90" : "object-cover"}`}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-[#8C8C8C] border-t border-[#F0F0EA] pt-2">
            <span className="font-bold text-[#121212] uppercase truncate">{photo.series}</span>
            <span className="truncate">{photo.specs.location}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={photo.id}
      style={{
        x: dragX,
        rotate: dragRotate,
        opacity: dragOpacity,
        zIndex: 30,
      }}
      drag={isExiting ? false : "x"}
      dragElastic={0.65}
      dragConstraints={{ left: -1200, right: 1200 }}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      exit={{
        x: exitDirection === "left" ? -750 : 750,
        rotate: exitDirection === "left" ? -28 : 28,
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 280,
          damping: 24,
        },
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform touch-pan-y"
    >
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-figma-photo="true"
        data-photo-series={photo.series}
        data-photo-specs={`${photo.specs.camera} · ${photo.specs.lens}`}
        className="w-full h-full relative bg-[#FFFFFF] p-3 sm:p-5 border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-sm flex flex-col justify-between overflow-hidden will-change-transform"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.015)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `${shadowX}px ${shadowY}px 56px -12px rgba(0, 0, 0, 0.45), 0 16px 30px -6px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.9)`
            : "0 28px 56px -12px rgba(0, 0, 0, 0.38), 0 12px 24px -6px rgba(0, 0, 0, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.22s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out",
        }}
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

        {/* Photograph Inset on Heavyweight Photo Paper */}
        <div className="relative w-full flex-1 bg-[#121212] rounded-xs overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 560px"
            className={`select-none ${isPortrait ? "object-contain bg-black/90" : "object-cover"}`}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light bg-gradient-to-t from-black/50 via-transparent to-black/20"
            aria-hidden="true"
          />
        </div>

        {/* Print Info Stamp on Glossy Border */}
        <div className="mt-3 flex items-center justify-between gap-2.5 font-mono text-[10px] md:text-[11px] text-[#6B6B67] border-t border-[#F0F0EA] pt-2.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <span className="font-bold text-[#121212] uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0 whitespace-nowrap">
              {photo.series}
            </span>
            <span className="text-[#D1D1CB] shrink-0">·</span>
            <span className="text-[#6B6B67] truncate min-w-0 tracking-wide">
              {photo.specs.location}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#8C8C8C] tracking-wider uppercase shrink min-w-0 max-w-[200px]">
            <span className="font-semibold text-[#121212] truncate shrink">
              Sony α7 III
            </span>
            {photo.specs.lens && (
              <>
                <span className="text-[#D1D1CB] shrink-0">·</span>
                <span className="text-[#8C8C8C] truncate shrink">
                  {photo.specs.lens}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoDeckStack({ items, onSelectPhoto }: PhotoDeckStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right">("left");

  const total = items.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    triggerHaptic("snap");
    setExitDirection("left");
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    triggerHaptic("snap");
    setExitDirection("right");
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleShuffle = () => {
    if (total <= 1) return;
    triggerHaptic("snap");
    setExitDirection("left");
    const nextIdx = Math.floor(Math.random() * total);
    setCurrentIndex(nextIdx);
  };

  // Keyboard navigation for deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Adjust index during render if items changed and currentIndex is out of bounds
  const [prevItemsLength, setPrevItemsLength] = useState(items.length);
  if (items.length !== prevItemsLength) {
    setPrevItemsLength(items.length);
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }

  if (total === 0) return null;

  const safeIndex = total > 0 ? Math.max(0, Math.min(currentIndex, total - 1)) : 0;
  const currentPhoto = items[safeIndex];
  if (!currentPhoto) return null;

  // Build list of unique visible cards in stack (up to 4 cards)
  const visibleCards: { photo: PhotoItem; offset: number }[] = [];
  const seenIds = new Set<string>();
  const maxVisible = Math.min(total, 4);

  for (let i = 0; i < maxVisible; i++) {
    const photo = items[(safeIndex + i) % total];
    if (photo && !seenIds.has(photo.id)) {
      seenIds.add(photo.id);
      visibleCards.push({ photo, offset: i });
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 select-none flex flex-col items-center">
      {/* Top Deck Prompt */}
      <div className="text-center mb-6 font-mono text-[11px] text-[#737373] dark:text-[#9E9E9C] tracking-widest uppercase flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] dark:bg-[#FFA000]" />
        <span>Physical Glossy Print Deck · Swipe or Drag Cards to Cycle</span>
      </div>

      {/* The Physical Card Stack Stage */}
      <div className="relative w-full max-w-[560px] aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center mb-8">
        <AnimatePresence mode="popLayout">
          {visibleCards
            .slice()
            .reverse()
            .map(({ photo, offset }) => (
              <StackCard
                key={photo.id}
                photo={photo}
                offset={offset}
                exitDirection={exitDirection}
                onSwipeLeft={handleNext}
                onSwipeRight={handlePrev}
                onSelectPhoto={onSelectPhoto}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Tactile Deck Controls */}
      <div className="flex items-center justify-between w-full max-w-md gap-3 bg-[#FFFFFF] dark:bg-[#161616] p-2 sm:p-2.5 rounded-full border border-[#E5E5DF] dark:border-[#282827] shadow-lg font-mono text-xs">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          type="button"
          className="p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-[#F4F4F0] dark:bg-[#202020] text-[#121212] dark:text-[#F5F5F3] hover:bg-[#121212] hover:text-white dark:hover:bg-[#F5F5F3] dark:hover:text-[#121212] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
          aria-label="Previous print in deck"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        {/* Counter & Series Tag */}
        <div className="flex flex-col items-center text-center px-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#121212] dark:text-[#F5F5F3]">
            <span className="text-[#FF9500] dark:text-[#FFA000]">
              {String(safeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[#9E9E9C]">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </div>
          <span className="text-[10px] text-[#737373] dark:text-[#9E9E9C] truncate max-w-[170px] uppercase tracking-wider">
            {currentPhoto.series}
          </span>
        </div>

        {/* Action Controls: Shuffle + Enlarge + Next */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleShuffle}
            type="button"
            title="Shuffle deck"
            className="p-2 rounded-full hover:bg-[#F4F4F0] dark:hover:bg-[#202020] text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] transition-colors cursor-pointer"
            aria-label="Shuffle prints"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectPhoto?.(currentPhoto)}
            type="button"
            title="Inspect high-res print"
            className="p-2 rounded-full hover:bg-[#F4F4F0] dark:hover:bg-[#202020] text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] transition-colors cursor-pointer"
            aria-label="Enlarge current photo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            type="button"
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] hover:bg-[#FF9500] dark:hover:bg-[#FFA000] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            aria-label="Next print in deck"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
