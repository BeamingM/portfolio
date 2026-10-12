"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import { triggerHaptic } from "@/utils/haptics";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu } from "lucide-react";

interface TopNavProps {
  onOpenAbout: () => void;
  onSelectSection?: (sectionId: string) => void;
  activeSection?: string;
  counts?: Record<string, number>;
}

export default function TopNav({
  onOpenAbout,
  onSelectSection,
  activeSection = "all",
  counts,
}: TopNavProps) {
  const { lang, setLang, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [heroFilterTop, setHeroFilterTop] = useState(1200 > 768 ? 390 : 430);

  // Measure exact position of hero filter anchor in DOM, adjusting dynamically for any text length or language
  useEffect(() => {
    const measureAnchor = () => {
      const anchor = document.getElementById("hero-filter-anchor");
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const scroll = window.pageYOffset || document.documentElement.scrollTop || 0;
        const actualTop = rect.top + scroll;
        if (actualTop > 100) {
          setHeroFilterTop(Math.round(actualTop));
        }
      }
    };

    measureAnchor();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measureAnchor);
    }
    const t1 = setTimeout(measureAnchor, 60);
    const t2 = setTimeout(measureAnchor, 300);
    window.addEventListener("resize", measureAnchor);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measureAnchor);
    };
  }, [activeSection, lang, windowWidth, isMobile]);

  // Robust native scroll listener guaranteeing smooth progress on mobile & desktop
  const scrollThreshold = Math.max(heroFilterTop - (isMobile ? 14 : 18) - 100, 180);

  useEffect(() => {
    const handleScroll = () => {
      const scroll =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      // 0 at top of hero, 1 once scrolled past hero anchor
      const raw = Math.min(Math.max(scroll / scrollThreshold, 0), 1);
      // Smoothstep curve: 3x^2 - 2x^3
      const eased = raw * raw * (3 - 2 * raw);
      setProgress(eased);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [scrollThreshold]);

  const navLinks = [
    { id: "all", label: t("navAll") },
    { id: "personal", label: t("navPersonal") },
    { id: "tu-photo", label: t("navTuPhoto") },
    { id: "psctu", label: t("navPscTu") },
  ];

  // Side padding matches container: px-4 on mobile (<640), px-6 on sm, px-12 on lg
  const sidePad = windowWidth < 640 ? 16 : windowWidth < 1024 ? 24 : 48;
  const factor = 1 - progress;

  // Exact clearance from BrandMark guaranteeing zero overlap with "BeamingMotion"
  const isDesktop = windowWidth >= 1024;
  const brandMarkClearance = isDesktop ? 360 : isMobile ? 104 : 138;
  const navLeft = sidePad + brandMarkClearance;
  const navTop = isMobile ? 14 : 18;

  return (
    <>
      {/* 1. Progressive Blur Layer */}
      <div
        className="progressive-blur-header"
        style={{
          opacity: progress,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* 2. Unified Morphing Layer: BrandMark & Filter Bar glide together as one continuous piece */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none">
        {/* BrandMark: Center Hero -> Top-Left Nav */}
        <div
          style={{
            position: "absolute",
            left: `calc(${sidePad}px + ${factor} * (50% - ${sidePad}px))`,
            top: `${(isMobile ? 15 : 18) + factor * (isMobile ? 46 : 56)}px`,
            transform: `translate3d(-${factor * 50}%, 0, 0) scale(${1 + factor * (isMobile ? 0.22 : 0.35)})`,
            transformOrigin: "center center",
            willChange: "left, top, transform",
          }}
          role={progress > 0.25 ? "button" : undefined}
          tabIndex={progress > 0.25 ? 0 : undefined}
          aria-label={progress > 0.25 ? "Scroll to top" : undefined}
          onKeyDown={(e) => {
            if (progress > 0.25 && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              triggerHaptic("light");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`pointer-events-auto shrink-0 max-w-[calc(100vw-180px)] ${
            progress > 0.25 ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => {
            if (progress > 0.25) {
              triggerHaptic("light");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <BrandMark
            centerFactor={factor}
            collapseSecondary={(isMobile || windowWidth < 1024) && progress > 0.15}
          />
        </div>

        {/* Filter Bar: Center Hero -> Top Nav beside BrandMark (desktop) / fades out centered on mobile */}
        <div
          style={{
            position: "absolute",
            left: isMobile
              ? "50%"
              : `calc(${navLeft}px + ${factor} * (50% - ${navLeft}px))`,
            top: `${navTop + factor * (heroFilterTop - navTop)}px`,
            transform: isMobile
              ? "translate3d(-50%, 0, 0)"
              : `translate3d(-${factor * 50}%, 0, 0)`,
            willChange: "left, top, transform",
            maxWidth:
              factor > 0.35
                ? "94vw"
                : `calc(100vw - ${navLeft + 200}px)`,
            opacity: isMobile ? Math.max(0, (factor - 0.25) / 0.75) : 1,
            pointerEvents: isMobile && factor <= 0.25 ? "none" : "auto",
          }}
          className={`pointer-events-auto items-center select-none ${
            factor <= 0.25 ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Full Horizontal Tabs (in hero on mobile, and morphs into top nav on desktop) */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#F4F4F0] dark:bg-[#1A1A19] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full overflow-x-auto no-scrollbar shadow-2xs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const count = counts?.[link.id] ?? 0;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    triggerHaptic("light");
                    onSelectSection?.(link.id);
                  }}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 sm:px-3.5 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 rounded-full text-[11px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] font-bold shadow-xs"
                      : "text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-[#F5F5F3] hover:bg-white/70 dark:hover:bg-[#282827]"
                  }`}
                >
                  <span>{link.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white/20 dark:bg-black/20 text-white dark:text-[#121212]"
                          : "text-[#A0A09A] dark:text-[#666]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Top Navigation Right Controls */}
      <header className="fixed top-0 left-0 w-full z-50 h-14 sm:h-20 flex items-center justify-end px-4 sm:px-6 md:px-12 select-none pointer-events-none overflow-x-hidden max-w-full">
        {/* Desktop Controls (>= 768px): Full navigation with Dark Mode, TH|EN, and About Me button */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs pointer-events-auto shrink-0 ml-auto">
          {/* Theme Toggle (Dark / Light mode) */}
          <button
            onClick={() => {
              triggerHaptic("light");
              toggleTheme();
            }}
            type="button"
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF] dark:bg-[#181818] text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
            aria-label="Toggle theme mode"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-[#FFA000]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#121212]" />
            )}
          </button>

          {/* Language Switcher: TH | EN */}
          <div className="flex items-center bg-[#F4F4F0] dark:bg-[#1C1C1B] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-full p-0.5 text-[10px] shrink-0">
            <button
              onClick={() => {
                triggerHaptic("light");
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

          {/* About Me Trigger */}
          <button
            onClick={() => {
              triggerHaptic("light");
              onOpenAbout();
            }}
            type="button"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#121212] dark:border-[#F5F5F3] bg-[#121212] dark:bg-[#F5F5F3] text-white dark:text-[#121212] hover:bg-[#FF9500] dark:hover:bg-[#FFA000] hover:border-[#FF9500] dark:hover:border-[#FFA000] hover:text-white dark:hover:text-[#121212] transition-colors cursor-pointer text-[11px] font-sans font-bold tracking-wide shadow-xs shrink-0"
          >
            <span>{t("aboutMe")}</span>
          </button>
        </div>

        {/* Mobile Controls (< 768px): Sleek Hamburger/Menu Icon button without redundant text */}
        <div className="flex md:hidden items-center pointer-events-auto shrink-0 ml-auto">
          <button
            onClick={() => {
              triggerHaptic("light");
              onOpenAbout();
            }}
            type="button"
            className="w-11 h-11 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-[#FFFFFF]/90 dark:bg-[#181818]/90 backdrop-blur-md text-[#121212] dark:text-[#F5F5F3] hover:border-[#121212] dark:hover:border-[#F5F5F3] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-2xs min-w-[44px] min-h-[44px]"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 text-[#121212] dark:text-[#F5F5F3]" />
          </button>
        </div>
      </header>
    </>
  );
}
