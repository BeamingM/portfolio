"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { triggerHaptic } from "@/utils/haptics";
import { Sun, Moon, ArrowUpRight, Camera, FileText, Mail } from "lucide-react";
import { TwitterXIcon, Instagram } from "@/components/SocialIcons";
import { galleryItems } from "@/config/gallery";

interface SiteFooterProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  counts?: Record<string, number>;
}

export default function SiteFooter({
  activeSection = "all",
  onSelectSection,
  counts,
}: SiteFooterProps) {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Compute dynamic fallback counts from galleryItems if not supplied
  const effectiveCounts = counts ?? {
    all: galleryItems.length,
    personal: galleryItems.filter((i) => i.sectionId === "personal").length,
    "tu-photo": galleryItems.filter((i) => i.sectionId === "tu-photo").length,
    psctu: galleryItems.filter((i) => i.sectionId === "psctu").length,
  };

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-20">
        {/* Top Brand & Identity Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5DF] dark:border-[#222221]">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-[#121212] dark:text-[#F5F5F3] uppercase">
                CHAKARIN L.
              </span>
              <span className="text-[#D1D1CB] dark:text-[#383837] text-sm">/</span>
              <span className="font-serif italic text-xl sm:text-2xl text-[#737373] dark:text-[#9E9E9C]">
                BeamingMotion
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[#737373] dark:text-[#9E9E9C] tracking-[0.16em] uppercase mt-1.5">
              {lang === "th"
                ? "ช่างภาพอิสระในกรุงเทพฯ · บันทึกภาพสารคดีและสตรีท"
                : "Photographer based in Bangkok · Documentary & Street Studies"}
            </p>
          </div>

          <div className="font-mono text-xs text-[#737373] dark:text-[#9E9E9C] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{lang === "th" ? "พร้อมรับงานถ่ายภาพในกรุงเทพฯ & หัวหิน" : "Available for select commissions"}</span>
          </div>
        </div>

        {/* 4-Column Editorial Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 py-12 border-b border-[#E5E5DF] dark:border-[#222221] text-xs font-mono">
          {/* Column 1: Series & Archive */}
          <div className="space-y-3.5">
            <div className="text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "หมวดภาพถ่าย" : "Archive Series"}
            </div>
            <ul className="space-y-2.5">
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
                  <span className="text-[10px] text-[#8C8C88] dark:text-[#6C6C68]">
                    ({effectiveCounts.all})
                  </span>
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
                  <span>{lang === "th" ? "หัวหิน 2026 (งานส่วนตัว)" : "Hua Hin 2026"}</span>
                  <span className="text-[10px] text-[#8C8C88] dark:text-[#6C6C68]">
                    ({effectiveCounts.personal})
                  </span>
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
                  <span>{lang === "th" ? "ครบรอบ 50 ปี 6 ตุลา" : "50th Oct 6 (TU Photo)"}</span>
                  <span className="text-[10px] text-[#8C8C88] dark:text-[#6C6C68]">
                    ({effectiveCounts["tu-photo"]})
                  </span>
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
                  <span>{lang === "th" ? "Polsci Music (PSC.TU)" : "Polsci Music (PSC.TU)"}</span>
                  <span className="text-[10px] text-[#8C8C88] dark:text-[#6C6C68]">
                    ({effectiveCounts.psctu})
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Profile & Navigation */}
          <div className="space-y-3.5">
            <div className="text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "ข้อมูลและประวัติ" : "Navigation"}
            </div>
            <ul className="space-y-2.5">
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
                  <span>{lang === "th" ? "เกี่ยวกับจักริน (About)" : "About Chakarin"}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8C8C88] group-hover:text-[#121212] dark:group-hover:text-white" />
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
                  <FileText className="w-3 h-3 text-[#8C8C88]" />
                  <span>{lang === "th" ? "เรซูเม่ (Resume PDF)" : "Resume (PDF)"}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Inquiries & Social */}
          <div className="space-y-3.5">
            <div className="text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              {lang === "th" ? "ติดต่อและติดตาม" : "Get In Touch"}
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:contact.chakarin@gmail.com"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-1.5 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">contact.chakarin@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-1.5 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  <span>@beamingmotion</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center gap-1.5 text-[#4A4A48] dark:text-[#B5B5B0] hover:text-[#121212] dark:hover:text-white transition-colors"
                >
                  <TwitterXIcon className="w-3 h-3" />
                  <span>Twitter / X</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Equipment & Colophon */}
          <div className="space-y-3.5">
            <div className="text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold flex items-center gap-1.5">
              <Camera className="w-3 h-3 text-[#FF9500]" />
              <span>{lang === "th" ? "อุปกรณ์และกล้อง" : "Equipment"}</span>
            </div>
            <ul className="space-y-2 text-[#4A4A48] dark:text-[#B5B5B0] text-[11px]">
              <li className="font-semibold text-[#121212] dark:text-[#F5F5F3]">
                Sony α7 III
              </li>
              <li>FE 28-70mm F3.5-5.6 OSS</li>
              <li>FE 35mm F1.8</li>
              <li>Sonnar T* FE 55mm F1.8 ZA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar: Theme, Language, Tech Stack & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          {/* Controls: Theme & Language Switchers */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                triggerHaptic("light");
                toggleTheme();
              }}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer shadow-2xs text-[11px]"
            >
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFA000]" />
                  <span>{lang === "th" ? "โหมดสว่าง" : "Light Mode"}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#121212]" />
                  <span>{lang === "th" ? "โหมดมืด" : "Dark Mode"}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full p-0.5 text-[10px]">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setLang("th");
                }}
                type="button"
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
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
          <div className="flex flex-col md:items-end gap-1 text-[11px] text-center md:text-right">
            <div className="font-semibold text-[#121212] dark:text-[#F5F5F3]">
              chakarin.pics
            </div>
            <div className="text-[10px] text-[#737373] dark:text-[#9E9E9C] uppercase tracking-wider">
              © 2026 CHAKARIN L. · BEAMINGMOTION. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
