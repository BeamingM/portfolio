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
  const rotate = useTransform(x, [-200, 200], [-4, 4]);
  const [isDragging, setIsDragging] = useState(false);

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

      {/* Main Photographic Canvas Frame (Julius Peschard Drag Physics) */}
      <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.22}
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
            className={`relative max-h-[72vh] md:max-h-[76vh] aspect-auto bg-white p-3 md:p-4 pb-8 md:pb-10 shadow-2xl rounded-xs border border-[#E5E5DF] cursor-grab active:cursor-grabbing transition-shadow ${
              isDragging ? "shadow-3xl ring-1 ring-[#D9381E]/30" : ""
            }`}
          >
            {/* The Actual Real Photograph */}
            <div className="relative w-full h-[52vh] md:h-[62vh] max-w-[80vw] md:max-w-[70vw] aspect-3/2 overflow-hidden bg-[#121212] rounded-3xs">
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 1200px"
                className="object-contain md:object-cover select-none pointer-events-none"
              />
            </div>

            {/* Modern Clean Photo Matting & Info */}
            <div className="mt-3.5 md:mt-4 px-1 flex items-baseline justify-between font-mono text-[10px] md:text-[11px] text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[#121212] font-bold text-xs md:text-sm tracking-tight">
                  {currentPhoto.title}
                </span>
                <span className="text-[#E5E5DF]">/</span>
                <span className="text-[10px] text-[#737373] hidden sm:inline">
                  {currentPhoto.series}
                </span>
                {currentPhoto.category && (
                  <span className="hidden md:inline px-1.5 py-0.5 rounded-sm bg-[#F4F4F0] text-[9px] text-[#555]">
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
