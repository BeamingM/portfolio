"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { PhotoItem, galleryItems } from "@/config/gallery";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Camera,
  Calendar,
  Info,
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";
import { useLanguage } from "@/context/LanguageContext";

interface WebKitGestureEvent extends UIEvent {
  scale: number;
  rotation: number;
}

interface PhotoModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

interface PhotoModalDialogProps {
  photo: PhotoItem;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

function getPhotoDateString(photo: PhotoItem, lang: string): string {
  if (photo.sectionId === "tu-photo") {
    return lang === "th" ? "ตุลาคม 2026" : "OCTOBER 2026";
  }
  if (photo.sectionId === "psctu") {
    return lang === "th" ? "สิงหาคม 2026" : "AUGUST 2026";
  }
  return lang === "th" ? "พฤษภาคม 2026" : "MAY 2026";
}

function PhotoModalDialog({
  photo,
  onClose,
  onNext,
  onPrev,
}: PhotoModalDialogProps) {
  const { lang } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // High-performance transform state (Scale & Pan Offset)
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isTransforming, setIsTransforming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showExifHud, setShowExifHud] = useState<boolean>(true);

  // Mutable refs to prevent stale closures during high-frequency RAF wheel/touch events
  const scaleRef = useRef<number>(1);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transformTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  const touchStateRef = useRef<{
    initialDist?: number;
    initialScale?: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    startTime: number;
  } | null>(null);
  const lastTapRef = useRef<number>(0);

  const isZoomed = transform.scale > 1.05;


  // Reset zoom & transform whenever navigating between photos (render-phase state adjustment)
  const [prevPhotoId, setPrevPhotoId] = useState(photo.id);
  if (prevPhotoId !== photo.id) {
    setPrevPhotoId(photo.id);
    setTransform({ scale: 1, x: 0, y: 0 });
    setIsTransforming(false);
    setIsDragging(false);
  }

  // Synchronize mutable refs on photo change outside render phase
  useEffect(() => {
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
  }, [photo.id]);

  // Predictive image prefetching for adjacent images (currentIndex ± 1)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const curIdx = galleryItems.findIndex((p) => p.id === photo.id);
    if (curIdx === -1) return;

    const nextPhoto = galleryItems[(curIdx + 1) % galleryItems.length];
    const prevPhoto = galleryItems[(curIdx - 1 + galleryItems.length) % galleryItems.length];

