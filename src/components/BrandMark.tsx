import { useLanguage } from "@/context/LanguageContext";

interface BrandMarkProps {
  showSubtitle?: boolean;
  className?: string;
  isCenter?: boolean;
  centerFactor?: number; // 1 = fully centered (hero), 0 = fully left-aligned (top nav)
  collapseSecondary?: boolean;
}

export default function BrandMark({
  showSubtitle = true,
  className = "",
  isCenter = false,
  centerFactor,
  collapseSecondary = false,
}: BrandMarkProps) {
  const { t } = useLanguage();

  // Effective centering factor: 1 for centered (hero), 0 for left-aligned (navbar)
  const factor =
    centerFactor !== undefined
      ? Math.min(Math.max(centerFactor, 0), 1)
      : isCenter
      ? 1
      : 0;

  // Tagline opacity: fully visible in hero, smoothly fades out and collapses as user scrolls
  const subtitleOpacity = Math.max(0, (factor - 0.4) / 0.6);

  return (
    <div
      className={`flex flex-col select-none transition-all duration-200 ${
        factor > 0.6 ? "items-center text-center" : "items-start text-left"
      } w-fit ${className}`}
    >
      {/* Primary Dominant Name: CHAKARIN L. / BeamingMotion with Optically Balanced Symmetrical Kerning */}
      <div className="inline-flex items-center gap-2.5 sm:gap-3 whitespace-nowrap">
        <span className="font-sans text-[16px] sm:text-[18px] md:text-[21px] font-black tracking-tight text-[#121212] dark:text-[#F5F5F3] leading-none uppercase transition-colors duration-200 shrink-0">
          CHAKARIN L.
        </span>

        {/* Secondary Script: Collapses on mobile and tablet when scrolled into top nav */}
        <div
          className={`inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden transition-all duration-300 ease-out ${
            collapseSecondary
              ? "max-w-0 opacity-0 lg:max-w-[280px] lg:opacity-100"
              : "max-w-[280px] opacity-100"
          }`}
        >
          <span className="text-[#BFBFB6] dark:text-[#454543] text-[13px] sm:text-sm font-light select-none leading-none -translate-y-[0.5px] px-0.5">
            /
          </span>
          <span className="font-serif italic text-[17px] sm:text-[19px] md:text-[22px] text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] transition-colors duration-200 leading-none shrink-0">
            BeamingMotion
          </span>
        </div>
      </div>

      {/* Subtitle / Tagline: Perfectly centered in hero, cleanly vanishes when docked in sticky navbar */}
      {showSubtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            maxHeight: subtitleOpacity > 0 ? "24px" : "0px",
            marginTop: subtitleOpacity > 0 ? "6px" : "0px",
            overflow: "hidden",
            pointerEvents: subtitleOpacity > 0 ? "auto" : "none",
          }}
          className="flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.16em] text-[#737373] dark:text-[#9E9E9C] uppercase transition-all duration-200 whitespace-nowrap"
        >
          <span>{t("tagline")}</span>
        </div>
      )}
    </div>
  );
}
