"use client";

import { useEffect, useState } from "react";
import { siteProfile } from "@/config/gallery";

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
    <header className="fixed top-0 left-0 w-full z-40 px-5 py-4 md:px-8 md:py-6 flex items-center justify-between text-xs tracking-wider select-none font-mono pointer-events-none">
      {/* Brand / Logo */}
      <div className="pointer-events-auto flex items-center gap-2 text-neutral-900 font-semibold tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
        <span>{siteProfile.name}</span>
      </div>

      {/* Live Hardware Clock */}
      <div className="hidden sm:flex items-center gap-2 text-neutral-500 font-mono">
        <span className="text-neutral-400">BKK</span>
        <span className="tabular-nums font-medium text-neutral-700">
          {timeStr || "--:--:--"}
        </span>
      </div>

      {/* About Trigger */}
      <button
        onClick={onOpenAbout}
        type="button"
        className="pointer-events-auto group flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-neutral-300 hover:border-neutral-900 bg-white/70 backdrop-blur-sm transition-all duration-200 text-neutral-800 hover:text-neutral-950 shadow-xs cursor-pointer"
      >
        <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-[#FF3E00] transition-colors" />
        <span className="font-mono text-[11px] font-medium tracking-wider">
          [ABOUT / INFO]
        </span>
      </button>
    </header>
  );
}
