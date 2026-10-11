"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface CursorContext {
  type: "default" | "photo" | "button" | "link" | "email";
  label?: string;
  specs?: string;
}

export default function FigmaCanvasOverlay() {
  const { resolvedTheme } = useTheme();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorContext, setCursorContext] = useState<CursorContext>({ type: "default" });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring following like Figma multiplayer cursor
  const springX = useSpring(mouseX, { damping: 25, stiffness: 350, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 350, mass: 0.5 });

  useEffect(() => {
    // Only enable on desktop mouse/trackpad viewports
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      if (!isVisible) setIsVisible(true);

      // Detect hover target context
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const photoEl = target.closest("[data-figma-photo]");
      if (photoEl) {
        const title = photoEl.getAttribute("data-photo-title") || "Frame";
        const specs = photoEl.getAttribute("data-photo-specs") || "Sony α7 III";
        setCursorContext({
          type: "photo",
          label: title,
          specs,
        });
        return;
      }

      const emailEl = target.closest("a[href^='mailto:']");
      if (emailEl) {
        setCursorContext({ type: "email", label: "SEND MAIL" });
        return;
      }

      const btnEl = target.closest("button, [role='button'], a");
      if (btnEl) {
        setCursorContext({ type: "button", label: "SELECT" });
        return;
      }

      setCursorContext({ type: "default" });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isFinePointer || !isVisible) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Figma-style Canvas Coordinate HUD in bottom-right corner */}
      <div className="fixed bottom-4 right-4 hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4F4F0]/90 dark:bg-[#1A1A19]/90 border border-[#E5E5DF] dark:border-[#282827] backdrop-blur-xs font-mono text-[9px] tracking-wider text-[#737373] dark:text-[#9E9E9C] shadow-2xs transition-opacity">
        <span className="flex items-center gap-1 font-semibold text-[#121212] dark:text-[#F5F5F3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
          FIGMA HUD
        </span>
        <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
        <span>X: {coords.x}px</span>
        <span>Y: {coords.y}px</span>
        <span className="text-[#D1D1CB] dark:text-[#383837]">·</span>
        <span className="font-semibold text-[#FF3E00] dark:text-[#FF5722]">100%</span>
      </div>

      {/* 2. Interactive Figma-Style Cursor with Badge Tag */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="absolute top-0 left-0"
      >
        {/* Figma Arrow Pointer */}
        <div className="relative -top-1 -left-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-sm transition-transform duration-150"
            style={{
              transform: cursorContext.type === "photo" ? "scale(1.15) rotate(-6deg)" : "scale(1)",
            }}
          >
            {/* Outer dark/light stroke */}
            <path
              d="M5.5 3.5L18.5 13.5L12 14.5L9.5 20.5L5.5 3.5Z"
              fill={cursorContext.type === "photo" ? "#FF3E00" : isDark ? "#F5F5F3" : "#121212"}
              stroke={isDark ? "#000000" : "#FFFFFF"}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Figma Cursor Badge Tag */}
          {cursorContext.type !== "default" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 10, y: 0 }}
              animate={{ opacity: 1, scale: 1, x: 16, y: 4 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-0 whitespace-nowrap flex flex-col items-start gap-0.5 px-2 py-0.5 rounded-sm shadow-md"
              style={{
                backgroundColor:
                  cursorContext.type === "photo"
                    ? "#FF3E00"
                    : cursorContext.type === "email"
                    ? "#0D99FF"
                    : isDark
                    ? "#282827"
                    : "#121212",
                color: "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-1 font-mono text-[9px] font-bold tracking-wider uppercase">
                <span>{cursorContext.label}</span>
              </div>
              {cursorContext.specs && (
                <div className="font-mono text-[8px] text-white/80 font-normal tracking-tight">
                  {cursorContext.specs}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
