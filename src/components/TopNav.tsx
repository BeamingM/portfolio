"use client";

import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import BrandMark from "./BrandMark";
import { playTactileClick } from "@/utils/sound";
import { triggerHaptic } from "@/utils/haptics";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface TopNavProps {
  onOpenAbout: () => void;
  onSelectSection?: (sectionId: string) => void;
  activeSection?: string;
}

export default function TopNav({
  onOpenAbout,
  onSelectSection,
  activeSection = "all",
}: TopNavProps) {
  const { lang, setLang, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      // 0 at top of hero, 1 once scrolled past 180px
      const raw = Math.min(Math.max(latest / 180, 0), 1);
      // Organic smoothstep curve: 3x^2 - 2x^3 (smooth acceleration & deceleration)
      const eased = raw * raw * (3 - 2 * raw);
      setProgress(eased);
    });
  }, [scrollY]);

  const navLinks = [
    { id: "all", label: t("navAll") },
    { id: "personal", label: t("navPersonal") },
    { id: "tu-photo", label: t("navTuPhoto") },
    { id: "psctu", label: t("navPscTu") },
  ];

  // Dynamic calculations for Hero -> Top-Left morph
  const sidePadding = isMobile ? 16 : 32; // px-4 vs px-8
  const factor = 1 - progress;
  // Exact horizontal centering formula with top-left transform-origin and scale factor
  const xOffset = `calc(${factor} * (50vw - ${sidePadding}px - 65%))`;
  // Vertical travel distance to align with hero spacer across all screen sizes
  const yOffset = `calc(${factor} * ${isMobile ? 116 : 126}px)`;
  const scale = 1 + factor * 0.3;

  return (
    <>
      {/* 1. Progressive Blur Layer (No harsh border, fades smoothly into page tone) */}
      <div
        className="progressive-blur-header"
        style={{
          opacity: progress,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* 2. Top Navigation Bar (z-40 floating above blur) */}
      <header className="fixed top-0 left-0 w-full z-40 h-16 flex items-center justify-between px-4 md:px-8 select-none pointer-events-none">
        {/* Left: Morphing BrandMark (starts centered in hero at scroll 0, morphs to top-left) */}
        <div
          style={{
            transform: `translate(${xOffset}, ${yOffset}) scale(${scale})`,
            transformOrigin: "top left",
            willChange: "transform",
          }}
          className="pointer-events-auto cursor-pointer"
          onClick={() => {
            if (progress > 0.3) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <BrandMark
            isCenter={progress < 0.05}
            centerFactor={factor}
          />
        </div>

        {/* Center: Editorial Project Index Links (Visible on desktop) */}
        <nav
          style={{ opacity: Math.max(0, (progress - 0.2) / 0.8) }}
          className="hidden md:flex items-center gap-1 font-mono text-[11px] pointer-events-auto transition-opacity duration-200"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  triggerHaptic("light");
                  playTactileClick();
                  onSelectSection?.(link.id);
                }}
                type="button"
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                    : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] hover:bg-[#F4F4F0] dark:hover:bg-[#1C1C1B]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Theme Toggle, Language Switcher, and Contact Drawer */}
        <div className="flex items-center gap-2 font-mono text-xs pointer-events-auto">
          {/* Theme Toggle (Dark / Light mode based on system setting) */}
          <button
            onClick={() => {
              triggerHaptic("light");
              playTactileClick();
              toggleTheme();
            }}
            type="button"
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Toggle theme mode"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-[#F5F5F3]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#121212]" />
            )}
          </button>

          {/* Quick Language Switcher: TH | EN */}
          <div className="flex items-center bg-[#F4F4F0] dark:bg-[#1C1C1B] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full p-0.5 text-[10px]">
            <button
              onClick={() => {
                triggerHaptic("light");
                playTactileClick();
                setLang("th");
              }}
              type="button"
              className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                lang === "th"
                  ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                  : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3]"
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
              className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold"
                  : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Contact Trigger */}
          <button
            onClick={() => {
              triggerHaptic("light");
              playTactileClick();
              onOpenAbout();
            }}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#121212] dark:border-[#F5F5F3] bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] hover:bg-[#FF3E00] dark:hover:bg-[#FF5722] hover:border-[#FF3E00] dark:hover:border-[#FF5722] hover:text-white dark:hover:text-white transition-colors cursor-pointer text-[11px] font-sans font-bold tracking-wide shadow-xs"
          >
            <span>{t("contact")}</span>
          </button>
        </div>
      </header>
    </>
  );
}
