"use client";

import { SectionInfo } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";

interface SectionFilterBarProps {
  sections: SectionInfo[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  counts: Record<string, number>;
}

export default function SectionFilterBar({
  sections,
  activeSection,
  onSelectSection,
  counts,
}: SectionFilterBarProps) {
  return (
    <div className="w-full flex items-center justify-center px-4 py-2.5 z-30 select-none">
      <div className="flex items-center gap-1.5 p-1 bg-[#F4F4F0] border border-[#E5E5DF] rounded-full overflow-x-auto no-scrollbar max-w-full shadow-2xs">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const count = counts[section.id] ?? 0;

          return (
            <button
              key={section.id}
              onClick={() => {
                triggerHaptic("light");
                playTactileClick();
                onSelectSection(section.id);
              }}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-mono tracking-wider transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#121212] text-white font-bold shadow-xs"
                  : "text-[#737373] hover:text-[#121212] hover:bg-white/70"
              }`}
            >
              <span>{section.folderName}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "text-[#A0A09A]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
