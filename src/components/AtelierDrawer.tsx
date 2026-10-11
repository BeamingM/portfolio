"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "./BrandMark";
import { siteProfile } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { playTactileClick } from "@/utils/sound";
import { X, Copy, Check, ExternalLink, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AtelierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AtelierDrawer({ isOpen, onClose }: AtelierDrawerProps) {
  const { lang, setLang, t } = useLanguage();
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
            className="fixed inset-0 z-50 bg-[#121212]/40 dark:bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-over Clean Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#FFFFFF] dark:bg-[#141414] border-l border-[#E5E5DF] dark:border-[#282827] text-[#121212] dark:text-[#F5F5F3] flex flex-col justify-between p-6 md:p-8 shadow-2xl overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EBEBE6] dark:border-[#222221]">
                <BrandMark showSubtitle={true} />
                <button
                  onClick={handleClose}
                  type="button"
                  className="p-2 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5] dark:bg-[#1E1E1D] hover:bg-[#121212] dark:hover:bg-[#F5F5F3] hover:text-white dark:hover:text-[#121212] transition-colors cursor-pointer"
                  aria-label="Close profile panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bio & Documentary Philosophy */}
              <div className="mt-7 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
                  <span className="font-mono text-[10px] tracking-wider text-[#737373] dark:text-[#9E9E9C] uppercase font-semibold">
                    {t("tagline")}
                  </span>
                </div>

                <p className="font-sans text-sm md:text-base leading-relaxed text-[#262626] dark:text-[#D4D4D0]">
                  {lang === "en" ? siteProfile.bio.en : siteProfile.bio.th}
                </p>

                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#737373] dark:text-[#9E9E9C]">
                  <span className="px-2 py-0.5 rounded-full bg-[#F4F4F0] dark:bg-[#202020] text-[#121212] dark:text-[#F5F5F3] font-medium">
                    {siteProfile.location}
                  </span>
                </div>
              </div>

              {/* Working Tools / Gear */}
              <div className="mt-8 pt-6 border-t border-[#EBEBE6] dark:border-[#222221] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{t("equipment")}]
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-[11px]">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("system")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium">{siteProfile.gear.system}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-[11px]">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("lens")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium">{siteProfile.gear.lenses.join(" · ")}</span>
                </div>
              </div>

              {/* Direct Inquiries & Contact */}
              <div className="mt-8 pt-6 border-t border-[#EBEBE6] dark:border-[#222221] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{t("getInTouch")}]
                </div>

                {/* Email Box (Direct Mailto Link + Copy Action) */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group">
                  <a
                    href={`mailto:${siteProfile.contact.email}`}
                    onClick={() => {
                      triggerHaptic("light");
                      playTactileClick();
                    }}
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px] group-hover:text-[#FF3E00] dark:group-hover:text-[#FF5722] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF3E00] dark:group-hover:text-[#FF5722] transition-colors" />
                    <span className="truncate">{siteProfile.contact.email}</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopyEmail();
                    }}
                    type="button"
                    title={copied ? "Copied" : "Copy email address"}
                    className="flex items-center gap-1.5 pl-2 text-[10px] text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FF3E00]" />
                        <span className="text-[#FF3E00] font-bold">[{t("copied")}]</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>[{t("copy")}]</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instagram Link */}
                <a
                  href={siteProfile.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px]">
                    @{siteProfile.contact.instagram}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3]">
                    <span>INSTAGRAM</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </div>

            {/* Language Switcher & Colophon */}
            <div className="pt-6 border-t border-[#EBEBE6] dark:border-[#222221] flex items-center justify-between font-mono text-[10px] text-[#737373] dark:text-[#9E9E9C] select-none">
              <div>© CHAKARIN L. 2026</div>
              <div className="flex items-center gap-1 bg-[#F4F4F0] dark:bg-[#1C1C1B] border border-[#E5E5DF] dark:border-[#282827] rounded-md p-0.5">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    playTactileClick();
                    setLang("th");
                  }}
                  type="button"
                  className={`px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${
                    lang === "th" ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold" : "text-[#737373] dark:text-[#9E9E9C]"
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
                    lang === "en" ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold" : "text-[#737373] dark:text-[#9E9E9C]"
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
