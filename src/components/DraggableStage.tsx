"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DraggableStageProps {
  currentPhoto: PhotoItem;
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function DraggableStage({
  currentPhoto,
  currentIndex,
  total,
  onNext,
  onPrev,
}: DraggableStageProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-3, 3]);
  const [isDragging, setIsDragging] = useState(false);

  const isPortrait = (currentPhoto.height || 0) > (currentPhoto.width || 0) * 1.15;

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false);
    if (info.offset.x < -70) {
      triggerHaptic("snap");
      playTactileClick();
      onNext();
    } else if (info.offset.x > 70) {
      triggerHaptic("snap");
      playTactileClick();
      onPrev();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    triggerHaptic("light");
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      {/* Discreet Left/Right Desktop Click Arrows */}
      <button
        onClick={() => {
          triggerHaptic("snap");
          playTactileClick();
          onPrev();
        }}
        type="button"
        className="hidden md:flex absolute left-6 lg:left-12 z-20 w-10 h-10 rounded-full border border-[#E5E5DF] bg-[#FBFBF9]/80 backdrop-blur-sm text-[#121212] hover:bg-[#121212] hover:text-white items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
        aria-label="Previous photograph"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          triggerHaptic("snap");
          playTactileClick();
          onNext();
        }}
        type="button"
        className="hidden md:flex absolute right-6 lg:right-12 z-20 w-10 h-10 rounded-full border border-[#E5E5DF] bg-[#FBFBF9]/80 backdrop-blur-sm text-[#121212] hover:bg-[#121212] hover:text-white items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
        aria-label="Next photograph"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Main Photographic Canvas Frame with Adaptive Aspect Ratio */}
      <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ x, rotate }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 28,
            }}
            className={`relative max-h-[74vh] md:max-h-[78vh] bg-white dark:bg-[#161616] p-3 md:p-4 pb-7 md:pb-9 shadow-2xl rounded-xs border border-[#E5E5DF] dark:border-[#282827] cursor-grab active:cursor-grabbing transition-shadow ${
              isDragging ? "shadow-3xl ring-1 ring-[#FF9500]/30 dark:ring-[#FFA000]/30" : ""
            }`}
          >
            {/* The Actual Photograph with Dynamic Aspect Ratio */}
            <div
              style={{
                aspectRatio: `${currentPhoto.width || (isPortrait ? 2 : 3)} / ${currentPhoto.height || (isPortrait ? 3 : 2)}`,
              }}
              className={`relative overflow-hidden bg-[#121212] rounded-3xs mx-auto transition-all duration-300 ${
                isPortrait
                  ? "h-[54vh] md:h-[64vh] max-w-[85vw]"
                  : "h-[46vh] md:h-[56vh] w-auto max-w-[85vw] md:max-w-[72vw]"
              }`}
            >
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 1200px"
                className="object-cover select-none pointer-events-none"
              />
            </div>

            {/* Modern Clean Photo Matting & Info */}
            <div className="mt-3.5 px-1 flex items-baseline justify-between font-mono text-[10px] md:text-[11px] text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[#121212] font-bold text-xs md:text-sm tracking-tight">
                  {currentPhoto.title}
                </span>
                <span className="text-[#E5E5DF]">/</span>
                <span className="text-[10px] text-[#737373] hidden sm:inline">
                  {currentPhoto.series}
                </span>
                {currentPhoto.category && (
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded-sm bg-[#F4F4F0] text-[9px] text-[#555]">
                    {currentPhoto.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase">
                <span>{currentPhoto.specs.location || "BANGKOK"}</span>
                <span className="text-[#E5E5DF]">·</span>
                <span className="text-[#121212] font-bold">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Tactile Drag Hint badge (Subtle) */}
            <div className="absolute -top-3 right-4 bg-[#FBFBF9] border border-[#E5E5DF] px-2 py-0.5 rounded-full text-[9px] font-mono text-[#737373] shadow-2xs pointer-events-none">
              DRAG & FLICK ⇄
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
