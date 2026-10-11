"use client";

import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/TopNav";
import DraggableStage from "@/components/DraggableStage";
import ArchiveGrid from "@/components/ArchiveGrid";
import PolaroidDock from "@/components/PolaroidDock";
import AtelierDrawer from "@/components/AtelierDrawer";
import { galleryItems } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState<boolean>(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, []);

  const handleSelectIndex = (index: number) => {
    setCurrentIndex(index);
    setIsGridView(false);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAtelierOpen) return;

      if (e.key === "ArrowRight") {
        triggerHaptic("snap");
        playTactileClick();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        triggerHaptic("snap");
        playTactileClick();
        handlePrev();
      } else if (e.key.toLowerCase() === "g") {
        triggerHaptic("medium");
        playTactileClick();
        setIsGridView((prev) => !prev);
      } else if (e.key === "Escape") {
        if (isGridView) setIsGridView(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isAtelierOpen, isGridView]);

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] text-[#121212] selection:bg-[#D9381E] selection:text-white analog-grain pt-16">
      {/* Top Minimal Craft Bar with Live Bangkok Telemetry */}
      <TopNav onOpenAbout={() => setIsAtelierOpen(true)} />

      {/* Main Exhibition View: Draggable Focus Print vs Contact Sheet Grid */}
      {isGridView ? (
        <ArchiveGrid
          items={galleryItems}
          onSelectPhoto={handleSelectIndex}
        />
      ) : (
        <DraggableStage
          currentPhoto={galleryItems[currentIndex]}
          currentIndex={currentIndex}
          total={galleryItems.length}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {/* Floating Polaroid Dock with Haptic Feedback */}
      <PolaroidDock
        items={galleryItems}
        currentIndex={currentIndex}
        onSelectIndex={handleSelectIndex}
        onOpenAbout={() => setIsAtelierOpen(true)}
        isGridView={isGridView}
        onToggleGrid={() => setIsGridView((prev) => !prev)}
      />

      {/* Atelier & Bio Slide-over Panel */}
      <AtelierDrawer
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
      />
    </main>
  );
}
