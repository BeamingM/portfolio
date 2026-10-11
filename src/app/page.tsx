"use client";

import { useState, useMemo, useCallback } from "react";
import TopNav from "@/components/TopNav";
import SectionFilterBar from "@/components/SectionFilterBar";
import EditorialPhotobook from "@/components/EditorialPhotobook";
import PhotoModal from "@/components/PhotoModal";
import AtelierDrawer from "@/components/AtelierDrawer";
import { galleryItems, gallerySections, PhotoItem } from "@/config/gallery";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
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
    <main className="relative min-h-screen bg-[#FBFBF9] dark:bg-[#0D0D0D] text-[#121212] dark:text-[#F5F5F3] selection:bg-[#FF3E00] dark:selection:bg-[#FF5722] selection:text-white analog-grain pt-16 transition-colors duration-200">
      {/* Top Header: Progressive Blur & Center-to-Top-Left Morphing BrandMark */}
      <TopNav
        onOpenAbout={() => setIsAtelierOpen(true)}
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
      />

      {/* Hero Welcome Space: The Brand Identity begins here in the center, then morphs to top-left */}
      <section className="relative w-full pt-14 pb-8 flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[34vh] select-none text-center">
        {/* Invisible spacer matching where the BrandMark sits at scroll 0 */}
        <div className="h-16 md:h-20" aria-hidden="true" />

        {/* Camera Spec & Location Imprint */}
        <div className="mt-6 flex items-center gap-2 font-mono text-[10px] md:text-[11px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-widest">
          <span>Sony α7 III</span>
          <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
          <span>FE 35mm & 55mm ZA</span>
        </div>

        {/* Scroll Prompt */}
        <div className="mt-8 flex flex-col items-center gap-1 font-mono text-[9px] md:text-[10px] text-[#A3A3A3] dark:text-[#777] uppercase tracking-[0.2em]">
          <span>{t("scrollPrompt")}</span>
          <span className="animate-bounce mt-1">↓</span>
        </div>
      </section>

      {/* Project Section Filter Pills */}
      <div className="pt-2 pb-1">
        <SectionFilterBar
          sections={gallerySections}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          counts={sectionCounts}
        />
      </div>

      {/* Main Exhibition: Vertical Scroll Editorial Photobook (Adaptive balanced grid) */}
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
