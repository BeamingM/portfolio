"use client";

import Image from "next/image";
import { PhotoItem } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { motion } from "framer-motion";

interface ArchiveGridProps {
  items: PhotoItem[];
  onSelectPhoto: (index: number) => void;
}

export default function ArchiveGrid({ items, onSelectPhoto }: ArchiveGridProps) {
  const tilts = [-1.2, 1.0, -0.8, 1.4, -1.0, 0.6];

  const handleSelect = (index: number) => {
    triggerHaptic("snap");
    playTactileClick();
    onSelectPhoto(index);
  };

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] py-8 px-4 md:px-12 max-w-6xl mx-auto pb-28">
      {/* Header Label */}
      <div className="flex items-baseline justify-between border-b border-[#E5E5DF] pb-4 mb-8 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-xs bg-[#FF3E00]" />
          <span className="text-[#121212] font-bold tracking-wider uppercase">
            CONTACT SHEET / ARCHIVE
          </span>
          <span className="text-[#737373]">[{items.length} PRINTS]</span>
        </div>
        <span className="text-[#737373] text-[10px] hidden sm:inline">
          CLICK ANY PRINT TO VIEW IN FULL STAGE
        </span>
      </div>

      {/* Scattered Prints Grid (Light Table Aesthetic with Real Aspect Ratios) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {items.map((item, index) => {
          const tilt = tilts[index % tilts.length];
          const isPortrait = (item.height || 0) > (item.width || 0) * 1.15;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.025, rotate: 0, zIndex: 10 }}
              style={{ rotate: `${tilt}deg` }}
              onClick={() => handleSelect(index)}
              className="bg-white p-3 pb-5 rounded-xs border border-[#E5E5DF] shadow-md hover:shadow-2xl transition-shadow cursor-pointer group flex flex-col justify-between"
            >
              {/* Photo with true aspect ratio */}
              <div
                style={{
                  aspectRatio: `${item.width || (isPortrait ? 2 : 3)} / ${item.height || (isPortrait ? 3 : 2)}`,
                }}
                className="relative w-full bg-[#121212] overflow-hidden rounded-3xs"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Matting Caption */}
              <div className="mt-3 px-1 flex items-baseline justify-between font-mono text-[10px] text-[#737373]">
                <div>
                  <span className="font-sans text-[#121212] font-bold text-xs block">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[#737373]">
                    <span>{item.series}</span>
                    {item.category && (
                      <>
                        <span>·</span>
                        <span className="text-[#121212]">{item.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#121212]">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
