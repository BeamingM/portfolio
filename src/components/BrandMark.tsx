"use client";

interface BrandMarkProps {
  showSubtitle?: boolean;
  className?: string;
}

export default function BrandMark({ showSubtitle = true, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Vermilion Artist Hankō Stamp (Inspired by Bill Guo / Japanese Art Seals) */}
      <div className="relative w-8 h-8 rounded-xs bg-[#D9381E] flex items-center justify-center shadow-xs overflow-hidden border border-[#B32612]/30 transition-transform active:scale-95 cursor-pointer group">
        {/* Subtle stamped texture overlay */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
        <span className="font-serif text-[13px] font-bold tracking-tighter text-[#FFFDF9] select-none leading-none pt-0.5">
          CL
        </span>
        {/* Tiny corner ink bleeds */}
        <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-[#FBFBF9] rounded-full" />
      </div>

      {/* Bespoke Editorial Typographic Wordmark (Strictly No Camera Icons) */}
      <div className="flex flex-col">
        <span className="font-serif text-[15px] md:text-[17px] font-medium tracking-[0.18em] text-[#121212] uppercase leading-none">
          CHAKARIN L.
        </span>
        {showSubtitle && (
          <span className="font-mono text-[9px] tracking-[0.24em] text-[#737373] uppercase mt-1">
            Bangkok · Fine Art
          </span>
        )}
      </div>
    </div>
  );
}
