"use client";

import { useState } from "react";
import HudHeader from "@/components/HudHeader";
import HudFooter from "@/components/HudFooter";
import ScrollytellingStage from "@/components/ScrollytellingStage";
import AboutDrawer from "@/components/AboutDrawer";
import { galleryItems } from "@/config/gallery";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  const handleSelectIndex = (index: number) => {
    setCurrentIndex(index);
    if (typeof window !== "undefined") {
      const targetTop = index * window.innerHeight * 1.2;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] text-[#121212] selection:bg-[#FF3E00] selection:text-white analog-grain">
      {/* Dynamic HUD Header */}
      <HudHeader onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Main Scrollytelling Canvas Stage */}
      <ScrollytellingStage
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      {/* Dynamic HUD Footer with Scrubber */}
      <HudFooter
        currentIndex={currentIndex}
        total={galleryItems.length}
        currentPhoto={galleryItems[currentIndex]}
        onSelectIndex={handleSelectIndex}
      />

      {/* Slide-over About Drawer */}
      <AboutDrawer
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}
