"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { PhotoItem } from "@/config/gallery";
import InstagramEmbed from "@/components/InstagramEmbed";
import InteractivePrintCard from "@/components/InteractivePrintCard";

interface EditorialPhotobookProps {
  items: PhotoItem[];
  activeSection: string;
  onSelectPhoto?: (item: PhotoItem) => void;
  onResetLensFilter?: () => void;
}

type PhotobookEntry =
  | { type: "photo"; photo: PhotoItem; id: string; priority: boolean }
  | { type: "embed"; id: string; priority: boolean };

const BATCH_SIZE = 12;

/**
 * Distribute photos evenly by orientation using Bresenham line algorithm.
 * Guarantees organic rhythm alternating landscape (แนวนอน) and portrait (แนวตั้ง).
 */
function bresenhamInterleave(
  landscapes: PhotoItem[],
  portraits: PhotoItem[]
): PhotoItem[] {
  const L = landscapes.length;
  const P = portraits.length;
  const N = L + P;
  if (N === 0) return [];
  if (P === 0) return [...landscapes];
  if (L === 0) return [...portraits];

  const result: PhotoItem[] = [];
  let lIdx = 0;
  let pIdx = 0;
  const isLandscapeMajor = L >= P;
  const minorCount = isLandscapeMajor ? P : L;
  let accum = Math.floor(N / 2);

  for (let i = 0; i < N; i++) {
    accum += minorCount;
    if (accum >= N) {
      accum -= N;
      if (isLandscapeMajor) {
        if (pIdx < P) result.push(portraits[pIdx++]);
        else result.push(landscapes[lIdx++]);
      } else {
        if (lIdx < L) result.push(landscapes[lIdx++]);
        else result.push(portraits[pIdx++]);
      }
    } else {
      if (isLandscapeMajor) {
        if (lIdx < L) result.push(landscapes[lIdx++]);
        else result.push(portraits[pIdx++]);
      } else {
        if (pIdx < P) result.push(portraits[pIdx++]);
        else result.push(landscapes[lIdx++]);
      }
    }
  }
  return result;
}

/**
 * Round-robin interleave by series (e.g. personal, tu-photo, psctu)
 * so photos from different documentary projects are interwoven evenly.
 */
function roundRobinBySeries(photos: PhotoItem[]): PhotoItem[] {
  const bySeries: Record<string, PhotoItem[]> = {};
  for (const p of photos) {
    if (!bySeries[p.sectionId]) bySeries[p.sectionId] = [];
    bySeries[p.sectionId].push(p);
  }
  const seriesKeys = Object.keys(bySeries);
  const result: PhotoItem[] = [];
  let added = true;
  let idx = 0;
  while (added) {
    added = false;
    for (const s of seriesKeys) {
      if (idx < bySeries[s].length) {
        result.push(bySeries[s][idx]);
        added = true;
      }
    }
    idx++;
  }
  return result;
}

