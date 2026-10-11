"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "th" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { th: string; en: string }> = {
  // Navigation & Header
  navAll: { th: "ALL ARCHIVE", en: "ALL ARCHIVE" },
  navPersonal: { th: "PERSONAL PROJECTS", en: "PERSONAL PROJECTS" },
  navTuPhoto: { th: "TU PHOTO", en: "TU PHOTO" },
  navPscTu: { th: "PSC.TU", en: "PSC.TU" },
  contact: { th: "CONTACT", en: "CONTACT" },
  
  // Brand Tagline
  tagline: { th: "Photographer based in Bangkok", en: "Photographer based in Bangkok" },
  locationBadge: { th: "Bangkok, Thailand", en: "Bangkok, Thailand" },
  scrollPrompt: { th: "Scroll down to explore prints", en: "Scroll down to explore prints" },

  // Sections
  chapter: { th: "CHAPTER", en: "CHAPTER" },
  prints: { th: "PRINTS", en: "PRINTS" },
  allArchive: { th: "ALL ARCHIVE", en: "ALL ARCHIVE" },
  personalTitle: { th: "Personal Projects 2026", en: "Personal Projects 2026" },
  personalDesc: { th: "Hua Hin 2026 — ทะเล แสงเงา และสตรีทศึกษา", en: "Hua Hin 2026 — Beam's Edited & Coastal Studies" },
  tuPhotoTitle: { th: "TU PHOTO 2026", en: "TU PHOTO 2026" },
  tuPhotoDesc: { th: "50*6th OCT — บันทึกภาพงานรำลึก 6 ตุลาฯ 2569", en: "50*6th OCT — October 6 Commemoration Series" },
  pscTuTitle: { th: "PSC.TU", en: "PSC.TU" },
  pscTuDesc: { th: "Polsci Music - FirstM33t 2026 · คอนเสิร์ตและโทนฟิล์ม", en: "Polsci Music - FirstM33t 2026 · Film Look & Stage Performance" },

  // Instagram Publication
  officialPublication: { th: "Official Feature", en: "Official Feature" },
  orientationSeries: { th: "TU Orientation 2026", en: "Thammasat Orientation 2026" },
  viewOnIg: { th: "View on Instagram", en: "View on IG" },
  seriesLabel: { th: "SERIES", en: "SERIES" },
  creditLabel: { th: "CREDIT", en: "CREDIT" },

  // Equipment & Drawer
  equipment: { th: "EQUIPMENT", en: "EQUIPMENT" },
  system: { th: "CAMERA", en: "CAMERA" },
  lens: { th: "LENS", en: "LENS" },
  getInTouch: { th: "GET IN TOUCH", en: "GET IN TOUCH" },
  sendEmail: { th: "SEND EMAIL", en: "SEND EMAIL" },
  copy: { th: "COPY", en: "COPY" },
  copied: { th: "COPIED", en: "COPIED" },
  close: { th: "CLOSE", en: "CLOSE" },

  // Footer & Colophon
  allRightsReserved: { th: "All Rights Reserved", en: "All Rights Reserved" },

  // Modal / Lightbox
  pressEscToClose: { th: "Press ESC to close", en: "Press ESC to close" },
  specs: { th: "SPECS", en: "SPECS" },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("th");

  useEffect(() => {
    // Load persisted language preference if available
    const saved = localStorage.getItem("portfolio_lang") as Language | null;
    if (saved === "th" || saved === "en") {
      queueMicrotask(() => {
        setLangState(saved);
      });
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("portfolio_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // LocalStorage unavailable in privacy mode
    }
  };

  const toggleLang = () => {
    setLang(lang === "th" ? "en" : "th");
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
