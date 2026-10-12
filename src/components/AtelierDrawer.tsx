"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "./BrandMark";
import { siteProfile } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { X, Copy, Check, ExternalLink, Mail, FileText, Sun, Moon } from "lucide-react";
import { InstagramIcon, TwitterXIcon } from "./SocialIcons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface AtelierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  counts?: Record<string, number>;
}

export default function AtelierDrawer({
  isOpen,
  onClose,
  activeSection = "all",
  onSelectSection,
  counts,
}: AtelierDrawerProps) {
  const { lang, setLang, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
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

  const handleCategoryClick = (catId: string) => {
    triggerHaptic("light");
    if (onSelectSection) {
      onSelectSection(catId);
      onClose();
      setTimeout(() => {
        const anchor =
          document.getElementById("hero-filter-anchor") ||
          document.getElementById("photos-archive");
        if (anchor) {
          anchor.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 380, behavior: "smooth" });
        }
      }, 150);
    } else {
      onClose();
      window.location.href = `/?section=${catId}`;
    }
  };

  const categoryItems = [
    {
      id: "all",
      label: "ALL ARCHIVE",
      labelTh: "ผลงานทั้งหมด",
      count: counts?.all ?? 16,
    },
    {
      id: "personal",
      label: "PERSONAL PROJECTS",
      labelTh: "หัวหิน 2026 (งานส่วนตัว)",
      count: counts?.personal ?? 5,
    },
    {
      id: "tu-photo",
      label: "TU PHOTO",
      labelTh: "ครบรอบ 50 ปี 6 ตุลา",
      count: counts?.["tu-photo"] ?? 6,
    },
    {
      id: "psctu",
      label: "PSC.TU",
      labelTh: "Polsci Music (PSC.TU)",
      count: counts?.psctu ?? 5,
    },
  ];

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
            className="fixed top-0 right-0 h-full w-[88vw] sm:w-[420px] max-w-md z-50 bg-[#FFFFFF]/90 dark:bg-[#141414]/90 backdrop-blur-2xl border-l border-white/60 dark:border-white/10 text-[#121212] dark:text-[#F5F5F3] flex flex-col justify-between p-6 md:p-8 shadow-[-16px_0_48px_rgba(0,0,0,0.22)] rounded-l-2xl sm:rounded-l-3xl overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EBEBE6]/60 dark:border-[#222221]/60">
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

              {/* 1. Category / Series Filter */}
              <div className="space-y-2 font-mono">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{lang === "th" ? "หมวดภาพถ่าย" : "SERIES ARCHIVE"}]
                </div>
                <div className="flex flex-col gap-1.5">
                  {categoryItems.map((cat) => {
                    const isActive = activeSection === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        type="button"
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                          isActive
                            ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold shadow-xs"
                            : "bg-[#F7F7F5]/80 dark:bg-[#1A1A19]/80 text-[#4A4A48] dark:text-[#B5B5B0] hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-[#FF9500]" : "bg-transparent"
                            }`}
                          />
                          <span>{lang === "th" ? cat.labelTh : cat.label}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                            isActive
                              ? "bg-white/20 dark:bg-black/20 text-white dark:text-[#121212]"
                              : "bg-black/5 dark:bg-white/5 text-[#737373] dark:text-[#9E9E9C]"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Navigation Links */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2 font-mono">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{lang === "th" ? "เมนูนำทาง" : "NAVIGATION"}]
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <Link
                    href="/"
                    onClick={() => {
                      triggerHaptic("light");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#121212] dark:text-[#F5F5F3]"
                  >
                    <span>{lang === "th" ? "หน้าแรก / แกลเลอรี" : "Gallery"}</span>
                    <span className="text-[10px] text-[#737373] dark:text-[#9E9E9C]">/</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => {
                      triggerHaptic("light");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#121212] dark:text-[#F5F5F3]"
                  >
                    <span>{lang === "th" ? "เกี่ยวกับจักริน (About)" : "About Chakarin"}</span>
                    <span className="text-[10px] text-[#737373] dark:text-[#9E9E9C]">/about</span>
                  </Link>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      triggerHaptic("light");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#121212] dark:text-[#F5F5F3]"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C]" />
                      <span>{lang === "th" ? "เรซูเม่ (Resume PDF)" : "Resume (PDF)"}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#737373] dark:text-[#9E9E9C]" />
                  </a>
                </div>
              </div>

              {/* 3. Bio & Intro (Clean, Floating Typography - Left Aligned with Large Hello) */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2.5 text-left">
                <h2 className="font-serif italic text-3xl sm:text-4xl text-[#121212] dark:text-[#F5F5F3] tracking-tight text-left">
                  Hello
                </h2>
                <p className="font-sans text-xs md:text-[13px] leading-relaxed text-[#262626] dark:text-[#D4D4D0] text-left">
                  {lang === "en"
                    ? "I started taking photos because I fell in love with unposed, candid moments—people simply living their lives, rather than standing still for a countdown and posing for the lens. For me, pressing the shutter is just a way to hold onto ordinary, fleeting moments that come and go. The rest of the time is spent wandering aimlessly, observing, and trying to blend in as naturally as possible whenever I hold a camera :)"
                    : "เริ่มถ่ายรูปเพราะ ชอบจังหวะเผลอๆ เวลาคนกำลังใช้ชีวิตมากกว่าให้มายืนนับหนึ่งสองสามแล้วเก๊กใส่กล้อง ส่วนตัวแล้ว การกดชัตเตอร์ก็แค่วิธีเก็บโมเมนต์ธรรมดาๆ ที่ผ่านมาแล้วก็ผ่านไป ส่วนเวลาที่เหลือก็หมดไปกับการเดินดูนู่นดูนี่เรื่อยเปื่อย แล้วพยายามทำตัวให้กลมกลืนที่สุดเวลาถือกล้อง :)"}
                </p>
              </div>

              {/* 4. Equipment Specs */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2 font-mono text-xs">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{t("equipment")}]
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-[11px]">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("system")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium">Sony α7 III</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-[11px]">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("lens")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium">
                    FE 28-70mm OSS · FE 35mm F1.8 · Sonnar T* FE 55mm F1.8 ZA
                  </span>
                </div>
              </div>

              {/* 5. Direct Inquiries & Contact Channels */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2 font-mono text-xs">
                <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  [{t("getInTouch")}]
                </div>

                {/* Email Box */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group">
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
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
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
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
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
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[#121212] dark:text-[#F5F5F3] font-semibold text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span>Resume</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3] transition-colors" />
                </a>
              </div>
            </div>

            {/* Bottom Utility: Theme Toggle + Language Switcher */}
            <div className="pt-5 mt-6 border-t border-[#EBEBE6] dark:border-[#222221] flex items-center justify-between font-mono text-xs select-none">
              {/* Dark / Light Toggle */}
              <button
                onClick={() => {
                  triggerHaptic("light");
                  toggleTheme();
                }}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5] dark:bg-[#1C1C1B] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer text-[11px]"
              >
                {resolvedTheme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FFA000]" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#121212]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Language Switch */}
              <div className="flex items-center bg-[#F4F4F0] dark:bg-[#1C1C1B] border border-[#E5E5DF] dark:border-[#282827] rounded-full p-0.5 text-[10px]">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setLang("th");
                  }}
                  type="button"
                  className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    lang === "th"
                      ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                      : "text-[#737373] dark:text-[#9E9E9C]"
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
                  className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    lang === "en"
                      ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                      : "text-[#737373] dark:text-[#9E9E9C]"
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
