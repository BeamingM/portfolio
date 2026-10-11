"use client";

interface BrandMarkProps {
  showSubtitle?: boolean;
  className?: string;
}

export default function BrandMark({ showSubtitle = true, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Monogram Icon with Macintosh Skeletal Script */}
      <div className="relative w-8 h-8 rounded-lg bg-[#121212] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer group">
        <span className="font-macintosh text-[17px] text-white leading-none pt-0.5">
          CL
        </span>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
      </div>

      {/* Dual Typographic Lockup: Bold Modern Sans + Apple Macintosh Cursive Calligraphy */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-[15px] md:text-[17px] font-extrabold tracking-[-0.03em] text-[#121212] leading-none">
            BeamingMotion
          </span>
          <span className="text-[#D1D1CB] text-xs">·</span>
          <span className="font-macintosh text-[19px] md:text-[21px] text-[#121212] leading-none">
            Chakarin L.
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] tracking-[0.12em] text-[#737373] uppercase">
            <span>Bangkok</span>
            <span className="text-[#D1D1CB]">/</span>
            <span>Observational Photography</span>
          </div>
        )}
      </div>
    </div>
  );
}
