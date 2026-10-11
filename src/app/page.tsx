"use client";

import { useState, useMemo, useCallback } from "react";
import TopNav from "@/components/TopNav";
import SectionFilterBar from "@/components/SectionFilterBar";
import EditorialPhotobook from "@/components/EditorialPhotobook";
import PhotoModal from "@/components/PhotoModal";
import AtelierDrawer from "@/components/AtelierDrawer";
import { galleryItems, gallerySections, PhotoItem } from "@/config/gallery";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [isAtelierOpen, setIsAtelierOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

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
    setActiveSection(sectionId);
    if (sectionId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  };

  const handleModalNext = useCallback(() => {
    if (!selectedPhoto) return;
    const curIdx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    if (curIdx !== -1) {
      const nextIdx = (curIdx + 1) % galleryItems.length;
      setSelectedPhoto(galleryItems[nextIdx]);
    }
  }, [selectedPhoto]);

  const handleModalPrev = useCallback(() => {
    if (!selectedPhoto) return;
    const curIdx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    if (curIdx !== -1) {
      const prevIdx = (curIdx - 1 + galleryItems.length) % galleryItems.length;
      setSelectedPhoto(galleryItems[prevIdx]);
    }
  }, [selectedPhoto]);

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] text-[#121212] selection:bg-[#FF3E00] selection:text-white analog-grain pt-16">
      {/* Top Header: Pure Typography Imprint & Controls */}
      <TopNav
        onOpenAbout={() => setIsAtelierOpen(true)}
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
      />

      {/* Project Section Filter Pills */}
      <div className="pt-3 pb-1">
        <SectionFilterBar
          sections={gallerySections}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          counts={sectionCounts}
        />
      </div>

      {/* Main Exhibition: Vertical Scroll Editorial Photobook (No bottom bar) */}
      <EditorialPhotobook
        items={galleryItems}
        activeSection={activeSection}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      {/* High-Resolution Focus Lightbox */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
      />

      {/* Slide-over Profile & Contact Panel */}
      <AtelierDrawer
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
      />
    </main>
  );
}
