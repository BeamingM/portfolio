"use client";

import { useMemo } from "react";
import { PhotoItem } from "@/config/gallery";
import { AnimatePresence } from "framer-motion";
import InstagramEmbed from "@/components/InstagramEmbed";
import InteractivePrintCard from "@/components/InteractivePrintCard";
import { Mail, FileText } from "lucide-react";
import { Twitter, Instagram } from "@/components/SocialIcons";

interface EditorialPhotobookProps {
  items: PhotoItem[];
  activeSection: string;
  onSelectPhoto?: (item: PhotoItem) => void;
  onResetLensFilter?: () => void;
}

const INTERLEAVED_COLLAGE_KEYS = [
  "personal-01",    // Hua Hin Coastline (Landscape)
  "tu-oct6-01",     // October 6 Candlelight (Landscape)
  "psctu-music-01",  // Stage Singer (Portrait)
  "personal-02",    // Pier Shadows (Portrait)
  "tu-oct6-02",     // Thammasat Gathering (Landscape)
  "psctu-music-02",  // Electric Riff (Landscape)
  "tu-oct6-04",     // Student Movement (Portrait)
  "personal-03",    // Coastal Light Study (Portrait)
  "psctu-music-03",  // Stage Lighting (Landscape)
  "tu-oct6-03",     // Silent Reflection (Landscape)
  "personal-04",    // Ocean Horizon (Portrait)
  "psctu-music-04",  // Live Sound Atmosphere (Landscape)
  "tu-oct6-05",     // Historic Wall (Portrait)
  "personal-05",    // Fisherman Geometry (Landscape)
  "psctu-music-05",  // Closing Encore (Landscape)
  "tu-oct6-06",     // Memorial Flowers (Landscape)
];

export default function EditorialPhotobook({
  items,
  activeSection,
  onSelectPhoto,
}: EditorialPhotobookProps) {
  // Sort and filter photos dynamically
  const filteredPhotos = useMemo(() => {
    if (activeSection === "all") {
      const itemMap = new Map(items.map((it) => [it.id, it]));
      const ordered: PhotoItem[] = [];
      INTERLEAVED_COLLAGE_KEYS.forEach((key) => {
        const found = itemMap.get(key);
        if (found) {
          ordered.push(found);
          itemMap.delete(key);
        }
      });
      itemMap.forEach((val) => ordered.push(val));
      return ordered;
    }
    return items.filter((p) => p.sectionId === activeSection);
  }, [items, activeSection]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-4 pb-28">
      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="py-24 text-center font-mono text-xs text-[#737373] dark:text-[#9E9E9C] flex flex-col items-center gap-3">
          <p>No documentary prints in this archive view.</p>
        </div>
      )}

      {/* Dynamic Masonry Collage Feed with 3D Glossy Prints & Deep Museum Shadows */}
      <div className="columns-1 md:columns-2 gap-6 lg:gap-8 [column-fill:_balance]">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, pIdx) => (
            <div
              key={photo.id}
              className="break-inside-avoid mb-6 lg:mb-8"
            >
              <InteractivePrintCard
                photo={photo}
                priority={pIdx < 2}
                onClick={() => onSelectPhoto?.(photo)}
              />
            </div>
          ))}

          {/* Featured Instagram Publication Tile */}
          {(activeSection === "all" || activeSection === "tu-photo") && (
            <div
              key="tu-photo-official-embed"
              className="break-inside-avoid mb-6 lg:mb-8"
            >
              <InstagramEmbed />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Editorial Colophon Footer */}
      <footer className="mt-20 pt-10 border-t border-[#E5E5DF] dark:border-[#282827] flex flex-col md:flex-row items-start md:items-baseline justify-between gap-6 text-[#737373] dark:text-[#9E9E9C] font-mono select-none">
        <div>
          <div className="font-sans font-black text-lg text-[#121212] dark:text-[#F5F5F3] tracking-tight uppercase">
            CHAKARIN L.
          </div>
          <div className="font-serif italic text-base text-[#737373] dark:text-[#9E9E9C] mt-0.5">
            BeamingMotion
          </div>
          <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] mt-2 tracking-wider uppercase">
            Photographer based in Bangkok · Thammasat University
          </div>

          {/* Social & Contact Direct Links */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-sans">
            <a
              href="https://x.com/beamingmotion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </a>
            <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
            <a
              href="https://www.instagram.com/beamingmotion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
            <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
            <a
              href="mailto:contact.chakarin@gmail.com"
              className="flex items-center gap-1.5 text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
              title="Send an email to Chakarin"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-[11px]">
          <div className="font-semibold text-[#121212] dark:text-[#F5F5F3]">
            chakarin.pics
          </div>
          <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider">
            © CHAKARIN L. 2026 · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
