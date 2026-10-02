"use client";

import { PhotoItem, siteProfile } from "@/config/gallery";

interface HudFooterProps {
  currentIndex: number;
  total: number;
  currentPhoto: PhotoItem;
  onSelectIndex: (index: number) => void;
}

export default function HudFooter({
  currentIndex,
  total,
  currentPhoto,
  onSelectIndex,
}: HudFooterProps) {
  const specs = currentPhoto?.specs || {};

  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 h-12 bg-[#FBFBF9]/90 backdrop-blur-md border-t border-[#E5E5DF] flex items-center justify-between px-4 md:px-8 select-none font-mono text-[11px]">
      {/* Left: Frame Indexing & Mechanical Scrubber */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#121212] font-semibold">
          <span className="text-[#FF3E00]">■</span>
          <span>
            [FRAME {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}]
          </span>
        </div>

        {/* Scrubber Ticks (1 to N) */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E5E5DF]">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => onSelectIndex(i)}
              type="button"
              className={`w-4 h-4 text-center text-[10px] font-mono transition-colors cursor-pointer rounded-2xs ${
                currentIndex === i
                  ? "bg-[#121212] text-[#FBFBF9] font-bold"
                  : "text-[#737373] hover:bg-[#E5E5DF]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Scrollytelling Kinetic Prompt */}
      <div className="hidden lg:flex items-center gap-2 text-[#737373] tracking-widest text-[10px]">
        <span>[ SCROLL TO SCRUB TIMELINE ↓ ]</span>
      </div>

      {/* Right: EXIF Spec Readout & Coordinate Anchor */}
      <div className="flex items-center gap-3 text-[#737373]">
        <div className="hidden md:flex items-center gap-1.5">
          {specs.camera && <span className="text-[#121212] font-semibold">{specs.camera}</span>}
          {specs.lens && (
            <>
              <span className="text-neutral-300">·</span>
              <span>{specs.lens}</span>
            </>
          )}
          {specs.aperture && (
            <>
              <span className="text-neutral-300">·</span>
              <span>{specs.aperture}</span>
            </>
          )}
          {specs.shutter && (
            <>
              <span className="text-neutral-300">·</span>
              <span>{specs.shutter}</span>
            </>
          )}
          {specs.iso && (
            <>
              <span className="text-neutral-300">·</span>
              <span>{specs.iso}</span>
            </>
          )}
          <span className="text-neutral-300">·</span>
          <span className="text-[#737373] uppercase">{siteProfile.coordinates}</span>
        </div>

        <div className="md:hidden text-[#121212] font-semibold">
          {specs.camera || "CAMERA"} · {specs.aperture || "SPEC"}
        </div>

        {/* Instagram External Link */}
        <a
          href={siteProfile.contact.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden xl:inline border-l border-[#E5E5DF] pl-3 text-[#121212] hover:text-[#FF3E00] transition-colors"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
