"use client";

import { useState, useEffect } from "react";
import BrandMark from "./BrandMark";
import { toggleSound, isSoundEnabled, playTactileClick } from "@/utils/sound";
import { triggerHaptic } from "@/utils/haptics";
import { Volume2, VolumeX } from "lucide-react";

interface TopNavProps {
  onOpenAbout: () => void;
}

export default function TopNav({ onOpenAbout }: TopNavProps) {
  const [timeStr, setTimeStr] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Bangkok",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    triggerHaptic("light");
    if (newState) playTactileClick();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 h-16 bg-[#FBFBF9]/85 backdrop-blur-md border-b border-[#E5E5DF] flex items-center justify-between px-4 md:px-8 select-none">
      {/* Brand & Hankō Seal */}
      <BrandMark />

      {/* Realtime Bangkok Clock Telemetry */}
      <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#737373]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse" />
        <span className="text-[#121212] font-medium">BKK {timeStr || "11:00 AM"}</span>
        <span className="text-[#A0A09A]">· UTC+7</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {/* Sound FX Toggle */}
        <button
          onClick={handleSoundToggle}
          type="button"
          title={soundOn ? "Mute tactile click sounds" : "Unmute tactile click sounds"}
          className="w-8 h-8 rounded-full border border-[#E5E5DF] bg-[#F4F4F0] hover:bg-[#121212] hover:text-white text-[#121212] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#737373]" />}
        </button>

        {/* Atelier Button */}
        <button
          onClick={() => {
            triggerHaptic("light");
            playTactileClick();
            onOpenAbout();
          }}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#121212] bg-[#121212] text-[#FBFBF9] hover:bg-[#D9381E] hover:border-[#D9381E] transition-colors cursor-pointer text-[11px] font-mono tracking-wider shadow-xs"
        >
          <span>[ATELIER]</span>
        </button>
      </div>
    </header>
  );
}
