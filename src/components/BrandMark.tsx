"use client";

interface BrandMarkProps {
  showSubtitle?: boolean;
  className?: string;
}

export default function BrandMark({ showSubtitle = true, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Pure Editorial Typographic Imprint: Zero Boxes, Zero Icons */}
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-[16px] md:text-[18px] font-extrabold tracking-tight text-[#121212] leading-none">
          BeamingMotion
        </span>
        <span className="text-[#D1D1CB] text-xs">/</span>
        <span className="font-macintosh text-[20px] md:text-[22px] text-[#121212] leading-none">
          Chakarin L.
        </span>
      </div>
      {showSubtitle && (
        <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] tracking-[0.14em] text-[#737373] uppercase">
          <span>Bangkok, Thailand</span>
          <span className="text-[#D1D1CB]">·</span>
          <span>Field Notes & Photography</span>
        </div>
      )}
    </div>
  );
}
