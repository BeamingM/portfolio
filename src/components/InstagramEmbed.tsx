"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

interface InstagramEmbedProps {
  postUrl?: string;
}

interface InstagramWindow extends Window {
  instgrm?: {
    Embeds: {
      process: () => void;
    };
  };
}

export default function InstagramEmbed({
  postUrl = "https://www.instagram.com/p/DcbOhDcmWNE/",
}: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Process Instagram embed on mount
    const processEmbed = () => {
      if (typeof window !== "undefined") {
        const win = window as unknown as InstagramWindow;
        if (win.instgrm) {
          win.instgrm.Embeds.process();
        } else {
          const existingScript = document.getElementById("instagram-embed-script");
          if (!existingScript) {
            const script = document.createElement("script");
            script.id = "instagram-embed-script";
            script.src = "https://www.instagram.com/embed.js";
            script.async = true;
            script.onload = () => {
              const loadedWin = window as unknown as InstagramWindow;
              loadedWin.instgrm?.Embeds?.process();
            };
            document.body.appendChild(script);
          }
        }
      }
    };

    processEmbed();
    const timer = setTimeout(processEmbed, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        data-figma-photo="true"
        data-photo-series="TU PHOTO · Official Instagram Feature"
        data-photo-specs="Instagram Embed · @beamingmotion"
        className="relative w-full max-w-[540px] mx-auto bg-[#FFFFFF] p-3 sm:p-4 md:p-5 pb-4 md:pb-5 rounded-sm border border-[#E5E5DF] dark:border-[#2C2C2B] shadow-sm hover:shadow-md transition-shadow duration-200 group overflow-hidden"
      >
        {/* Embedded Instagram Media */}
        <div className="relative w-full overflow-hidden rounded-xs bg-white">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned=""
            data-instgrm-permalink={postUrl}
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: "3px",
              boxShadow: "none",
              margin: "1px",
              maxWidth: "540px",
              minWidth: "260px",
              padding: 0,
              width: "calc(100% - 2px)",
            }}
          >
            <div style={{ padding: "16px" }}>
              <a
                href={postUrl}
                style={{
                  background: "#FFFFFF",
                  lineHeight: 0,
                  padding: "0 0",
                  textAlign: "center",
                  textDecoration: "none",
                  width: "100%",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "50%",
                      flexGrow: 0,
                      height: "40px",
                      marginRight: "14px",
                      width: "40px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#F4F4F4",
                        borderRadius: "4px",
                        flexGrow: 0,
                        height: "14px",
                        marginBottom: "6px",
                        width: "100px",
                      }}
                    />
                    <div
                      style={{
                        backgroundColor: "#F4F4F4",
                        borderRadius: "4px",
                        flexGrow: 0,
                        height: "14px",
                        width: "60px",
                      }}
                    />
                  </div>
                </div>
                <div style={{ padding: "19% 0" }} />
                <div style={{ paddingTop: "8px", color: "#3897f0", fontSize: "14px", fontWeight: 550 }}>
                  View this publication on Instagram
                </div>
              </a>
            </div>
          </blockquote>

        </div>

        {/* Documentary Footer Bar */}
        <div className="mt-3 px-0.5 flex items-center justify-between gap-2.5 font-mono text-[10px] md:text-[11px] text-[#6B6B67] border-t border-[#F0F0EA] pt-2.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="font-bold tracking-wider text-[#121212] uppercase text-[10px] sm:text-[11px] shrink-0 group-hover:text-[#FF9500] transition-colors">
              TU PHOTO
            </span>
            <span className="text-[#D1D1CB] shrink-0">·</span>
            <span className="text-[#6B6B67] truncate min-w-0 tracking-wide text-[10px]">
              Official Instagram Feature
            </span>
          </div>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-[#FF9500] hover:text-[#FFA000] font-semibold shrink-0 cursor-pointer"
          >
            <span>@beamingmotion</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
