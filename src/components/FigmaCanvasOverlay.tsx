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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorContext, setCursorContext] = useState<CursorContext>({ type: "default" });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Direct mouse positions for 0-latency crisp cursor replacement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Soft trailing spring for the floating badge tag (like Figma multiplayer name tag)
  const tagX = useSpring(mouseX, { damping: 28, stiffness: 300, mass: 0.4 });
  const tagY = useSpring(mouseY, { damping: 28, stiffness: 300, mass: 0.4 });

  useEffect(() => {
    // Only enable on desktop mouse/trackpad viewports
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    if (mediaQuery.matches) {
      document.documentElement.classList.add("figma-cursor-active");
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
      if (e.matches) {
        document.documentElement.classList.add("figma-cursor-active");
      } else {
        document.documentElement.classList.remove("figma-cursor-active");
      }
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

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsMouseDown(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.documentElement.classList.remove("figma-cursor-active");
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isFinePointer || !isVisible) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Figma-style Canvas Coordinate HUD in bottom-right corner */}
      <div className="fixed bottom-4 right-4 hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4F4F0]/90 dark:bg-[#1A1A19]/90 border border-[#E5E5DF] dark:border-[#282827] backdrop-blur-xs font-mono text-[9px] tracking-wider text-[#737373] dark:text-[#9E9E9C] shadow-2xs">
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

      {/* 2. Primary Figma Vector Cursor (Zero-latency direct follow) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        className="fixed top-0 left-0"
      >
        <div
          style={{
            transform: `translate(-2px, -2px) scale(${isMouseDown ? 0.88 : 1})`,
            transformOrigin: "top left",
            transition: "transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative pointer-events-none"
        >
          {/* Authentic Figma Canvas Vector Pointer */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-md"
          >
            {/* Outer high-contrast stroke + inner fill */}
            <path
              d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z"
              fill={cursorContext.type === "photo" ? "#FF3E00" : isDark ? "#FFFFFF" : "#0D0D0D"}
              stroke={isDark ? "#000000" : "#FFFFFF"}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* 3. Trailing Figma Tag Badge (Follows with gentle fluid spring) */}
      {cursorContext.type !== "default" && (
        <motion.div
          style={{
            x: tagX,
            y: tagY,
          }}
          className="fixed top-0 left-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 14, y: 14 }}
            animate={{ opacity: 1, scale: 1, x: 16, y: 14 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            className="whitespace-nowrap flex flex-col items-start gap-0.5 px-2 py-0.5 rounded-sm shadow-md pointer-events-none"
            style={{
              backgroundColor:
                cursorContext.type === "photo"
                  ? "#FF3E00"
                  : cursorContext.type === "email"
                  ? "#0D99FF"
                  : isDark
                  ? "#242423"
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
        </motion.div>
      )}
    </div>
  );
}
