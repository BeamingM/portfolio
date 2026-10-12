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
  navAll: { th: "ทั้งหมด", en: "ALL" },
  navPersonal: { th: "ส่วนตัว", en: "PERSONAL" },
  navTuPhoto: { th: "กิจกรรม", en: "ACTIVITIES" },
  navPscTu: { th: "อื่นๆ", en: "OTHERS" },
  aboutMe: { th: "เกี่ยวกับฉัน", en: "About Me" },
  contact: { th: "CONTACT", en: "CONTACT" },
  
  // Brand Tagline
  tagline: { th: "Photographer based in Bangkok", en: "Photographer based in Bangkok" },
  locationBadge: { th: "Bangkok, Thailand", en: "Bangkok, Thailand" },
  scrollPrompt: { th: "Scroll down to explore prints", en: "Scroll down to explore prints" },

  // Sections
  chapter: { th: "CHAPTER", en: "CHAPTER" },
  prints: { th: "PRINTS", en: "PRINTS" },
  allArchive: { th: "ALL ARCHIVE", en: "ALL ARCHIVE" },
  personalTitle: { th: "ส่วนตัว", en: "Personal" },
  personalDesc: { th: "ส่วนตัว — ทะเล แสงเงา และช่วงเวลาทั่วไป", en: "Personal — Coastal light, ambient moments, and quiet scenes" },
  tuPhotoTitle: { th: "กิจกรรม", en: "Activities" },
  tuPhotoDesc: { th: "กิจกรรม — บรรยากาศงานและผู้คนรอบตัว", en: "Activities — Campus events, movement, and people" },
  pscTuTitle: { th: "อื่นๆ", en: "Others" },
  pscTuDesc: { th: "อื่นๆ — แสงเวที คอนเสิร์ต และช่วงเวลาหลากหลาย", en: "Others — Stage lights, concerts, and various moments" },

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
