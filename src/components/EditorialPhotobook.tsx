"use client";

import Image from "next/image";
import { PhotoItem, gallerySections, SectionInfo } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { motion } from "framer-motion";
import InstagramEmbed from "@/components/InstagramEmbed";
import { useLanguage } from "@/context/LanguageContext";

interface EditorialPhotobookProps {
  items: PhotoItem[];
  activeSection: string;
  onSelectPhoto?: (item: PhotoItem) => void;
}

// Balance photos into columns greedily based on aspect-ratio height so both columns finish at similar heights
function splitIntoBalancedColumns(photos: PhotoItem[], colCount: number = 2) {
  const cols: PhotoItem[][] = Array.from({ length: colCount }, () => []);
  const heights = Array(colCount).fill(0);

  photos.forEach((photo) => {
    const ratio = (photo.height || 1600) / (photo.width || 2400);
    let minIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (heights[i] < heights[minIdx]) {
        minIdx = i;
      }
    }
    cols[minIdx].push(photo);
    heights[minIdx] += ratio;
  });

  return cols;
}

export default function EditorialPhotobook({
  items,
  activeSection,
  onSelectPhoto,
}: EditorialPhotobookProps) {
  const { lang, t } = useLanguage();

  const sectionsToRender =
    activeSection === "all"
      ? gallerySections.filter((s) => s.id !== "all")
      : gallerySections.filter((s) => s.id === activeSection);

  const handlePhotoClick = (photo: PhotoItem) => {
    triggerHaptic("light");
    playTactileClick();
    onSelectPhoto?.(photo);
  };

  const getSectionHeader = (sec: SectionInfo) => {
    if (lang === "th") {
      if (sec.id === "personal") {
        return { title: t("personalTitle"), desc: t("personalDesc") };
      }
      if (sec.id === "tu-photo") {
        return { title: t("tuPhotoTitle"), desc: t("tuPhotoDesc") };
      }
      if (sec.id === "psctu") {
        return { title: t("pscTuTitle"), desc: t("pscTuDesc") };
      }
    }
    return { title: sec.folderName, desc: sec.description };
  };

  const renderPhotoCard = (
    photo: PhotoItem,
    pIdx: number,
    totalCount: number,
    priority: boolean = false
  ) => {
    const isPortrait = (photo.height || 0) > (photo.width || 0) * 1.15;
    const aspectRatio = `${photo.width || (isPortrait ? 2 : 3)} / ${photo.height || (isPortrait ? 3 : 2)}`;

    return (
      <motion.article
        key={photo.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col group"
      >
        <div
          onClick={() => handlePhotoClick(photo)}
          data-figma-photo="true"
          data-photo-title={photo.title}
          data-photo-specs={`${photo.specs.camera || "Sony α7 III"} · ${photo.specs.lens || "35mm"}`}
          className="w-full relative bg-white dark:bg-[#151515] p-3 sm:p-4 md:p-5 pb-5 md:pb-6 shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-[#EBEBE6] dark:border-[#262625] group-hover:border-[#FF3E00]/70 dark:group-hover:border-[#FF5722]/70 rounded-xs cursor-pointer"
        >
          {/* Figma-Style Artboard Selection Corner Handles & Dimensions on Hover */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border border-[#FF3E00] bg-white dark:bg-[#0D0D0D] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border border-[#FF3E00] bg-white dark:bg-[#0D0D0D] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-[#FF3E00] bg-white dark:bg-[#0D0D0D] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-[#FF3E00] bg-white dark:bg-[#0D0D0D] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
          <div className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded-xs bg-[#FF3E00] text-white font-mono text-[8px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xs">
            {photo.width || 2400} × {photo.height || 1600}
          </div>

          {/* Image Container with Exact Native Aspect Ratio — Zero cropping, zero empty side padding */}
          <div
            style={{ aspectRatio }}
            className="relative w-full bg-[#121212] overflow-hidden rounded-3xs"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 680px"
              priority={priority}
              className="object-cover select-none group-hover:scale-101.5 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Editorial Caption Bar */}
          <div className="mt-3.5 px-0.5 flex flex-col gap-1.5 font-mono text-[10px] md:text-[11px] text-[#737373] dark:text-[#9E9E9C] border-t border-[#F0F0EA] dark:border-[#222221] pt-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-sans font-bold text-xs md:text-sm text-[#121212] dark:text-[#F5F5F3] tracking-tight truncate">
                  {photo.title}
                </span>
                <span className="text-[#E0E0DA] dark:text-[#3A3A39]">/</span>
                <span className="text-[#737373] dark:text-[#9E9E9C] truncate text-[11px]">{photo.series}</span>
              </div>
              {photo.category && (
                <span className="px-1.5 py-0.5 rounded-sm bg-[#F4F4F0] dark:bg-[#202020] text-[9px] text-[#555] dark:text-[#BBB] shrink-0 font-mono">
                  {photo.category}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 uppercase tracking-wider text-[10px] text-[#8C8C8C] dark:text-[#888886]">
              <span className="truncate">
                {photo.specs.camera} · {photo.specs.lens}
              </span>
              <span className="text-[#121212] dark:text-[#F5F5F3] font-semibold shrink-0">
                {photo.specs.location}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 pb-32">
      {sectionsToRender.map((section, secIdx) => {
        const sectionPhotos = items.filter((p) => p.sectionId === section.id);
        if (sectionPhotos.length === 0) return null;

        // Split photos into 2 balanced columns for tablet & desktop
        const columns = splitIntoBalancedColumns(sectionPhotos, 2);
        const { title, desc } = getSectionHeader(section);

        return (
          <section
            key={section.id}
            id={section.id}
            className="mb-24 md:mb-32 scroll-mt-24"
          >
            {/* Chapter Cover / Section Header */}
            <div className="border-b border-[#E5E5DF] dark:border-[#282827] pb-4 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] text-[#737373] dark:text-[#9E9E9C] tracking-widest uppercase mb-1">
                  <span>
                    {t("chapter")} {String(secIdx + 1).padStart(2, "0")}
                  </span>
                  <span>/</span>
                  <span>
                    {sectionPhotos.length} {t("prints")}
                  </span>
                </div>
                <h2 className="font-sans font-extrabold text-xl md:text-2xl text-[#121212] dark:text-[#F5F5F3] tracking-tight">
                  {title}
                </h2>
              </div>
              <p className="font-sans text-xs md:text-sm text-[#737373] dark:text-[#9E9E9C] max-w-md">
                {desc}
              </p>
            </div>

            {/* Featured Official Instagram Publication */}
            {section.id === "tu-photo" && (
              <div className="mb-12 w-full max-w-xl mx-auto">
                <InstagramEmbed />
              </div>
            )}

            {/* Mobile View: Sequential Single Column */}
            <div className="flex flex-col gap-6 sm:gap-8 md:hidden">
              {sectionPhotos.map((photo, pIdx) =>
                renderPhotoCard(
                  photo,
                  pIdx,
                  sectionPhotos.length,
                  secIdx === 0 && pIdx === 0
                )
              )}
            </div>

            {/* Tablet & Desktop View: Adaptive Balanced 2-Column Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Column 1 */}
              <div className="flex flex-col gap-6 lg:gap-8">
                {columns[0].map((photo, pIdx) =>
                  renderPhotoCard(
                    photo,
                    pIdx,
                    sectionPhotos.length,
                    secIdx === 0 && pIdx === 0
                  )
                )}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6 lg:gap-8">
                {columns[1].map((photo, pIdx) =>
                  renderPhotoCard(photo, pIdx, sectionPhotos.length, false)
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Editorial Colophon Footer */}
      <footer className="mt-20 pt-10 border-t border-[#E5E5DF] dark:border-[#282827] flex flex-col sm:flex-row items-baseline justify-between gap-4 text-[#737373] dark:text-[#9E9E9C] font-mono select-none">
        <div>
          <div className="font-sans font-black text-lg text-[#121212] dark:text-[#F5F5F3] tracking-tight uppercase">
            CHAKARIN L.
          </div>
          <div className="font-serif italic text-base text-[#737373] dark:text-[#9E9E9C] mt-0.5">
            BeamingMotion
          </div>
          <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] mt-2 tracking-wider uppercase">
            {t("tagline")}
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-[11px]">
          <div className="font-semibold text-[#121212] dark:text-[#F5F5F3]">
            © CHAKARIN L. 2026
          </div>
          <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider">
            {t("allRightsReserved")} · Sony α7 III
          </div>
        </div>
      </footer>
    </div>
  );
}
