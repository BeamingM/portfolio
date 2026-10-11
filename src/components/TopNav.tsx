"use client";

import { useState } from "react";
import BrandMark from "./BrandMark";
import { toggleSound, playTactileClick } from "@/utils/sound";
import { triggerHaptic } from "@/utils/haptics";
import { Volume2, VolumeX } from "lucide-react";

interface TopNavProps {
  onOpenAbout: () => void;
  onSelectSection?: (sectionId: string) => void;
  activeSection?: string;
}

export default function TopNav({
  onOpenAbout,
  onSelectSection,
  activeSection = "all",
}: TopNavProps) {
  const [soundOn, setSoundOn] = useState(true);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    triggerHaptic("light");
    if (newState) playTactileClick();
  };

  const navLinks = [
    { id: "all", label: "ALL" },
    { id: "personal", label: "PERSONAL PROJECTS" },
    { id: "tu-photo", label: "TU PHOTO" },
    { id: "psctu", label: "PSC.TU" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 h-16 bg-[#FBFBF9]/92 backdrop-blur-md border-b border-[#EBEBE6] flex items-center justify-between px-4 md:px-8 select-none">
      {/* Brand: Pure Typography (No icon box) */}
      <BrandMark />

      {/* Center: Editorial Project Index Links (Hidden on small mobile, visible sm+) */}
      <nav className="hidden md:flex items-center gap-1 font-mono text-[11px]">
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                triggerHaptic("light");
                playTactileClick();
                onSelectSection?.(link.id);
              }}
              type="button"
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#121212] text-white font-bold"
                  : "text-[#737373] hover:text-[#121212] hover:bg-[#F4F4F0]"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 font-mono text-xs">
        {/* Sound FX Toggle */}
        <button
          onClick={handleSoundToggle}
          type="button"
          title={soundOn ? "Mute tactile click sounds" : "Unmute tactile click sounds"}
          className="w-8 h-8 rounded-full border border-[#E5E5DF] bg-[#FFFFFF] hover:bg-[#121212] hover:text-white text-[#121212] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#737373]" />}
        </button>

        {/* Profile & Info Trigger */}
        <button
          onClick={() => {
            triggerHaptic("light");
            playTactileClick();
            onOpenAbout();
          }}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#121212] bg-[#121212] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors cursor-pointer text-[11px] font-sans font-bold tracking-wide shadow-xs"
        >
          <span>INFO / CONTACT</span>
        </button>
      </div>
    </header>
  );
}
