"use client";

import { useRef } from "react";
import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { LayoutGrid, Maximize2 } from "lucide-react";

interface PolaroidDockProps {
  items: PhotoItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenAbout: () => void;
  isGridView: boolean;
  onToggleGrid: () => void;
}

export default function PolaroidDock({
  items,
  currentIndex,
  onSelectIndex,
  onOpenAbout,
  isGridView,
  onToggleGrid,
}: PolaroidDockProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (index: number) => {
    triggerHaptic("snap");
    playTactileClick();
    onSelectIndex(index);
  };

  const handleToggleView = () => {
    triggerHaptic("medium");
    playTactileClick();
    onToggleGrid();
  };

  const handleAboutClick = () => {
    triggerHaptic("light");
    playTactileClick();
    onOpenAbout();
  };

  return (
    <div className="fixed bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl pointer-events-none select-none">
      {/* Floating Pill Container (Inspired by Matthias Oel / Framer Polaroid Nav) */}
      <div className="pointer-events-auto bg-[#FBFBF9]/90 backdrop-blur-md border border-[#E5E5DF] rounded-full p-2 md:p-2.5 shadow-xl flex items-center justify-between gap-2 md:gap-4 transition-all">
        {/* Left: View Mode Toggle */}
        <button
          onClick={handleToggleView}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5DF] bg-[#F4F4F0] hover:bg-[#121212] hover:text-white text-[#121212] transition-colors cursor-pointer text-[10px] md:text-[11px] font-mono tracking-wider shadow-2xs shrink-0"
          title={isGridView ? "Switch to Stage View" : "Switch to Contact Sheet Grid"}
        >
          {isGridView ? (
            <>
              <Maximize2 className="w-3 h-3 text-[#D9381E]" />
              <span className="hidden sm:inline">STAGE</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-3 h-3 text-[#D9381E]" />
              <span className="hidden sm:inline">ARCHIVE</span>
            </>
          )}
        </button>

        {/* Center: Polaroid Cards Strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 flex-1 justify-start md:justify-center"
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index && !isGridView;
            return (
              <button
                key={item.id}
                onClick={() => handleCardClick(index)}
                type="button"
                className={`group relative shrink-0 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "-translate-y-1.5 scale-105 shadow-md"
                    : "opacity-60 hover:opacity-100 hover:-translate-y-0.5"
                }`}
              >
                {/* Polaroid Miniature Card */}
                <div
                  className={`w-10 h-13 md:w-12 md:h-15 bg-white border p-1 pb-2 flex flex-col justify-between rounded-2xs ${
                    isActive
                      ? "border-[#121212] shadow-sm ring-1 ring-[#D9381E]/40"
                      : "border-[#E5E5DF]"
                  }`}
                >
                  {/* Photo area */}
                  <div className="relative w-full aspect-square bg-[#121212] overflow-hidden rounded-3xs">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-cover grayscale contrast-105"
                    />
                  </div>

                  {/* Polaroid handwritten/tiny label bottom margin */}
                  <div className="text-center mt-0.5">
                    <span className="font-serif text-[8px] md:text-[9px] text-[#737373] tracking-tight block leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Active Vermilion Dot */}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D9381E]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Atelier / Info Button */}
        <button
          onClick={handleAboutClick}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#F4F4F0] dark:bg-[#1A1A19] hover:bg-[#121212] dark:hover:bg-[#F5F5F3] hover:text-white dark:hover:text-[#121212] text-[#121212] dark:text-[#F5F5F3] transition-colors cursor-pointer text-[10px] md:text-[11px] font-mono tracking-wider shadow-2xs shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] dark:bg-[#FFA000] animate-pulse" />
          <span>INFO</span>
        </button>
      </div>
    </div>
  );
}
