"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteProfile } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import BrandMark from "./BrandMark";
import { X, Copy, Check, ExternalLink } from "lucide-react";

interface AtelierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AtelierDrawer({ isOpen, onClose }: AtelierDrawerProps) {
  const [lang, setLang] = useState<"en" | "th">("th");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteProfile.contact.email);
    triggerHaptic("success");
    playTactileClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleClose = () => {
    triggerHaptic("light");
    playTactileClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-[#121212]/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-over Clean Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#FFFFFF] border-l border-[#E5E5DF] text-[#121212] flex flex-col justify-between p-6 md:p-8 shadow-2xl overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EBEBE6]">
                <BrandMark showSubtitle={true} />
                <button
                  onClick={handleClose}
                  type="button"
                  className="p-2 rounded-full border border-[#E5E5DF] bg-[#F7F7F5] hover:bg-[#121212] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close profile panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bio & Documentary Philosophy */}
              <div className="mt-7 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
                  <span className="font-mono text-[10px] tracking-wider text-[#737373] uppercase font-semibold">
                    PHOTOGRAPHY & FIELD NOTES
                  </span>
                </div>

                <p className="font-sans text-sm md:text-base leading-relaxed text-[#262626]">
                  {lang === "en" ? siteProfile.bio.en : siteProfile.bio.th}
                </p>

                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#737373]">
                  <span className="px-2 py-0.5 rounded-full bg-[#F4F4F0] text-[#121212] font-medium">
                    {siteProfile.location}
                  </span>
                  <span>{siteProfile.coordinates}</span>
                </div>
              </div>

              {/* Working Tools / Real Gear */}
              <div className="mt-8 pt-6 border-t border-[#EBEBE6] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                  [EQUIPMENT & ARCHIVE]
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] text-[11px]">
                  <span className="text-[#737373]">SYSTEM</span>
                  <span className="text-[#121212] font-medium">{siteProfile.gear.system}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] text-[11px]">
                  <span className="text-[#737373]">OPTICS</span>
                  <span className="text-[#121212] font-medium">{siteProfile.gear.optics.join(" · ")}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] text-[11px]">
                  <span className="text-[#737373]">SOURCE</span>
                  <span className="text-[#121212] font-medium">{siteProfile.gear.archive}</span>
                </div>
              </div>

              {/* Direct Inquiries & Contact */}
              <div className="mt-8 pt-6 border-t border-[#EBEBE6] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                  [GET IN TOUCH / COMMISSIONS]
                </div>

                {/* Email Box */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] bg-[#FBFBF9]">
                  <span className="text-[#121212] font-semibold text-[11px]">
                    {siteProfile.contact.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="flex items-center gap-1.5 text-[10px] text-[#737373] hover:text-[#121212] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FF3E00]" />
                        <span className="text-[#FF3E00] font-bold">[COPIED]</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>[COPY]</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instagram Link */}
                <a
                  href={siteProfile.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] bg-[#FBFBF9] hover:border-[#121212] transition-colors group cursor-pointer"
                >
                  <span className="text-[#121212] font-semibold text-[11px]">
                    @{siteProfile.contact.instagram}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#737373] group-hover:text-[#121212]">
                    <span>INSTAGRAM</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </div>

            {/* Language Switcher & Colophon */}
            <div className="pt-6 border-t border-[#EBEBE6] flex items-center justify-between font-mono text-[10px] text-[#737373] select-none">
              <div>© CHAKARIN L. 2026</div>
              <div className="flex items-center gap-1 bg-[#F4F4F0] border border-[#E5E5DF] rounded-md p-0.5">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    playTactileClick();
                    setLang("th");
                  }}
                  type="button"
                  className={`px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${
                    lang === "th" ? "bg-[#121212] text-white font-bold" : "text-[#737373]"
                  }`}
                >
                  TH
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    playTactileClick();
                    setLang("en");
                  }}
                  type="button"
                  className={`px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${
                    lang === "en" ? "bg-[#121212] text-white font-bold" : "text-[#737373]"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
