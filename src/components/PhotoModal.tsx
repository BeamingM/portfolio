"use client";

import { useEffect } from "react";
import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";

interface PhotoModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function PhotoModal({
  photo,
  onClose,
  onNext,
  onPrev,
}: PhotoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, onNext, onPrev]);

  if (!photo) return null;

  const isPortrait = (photo.height || 0) > (photo.width || 0) * 1.15;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#121212]/92 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out select-none"
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("light");
            playTactileClick();
            onClose();
          }}
          type="button"
          className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
          aria-label="Close photo view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous Button */}
        {onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("snap");
              playTactileClick();
              onPrev();
            }}
            type="button"
            className="hidden md:flex absolute left-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("snap");
              playTactileClick();
              onNext();
            }}
            type="button"
            className="hidden md:flex absolute right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Central Expanded Plate */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[86vh] max-w-[90vw] flex flex-col items-center justify-center cursor-default"
        >
          <div
            style={{
              aspectRatio: `${photo.width} / ${photo.height}`,
            }}
            className={`relative overflow-hidden bg-black rounded-xs shadow-2xl ${
              isPortrait ? "h-[74vh] max-w-[85vw]" : "h-[62vh] md:h-[72vh] max-w-[88vw]"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Understated Caption in Modal */}
          <div className="mt-3 text-center font-mono text-[11px] text-white/70">
            <span className="font-sans font-bold text-white text-xs mr-2">
              {photo.title}
            </span>
            <span>
              {photo.specs.camera} · {photo.specs.lens} · {photo.specs.location}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
