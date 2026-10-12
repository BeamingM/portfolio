"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { triggerHaptic } from "@/utils/haptics";
import { Sun, Moon, ArrowUpRight, FileText, Mail } from "lucide-react";
import { TwitterXIcon, Instagram } from "@/components/SocialIcons";

interface SiteFooterProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  counts?: Record<string, number>;
}

export default function SiteFooter({
  activeSection = "all",
  onSelectSection,
}: SiteFooterProps) {
  const { lang, setLang } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  const handleSectionClick = (sectionId: string, e?: React.MouseEvent) => {
    triggerHaptic("light");
    if (onSelectSection) {
      e?.preventDefault();
      onSelectSection(sectionId);
      const target =
        document.getElementById("photos-archive") ||
        document.getElementById("hero-filter-anchor");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="w-full mt-24 border-t border-[#E5E5DF] dark:border-[#222221] bg-[#F4F4F0]/60 dark:bg-[#111111]/60 backdrop-blur-md select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-16 md:py-20">
        {/* Top Brand & Identity Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E5E5DF] dark:border-[#222221]">
          <div className="flex items-baseline gap-2.5">
            <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-[#121212] dark:text-[#F5F5F3] uppercase">
              CHAKARIN L.
            </span>
            <span className="text-[#D1D1CB] dark:text-[#383837] text-sm">/</span>
            <span className="font-serif italic text-xl sm:text-2xl text-[#737373] dark:text-[#9E9E9C]">
              BeamingMotion
            </span>
          </div>
        </div>

        {/* 3-Column Editorial Sitemap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-8 py-12 border-b border-[#E5E5DF] dark:border-[#222221] text-[13px] sm:text-xs font-mono">
          {/* Column 1: Series & Archive (No counts/numbers) */}
          <div className="space-y-3.5">
            <div className="text-[11px] sm:text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "ผังเว็บไซต์" : "Sitemap"}
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  onClick={(e) => handleSectionClick("all", e)}
                  className={`flex items-center gap-2 transition-colors cursor-pointer text-left ${
                    activeSection === "all"
                      ? "text-[#FF9500] dark:text-[#FFA000] font-bold"
                      : "text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white"
                  }`}
                >
                  <span>{lang === "th" ? "ผลงานทั้งหมด" : "All Works"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?section=personal"
                  onClick={(e) => handleSectionClick("personal", e)}
                  className={`flex items-center gap-2 transition-colors cursor-pointer text-left ${
                    activeSection === "personal"
                      ? "text-[#FF9500] dark:text-[#FFA000] font-bold"
                      : "text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white"
                  }`}
                >
                  <span>{lang === "th" ? "งานส่วนตัว" : "Personal Works"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?section=tu-photo"
                  onClick={(e) => handleSectionClick("tu-photo", e)}
                  className={`flex items-center gap-2 transition-colors cursor-pointer text-left ${
                    activeSection === "tu-photo"
                      ? "text-[#FF9500] dark:text-[#FFA000] font-bold"
                      : "text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white"
                  }`}
                >
                  <span>{lang === "th" ? "งานกิจกรรม" : "Activities & Events"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?section=psctu"
                  onClick={(e) => handleSectionClick("psctu", e)}
                  className={`flex items-center gap-2 transition-colors cursor-pointer text-left ${
                    activeSection === "psctu"
                      ? "text-[#FF9500] dark:text-[#FFA000] font-bold"
                      : "text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white"
                  }`}
                >
                  <span>{lang === "th" ? "งานต่างๆ" : "Various Projects"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Profile & Navigation */}
          <div className="space-y-3.5">
            <div className="text-[11px] sm:text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "ข้อมูลและประวัติ" : "Navigation"}
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  onClick={() => triggerHaptic("light")}
                  className="text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors"
                >
                  {lang === "th" ? "หน้าแรก / แกลเลอรี" : "Home / Gallery"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-1.5 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors group"
                >
                  <span>About</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8C8C88] group-hover:text-[#121212] dark:group-hover:text-white" />
                </Link>
              </li>
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-1.5 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors group"
                >
                  <FileText className="w-3.5 h-3.5 text-[#8C8C88]" />
                  <span>Resume</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Inquiries & Social */}
          <div className="space-y-3.5">
            <div className="text-[11px] sm:text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "ติดต่อและติดตาม" : "Get In Touch"}
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact.chakarin@gmail.com"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-2 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">contact.chakarin@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-2 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@beamingmotion</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-2 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors"
                >
                  <TwitterXIcon className="w-3.5 h-3.5" />
                  <span>Twitter / X</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar: Theme, Language Switchers & Clean Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          {/* Controls: Theme & Language Switchers */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                triggerHaptic("light");
                toggleTheme();
              }}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer shadow-2xs text-xs sm:text-[11px]"
            >
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-[#FFA000]" />
                  <span>{lang === "th" ? "โหมดสว่าง" : "Light Mode"}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#121212]" />
                  <span>{lang === "th" ? "โหมดมืด" : "Dark Mode"}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full p-0.5 text-xs sm:text-[10px]">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setLang("th");
                }}
                type="button"
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  lang === "th"
                    ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                    : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3]"
                }`}
              >
                ภาษาไทย
              </button>
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setLang("en");
                }}
                type="button"
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                    : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3]"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Copyright & Domain */}
          <div className="flex flex-col md:items-end gap-1 text-xs sm:text-[11px] text-center md:text-right">
            <div className="font-semibold text-[#121212] dark:text-[#F5F5F3]">
              chakarin.pics
            </div>
            <div className="text-[11px] sm:text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider">
              © 2026 CHAKARIN L. · ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
