"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "./BrandMark";
import { siteProfile } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { X, Copy, Check, ExternalLink, Mail, FileText } from "lucide-react";
import { InstagramIcon, TwitterXIcon } from "./SocialIcons";
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Frosted Glass Backdrop with Rich Bokeh Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/35 dark:bg-black/60 backdrop-blur-md cursor-pointer transition-opacity"
            aria-label="Close drawer backdrop"
          />

          {/* Chic Floating Frosted Glass Panel (Breathable 88vw on mobile, never suffocating) */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 h-full w-[88vw] sm:w-[420px] max-w-md z-50 bg-[#FFFFFF]/85 dark:bg-[#141414]/85 backdrop-blur-2xl border-l border-white/60 dark:border-white/10 text-[#121212] dark:text-[#F5F5F3] flex flex-col justify-between p-6 md:p-8 shadow-[-16px_0_48px_rgba(0,0,0,0.22)] rounded-l-2xl sm:rounded-l-3xl overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EBEBE6]/60 dark:border-[#222221]/60">
                <BrandMark showSubtitle={false} />
                <button
                  onClick={handleClose}
                  type="button"
                  className="p-2 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5]/80 dark:bg-[#1E1E1D]/80 hover:bg-[#121212] dark:hover:bg-[#F5F5F3] hover:text-white dark:hover:text-[#121212] transition-colors cursor-pointer"
                  aria-label="Close profile panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bio & Intro (Clean, Floating Typography - Left Aligned with Large Hello) */}
              <div className="mt-8 space-y-3 text-left">
                <h2 className="font-serif italic text-3xl sm:text-4xl text-[#121212] dark:text-[#F5F5F3] tracking-tight text-left">
                  Hello
                </h2>
                <p className="font-sans text-sm md:text-[15px] leading-relaxed text-[#262626] dark:text-[#D4D4D0] text-left">
                  {lang === "en"
                    ? "I started taking photos because I fell in love with unposed, candid moments—people simply living their lives, rather than standing still for a countdown and posing for the lens. For me, pressing the shutter is just a way to hold onto ordinary, fleeting moments that come and go. The rest of the time is spent wandering aimlessly, observing, and trying to blend in as naturally as possible whenever I hold a camera :)"
                    : "เริ่มถ่ายรูปเพราะ ชอบจังหวะเผลอๆ เวลาคนกำลังใช้ชีวิตมากกว่าให้มายืนนับหนึ่งสองสามแล้วเก๊กใส่กล้อง ส่วนตัวแล้ว การกดชัตเตอร์ก็แค่วิธีเก็บโมเมนต์ธรรมดาๆ ที่ผ่านมาแล้วก็ผ่านไป ส่วนเวลาที่เหลือก็หมดไปกับการเดินดูนู่นดูนี่เรื่อยเปื่อย แล้วพยายามทำตัวให้กลมกลืนที่สุดเวลาถือกล้อง :)"}
                </p>
              </div>

              {/* Working Tools / Gear */}
              <div className="mt-7 pt-5 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2.5 font-mono text-xs">
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

              {/* Direct Inquiries & Contact Channels */}
              <div className="mt-7 pt-5 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2.5 font-mono text-xs">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{t("getInTouch")}]
                </div>

                {/* Email Box */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group">
                  <a
                    href="mailto:contact.chakarin@gmail.com"
                    onClick={() => triggerHaptic("light")}
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span className="truncate">contact.chakarin@gmail.com</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopyEmail();
                    }}
                    type="button"
                    title={copied ? "Copied" : "Copy email address"}
                    className="p-1 text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] cursor-pointer shrink-0 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#FF9500] dark:text-[#FFA000]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Twitter / X Link */}
                <a
                  href="https://x.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px]">
                    <TwitterXIcon className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000]" />
                    <span>@beamingmotion</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3]">
                    <span>TWITTER / X</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>

                {/* Instagram Link */}
                <a
                  href={siteProfile.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px]">
                    <InstagramIcon className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000]" />
                    <span>@{siteProfile.contact.instagram}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3]">
                    <span>INSTAGRAM</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>

                {/* Curriculum Vitae / Resume Link */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span>Resume</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3] transition-colors" />
                </a>
              </div>
            </div>

            {/* Footer / Language Switcher */}
            <div className="pt-6 border-t border-[#EBEBE6] dark:border-[#222221] flex items-center justify-between font-mono text-[10px] text-[#737373] dark:text-[#9E9E9C] select-none">
              <div>chakarin.pics · 2026</div>
              <div className="flex items-center gap-1 bg-[#F4F4F0] dark:bg-[#1C1C1B] border border-[#E5E5DF] dark:border-[#282827] rounded-md p-0.5">
                <button
                  onClick={() => {
                    triggerHaptic("light");
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
