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

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] text-[#121212] selection:bg-[#FF3E00] selection:text-white">
      {/* Dynamic HUD Overlays */}
      <HudHeader onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Main Scrollytelling Canvas */}
      <ScrollytellingStage
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      {/* Dynamic HUD Footer */}
      <HudFooter
        currentIndex={currentIndex}
        total={galleryItems.length}
        currentPhoto={galleryItems[currentIndex]}
      />

      {/* Slide-over About Drawer */}
      <AboutDrawer
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}