    [nextPhoto?.src, prevPhoto?.src].filter(Boolean).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [photo.id]);

  // Silent protection: intercept copy event while lightbox is open
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    window.addEventListener("copy", handleCopy);
    return () => window.removeEventListener("copy", handleCopy);
  }, []);

  const resetZoom = useCallback(() => {
    triggerHaptic("light");
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setTransform({ scale: 1, x: 0, y: 0 });
    setIsTransforming(false);
  }, []);

  const toggleZoom = useCallback(() => {
    triggerHaptic("light");
    if (scaleRef.current > 1.05) {
      resetZoom();
    } else {
      scaleRef.current = 2.5;
      panRef.current = { x: 0, y: 0 };
      setTransform({ scale: 2.5, x: 0, y: 0 });
      setIsTransforming(false);
    }
  }, [resetZoom]);

  // Zoom to specific client coordinates
  const zoomToPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (scaleRef.current > 1.05) {
        resetZoom();
      } else {
        triggerHaptic("light");
        const stage = stageRef.current;
        let targetX = 0;
        let targetY = 0;
        if (stage) {
          const rect = stage.getBoundingClientRect();
          const clickX = clientX - (rect.left + rect.width / 2);
          const clickY = clientY - (rect.top + rect.height / 2);
          targetX = -clickX * 1.2;
          targetY = -clickY * 1.2;
        }
        scaleRef.current = 2.5;
        panRef.current = { x: targetX, y: targetY };
        setTransform({ scale: 2.5, x: targetX, y: targetY });
        setIsTransforming(false);
      }
    },
    [resetZoom]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      zoomToPoint(e.clientX, e.clientY);
    },
    [zoomToPoint]
  );

  // Native MacBook Trackpad Pinch-to-Zoom & Two-Finger Pan Listener
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      // 1. MacBook Trackpad Pinch Gesture (Safari & Chromium emit wheel with e.ctrlKey === true)
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();

        const currentScale = scaleRef.current;
        // deltaY < 0 when pinching out (zoom in), deltaY > 0 when pinching in (zoom out)
        const factor = Math.exp(-e.deltaY * 0.012);
        const nextScale = Math.min(Math.max(1, currentScale * factor), 5);

        if (nextScale <= 1.02) {
          scaleRef.current = 1;
          panRef.current = { x: 0, y: 0 };
          setTransform({ scale: 1, x: 0, y: 0 });
          setIsTransforming(false);
          return;
        }

        // Focal point zooming: scale around cursor position relative to center of stage
        const rect = stage.getBoundingClientRect();
        const cursorX = e.clientX - (rect.left + rect.width / 2);
        const cursorY = e.clientY - (rect.top + rect.height / 2);

        const ratio = nextScale / currentScale;
        const currentPan = panRef.current;
        const nextX = cursorX - (cursorX - currentPan.x) * ratio;
        const nextY = cursorY - (cursorY - currentPan.y) * ratio;

        scaleRef.current = nextScale;
        panRef.current = { x: nextX, y: nextY };
        setTransform({ scale: nextScale, x: nextX, y: nextY });
        setIsTransforming(true);

        if (transformTimeoutRef.current) clearTimeout(transformTimeoutRef.current);
        transformTimeoutRef.current = setTimeout(() => {
          setIsTransforming(false);
        }, 120);
        return;
      }

      // 2. Trackpad two-finger pan when zoomed in (scale > 1)
      if (scaleRef.current > 1.02) {
        e.preventDefault();
        e.stopPropagation();

        const nextX = panRef.current.x - e.deltaX * 1.1;
        const nextY = panRef.current.y - e.deltaY * 1.1;

        panRef.current = { x: nextX, y: nextY };
        setTransform((prev) => ({ ...prev, x: nextX, y: nextY }));
        setIsTransforming(true);

        if (transformTimeoutRef.current) clearTimeout(transformTimeoutRef.current);
        transformTimeoutRef.current = setTimeout(() => {
          setIsTransforming(false);
        }, 120);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Safari Native Gesture Event Listeners (gesturestart, gesturechange, gestureend)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let gestureInitialScale = 1;

    const onGestureStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      gestureInitialScale = scaleRef.current;
      setIsTransforming(true);
    };

    const onGestureChange = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const gesture = e as WebKitGestureEvent;
      const nextScale = Math.min(Math.max(1, gestureInitialScale * (gesture.scale || 1)), 5);
      scaleRef.current = nextScale;

      if (nextScale <= 1.02) {
        panRef.current = { x: 0, y: 0 };
        setTransform({ scale: 1, x: 0, y: 0 });
      } else {
        setTransform((prev) => ({ ...prev, scale: nextScale }));
      }
    };

    const onGestureEnd = (e: Event) => {
      e.preventDefault();
      setIsTransforming(false);
      if (scaleRef.current <= 1.05) {
        scaleRef.current = 1;
        panRef.current = { x: 0, y: 0 };
        setTransform({ scale: 1, x: 0, y: 0 });
      }
    };

    stage.addEventListener("gesturestart", onGestureStart, { passive: false });
    stage.addEventListener("gesturechange", onGestureChange, { passive: false });
    stage.addEventListener("gestureend", onGestureEnd, { passive: false });

    return () => {
      stage.removeEventListener("gesturestart", onGestureStart);
      stage.removeEventListener("gesturechange", onGestureChange);
      stage.removeEventListener("gestureend", onGestureEnd);
    };
  }, []);

  // Mouse Drag / Pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (scaleRef.current > 1.02) {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
      setIsDragging(true);
      setIsTransforming(true);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || scaleRef.current <= 1.02) return;
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      const nextX = dragStartRef.current.panX + dx;
      const nextY = dragStartRef.current.panY + dy;

      panRef.current = { x: nextX, y: nextY };
      setTransform((prev) => ({ ...prev, x: nextX, y: nextY }));
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setIsTransforming(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Keyboard navigation & viewer shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerHaptic("light");
        if (scaleRef.current > 1.05) {
          resetZoom();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight" || (e.key === " " && scaleRef.current <= 1.05)) {
        if (e.key === " ") e.preventDefault();
        triggerHaptic("snap");
        onNext?.();
      } else if (e.key === "ArrowLeft") {
        triggerHaptic("snap");
        onPrev?.();
      } else if (e.key === "z" || e.key === "Z") {
        toggleZoom();
      } else if (e.key === "i" || e.key === "I") {
        triggerHaptic("light");
        setShowExifHud((prev) => !prev);
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "s" || e.key === "S" || e.key === "c" || e.key === "C")
      ) {
        // Silently block Save Page and Copy hotkeys
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, resetZoom, toggleZoom]);

  // Mobile / Touchscreen Pinch & Pan Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2-finger pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current = {
        initialDist: dist,
        initialScale: scaleRef.current,
        startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        startY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
        startTime: Date.now(),
      };
      setIsTransforming(true);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double-tap zoom toggle
        e.preventDefault();
        lastTapRef.current = 0;
        zoomToPoint(e.touches[0].clientX, e.touches[0].clientY);
        return;
      }
      lastTapRef.current = now;

      touchStateRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
        startTime: now,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStateRef.current) return;

    if (e.touches.length === 2 && touchStateRef.current.initialDist) {
      // Two-finger pinch active
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / touchStateRef.current.initialDist;
      const nextScale = Math.min(Math.max(1, (touchStateRef.current.initialScale || 1) * factor), 5);

      if (nextScale <= 1.02) {
        scaleRef.current = 1;
        panRef.current = { x: 0, y: 0 };
        setTransform({ scale: 1, x: 0, y: 0 });
      } else {
        scaleRef.current = nextScale;
        setTransform((prev) => ({ ...prev, scale: nextScale }));
      }
      setIsTransforming(true);
    } else if (e.touches.length === 1 && scaleRef.current > 1.02) {
      // One-finger pan while zoomed in
      e.preventDefault();
      const dx = e.touches[0].clientX - touchStateRef.current.startX;
      const dy = e.touches[0].clientY - touchStateRef.current.startY;
      const nextX = touchStateRef.current.startPanX + dx;
      const nextY = touchStateRef.current.startPanY + dy;

      panRef.current = { x: nextX, y: nextY };
      setTransform((prev) => ({ ...prev, x: nextX, y: nextY }));
      setIsTransforming(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTransforming(false);
    if (!touchStateRef.current) return;

    if (scaleRef.current <= 1.05) {
      scaleRef.current = 1;
      panRef.current = { x: 0, y: 0 };
      setTransform({ scale: 1, x: 0, y: 0 });

      // Swipe navigation when at 1x
      if (e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStateRef.current.startX;
        const deltaY = e.changedTouches[0].clientY - touchStateRef.current.startY;

        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            triggerHaptic("snap");
            onNext?.();
          } else {
            triggerHaptic("snap");
            onPrev?.();
          }
        } else if (deltaY > 90 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
          triggerHaptic("light");
          onClose();
        }
      }
    }

    touchStateRef.current = null;
  };

  const displayTitle = lang === "th" && photo.titleTh ? photo.titleTh : photo.title;

  return (
    <motion.div
      key="photo-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo view: ${displayTitle}`}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      style={{ touchAction: "none" }}
      className="fixed inset-0 z-50 bg-[#060606]/96 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-5 md:p-7 select-none overflow-hidden touch-none"
    >
      {/* Top Controls Bar: Modern Editorial Header */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl mx-auto flex items-center justify-between text-white z-40 pb-2 border-b border-white/5"
      >
        {/* Left Info: Project Series & Shoot Location */}
        <div className="flex items-center gap-2 sm:gap-2.5 font-mono min-w-0 flex-1 mr-3">
          <span className="font-sans font-bold text-xs sm:text-sm text-white tracking-wider uppercase shrink-0">
            {photo.series}
          </span>
          <span className="text-white/30 text-xs shrink-0">·</span>
          <span className="text-white/70 text-xs truncate max-w-[200px] sm:max-w-md tracking-wide">
            {photo.specs.location}
          </span>
        </div>

        {/* Right Actions: EXIF Toggle + Icon-Only Loupe Zoom + Close Button */}
        <div className="flex items-center gap-2">
          {/* Toggle EXIF HUD Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
              setShowExifHud((prev) => !prev);
            }}
            type="button"
            className={`w-10 h-10 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              showExifHud
                ? "bg-white/15 text-white border-white/30"
                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/15 hover:text-white"
            }`}
            title={showExifHud ? "Hide camera specs" : "Show camera specs"}
            aria-label="Toggle camera specs HUD"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* 1:1 Loupe Zoom Inspection Toggle Button (Icon-Only) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            type="button"
            className={`w-10 h-10 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isZoomed
                ? "bg-white text-black border-white shadow-md scale-105"
                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:text-white"
            }`}
            title={isZoomed ? "Reset zoom" : "Zoom inspection"}
            aria-label="Toggle zoom inspection"
          >
            {isZoomed ? (
              <ZoomOut className="w-4 h-4" />
            ) : (
              <ZoomIn className="w-4 h-4" />
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
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/15 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Close"
            aria-label="Close photo view"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Chevrons (Mobile & Desktop) */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("snap");
            onPrev();
          }}
          type="button"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
          title="Previous Photo"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
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
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
          title="Next Photo"
          aria-label="Next photo"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Center Image Exhibition Stage (Supports Native MacBook Pinch-to-Zoom & Pan) */}
      <div
        id="modal-image-stage"
        ref={stageRef}
        onClick={(e) => {
          // If clicking on empty stage space outside the photo when at 1x, dismiss modal
          if (e.target === e.currentTarget && transform.scale <= 1.05) {
            triggerHaptic("light");
            onClose();
          }
        }}
        style={{ touchAction: "none" }}
        className="flex-1 w-full flex items-center justify-center relative min-h-0 my-2 sm:my-3 overflow-hidden select-none cursor-default touch-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full h-full max-h-[64vh] sm:max-h-[72vh] md:max-h-[76vh] max-w-[92vw] sm:max-w-[88vw] flex items-center justify-center select-none"
          >
            <div
              ref={imageContainerRef}
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                transformOrigin: "center center",
                transition: isTransforming ? "none" : "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="relative max-h-[64vh] sm:max-h-[72vh] md:max-h-[76vh] max-w-[92vw] sm:max-w-[88vw] flex items-center justify-center will-change-transform rounded-xs shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width || 2400}
                height={photo.height || 1600}
                priority
                unoptimized
                draggable={false}
                data-protected="true"
                className="max-h-[64vh] sm:max-h-[72vh] md:max-h-[76vh] max-w-[92vw] sm:max-w-[88vw] w-auto h-auto object-contain rounded-xs select-none pointer-events-none"
              />

              {/* Micro-Vignette Edge Layer for Deep Contrast */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light bg-gradient-to-t from-black/60 via-transparent to-black/30 rounded-xs"
                aria-hidden="true"
              />

              {/* Silent Anti-Theft Protection Shield with Dynamic Zoom / Drag Cursors */}
              <div
                className="photo-shield rounded-xs"
                style={{
                  cursor: transform.scale > 1.05 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Adaptive Museum EXIF Island */}
      <AnimatePresence>
        {showExifHud && (
          <motion.footer
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl mx-auto z-40 mt-1"
          >
            <div className="bg-[#121212]/85 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-white font-mono shadow-[0_16px_36px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
              {/* Primary Camera Spec: strictly Sony α7 III + Full Lens Name (Adaptive width) */}
              <div className="flex items-center gap-2.5 text-xs w-full md:w-auto justify-between md:justify-start min-w-0">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-bold tracking-wider text-xs shrink-0">
                  <Camera className="w-3.5 h-3.5 text-[#FF9500]" />
                  Sony α7 III
                </span>
                <span className="text-white/85 font-medium text-xs sm:text-[13px] truncate max-w-[280px] sm:max-w-none">
                  {photo.specs.lens}
                </span>
              </div>

              {/* Technical Exposure Triad (Aperture ƒ · Shutter · ISO · Focal Length) + Shoot Month/Year */}
              <div className="flex items-center flex-wrap justify-center gap-2 text-xs sm:text-[13px] text-white/90">
                {/* Authentic Photographic Italic Hook ƒ/stop */}
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 font-semibold text-[#FFA000] tracking-wide flex items-center">
                  <span className="font-serif italic font-bold text-xs mr-0.5">ƒ</span>
                  <span>/{photo.specs.aperture.replace(/^[fF]\//, "")}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 font-semibold">
                  {photo.specs.shutter}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 font-semibold">
                  {typeof photo.specs.iso === "number" ? `ISO ${photo.specs.iso}` : photo.specs.iso}
                </span>
                {photo.specs.focalLength && (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/70">
                    {photo.specs.focalLength}
                  </span>
                )}

                {/* Shoot Month and Year in Uppercase */}
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 text-white/75 font-bold tracking-wider uppercase ml-1 sm:ml-2">
                  <Calendar className="w-3 h-3 text-[#FF9500]" />
                  <span>{getPhotoDateString(photo, lang)}</span>
                </span>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PhotoModal({
  photo,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
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
          key="photo-modal-shell"
          photo={photo}
          onClose={onClose}
          onNext={onNext}
          onPrev={onPrev}
          currentIndex={currentIndex}
          totalCount={totalCount}
        />
      )}
    </AnimatePresence>
  );
}
