"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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

/**
 * AnimatedDigit: Renders an individual numeral with a high-end mechanical/Apple-style rolling slide animation.
 * Whenever `digit` changes, the outgoing digit smoothly slides up and blurs away,
 * while the incoming digit rolls in from below with spring physics.
 */
function AnimatedDigit({
  digit,
  className = "",
}: {
  digit: string;
  className?: string;
}) {
  return (
    <span className="relative inline-block overflow-hidden h-[1.18em] w-[0.66em] select-none tabular-nums text-center align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "85%", opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-85%", opacity: 0, filter: "blur(2px)" }}
          transition={{
            y: { type: "spring", stiffness: 360, damping: 28, mass: 0.6 },
            opacity: { duration: 0.22, ease: "easeOut" },
            filter: { duration: 0.22 },
          }}
          className={`absolute inset-0 flex items-center justify-center font-mono leading-none ${className}`}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * AnimatedNumberSlot: Splits an integer into individual 2-digit places (tens & ones)
 * and animates each digit independently so static digits remain motionless while changing digits roll smoothly.
 */
function AnimatedNumberSlot({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const str = String(value).padStart(2, "0");
  const digits = str.split("");

  return (
    <span className="inline-flex items-center justify-center tabular-nums font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
      {digits.map((d, idx) => (
        <AnimatedDigit key={idx} digit={d} className={className} />
      ))}
    </span>
  );
}

export default function CountdownOverlay() {
  const { lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);
  const [isSecretBypass, setIsSecretBypass] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Secret query param check (?preview=true) allows inspecting the full site without overlay
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "true") {
        setIsSecretBypass(true);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || timeLeft.isExpired || isSecretBypass) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[75] flex flex-col items-center justify-between p-6 sm:p-10 md:p-14 bg-[#FBFBF9]/90 dark:bg-[#0C0C0C]/92 backdrop-blur-3xl text-[#121212] dark:text-[#F5F5F3] select-none overflow-hidden"
    >
      {/* Ambient Editorial Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FF9500]/20 via-[#FFA000]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[420px] h-[420px] rounded-full bg-[#121212]/5 dark:bg-white/5 blur-3xl" />
      </div>

      {/* Top Minimal Brand Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
          <span className="font-sans font-black tracking-widest uppercase text-[#121212] dark:text-[#F5F5F3]">
            CHAKARIN L.
          </span>
          <span
            className="text-[#D1D1CB] dark:text-[#383837] font-light select-none transform -translate-y-[0.5px]"
            aria-hidden="true"
          >
            /
          </span>
          <span className="font-serif italic text-[#737373] dark:text-[#9E9E9C] tracking-normal">
            BeamingMotion
          </span>
        </div>
      </div>

      {/* Center Content: Minimalist Coming Soon Countdown */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-2xl px-4 py-8">
        {/* Title: Pure Coming Soon */}
        <h1 className="font-serif italic text-4xl sm:text-6xl md:text-7xl text-[#121212] dark:text-[#F5F5F3] tracking-tight leading-none mb-10">
          Coming Soon
        </h1>

        {/* Countdown Numbers Grid with Per-Digit Rolling Slide Animations */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-xl">
          {/* Days */}
          <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
            <AnimatedNumberSlot
              value={timeLeft.days}
              className="text-[#121212] dark:text-[#F5F5F3]"
            />
            <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-2">
              {lang === "th" ? "วัน" : "Days"}
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
            <AnimatedNumberSlot
              value={timeLeft.hours}
              className="text-[#121212] dark:text-[#F5F5F3]"
            />
            <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-2">
              {lang === "th" ? "ชั่วโมง" : "Hours"}
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#EBEBE6] dark:border-[#262625] backdrop-blur-md shadow-xs">
            <AnimatedNumberSlot
              value={timeLeft.minutes}
              className="text-[#121212] dark:text-[#F5F5F3]"
            />
            <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-2">
              {lang === "th" ? "นาที" : "Mins"}
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/70 border border-[#FF9500]/30 dark:border-[#FFA000]/30 backdrop-blur-md shadow-xs">
            <AnimatedNumberSlot
              value={timeLeft.seconds}
              className="text-[#FF9500] dark:text-[#FFA000]"
            />
            <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#8C8C88] dark:text-[#6C6C68] mt-2">
              {lang === "th" ? "วินาที" : "Secs"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Clean Copyright */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between pb-2 font-mono text-xs text-[#737373] dark:text-[#9E9E9C]">
        <div className="text-[11px] tracking-wide">
          © 2026 CHAKARIN L. · ALL RIGHTS RESERVED.
        </div>
        <div className="text-[11px] tracking-wide text-[#8C8C88] dark:text-[#6C6C68]">
          chakarin.pics
        </div>
      </div>
    </motion.div>
  );
}
