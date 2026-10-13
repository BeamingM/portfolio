"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";
import AtelierDrawer from "@/components/AtelierDrawer";
import CountdownOverlay from "@/components/CountdownOverlay";
import { getContactEmail } from "@/config/gallery";
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
  ArrowUpRight,
  Camera,
  FileText,
} from "lucide-react";
import { TwitterXIcon, InstagramIcon } from "@/components/SocialIcons";
import { trackContactReveal } from "@/utils/analytics";

export default function AboutClient() {
  const { lang, setLang } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);
  const [revealedEmail, setRevealedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Direct inquiries channel: contact.chakarin@gmail.com (runtime obfuscated to prevent bot harvesting)
  const handleRevealAndCopyEmail = () => {
    const email = getContactEmail();
    setRevealedEmail(email);
    setIsEmailRevealed(true);
    navigator.clipboard.writeText(email);
    triggerHaptic("success");
    setCopied(true);
    trackContactReveal("about_page", "email");
    setTimeout(() => setCopied(false), 2400);
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
        {/* Editorial Section Overline */}
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#737373] dark:text-[#9E9E9C] mb-4">
          {lang === "th" ? "เกี่ยวกับตัวฉัน" : "ABOUT ME"}
        </div>

        {/* Hero Title: Hello! */}
        <h1 className="font-serif italic text-6xl sm:text-8xl md:text-9xl tracking-tight text-[#121212] dark:text-[#F5F5F3] leading-[0.9] mb-8">
          Hello!
        </h1>

        {/* Identity & Portrait Editorial Grid */}
        <div className="border-b border-[#E5E5DF] dark:border-[#222221] pb-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Portrait Frame */}
            <div className="md:col-span-4 relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E5DF] dark:border-[#262625] bg-[#F7F7F5] dark:bg-[#161616] shadow-sm">
                <Image
                  src="/profile.jpg"
                  alt="จักริน ลิ้มป์อุดม (Chakarin Limudom)"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center filter contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-500"
                  priority
                  unoptimized
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#737373] dark:text-[#9E9E9C]">
                <span>PORTRAIT</span>
                <span>Sony α7 III · 2026</span>
              </div>
            </div>

            {/* Invariant Names & Tagline */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-4">
                <h2 className="font-sans font-bold text-3xl sm:text-4xl text-[#121212] dark:text-[#F5F5F3] whitespace-nowrap">
                  จักริน ลิ้มป์อุดม
                </h2>
                <span className="font-mono text-sm sm:text-base text-[#737373] dark:text-[#9E9E9C] whitespace-nowrap">
                  Chakarin Limudom · BeamingMotion
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-[#FF9500] dark:text-[#FFA000] tracking-widest uppercase font-semibold">
                Photographer based in Bangkok
              </p>
              <p className="font-sans text-sm sm:text-[15px] text-[#737373] dark:text-[#9E9E9C] leading-relaxed pt-1">
                {lang === "th"
                  ? "บันทึกภาพถ่ายโมเมนต์ธรรมดาๆ ที่เกิดขึ้นและผ่านไป ผ่านสายตาที่เป็นธรรมชาติและจริงใจ"
                  : "Documenting ordinary fleeting moments with an unposed, authentic eye."}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Bio Story (Thai & English side-by-side or stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[#262626] dark:text-[#D4D4D0] leading-relaxed text-base sm:text-[17px] mb-16">
          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] font-bold">
              ภาษาไทย
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
              ENGLISH
            </div>
            <p className="font-sans leading-relaxed">
              I started taking photos because I fell in love with unposed, candid moments—people simply living their lives, rather than standing still for a countdown and posing for the lens. For me, pressing the shutter is just a way to hold onto ordinary, fleeting moments that come and go. The rest of the time is spent wandering aimlessly, observing, and trying to blend in as naturally as possible whenever I hold a camera :)
            </p>
            <p className="font-sans text-[15px] sm:text-base text-[#737373] dark:text-[#9E9E9C] leading-relaxed">
              Documenting everyday rhythms, ambient light, and unscripted moments.
            </p>
          </div>
        </div>



        {/* Equipment & Working Gear Specs (Apple Minimalist Tech Specs) */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 pb-14 font-mono text-xs">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-8">
            <Camera className="w-3.5 h-3.5 text-[#FF9500]" />
            <span>{lang === "th" ? "อุปกรณ์และระบบกล้อง" : "Equipment & Specs"}</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-[#F0F0EA] dark:border-[#1E1E1D]">
              <span className="text-[#737373] dark:text-[#9E9E9C] text-xs uppercase tracking-wider">
                {lang === "th" ? "ระบบกล้องหลัก" : "Camera System"}
              </span>
              <div className="text-left sm:text-right">
                <span className="text-sm font-semibold text-[#121212] dark:text-[#F5F5F3]">
                  Sony α7 III
                </span>
                <span className="text-[11px] text-[#737373] dark:text-[#9E9E9C] block sm:inline sm:ml-2">
                  (Full-Frame 24.2 MP)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-[#F0F0EA] dark:border-[#1E1E1D]">
              <span className="text-[#737373] dark:text-[#9E9E9C] text-xs uppercase tracking-wider">
                {lang === "th" ? "ชุดเลนส์ประจำตัว" : "Optics"}
              </span>
              <span className="text-sm font-semibold text-[#121212] dark:text-[#F5F5F3] text-left sm:text-right">
                FE 28-70mm F3.5-5.6 OSS
              </span>
            </div>
          </div>
        </section>

        {/* Series Overview: Apple Editorial Clean Narrative */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 pb-14">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-6">
            {lang === "th" ? "ซีรีส์ภาพถ่ายที่ผ่านมา" : "Photo Series"}
          </div>

          <p className="font-sans text-[15px] sm:text-base leading-relaxed text-[#262626] dark:text-[#D4D4D0] mb-8 max-w-3xl">
            {lang === "th"
              ? "ผลงานที่คัดสรรมาแบ่งออกเป็น 3 หมวดตามสิ่งที่ได้ไปพบเจอ เริ่มตั้งแต่งานส่วนตัวที่บันทึกแสงเงา ท้องฟ้า และความเงียบสงบริมทะเลหัวหิน ถัดมาคืองานกิจกรรมที่ได้ร่วมบันทึกบรรยากาศจริงและผู้คนรอบตัว เช่น งานครบรอบ 50 ปี 6 ตุลา ตลอดจนงานอื่นๆ อย่างแสงสีบนเวทีและงานต่างๆ ที่ได้มีโอกาสไปร่วมเก็บบรรยากาศ ทั้งหมดบันทึกผ่านมุมมองที่ตรงไปตรงมาและเป็นธรรมชาติ"
              : "The collection curated here spans three chapters gathered along the way: personal frames capturing seaside light and quiet coastal rhythms; campus activities preserving authentic moments and people, including the 50th Anniversary of October 6; and various projects documenting stage atmosphere and diverse gatherings."}
          </p>

          {/* Clean Apple-style Text Links with Arrows (No heavy button boxes) */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs sm:text-[13px]">
            <Link
              href="/?section=personal"
              onClick={() => triggerHaptic("light")}
              className="text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{lang === "th" ? "ส่วนตัว" : "Personal"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <span className="text-[#D1D1CB] dark:text-[#333332]">·</span>
            <Link
              href="/?section=tu-photo"
              onClick={() => triggerHaptic("light")}
              className="text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{lang === "th" ? "กิจกรรม" : "Activities"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <span className="text-[#D1D1CB] dark:text-[#333332]">·</span>
            <Link
              href="/?section=psctu"
              onClick={() => triggerHaptic("light")}
              className="text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{lang === "th" ? "อื่นๆ" : "Others"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* Direct Inquiries, Social & Resume (Clean Apple 3-Column Editorial Grid) */}
        <section className="border-t border-[#E5E5DF] dark:border-[#222221] pt-12 pb-6">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mb-10">
            {lang === "th" ? "ติดต่อและข้อมูลเพิ่มเติม" : "Direct Inquiries & Connect"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {/* Column 1: Direct Inquiries (Email) */}
            <div className="space-y-3.5">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8C8C88] dark:text-[#6C6C68] font-bold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF9500] dark:text-[#FFA000]" />
                <span>{lang === "th" ? "อีเมลติดต่อ" : "Direct Email"}</span>
              </div>
              <div className="space-y-2">
                {!isEmailRevealed ? (
                  <button
                    onClick={handleRevealAndCopyEmail}
                    type="button"
                    className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FBFBF9] dark:bg-[#1A1A19] hover:border-[#121212] dark:hover:border-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-all cursor-pointer text-xs font-mono group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] dark:bg-[#FFA000] animate-pulse" />
                    <span className="text-[#121212] dark:text-[#F5F5F3] group-hover:text-inherit font-medium">
                      {lang === "th" ? "คลิกเพื่อดูและคัดลอกอีเมล" : "Click to reveal & copy email"}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${revealedEmail || getContactEmail()}`}
                      onClick={() => {
                        triggerHaptic("light");
                        trackContactReveal("about_page_mailto", "email");
                      }}
                      className="font-sans font-semibold text-sm sm:text-[15px] text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors break-all"
                    >
                      {revealedEmail || getContactEmail()}
                    </a>
                    <button
                      onClick={handleRevealAndCopyEmail}
                      type="button"
                      title={copied ? "Copied" : "Copy email address"}
                      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-[#FF9500] dark:text-[#FFA000]" />
                          <span className="text-[#FF9500] dark:text-[#FFA000]">
                            {lang === "th" ? "คัดลอกแล้ว" : "Copied"}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{lang === "th" ? "คัดลอก" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="font-sans text-xs sm:text-[13px] text-[#737373] dark:text-[#9E9E9C] leading-relaxed pt-1">
                {lang === "th"
                  ? "สำหรับงานถ่ายภาพ โปรเจกต์ หรือทักทายพูดคุยแลกเปลี่ยนมุมมอง ยินดีตอบกลับเสมอ"
                  : "Available for photography assignments, projects, or friendly hello."}
              </p>
            </div>

            {/* Column 2: Social Media (Instagram & X) */}
            <div className="space-y-3.5">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8C8C88] dark:text-[#6C6C68] font-bold flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-[#FF9500] dark:text-[#FFA000]" />
                <span>{lang === "th" ? "โซเชียลมีเดีย" : "Social Channels"}</span>
              </div>
              <div className="space-y-2.5 font-mono text-xs sm:text-[13px]">
                <a
                  href="https://www.instagram.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center justify-between text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors py-0.5 group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#9E9E9C]">
                    <InstagramIcon className="w-3 h-3 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span>Instagram</span>
                  </span>
                  <span className="font-semibold text-[#121212] dark:text-[#F5F5F3] group-hover:text-inherit">@beamingmotion</span>
                </a>
                <a
                  href="https://x.com/beamingmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex items-center justify-between text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors py-0.5 group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#9E9E9C]">
                    <TwitterXIcon className="w-3 h-3 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-colors" />
                    <span>Twitter / X</span>
                  </span>
                  <span className="font-semibold text-[#121212] dark:text-[#F5F5F3] group-hover:text-inherit">@beamingmotion</span>
                </a>
              </div>
              <p className="font-sans text-xs sm:text-[13px] text-[#737373] dark:text-[#9E9E9C] leading-relaxed pt-1">
                {lang === "th"
                  ? "ติดตามโมเมนต์และภาพถ่ายล่าสุดในชีวิตประจำวัน"
                  : "Follow everyday snapshots, stories, and latest updates."}
              </p>
            </div>

            {/* Column 3: Credentials (Resume) */}
            <div className="space-y-3.5">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8C8C88] dark:text-[#6C6C68] font-bold flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#FF9500] dark:text-[#FFA000]" />
                <span>{lang === "th" ? "ข้อมูลประวัติ" : "Credentials"}</span>
              </div>
              <div className="space-y-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] font-semibold text-[#121212] dark:text-[#F5F5F3] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors group cursor-pointer"
                >
                  <span>Resume</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#737373] dark:text-[#9E9E9C] group-hover:text-[#FF9500] dark:group-hover:text-[#FFA000] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
              <p className="font-sans text-xs sm:text-[13px] text-[#737373] dark:text-[#9E9E9C] leading-relaxed pt-1">
                {lang === "th"
                  ? "ดูประวัติและประสบการณ์การทำงานฉบับเต็ม"
                  : "View complete background, skills, and experience."}
              </p>
            </div>
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



      {/* Countdown Overlay for pre-launch protection */}
      <CountdownOverlay />
    </main>
  );
}
