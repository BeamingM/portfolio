"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";
import AtelierDrawer from "@/components/AtelierDrawer";
import InteractivePrintCard from "@/components/InteractivePrintCard";
import PhotoModal from "@/components/PhotoModal";
import CountdownOverlay from "@/components/CountdownOverlay";
import { galleryItems, PhotoItem } from "@/config/gallery";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { triggerHaptic } from "@/utils/haptics";
import {
  ArrowLeft,
  Sun,
  Moon,
  Menu,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Camera,
  FileText,
  MapPin,
} from "lucide-react";
import { TwitterXIcon, InstagramIcon } from "@/components/SocialIcons";

export default function AboutClient() {
  const { lang, setLang } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const featuredPhoto = galleryItems[0]; // personal-01: Hua Hin Coastline

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact.chakarin@gmail.com");
    triggerHaptic("success");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main className="relative min-h-screen bg-[#FBFBF9] dark:bg-[#0D0D0D] text-[#121212] dark:text-[#F5F5F3] selection:bg-[#FF9500] dark:selection:bg-[#FFA000] selection:text-white paper-texture transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full h-16 sm:h-20 bg-[#FBFBF9]/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-b border-[#E5E5DF]/60 dark:border-[#222221]/60 px-4 sm:px-8 md:px-12 flex items-center justify-between select-none">
        {/* Back Link to Gallery */}
        <Link
          href="/"
          onClick={() => triggerHaptic("light")}
          className="flex items-center gap-2 font-mono text-xs text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] transition-colors group cursor-pointer min-h-[44px] py-2 pr-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">
            {lang === "th" ? "กลับสู่แกลเลอรี" : "Back to Gallery"}
          </span>
          <span className="sm:hidden">{lang === "th" ? "แกลเลอรี" : "Gallery"}</span>
        </Link>

        {/* Center / Brand */}
        <Link
          href="/"
          onClick={() => triggerHaptic("light")}
          className="cursor-pointer"
        >
          <BrandMark showSubtitle={false} collapseSecondary={true} />
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Desktop Controls (>= 768px) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic("light");
                toggleTheme();
              }}
              type="button"
              title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Toggle theme mode"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-[#FFA000]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#121212]" />
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
              className="h-8 px-2.5 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors cursor-pointer shadow-2xs font-mono text-[11px] font-semibold"
            >
              {lang === "th" ? "EN" : "TH"}
            </button>
          </div>

          {/* Mobile Menu Trigger (< 768px): Icon-only button without redundant text */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => {
                triggerHaptic("light");
                setIsDrawerOpen(true);
              }}
              type="button"
              className="w-11 h-11 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF]/90 dark:bg-[#181818]/90 backdrop-blur-md text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-2xs min-w-[44px] min-h-[44px]"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 text-[#121212] dark:text-[#F5F5F3]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Editorial Hero & Bio Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-20 pb-16">
        {/* Overline & Category */}
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#737373] dark:text-[#9E9E9C] mb-4">
          <span>[ABOUT]</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#FF9500]" />
            Bangkok, Thailand
          </span>
        </div>

        {/* Hero Title: Hello! */}
        <h1 className="font-serif italic text-6xl sm:text-8xl md:text-9xl tracking-tight text-[#121212] dark:text-[#F5F5F3] leading-[0.9] mb-8">
          Hello!
        </h1>

        {/* Identity & Invariant Names */}
        <div className="border-b border-[#E5E5DF] dark:border-[#222221] pb-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#121212] dark:text-[#F5F5F3]">
              จักริน ลิ้มป์อุดม
            </h2>
            <span className="font-mono text-sm sm:text-base text-[#737373] dark:text-[#9E9E9C]">
              Chakarin Limudom · BeamingMotion
            </span>
          </div>
          <p className="font-mono text-xs text-[#FF9500] dark:text-[#FFA000] tracking-widest uppercase mt-2 font-semibold">
            Photographer based in Bangkok
          </p>
        </div>

        {/* Narrative Bio Story (Thai & English side-by-side or stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[#262626] dark:text-[#D4D4D0] leading-relaxed text-base sm:text-[17px] mb-16">
          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              [ภาษาไทย]
            </div>
            <p className="font-sans leading-relaxed">
              เริ่มถ่ายรูปเพราะ ชอบจังหวะเผลอๆ เวลาคนกำลังใช้ชีวิตมากกว่าให้มายืนนับหนึ่งสองสามแล้วเก๊กใส่กล้อง ส่วนตัวแล้ว การกดชัตเตอร์ก็แค่วิธีเก็บโมเมนต์ธรรมดาๆ ที่ผ่านมาแล้วก็ผ่านไป ส่วนเวลาที่เหลือก็หมดไปกับการเดินดูนู่นดูนี่เรื่อยเปื่อย แล้วพยายามทำตัวให้กลมกลืนที่สุดเวลาถือกล้อง :)
            </p>
            <p className="font-sans text-[15px] sm:text-base text-[#737373] dark:text-[#9E9E9C] leading-relaxed">
              โฟกัสหลักอยู่ที่ภาพถ่ายแสงเงา จังหวะชีวิตประจำวัน และผู้คนรอบตัว บันทึกเรื่องราวผ่านสายตาที่เป็นธรรมชาติ
            </p>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              [ENGLISH]
            </div>
            <p className="font-sans leading-relaxed">
              I started taking photos because I fell in love with unposed, candid moments—people simply living their lives, rather than standing still for a countdown and posing for the lens. For me, pressing the shutter is just a way to hold onto ordinary, fleeting moments that come and go. The rest of the time is spent wandering aimlessly, observing, and trying to blend in as naturally as possible whenever I hold a camera :)
            </p>
            <p className="font-sans text-[15px] sm:text-base text-[#737373] dark:text-[#9E9E9C] leading-relaxed">
              Documenting everyday rhythms, ambient light, and unscripted moments.
            </p>
          </div>
        </div>

        {/* Featured Archival Print Showcase */}
        <div className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold mb-4">
            [FEATURED ARCHIVE PRINT]
          </div>
          <InteractivePrintCard
            photo={featuredPhoto}
            priority={true}
            onClick={() => setSelectedPhoto(featuredPhoto)}
          />
        </div>

        {/* Equipment & Working Gear Specs */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 mb-16 font-mono text-xs">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-6">
            <Camera className="w-4 h-4 text-[#FF9500]" />
            <span>{lang === "th" ? "อุปกรณ์และระบบกล้อง" : "Equipment & Specs"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FFFFFF]/60 dark:bg-[#141414]/60 p-6 rounded-2xl border border-[#E5E5DF] dark:border-[#222221]">
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#737373] dark:text-[#9E9E9C]">
                {lang === "th" ? "ระบบกล้องหลัก" : "Primary Camera System"}
              </div>
              <div className="text-sm font-bold text-[#121212] dark:text-[#F5F5F3]">
                Sony α7 III
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#9E9E9C] leading-relaxed">
                Full-frame 24.2 MP documentary sensor with high dynamic range and silent electronic shutter.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#737373] dark:text-[#9E9E9C]">
                {lang === "th" ? "ชุดเลนส์ประจำตัว" : "Optics"}
              </div>
              <ul className="space-y-1.5 text-xs text-[#121212] dark:text-[#F5F5F3] font-medium">
                <li>· FE 28-70mm F3.5-5.6 OSS</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Series Overview: Continuous Unified Editorial Narrative */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 mb-16 text-xs sm:text-sm">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-4">
            [{lang === "th" ? "ซีรีส์ภาพถ่ายที่ผ่านมา" : "Photo Series"}]
          </div>

          <div className="bg-[#FFFFFF]/60 dark:bg-[#141414]/60 p-6 sm:p-8 rounded-2xl border border-[#E5E5DF] dark:border-[#222221] space-y-4">
            <p className="font-sans text-[15px] sm:text-base leading-relaxed text-[#262626] dark:text-[#D4D4D0]">
              {lang === "th"
                ? "ผลงานที่คัดสรรมาแบ่งออกเป็น 3 หมวดตามสิ่งที่ได้ไปพบเจอ เริ่มตั้งแต่งานส่วนตัวที่บันทึกแสงเงา ท้องฟ้า และความเงียบสงบริมทะเลหัวหิน ถัดมาคืองานกิจกรรมที่ได้ร่วมบันทึกบรรยากาศจริงและผู้คนรอบตัว เช่น งานครบรอบ 50 ปี 6 ตุลา ตลอดจนงานอื่นๆ อย่างแสงสีบนเวทีและงานต่างๆ ที่ได้มีโอกาสไปร่วมเก็บบรรยากาศ ทั้งหมดบันทึกผ่านมุมมองที่ตรงไปตรงมาและเป็นธรรมชาติ"
                : "The collection curated here spans three chapters gathered along the way: personal frames capturing seaside light and quiet coastal rhythms; campus activities preserving authentic moments and people, including the 50th Anniversary of October 6; and various projects documenting stage atmosphere and diverse gatherings."}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2 font-mono text-xs">
              <Link
                href="/?section=personal"
                onClick={() => triggerHaptic("light")}
                className="px-3.5 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#1C1C1B] hover:bg-[#121212] hover:text-white dark:hover:bg-[#F5F5F3] dark:hover:text-[#121212] transition-colors cursor-pointer"
              >
                {lang === "th" ? "ส่วนตัว" : "Personal"} →
              </Link>
              <Link
                href="/?section=tu-photo"
                onClick={() => triggerHaptic("light")}
                className="px-3.5 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#1C1C1B] hover:bg-[#121212] hover:text-white dark:hover:bg-[#F5F5F3] dark:hover:text-[#121212] transition-colors cursor-pointer"
              >
                {lang === "th" ? "กิจกรรม" : "Activities"} →
              </Link>
              <Link
                href="/?section=psctu"
                onClick={() => triggerHaptic("light")}
                className="px-3.5 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#1C1C1B] hover:bg-[#121212] hover:text-white dark:hover:bg-[#F5F5F3] dark:hover:text-[#121212] transition-colors cursor-pointer"
              >
                {lang === "th" ? "อื่นๆ" : "Others"} →
              </Link>
            </div>
          </div>
        </section>

        {/* Direct Inquiries & Contact Channels */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 font-mono text-xs">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-6">
            [{lang === "th" ? "ติดต่อและช่องทางติดตาม" : "Direct Inquiries & Contact"}]
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Box */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FFFFFF] dark:bg-[#161615] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group">
              <a
                href="mailto:contact.chakarin@gmail.com"
                onClick={() => triggerHaptic("light")}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer text-[#121212] dark:text-[#F5F5F3] font-semibold text-xs group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
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

            {/* Resume Link */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic("light")}
              className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FFFFFF] dark:bg-[#161615] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-xs">
                <FileText className="w-4 h-4 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                <span>Resume (Curriculum Vitae PDF)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#121212] dark:group-hover:text-[#F5F5F3] transition-colors" />
            </a>

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/beamingmotion"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic("light")}
              className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FFFFFF] dark:bg-[#161615] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-xs">
                <InstagramIcon className="w-4 h-4 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                <span>Instagram · @beamingmotion</span>
              </div>
            </a>

            {/* Twitter / X Link */}
            <a
              href="https://x.com/beamingmotion"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic("light")}
              className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5DF] dark:border-[#282827] bg-[#FFFFFF] dark:bg-[#161615] hover:border-[#121212] dark:hover:border-[#F5F5F3] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#121212] dark:text-[#F5F5F3] font-semibold text-xs">
                <TwitterXIcon className="w-4 h-4 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                <span>Twitter / X · @beamingmotion</span>
              </div>
            </a>
          </div>
        </section>
      </article>

      {/* Comprehensive Editorial Sitemap Footer */}
      <SiteFooter />

      {/* Mobile Drawer */}
      <AtelierDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Focus Photo Lightbox */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Countdown Overlay for pre-launch protection */}
      <CountdownOverlay />
    </main>
  );
}
