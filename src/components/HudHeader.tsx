"use client";

import { useEffect, useState } from "react";
import { siteProfile } from "@/config/gallery";
import { SlidersHorizontal } from "lucide-react";

interface HudHeaderProps {
  onOpenAbout: () => void;
}

export default function HudHeader({ onOpenAbout }: HudHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const bkkTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTimeStr(bkkTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-40 h-12 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#E5E5DF] flex items-center justify-between px-4 md:px-8 select-none font-mono">
      {/* Identity & Sub-badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#121212] uppercase font-sans">
          <span>{siteProfile.name}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E5E5DF] text-[#737373]">
          <span className="text-[10px] tracking-wider uppercase">VISUAL MEDIA / BKK</span>
          <span className="inline-block w-1 h-1 bg-[#737373] rounded-full" />
          <span className="text-[10px] text-[#FF3E00] tracking-wider font-semibold">CH-01</span>
        </div>
      </div>

      {/* Realtime Bangkok Station Telemetry */}
      <div className="flex items-center gap-2 text-[#121212] text-xs">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F4F4F0] border border-[#E5E5DF] rounded-xs shadow-2xs">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
          <span className="tracking-widest font-mono text-[11px] font-medium">
            BKK {timeStr || "02:45:12"}
          </span>
          <span className="hidden md:inline text-[9px] text-[#737373] border-l border-[#E5E5DF] pl-2 font-mono">
            UTC+7 · SYS: ONLINE / 60FPS
          </span>
        </div>
      </div>

      {/* Action Trigger for About Drawer */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAbout}
          type="button"
          className="text-xs px-3 py-1 bg-transparent border border-[#121212] hover:bg-[#121212] hover:text-[#FBFBF9] text-[#121212] transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[11px] tracking-wider font-mono font-medium">[ABOUT / INFO]</span>
        </button>
      </div>
    </header>
  );
}
