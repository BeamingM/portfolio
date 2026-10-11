import { useLanguage } from "@/context/LanguageContext";

interface BrandMarkProps {
  showSubtitle?: boolean;
  className?: string;
  isCenter?: boolean;
}

export default function BrandMark({
  showSubtitle = true,
  className = "",
  isCenter = false,
}: BrandMarkProps) {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-col select-none ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}>
      {/* Primary Dominant Name: CHAKARIN L. */}
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-[17px] md:text-[20px] font-black tracking-tight text-[#121212] leading-none uppercase">
          CHAKARIN L.
        </span>
        <span className="text-[#D1D1CB] text-xs">/</span>
        <span className="font-macintosh text-[19px] md:text-[21px] text-[#737373] hover:text-[#121212] transition-colors leading-none">
          BeamingMotion
        </span>
      </div>

      {showSubtitle && (
        <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] md:text-[10px] tracking-[0.14em] text-[#737373] uppercase">
          <span>{t("tagline")}</span>
        </div>
      )}
    </div>
  );
}
