"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Camera,
  MapPin,
  Calendar,
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

interface PhotoModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

interface PhotoModalDialogProps {
  photo: PhotoItem;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

function PhotoModalDialog({
  photo,
  onClose,
  onNext,
  onPrev,
}: PhotoModalDialogProps) {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerHaptic("light");
        onClose();
      } else if (e.key === "ArrowRight") {
        triggerHaptic("snap");
        onNext?.();
      } else if (e.key === "ArrowLeft") {
        triggerHaptic("snap");
        onPrev?.();
      } else if (e.key === "z" || e.key === "Z") {
        triggerHaptic("light");
        setIsZoomed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Mobile Touch Swipe Navigation Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Ignore swipe gestures while in 1:1 zoomed mode
    if (isZoomed) return;

    // Horizontal swipe threshold: 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe Left -> Next
        triggerHaptic("snap");
        onNext?.();
      } else {
        // Swipe Right -> Prev
        triggerHaptic("snap");
        onPrev?.();
      }
    } else if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
      // Swipe Down -> Dismiss modal
      triggerHaptic("light");
      onClose();
    }
  };

  const toggleZoom = useCallback(() => {
    triggerHaptic("light");
    setIsZoomed((prev) => !prev);
  }, []);

  return (
    <motion.div
      key="photo-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo view: ${photo.title}`}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      className="fixed inset-0 z-50 bg-[#0B0B0B]/94 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-5 md:p-8 select-none overflow-y-auto"
    >
      {/* Top Control Bar: Title & Action Buttons */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl flex items-center justify-between text-white z-50 pb-2"
      >
        <div className="flex items-center gap-2 font-mono min-w-0 flex-1 mr-3">
          <span className="font-bold text-xs md:text-sm text-white tracking-wider uppercase shrink-0">
            {photo.series}
          </span>
          <span className="text-white/40 text-xs shrink-0">·</span>
          <span className="text-white/80 text-xs truncate">{photo.specs.location}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 1:1 Zoom Inspection Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            type="button"
            className={`h-11 px-3.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono min-h-[44px] ${
              isZoomed
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
            title={isZoomed ? "Reset zoom (1x fit)" : "1:1 Zoom Inspection (100% detail)"}
            aria-label="Toggle zoom inspection"
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-4 h-4" />
                <span className="hidden sm:inline">1:1 Zoomed</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">1:1 Inspect</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
              onClose();
            }}
            type="button"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Close photo view"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Chevrons */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("snap");
            onPrev();
          }}
          type="button"
          className="hidden sm:flex absolute left-2.5 md:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("snap");
            onNext();
          }}
          type="button"
          className="hidden sm:flex absolute right-2.5 md:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Center Image Plate Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 w-full flex items-center justify-center relative min-h-0 my-2 overflow-hidden"
      >
        {isZoomed ? (
          <div
            onClick={toggleZoom}
            className="w-full h-full overflow-auto cursor-zoom-out flex p-4"
          >
            <div className="m-auto flex items-center justify-center min-w-full min-h-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width || 1200}
                height={photo.height || 800}
                priority
                unoptimized
                className="max-w-none max-h-none w-auto h-auto object-contain rounded-xs shadow-2xl select-none"
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={toggleZoom}
            className="relative w-full h-full max-h-[62vh] sm:max-h-[74vh] max-w-[92vw] sm:max-w-[88vw] flex items-center justify-center cursor-zoom-in rounded-xs"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width || 1200}
              height={photo.height || 800}
              priority
              unoptimized
              className="max-h-[62vh] sm:max-h-[74vh] max-w-[92vw] sm:max-w-[88vw] w-auto h-auto object-contain rounded-xs shadow-2xl select-none"
            />
          </motion.div>
        )}
      </div>

      {/* Complete Camera EXIF HUD Overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-black/75 border border-white/15 backdrop-blur-md rounded-lg p-3 text-white font-mono z-50 mt-1 shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-[11px] sm:text-xs">
          {/* Primary Camera Spec strictly Sony α7 III */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-white/15 text-white font-bold tracking-wider text-[11px] sm:text-xs">
              <Camera className="w-3.5 h-3.5 text-[#FF9500]" />
              Sony α7 III
            </span>
            <span className="text-white/80 font-medium truncate max-w-[180px] sm:max-w-none">
              {photo.specs.lens}
            </span>
          </div>

          {/* Exposure Triad HUD (Aperture · Shutter · ISO · Focal Length) */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-white/90">
            <span className="px-2 py-0.5 rounded-xs bg-white/10 font-semibold text-[#FFB300]">
              {photo.specs.aperture}
            </span>
            <span className="px-2 py-0.5 rounded-xs bg-white/10 font-semibold">
              {photo.specs.shutter}
            </span>
            <span className="px-2 py-0.5 rounded-xs bg-white/10 font-semibold">
              {typeof photo.specs.iso === "number" ? `ISO ${photo.specs.iso}` : photo.specs.iso}
            </span>
            {photo.specs.focalLength && (
              <span className="px-2 py-0.5 rounded-xs bg-white/10 text-white/80">
                {photo.specs.focalLength}
              </span>
            )}
          </div>

          {/* Location & Year */}
          <div className="flex items-center gap-2 text-white/70">
            <span className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#FF9500]" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                {photo.specs.location}
              </span>
            </span>
            <span className="flex items-center gap-0.5 text-white/50">
              <Calendar className="w-2.5 h-2.5" />
              <span>{photo.specs.year}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoModal({
  photo,
  onClose,
  onNext,
  onPrev,
}: PhotoModalProps) {
  // Lock body scroll while modal is active
  useEffect(() => {
    if (photo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [photo]);

  return (
    <AnimatePresence>
      {photo && (
        <PhotoModalDialog
          key={photo.id}
          photo={photo}
          onClose={onClose}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
    </AnimatePresence>
  );
}
