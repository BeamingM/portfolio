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

  return (
    <div className={`flex flex-col select-none items-start text-left w-fit ${className}`}>
      {/* Primary Dominant Name: CHAKARIN L. */}
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-sans text-[16px] sm:text-[17px] md:text-[20px] font-black tracking-tight text-[#121212] dark:text-[#F5F5F3] leading-none uppercase transition-colors duration-200 shrink-0">
          CHAKARIN L.
        </span>

        {/* Secondary Script: Collapses on mobile and tablet when scrolled into top nav */}
        <span
          className={`inline-flex items-baseline gap-2 overflow-hidden transition-all duration-300 ease-out ${
            collapseSecondary
              ? "max-w-0 opacity-0 lg:max-w-[240px] lg:opacity-100"
              : "max-w-[240px] opacity-100"
          }`}
        >
          <span className="text-[#D1D1CB] dark:text-[#383837] text-xs transition-colors duration-200">
            /
          </span>
          <span className="font-serif italic text-[17px] md:text-[20px] text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] transition-colors duration-200 leading-none">
            BeamingMotion
          </span>
        </span>
      </div>

      {showSubtitle && (
        <div
          style={
            factor > 0
              ? {
                  position: "relative",
                  left: `${factor * 50}%`,
                  transform: `translateX(-${factor * 50}%)`,
                }
              : undefined
          }
          className={`flex items-center gap-1.5 mt-1 font-mono text-[9px] md:text-[10px] tracking-[0.14em] text-[#737373] dark:text-[#9E9E9C] uppercase transition-all duration-300 whitespace-nowrap ${
            collapseSecondary
              ? "max-h-0 opacity-0 overflow-hidden md:max-h-6 md:opacity-100 md:overflow-visible"
              : "max-h-6 opacity-100"
          }`}
        >
          <span>{t("tagline")}</span>
        </div>
      )}
    </div>
  );
}
