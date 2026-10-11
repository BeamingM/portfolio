"use client";

import { SectionInfo } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();

  const getSectionTitle = (sec: SectionInfo) => {
    if (sec.id === "all") return t("navAll");
    if (sec.id === "personal") return t("navPersonal");
    if (sec.id === "tu-photo") return t("navTuPhoto");
    if (sec.id === "psctu") return t("navPscTu");
    return sec.folderName;
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-1.5 z-30 select-none">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
        {/* Single Toolbar: Project Section Filter Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#F4F4F0] dark:bg-[#1A1A19] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full overflow-x-auto no-scrollbar max-w-full shadow-2xs">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const count = counts[section.id] ?? 0;
            const label = getSectionTitle(section);

            return (
              <button
                key={section.id}
                onClick={() => {
                  triggerHaptic("light");
                  onSelectSection(section.id);
                }}
                type="button"
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-mono tracking-wider transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold shadow-xs"
                    : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] hover:bg-white/70 dark:hover:bg-[#282827]"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 dark:bg-black/20 text-white dark:text-[#121212]"
                      : "text-[#A0A09A] dark:text-[#666]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
