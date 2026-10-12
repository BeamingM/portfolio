"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "./BrandMark";
import { siteProfile, galleryItems } from "@/config/gallery";
import { triggerHaptic } from "@/utils/haptics";
import { trackContactReveal } from "@/utils/analytics";
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
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute dynamic fallback counts from galleryItems
  const effectiveCounts = counts ?? {
    all: galleryItems.length,
    personal: galleryItems.filter((i) => i.sectionId === "personal").length,
    "tu-photo": galleryItems.filter((i) => i.sectionId === "tu-photo").length,
    psctu: galleryItems.filter((i) => i.sectionId === "psctu").length,
  };

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Handle Escape key dismissal and Tab focus trap for WCAG 2.2 AA compliance
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        triggerHaptic("light");
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const drawer = document.querySelector('[role="dialog"][aria-label="Profile and menu drawer"]');
        if (!drawer) return;
        const focusable = drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRevealAndCopyEmail = () => {
    setIsEmailRevealed(true);
    navigator.clipboard.writeText(siteProfile.contact.email);
    triggerHaptic("success");
    setCopied(true);
    trackContactReveal("atelier_drawer", "email");
    setTimeout(() => setCopied(false), 2400);
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
          document.getElementById("photos-archive") ||
          document.getElementById("hero-filter-anchor");
        if (anchor) {
          anchor.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 380, behavior: "smooth" });
        }
      }, 150);
    } else {
      onClose();
      router.push(catId === "all" ? "/" : `/?section=${catId}`);
    }
  };

  const categoryItems = [
    {
      id: "all",
      label: "ALL ARCHIVE",
      labelTh: "ทั้งหมด",
      count: effectiveCounts.all,
    },
    {
      id: "personal",
      label: "PERSONAL PROJECTS",
      labelTh: "ส่วนตัว",
      count: effectiveCounts.personal,
    },
    {
      id: "tu-photo",
      label: "TU PHOTO",
      labelTh: "กิจกรรม",
      count: effectiveCounts["tu-photo"],
    },
    {
      id: "psctu",
      label: "PSC.TU",
      labelTh: "อื่นๆ",
      count: effectiveCounts.psctu,
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
            className="fixed inset-0 z-[60] bg-black/35 dark:bg-black/60 backdrop-blur-md cursor-pointer transition-opacity"
            aria-label="Close drawer backdrop"
          />

          {/* Chic Floating Frosted Glass Panel (Breathable 88vw on mobile, never suffocating) */}
          <motion.aside
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Profile and menu drawer for จักริน ลิ้มป์อุดม"
            className="fixed top-0 right-0 h-full w-[88vw] sm:w-[420px] max-w-md z-[60] bg-[#FFFFFF]/90 dark:bg-[#141414]/90 backdrop-blur-2xl border-l border-white/60 dark:border-white/10 text-[#121212] dark:text-[#F5F5F3] flex flex-col justify-between p-6 md:p-8 shadow-[-16px_0_48px_rgba(0,0,0,0.22)] rounded-l-2xl sm:rounded-l-3xl overflow-y-auto overscroll-contain"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EBEBE6]/60 dark:border-[#222221]/60">
                <BrandMark showSubtitle={false} collapseSecondary={true} />
                <button
                  onClick={handleClose}
                  type="button"
                  className="w-10 h-10 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5]/80 dark:bg-[#1E1E1D]/80 hover:bg-[#121212] dark:hover:bg-[#F5F5F3] hover:text-white dark:hover:text-[#121212] transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Close profile panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Category / Series Filter (No numbers) */}
              <div className="space-y-2 font-mono">
                <div className="text-xs sm:text-[11px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  {lang === "th" ? "หมวดภาพถ่าย" : "SERIES ARCHIVE"}
                </div>
                <div className="flex flex-col gap-1.5">
                  {categoryItems.map((cat) => {
                    const isActive = activeSection === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        type="button"
                        className={`w-full flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-xl text-sm sm:text-[13px] font-mono transition-all text-left cursor-pointer ${
                          isActive
                            ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold shadow-xs"
                            : "bg-[#F7F7F5]/80 dark:bg-[#1A1A19]/80 text-[#4A4A48] dark:text-[#B5B5B0] hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full ${
                            isActive ? "bg-[#FF9500]" : "bg-transparent"
                          }`}
                        />
                        <span>{lang === "th" ? cat.labelTh : cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Bio & Intro (Clean, Floating Typography - Hello!) */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2.5 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-serif italic text-3xl sm:text-4xl text-[#121212] dark:text-[#F5F5F3] tracking-tight text-left">
                    Hello!
                  </h2>
                </div>
                <div className="font-mono text-xs sm:text-[11px] text-[#FF9500] dark:text-[#FFA000] tracking-wider uppercase font-semibold">
                  Photographer based in Bangkok
                </div>
                <p className="font-sans text-sm sm:text-[14px] leading-relaxed text-[#262626] dark:text-[#D4D4D0] text-left">
                  {lang === "en"
                    ? "I started taking photos because I fell in love with unposed, candid moments—people simply living their lives, rather than standing still for a countdown and posing for the lens. For me, pressing the shutter is just a way to hold onto ordinary, fleeting moments that come and go. The rest of the time is spent wandering aimlessly, observing, and trying to blend in as naturally as possible whenever I hold a camera :)"
                    : "เริ่มถ่ายรูปเพราะ ชอบจังหวะเผลอๆ เวลาคนกำลังใช้ชีวิตมากกว่าให้มายืนนับหนึ่งสองสามแล้วเก๊กใส่กล้อง ส่วนตัวแล้ว การกดชัตเตอร์ก็แค่วิธีเก็บโมเมนต์ธรรมดาๆ ที่ผ่านมาแล้วก็ผ่านไป ส่วนเวลาที่เหลือก็หมดไปกับการเดินดูนู่นดูนี่เรื่อยเปื่อย แล้วพยายามทำตัวให้กลมกลืนที่สุดเวลาถือกล้อง :)"}
                </p>

                {/* Pure Brand Emblems (Direct logos without borders or labels) */}
                <div className="pt-2.5 flex items-center gap-4 select-none">
                  <Image
                    src="/brand/tuphoto-logo-black.png"
                    alt="TU PHOTO"
                    width={28}
                    height={28}
                    unoptimized
                    className="h-6 w-auto object-contain dark:invert opacity-85 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/brand/ตรากน.png"
                    alt="กน."
                    width={28}
                    height={28}
                    unoptimized
                    className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* 3. Equipment Specs */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2 font-mono text-xs">
                <div className="text-xs sm:text-[11px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  {t("equipment")}
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-sm sm:text-xs">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("system")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium">Sony α7 III</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 border-b border-[#F0F0EA] dark:border-[#1E1E1E] text-sm sm:text-xs">
                  <span className="text-[#737373] dark:text-[#9E9E9C]">{t("lens")}</span>
                  <span className="text-[#121212] dark:text-[#F5F5F3] font-medium leading-relaxed">
                    FE 28-70mm F3.5-5.6 OSS
                  </span>
                </div>
              </div>

              {/* 4. Direct Inquiries & Contact Channels */}
              <div className="pt-4 border-t border-[#EBEBE6] dark:border-[#222221] space-y-2 font-mono text-xs">
                <div className="text-xs sm:text-[11px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider font-semibold">
                  {t("getInTouch")}
                </div>

                {/* Email Box */}
                {!isEmailRevealed ? (
                  <button
                    onClick={handleRevealAndCopyEmail}
                    type="button"
                    className="w-full flex items-center justify-between p-3 sm:p-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-sm sm:text-xs group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors">
                      <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                      <span>{lang === "th" ? "คลิกเพื่อดูและคัดลอกอีเมล" : "Click to reveal email"}</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] dark:bg-[#FFA000] animate-pulse shrink-0" />
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-3 sm:p-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group">
                    <a
                      href={`mailto:${siteProfile.contact.email}`}
                      onClick={() => {
                        triggerHaptic("light");
                        trackContactReveal("atelier_drawer_mailto", "email");
                      }}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer text-[#121212] dark:text-[#F5F5F3] font-semibold text-sm sm:text-xs group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors"
                    >
                      <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                      <span className="truncate">{siteProfile.contact.email}</span>
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRevealAndCopyEmail();
                      }}
                      type="button"
                      title={copied ? "Copied" : "Copy email address"}
                      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
                      className="w-10 h-10 -mr-1 rounded-lg flex items-center justify-center text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] cursor-pointer shrink-0 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#FF9500] dark:text-[#FFA000]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Twitter / X Link */}
                <a
                  href="https://x.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 sm:p-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-sm sm:text-xs">
                    <TwitterXIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000]" />
                    <span>@beamingmotion</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-[11px] text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3]">
                    <span>TWITTER / X</span>
                  </div>
                </a>

                {/* Instagram Link */}
                <a
                  href={siteProfile.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 sm:p-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-sm sm:text-xs">
                    <InstagramIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000]" />
                    <span>@{siteProfile.contact.instagram}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-[11px] text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3]">
                    <span>INSTAGRAM</span>
                  </div>
                </a>

                {/* Resume Link */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center justify-between p-3 sm:p-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-sm sm:text-xs">
                    <FileText className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span>Resume</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3] transition-colors" />
                </a>
              </div>
            </div>

            {/* Bottom Utility: Single Theme Toggle & Single Language Switcher */}
            <div className="pt-5 mt-6 border-t border-[#EBEBE6] dark:border-[#222221] flex items-center justify-between font-mono text-xs select-none">
              {/* Single Dark / Light Icon-Only Toggle */}
              <button
                onClick={() => {
                  triggerHaptic("light");
                  toggleTheme();
                }}
                type="button"
                aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="w-10 h-10 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5] dark:bg-[#1C1C1B] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer flex items-center justify-center"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-[#FFA000]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#121212]" />
                )}
              </button>

              {/* Single Language Switcher Button (TH ⇄ EN) */}
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setLang(lang === "th" ? "en" : "th");
                }}
                type="button"
                aria-label="Toggle language"
                className="h-10 px-4 rounded-full border border-[#E5E5DF] dark:border-[#282827] bg-[#F7F7F5] dark:bg-[#1C1C1B] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer font-bold text-xs"
              >
                {lang === "th" ? "EN" : "TH"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
