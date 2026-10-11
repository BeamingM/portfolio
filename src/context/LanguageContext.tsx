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
  navPersonal: { th: "งานส่วนตัว", en: "PERSONAL PROJECTS" },
  navTuPhoto: { th: "TU PHOTO", en: "TU PHOTO" },
  navPscTu: { th: "PSC.TU", en: "PSC.TU" },
  contact: { th: "ติดต่อ", en: "CONTACT" },
  
  // Brand Tagline
  tagline: { th: "ช่างภาพอิสระในกรุงเทพฯ", en: "Photographer based in Bangkok" },
  locationBadge: { th: "กรุงเทพฯ, ประเทศไทย", en: "Bangkok, Thailand" },
  scrollPrompt: { th: "เลื่อนลงเพื่อดูผลงานภาพถ่าย", en: "Scroll down to explore prints" },

  // Sections
  chapter: { th: "บทที่", en: "CHAPTER" },
  prints: { th: "ภาพ", en: "PRINTS" },
  allArchive: { th: "คลังภาพทั้งหมด", en: "ALL ARCHIVE" },
  personalTitle: { th: "งานส่วนตัว 2026", en: "Personal Projects 2026" },
  personalDesc: { th: "หัวหิน 2026 — Beam's Edited & ภาพบันทึกชายหาด", en: "Hua Hin 2026 — Beam's Edited & Coastal Studies" },
  tuPhotoTitle: { th: "TU PHOTO 2026", en: "TU PHOTO 2026" },
  tuPhotoDesc: { th: "One Day Trip 2026 — บึม_beamingmotion", en: "One Day Trip 2026 — บึม_beamingmotion" },
  pscTuTitle: { th: "PSC.TU", en: "PSC.TU" },
  pscTuDesc: { th: "คณะรัฐศาสตร์ ม.ธรรมศาสตร์ · First Meet ไหว้ครู & ดนตรี", en: "Faculty of Political Science · First Meet & Music" },

  // Instagram Publication
  officialPublication: { th: "ผลงานเผยแพร่ทางการ", en: "Official Feature" },
  orientationSeries: { th: "ปฐมนิเทศ ม.ธรรมศาสตร์ 2026", en: "Thammasat Orientation 2026" },
  viewOnIg: { th: "เปิดดูใน Instagram", en: "View on IG" },
  seriesLabel: { th: "ซีรีส์", en: "SERIES" },
  creditLabel: { th: "ช่างภาพ", en: "CREDIT" },

  // Equipment & Drawer
  equipment: { th: "อุปกรณ์", en: "EQUIPMENT" },
  system: { th: "กล้อง", en: "SYSTEM" },
  lens: { th: "เลนส์", en: "LENS" },
  getInTouch: { th: "ติดต่อพูดคุย / ร่วมงาน", en: "GET IN TOUCH" },
  copy: { th: "คัดลอก", en: "COPY" },
  copied: { th: "คัดลอกแล้ว", en: "COPIED" },
  close: { th: "ปิด", en: "CLOSE" },

  // Footer & Colophon
  allRightsReserved: { th: "สงวนลิขสิทธิ์ทั้งหมด", en: "All Rights Reserved" },

  // Modal / Lightbox
  pressEscToClose: { th: "กด ESC เพื่อปิด", en: "Press ESC to close" },
  specs: { th: "รายละเอียดกล้อง", en: "SPECS" },
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
      setLangState(saved);
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
