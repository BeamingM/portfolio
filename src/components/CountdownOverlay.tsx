"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";
import { useLanguage } from "@/context/LanguageContext";
import { Lock, Eye, Sparkles } from "lucide-react";

// Target: 22 October 2026 at 20:15:00 (ICT / Asia/Bangkok, UTC+7)
// Note: Strict invariant — Never display the date or "birthday" in the UI
const TARGET_TIMESTAMP = new Date("2026-10-22T20:15:00+07:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = TARGET_TIMESTAMP - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function CountdownOverlay() {
  const { lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check session storage for preview mode
    if (typeof window !== "undefined") {
      const unlockedSession = sessionStorage.getItem("beamingmotion_preview_unlocked");
      if (unlockedSession === "true") {
        setIsUnlocked(true);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    triggerHaptic("medium");
    setIsUnlocked(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("beamingmotion_preview_unlocked", "true");
    }
  };

  const handleRelock = () => {
    triggerHaptic("light");
    setIsUnlocked(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("beamingmotion_preview_unlocked");
    }
  };

  if (!mounted || timeLeft.isExpired) {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[75] flex flex-col items-center justify-between p-6 sm:p-10 md:p-14 bg-[#FBFBF9]/85 dark:bg-[#0C0C0C]/88 backdrop-blur-2xl text-[#121212] dark:text-[#F5F5F3] select-none overflow-hidden"
          >
            {/* Ambient Editorial Background Accents */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FF9500]/20 via-[#FFA000]/10 to-transparent blur-3xl" />
              <div className="absolute -bottom-20 right-10 w-[420px] h-[420px] rounded-full bg-[#121212]/5 dark:bg-white/5 blur-3xl" />
            </div>

            {/* Top Minimal Brand Header */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-xs sm:text-sm font-black tracking-widest uppercase">
                  CHAKARIN L.
                </span>
                <span className="text-[#D1D1CB] dark:text-[#383837] text-xs">/</span>
                <span className="font-serif italic text-xs sm:text-sm text-[#737373] dark:text-[#9E9E9C]">
                  BeamingMotion
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-[#737373] dark:text-[#9E9E9C] uppercase border border-[#E5E5DF] dark:border-[#282827] px-2.5 py-1 rounded-full bg-white/50 dark:bg-[#181818]/50">
                <Lock className="w-2.5 h-2.5 text-[#FF9500]" />
                <span>Archive Locked</span>
              </div>
            </div>

            {/* Center Content: Minimalist Countdown Clock */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-2xl px-4 py-8">
              {/* Chic Decorative Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-white/70 dark:bg-[#1A1A19]/70 backdrop-blur-md mb-6 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FF9500] dark:text-[#FFA000]" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373] dark:text-[#9E9E9C]">
                  {lang === "th" ? "บันทึกภาพถ่ายกำลังจะเปิดตัว" : "The Archive is Unveiling"}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#121212] dark:text-[#F5F5F3] tracking-tight leading-none mb-3">
                Opening Soon
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#737373] dark:text-[#A0A09D] max-w-md mx-auto mb-10 leading-relaxed">
                {lang === "th"
                  ? "นิทรรศการภาพถ่ายสารคดีและสตรีทกำลังจะเปิดตัวอย่างเป็นทางการในเร็ว ๆ นี้"
                  : "A dedicated documentary and street photography portfolio is currently being prepared."}
              </p>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-xl">
                {/* Days */}
                <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#121212] dark:text-[#F5F5F3]">
                    {pad(timeLeft.days)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-1.5">
                    {lang === "th" ? "วัน" : "Days"}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#121212] dark:text-[#F5F5F3]">
                    {pad(timeLeft.hours)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-1.5">
                    {lang === "th" ? "ชั่วโมง" : "Hours"}
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#121212] dark:text-[#F5F5F3]">
                    {pad(timeLeft.minutes)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-1.5">
                    {lang === "th" ? "นาที" : "Mins"}
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#FF9500]/30 dark:border-[#FFA000]/30 backdrop-blur-md shadow-xs">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FF9500] dark:text-[#FFA000]">
                    {pad(timeLeft.seconds)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-1.5">
                    {lang === "th" ? "วินาที" : "Secs"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Discreet Preview Bypass Button */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 font-mono text-xs text-[#737373] dark:text-[#9E9E9C]">
              <div className="text-[11px] tracking-wide">
                © 2026 CHAKARIN L. · ALL RIGHTS RESERVED.
              </div>

              {/* Discrete Preview Unlock Button */}
              <button
                onClick={handleUnlock}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-white/80 dark:bg-[#181818]/80 text-[#121212] dark:text-[#F5F5F3] hover:border-[#FF9500] dark:hover:border-[#FFA000] hover:text-[#FF9500] dark:hover:text-[#FFA000] transition-colors cursor-pointer shadow-xs text-[11px]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {lang === "th" ? "เข้าชมผลงาน (Preview Archive)" : "Preview Archive"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill when Unlocked to easily re-lock for testing */}
      {isUnlocked && (
        <button
          onClick={handleRelock}
          type="button"
          title="Relock Countdown Overlay"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E5DF] dark:border-[#2C2C2B] bg-white/90 dark:bg-[#181818]/90 text-[#737373] dark:text-[#9E9E9C] hover:text-[#121212] dark:hover:text-white transition-all shadow-md text-[11px] font-mono cursor-pointer backdrop-blur-md select-none group"
        >
          <Lock className="w-3 h-3 text-[#FF9500] group-hover:rotate-12 transition-transform" />
          <span>Lock Countdown</span>
        </button>
      )}
    </>
  );
}
