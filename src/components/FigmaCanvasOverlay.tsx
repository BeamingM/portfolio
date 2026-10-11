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

  // Direct mouse positions for 0-latency crisp cursor replacement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Soft trailing spring for the floating badge tag (like Figma multiplayer name tag)
  const tagX = useSpring(mouseX, { damping: 28, stiffness: 300, mass: 0.4 });
  const tagY = useSpring(mouseY, { damping: 28, stiffness: 300, mass: 0.4 });

  useEffect(() => {
    // Only enable on desktop mouse/trackpad viewports
    const mediaQuery = window.matchMedia("(pointer: fine)");
    queueMicrotask(() => {
      setIsFinePointer(mediaQuery.matches);
    });

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
      if (!isVisible) setIsVisible(true);

      // Detect hover target context
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const photoEl = target.closest("[data-figma-photo]");
      if (photoEl) {
        const series = photoEl.getAttribute("data-photo-series") || "Documentary Frame";
        const specs = photoEl.getAttribute("data-photo-specs") || "Sony α7 III";
        setCursorContext({
          type: "photo",
          label: series,
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
        setCursorContext({ type: "button" });
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
  const accentOrange = isDark ? "#FFA000" : "#FF9500";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Polite, Gentle Rounded Cursor (Zero-latency direct follow) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        className="fixed top-0 left-0"
      >
        <div
          style={{
            transform: `translate(-1px, -1px) scale(${isMouseDown ? 0.9 : cursorContext.type === "button" ? 0.94 : 1})`,
            transformOrigin: "top left",
            transition: "transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative pointer-events-none"
        >
          {/* Gentle, polite rounded arrow with soft fillets and gentle curves */}
          <svg
            width="19"
            height="19"
            viewBox="0 0 20 20"
            fill="none"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            <path
              d="M3.5 2.5 C3.0 2.2 2.4 2.6 2.4 3.2 L2.4 15.2 C2.4 15.8 3.2 16.2 3.7 15.7 L7.2 12.4 C7.5 12.1 7.9 11.9 8.3 11.9 L14.2 11.9 C14.8 11.9 15.2 11.1 14.7 10.6 L3.5 2.5 Z"
              fill={cursorContext.type === "photo" ? accentOrange : isDark ? "#FFFFFF" : "#141414"}
              stroke={isDark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.95)"}
              strokeWidth="1.3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* 2. Trailing Photo Pill Tag (Only appears gently when hovering photographs) */}
      {cursorContext.type === "photo" && (
        <motion.div
          style={{
            x: tagX,
            y: tagY,
          }}
          className="fixed top-0 left-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 14, y: 14 }}
            animate={{ opacity: 1, scale: 1, x: 16, y: 14 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg pointer-events-none bg-black/85 dark:bg-black/90 backdrop-blur-md border border-white/15 text-white"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
            <span className="font-mono text-[9px] font-semibold tracking-wider uppercase text-white/95">
              {cursorContext.label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
