"use client";

import { PhotoItem } from "@/config/gallery";

interface HudFooterProps {
  currentIndex: number;
  total: number;
  currentPhoto: PhotoItem;
}

export default function HudFooter({
  currentIndex,
  total,
  currentPhoto,
}: HudFooterProps) {
  const specs = currentPhoto?.specs || {};

  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 px-5 py-4 md:px-8 md:py-6 flex items-end justify-between text-xs tracking-wider select-none font-mono pointer-events-none">
      {/* Frame Counter Badge */}
      <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-sm border border-neutral-300 bg-white/70 backdrop-blur-sm shadow-xs text-neutral-800">
        <span className="text-[10px] text-neutral-400 uppercase">FRAME</span>
        <span className="tabular-nums font-semibold">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-neutral-400">/</span>
        <span className="tabular-nums text-neutral-500">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Camera Technical Spec Badge */}
      <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3 py-1.5 rounded-sm border border-neutral-300 bg-white/70 backdrop-blur-sm shadow-xs text-neutral-700 text-[11px]">
        {specs.camera && (
          <span className="font-semibold text-neutral-900">{specs.camera}</span>
        )}
        {specs.lens && (
          <>
            <span className="text-neutral-300">·</span>
            <span>{specs.lens}</span>
          </>
        )}
        {specs.aperture && (
          <>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-900 font-medium">{specs.aperture}</span>
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
            <span className="text-neutral-500">{specs.iso}</span>
          </>
        )}
        {specs.location && (
          <>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-400 uppercase">{specs.location}</span>
          </>
        )}
      </div>

      {/* Mobile Spec Summary */}
      <div className="pointer-events-auto md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-neutral-300 bg-white/70 backdrop-blur-sm shadow-xs text-neutral-700 text-[10px]">
        <span>{specs.camera || "CAMERA"}</span>
        <span className="text-neutral-300">·</span>
        <span>{specs.aperture || "SPEC"}</span>
      </div>
    </footer>
  );
}
