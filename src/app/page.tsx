"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import TopNav from "@/components/TopNav";
import ProjectDescriptionHeader from "@/components/ProjectDescriptionHeader";
import EditorialPhotobook from "@/components/EditorialPhotobook";
import SiteFooter from "@/components/SiteFooter";
import PhotoModal from "@/components/PhotoModal";
import AtelierDrawer from "@/components/AtelierDrawer";
import FigmaCanvasOverlay from "@/components/FigmaCanvasOverlay";
import { galleryItems, gallerySections, PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [isAtelierOpen, setIsAtelierOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Sync active section from URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      if (sec && ["all", "personal", "tu-photo", "psctu"].includes(sec)) {
        setActiveSection(sec);
      }
    }
  }, []);

  // Filter gallery items by active project section
  const displayedPhotos = useMemo(() => {
    if (activeSection === "all") return galleryItems;
    return galleryItems.filter((item) => item.sectionId === activeSection);
  }, [activeSection]);

  // Compute section counts based on available gallery photos
  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: galleryItems.length,
    };
    gallerySections.forEach((sec) => {
      if (sec.id !== "all") {
        counts[sec.id] = galleryItems.filter((item) => item.sectionId === sec.id).length;
      }
    });
    return counts;
  }, []);

  const handleSelectSection = (sectionId: string) => {
    triggerHaptic("light");
    setActiveSection((prev) => (prev === sectionId && sectionId !== "all" ? "all" : sectionId));
  };

  const handleModalNext = useCallback(() => {
    if (!selectedPhoto || displayedPhotos.length === 0) return;
    const curIdx = displayedPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (curIdx !== -1) {
      const nextIdx = (curIdx + 1) % displayedPhotos.length;
      setSelectedPhoto(displayedPhotos[nextIdx]);
    } else {
      setSelectedPhoto(displayedPhotos[0]);
    }
  }, [selectedPhoto, displayedPhotos]);

  const handleModalPrev = useCallback(() => {
    if (!selectedPhoto || displayedPhotos.length === 0) return;
    const curIdx = displayedPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (curIdx !== -1) {
      const prevIdx = (curIdx - 1 + displayedPhotos.length) % displayedPhotos.length;
      setSelectedPhoto(displayedPhotos[prevIdx]);
    } else {
      setSelectedPhoto(displayedPhotos[displayedPhotos.length - 1]);
    }
  }, [selectedPhoto, displayedPhotos]);

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] dark:bg-[#0D0D0D] text-[#121212] dark:text-[#F5F5F3] selection:bg-[#FF9500] dark:selection:bg-[#FFA000] selection:text-white paper-texture transition-colors duration-200">
      {/* Top Header: Progressive Blur & Center-to-Top-Left Morphing BrandMark with Project Tabs */}
      <TopNav
        onOpenAbout={() => setIsAtelierOpen(true)}
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
        counts={sectionCounts}
      />

      {/* Hero Welcome Space: BrandMark + Floating Greeting + Unified Filter Bar at scroll 0 */}
      <section className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-2 flex flex-col items-center justify-center select-none text-center">
        {/* Authentic Apple-Style Floating Narrative Greeting (No boxes, no badges, pure typography) */}
        <ProjectDescriptionHeader activeSection={activeSection} />

        {/* Anchor slot where the Unified Morphing Filter Bar sits cleanly below greeting at scroll 0 */}
        <div
          id="hero-filter-anchor"
          className="w-full h-12 sm:h-14 flex items-center justify-center my-3 pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* Editorial Photobook Exhibition Showcase */}
      <EditorialPhotobook
        items={displayedPhotos}
        activeSection={activeSection}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      {/* Comprehensive Editorial Sitemap & Footer */}
      <SiteFooter
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        counts={sectionCounts}
      />

      {/* High-Resolution Focus Lightbox */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
      />

      {/* Slide-over Profile & Contact Panel (Unified Mobile Hamburger Drawer) */}
      <AtelierDrawer
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        counts={sectionCounts}
      />

      {/* Interactive Figma Canvas Cursor Overlay */}
      <FigmaCanvasOverlay />
    </main>
  );
}
