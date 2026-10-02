"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteProfile } from "@/config/gallery";
import { X, Copy, Check, ExternalLink } from "lucide-react";

interface AboutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutDrawer({ isOpen, onClose }: AboutDrawerProps) {
  const [lang, setLang] = useState<"en" | "th">("en");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteProfile.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#F4F4F0] border-l border-[#E5E5DF] text-[#121212] flex flex-col justify-between p-6 md:p-8 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E5E5DF]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                    SYS.INFO // ABOUT
                  </span>
                </div>
                <button
                  onClick={onClose}
                  type="button"
                  className="p-1 rounded-sm border border-neutral-300 hover:border-neutral-900 bg-white/60 transition-colors cursor-pointer"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4 text-neutral-700" />
                </button>
              </div>

              {/* Bio Statement */}
              <div className="mt-8 space-y-4">
                <h2 className="text-xl md:text-2xl font-normal tracking-tight font-sans text-neutral-900">
                  {siteProfile.name}
                </h2>
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                  {siteProfile.role} — {siteProfile.location}
                </p>

                <p className="text-sm leading-relaxed text-neutral-700 font-sans pt-2">
                  {lang === "en" ? siteProfile.bio.en : siteProfile.bio.th}
                </p>
                <p className="font-mono text-[11px] text-neutral-400">
                  GPS: {siteProfile.coordinates}
                </p>
              </div>

              {/* Hardware & Gear Specs */}
              <div className="mt-10 pt-6 border-t border-[#E5E5DF] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                  [EQUIPMENT & SPECIFICATIONS]
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-1 text-[11px] py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-400">BODY</span>
                  <span className="text-neutral-800">
                    {siteProfile.gear.bodies.join(" / ")}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-1 text-[11px] py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-400">OPTICS</span>
                  <span className="text-neutral-800">
                    {siteProfile.gear.optics.join(" / ")}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-1 text-[11px] py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-400">MEDIUM</span>
                  <span className="text-neutral-800">
                    {siteProfile.gear.medium.join(" / ")}
                  </span>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="mt-10 pt-6 border-t border-[#E5E5DF] space-y-3 font-mono text-xs">
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                  [COMMUNICATIONS]
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-sm border border-neutral-300 bg-white/70">
                  <span className="text-neutral-800 font-medium">
                    {siteProfile.contact.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FF3E00]" />
                        <span className="text-[#FF3E00] font-bold">[COPIED]</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>[COPY]</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={siteProfile.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-sm border border-neutral-300 bg-white/70 hover:border-neutral-900 transition-colors group cursor-pointer"
                >
                  <span className="text-neutral-800 font-medium">
                    @{siteProfile.contact.instagram}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 group-hover:text-black">
                    <span>INSTAGRAM</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </div>

            {/* Colophon & Language Switcher */}
            <div className="pt-8 border-t border-[#E5E5DF] flex items-center justify-between font-mono text-[10px] text-neutral-400 select-none">
              <div>© 2026 CHAKARIN L.</div>
              <div className="flex items-center gap-1 bg-white/60 border border-neutral-300 rounded-xs p-0.5">
                <button
                  onClick={() => setLang("en")}
                  type="button"
                  className={`px-1.5 py-0.5 rounded-2xs cursor-pointer ${
                    lang === "en"
                      ? "bg-neutral-900 text-white font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  EN
                </button>
                <span className="text-neutral-300">/</span>
                <button
                  onClick={() => setLang("th")}
                  type="button"
                  className={`px-1.5 py-0.5 rounded-2xs cursor-pointer ${
                    lang === "th"
                      ? "bg-neutral-900 text-white font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  TH
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
