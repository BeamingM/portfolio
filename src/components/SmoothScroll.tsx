"use client";

import { ReactNode, useState, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

function LenisGlobalSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window !== "undefined" && lenis) {
      (window as unknown as { lenis?: typeof lenis }).lenis = lenis;
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as unknown as { lenis?: unknown }).lenis = undefined;
      }
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  // Default to true (safe native momentum scrolling) so Lenis never mounts on mobile touch devices
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Detect mobile touch devices to preserve native fluid momentum scrolling without interception
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouch(isCoarse || hasTouch || window.innerWidth < 768);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // On touch/mobile devices, rely directly on hardware-accelerated native smooth scrolling
  if (isTouch) {
    return <>{children}</>;
  }

  // On desktop fine-pointer devices, enhance with Lenis smooth wheel
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      <LenisGlobalSync />
      {children}
    </ReactLenis>
  );
}