export default function EditorialPhotobook({
  items,
  activeSection,
  onSelectPhoto,
}: EditorialPhotobookProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Responsive mobile detector
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset progressive batch visible count to 12 when activeSection changes (render-phase state adjustment)
  const [prevSection, setPrevSection] = useState(activeSection);
  if (prevSection !== activeSection) {
    setPrevSection(activeSection);
    setVisibleCount(BATCH_SIZE);
  }

  // Algorithmic orientation interleaving with Bresenham ratio distribution
  const allOrderedPhotos = useMemo<PhotoItem[]>(() => {
    if (activeSection === "all") {
      const landscapes = items.filter((p) => p.orientation === "landscape");
      const portraits = items.filter((p) => p.orientation === "portrait");
      const balancedLandscapes = roundRobinBySeries(landscapes);
      const balancedPortraits = roundRobinBySeries(portraits);
      return bresenhamInterleave(balancedLandscapes, balancedPortraits);
    }
    const sectionItems = items.filter((p) => p.sectionId === activeSection);
    const landscapes = sectionItems.filter((p) => p.orientation === "landscape");
    const portraits = sectionItems.filter((p) => p.orientation === "portrait");
    return bresenhamInterleave(landscapes, portraits);
  }, [items, activeSection]);

  // Progressive batch lazy loading: observe bottom sentinel to increment visible count
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= allOrderedPhotos.length) return prev;
            return Math.min(prev + BATCH_SIZE, allOrderedPhotos.length);
          });
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [allOrderedPhotos.length]);

  // Visible photo batch
  const visiblePhotos = useMemo(() => {
    return allOrderedPhotos.slice(0, visibleCount);
  }, [allOrderedPhotos, visibleCount]);

  // Deterministic Dual-Column Masonry (Desktop >= 768px)
  // Greedy cumulative aspect-ratio balancing ensures zero layout shifts on progressive batching
  const { colLeft, colRight } = useMemo(() => {
    const left: PhotobookEntry[] = [];
    const right: PhotobookEntry[] = [];
    let heightL = 0;
    let heightR = 0;

    const showEmbed = activeSection === "all" || activeSection === "tu-photo";
    let embedPlaced = false;

    visiblePhotos.forEach((photo, idx) => {
      if (showEmbed && !embedPlaced && idx === 4) {
        embedPlaced = true;
        const embedAspect = 1.25;
        if (heightL <= heightR) {
          left.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
          heightL += embedAspect;
        } else {
          right.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
          heightR += embedAspect;
        }
      }

      const aspect = (photo.height || 1600) / (photo.width || 2400);
      const priority = idx < 4;

      if (heightL <= heightR) {
        left.push({ type: "photo", photo, id: photo.id, priority });
        heightL += aspect;
      } else {
        right.push({ type: "photo", photo, id: photo.id, priority });
        heightR += aspect;
      }
    });

    if (showEmbed && !embedPlaced && visiblePhotos.length > 0) {
      if (heightL <= heightR) {
        left.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
      } else {
        right.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
      }
    }

    return { colLeft: left, colRight: right };
  }, [visiblePhotos, activeSection]);

  // Single sequential stream for Mobile (< 768px)
  const mobileItems = useMemo<PhotobookEntry[]>(() => {
    const list: PhotobookEntry[] = [];
    const showEmbed = activeSection === "all" || activeSection === "tu-photo";
    let embedPlaced = false;

    visiblePhotos.forEach((photo, idx) => {
      if (showEmbed && !embedPlaced && idx === 4) {
        embedPlaced = true;
        list.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
      }
      list.push({
        type: "photo",
        photo,
        id: photo.id,
        priority: idx < 4,
      });
    });

    if (showEmbed && !embedPlaced && visiblePhotos.length > 0) {
      list.push({ type: "embed", id: "tu-photo-official-embed", priority: false });
    }

    return list;
  }, [visiblePhotos, activeSection]);

  const renderEntry = (entry: PhotobookEntry) => {
    if (entry.type === "embed") {
      return (
        <div key={entry.id} className="w-full">
          <InstagramEmbed />
        </div>
      );
    }
    return (
      <div key={entry.id} className="w-full">
        <InteractivePrintCard
          photo={entry.photo}
          priority={entry.priority}
          onClick={() => onSelectPhoto?.(entry.photo)}
        />
      </div>
    );
  };

  return (
    <div id="photos-archive" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-4 pb-12 scroll-mt-20 sm:scroll-mt-24">
      {/* Empty State */}
      {allOrderedPhotos.length === 0 && (
        <div className="py-24 text-center font-mono text-xs text-[#737373] dark:text-[#9E9E9C] flex flex-col items-center gap-3">
          <p>No documentary prints in this archive view.</p>
        </div>
      )}

      {/* Photobook Spread: Single sequential column for Mobile, Deterministic Dual-Column Masonry for Desktop */}
      {isMobile ? (
        <div className="flex flex-col gap-6">
          {mobileItems.map(renderEntry)}
        </div>
      ) : (
        <div className="flex flex-row items-start gap-6 lg:gap-8">
          <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
            {colLeft.map(renderEntry)}
          </div>
          <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
            {colRight.map(renderEntry)}
          </div>
        </div>
      )}

      {/* Progressive Batch Lazy Loading Sentinel */}
      {visibleCount < allOrderedPhotos.length && (
        <div
          ref={sentinelRef}
          className="h-10 w-full pointer-events-none opacity-0"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
