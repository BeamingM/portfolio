"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectDescriptionHeaderProps {
  activeSection: string;
}

interface NarrativeItem {
  title: { th: string; en: string };
  description: { th: string; en: string };
}

const GREETINGS: Record<string, NarrativeItem> = {
  all: {
    title: {
      th: "จังหวะชีวิตประจำวัน แสงเงา และอะไรก็ตามที่ทำให้ต้องหยุดเดินกลางทางแล้วยกกล้องขึ้นมา",
      en: "Documenting the rhythm of everyday life, subtle light, and whatever made me stop in the middle of the street.",
    },
    description: {
      th: "นี่คือบันทึกรวมเรื่องราวที่ผ่านสายตาระหว่างการเดินทาง ขอให้เพลิดเพลินกับแต่ละช่วงเวลาไปด้วยกัน :)",
      en: "Here is what caught my eye along the journey. Take your time and enjoy the moments :)",
    },
  },
  personal: {
    title: {
      th: "Hua Hin 2026",
      en: "Hua Hin 2026",
    },
    description: {
      th: "บันทึกแสงเงา ทะเล และจังหวะสตรีทริมชายหาด",
      en: "Coastal light and quiet street rhythms along the Gulf of Thailand",
    },
  },
  "tu-photo": {
    title: {
      th: "TU Photo",
      en: "TU Photo",
    },
    description: {
      th: "ชุมนุมถ่ายภาพ มหาวิทยาลัยธรรมศาสตร์ — ครบรอบ 50 ปี 6 ตุลา และกิจกรรมท่าพระจันทร์",
      en: "Thammasat University Photo Club — 50th Anniversary of Oct 6 and campus documentation",
    },
  },
  psctu: {
    title: {
      th: "PSC.TU",
      en: "PSC.TU",
    },
    description: {
      th: "บันทึกภาพกิจกรรมและคอนเสิร์ต Polsci Music — ท่าพระจันทร์",
      en: "Live performance frames and campus concert atmosphere at Tha Phra Chan",
    },
  },
};

export default function ProjectDescriptionHeader({
  activeSection,
}: ProjectDescriptionHeaderProps) {
  const { lang } = useLanguage();
  const current = GREETINGS[activeSection] || GREETINGS.all;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center select-none pt-3 pb-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="space-y-2.5"
        >
          {/* Apple-Style Clean Floating Typography (Bold, modern Anuphan Thai typography) */}
          <h2 className="font-sans font-semibold sm:font-bold text-lg sm:text-2xl md:text-3xl text-[#121212] dark:text-[#F5F5F3] tracking-tight leading-snug sm:leading-relaxed [text-wrap:balance] max-w-2xl mx-auto">
            {current.title[lang]}
          </h2>
          <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#595955] dark:text-[#A8A8A4] max-w-xl mx-auto font-normal">
            {current.description[lang]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
