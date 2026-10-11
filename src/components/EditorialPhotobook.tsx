"use client";

import { useRef } from "react";
import Image from "next/image";
import { PhotoItem, gallerySections } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { motion } from "framer-motion";
import InstagramEmbed from "@/components/InstagramEmbed";

interface EditorialPhotobookProps {
  items: PhotoItem[];
  activeSection: string;
  onSelectPhoto?: (item: PhotoItem) => void;
}

export default function EditorialPhotobook({
  items,
  activeSection,
  onSelectPhoto,
}: EditorialPhotobookProps) {
  const sectionsToRender =
    activeSection === "all"
      ? gallerySections.filter((s) => s.id !== "all")
      : gallerySections.filter((s) => s.id === activeSection);

  const handlePhotoClick = (item: PhotoItem) => {
    triggerHaptic("light");
    playTactileClick();
    onSelectPhoto?.(item);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 pb-32">
      {sectionsToRender.map((section, secIdx) => {
        const sectionPhotos = items.filter((p) => p.sectionId === section.id);
        if (sectionPhotos.length === 0) return null;

        return (
          <section
            key={section.id}
            id={section.id}
            className="mb-24 md:mb-32 scroll-mt-24"
          >
            {/* Chapter Cover / Section Header */}
            <div className="border-b border-[#E5E5DF] pb-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] text-[#737373] tracking-widest uppercase mb-1">
                  <span>CHAPTER {String(secIdx + 1).padStart(2, "0")}</span>
                  <span>/</span>
                  <span>{sectionPhotos.length} PRINTS</span>
                </div>
                <h2 className="font-sans font-extrabold text-xl md:text-2xl text-[#121212] tracking-tight">
                  {section.folderName}
                </h2>
              </div>
              <p className="font-sans text-xs md:text-sm text-[#737373] max-w-md">
                {section.description}
              </p>
            </div>

            {/* Featured Official Instagram Publication */}
            {section.id === "tu-photo" && <InstagramEmbed />}

            {/* Vertical Flow of Photobook Plates */}
            <div className="space-y-16 md:space-y-24">
              {sectionPhotos.map((photo, pIdx) => {
                const isPortrait = (photo.height || 0) > (photo.width || 0) * 1.15;

                return (
                  <motion.article
                    key={photo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center group"
                  >
                    {/* Photobook Exhibition Plate */}
                    <div
                      onClick={() => handlePhotoClick(photo)}
                      className={`relative bg-white p-3 md:p-5 pb-6 md:pb-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#EBEBE6] rounded-xs cursor-pointer ${
                        isPortrait
                          ? "w-full max-w-md md:max-w-lg"
                          : "w-full max-w-3xl md:max-w-4xl"
                      }`}
                    >
                      {/* Image Container with Exact Native Aspect Ratio */}
                      <div
                        style={{
                          aspectRatio: `${photo.width || (isPortrait ? 2 : 3)} / ${photo.height || (isPortrait ? 3 : 2)}`,
                        }}
                        className="relative w-full bg-[#121212] overflow-hidden rounded-3xs"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 1200px"
                          priority={secIdx === 0 && pIdx === 0}
                          className="object-cover select-none group-hover:scale-101.5 transition-transform duration-700 ease-out"
                        />
                      </div>

                      {/* Editorial Matting Caption Below Image */}
                      <div className="mt-4 px-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 font-mono text-[10px] md:text-[11px] text-[#737373] border-t border-[#F0F0EA] pt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-bold text-xs md:text-sm text-[#121212] tracking-tight">
                            {photo.title}
                          </span>
                          <span className="text-[#E0E0DA]">/</span>
                          <span className="text-[#737373]">{photo.series}</span>
                          {photo.category && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-[#F4F4F0] text-[9px] text-[#555]">
                              {photo.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 uppercase tracking-wider text-[10px]">
                          <span>
                            {photo.specs.camera} · {photo.specs.lens}
                          </span>
                          <span className="text-[#E0E0DA]">·</span>
                          <span>{photo.specs.location}</span>
                          <span className="text-[#E0E0DA]">·</span>
                          <span className="text-[#121212] font-bold">
                            {String(pIdx + 1).padStart(2, "0")} / {String(sectionPhotos.length).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Editorial Colophon Footer */}
      <footer className="mt-20 pt-10 border-t border-[#E5E5DF] flex flex-col sm:flex-row items-baseline justify-between gap-4 text-[#737373] font-mono select-none">
        <div>
          <div className="font-sans font-black text-lg text-[#121212] tracking-tight uppercase">
            CHAKARIN L.
          </div>
          <div className="font-macintosh text-base text-[#737373] mt-0.5">
            BeamingMotion
          </div>
          <div className="text-[10px] text-[#737373] mt-2 tracking-wider uppercase">
            Street & Documentary Photography · Bangkok, Thailand
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-[11px]">
          <div className="font-semibold text-[#121212]">
            © CHAKARIN L. 2026
          </div>
          <div className="text-[10px] text-[#737373] uppercase tracking-wider">
            All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
