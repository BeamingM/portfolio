"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { galleryItems, PhotoItem, getContactEmail } from "@/config/gallery";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { triggerHaptic } from "@/utils/haptics";
import { trackContactReveal } from "@/utils/analytics";
import {
  Search,
  FileText,
  Mail,
  Sun,
  Moon,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Twitter, Instagram } from "@/components/SocialIcons";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
  onSelectSection: (sectionId: string) => void;
}

interface ActionItem {
  id: string;
  title: string;
  category: "Action" | "Social" | "Navigation";
  icon: React.ReactNode;
  perform: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectPhoto,
  onSelectSection,
}: CommandPaletteProps) {
  const { lang, setLang } = useLanguage();
  const { toggleTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        triggerHaptic("light");
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const quickActions: ActionItem[] = useMemo(
    () => [
      {
        id: "resume",
        title: "Download Resume — Chakarin Limudom",
        category: "Action",
        icon: <FileText className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          window.open("/resume.pdf", "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "twitter",
        title: "Twitter / X — @beamingmotion",
        category: "Social",
        icon: <Twitter className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          window.open("https://x.com/beamingmotion", "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "instagram",
        title: "Instagram — @beamingmotion",
        category: "Social",
        icon: <Instagram className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          window.open("https://www.instagram.com/beamingmotion", "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "email",
        title: "Send Email / Contact",
        category: "Action",
        icon: <Mail className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          trackContactReveal("command_palette", "email");
          window.location.href = `mailto:${getContactEmail()}`;
          onClose();
        },
      },
      {
        id: "theme-toggle",
        title: `Switch Theme to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
        category: "Action",
        icon: resolvedTheme === "dark" ? <Sun className="w-4 h-4 text-[#FF9500]" /> : <Moon className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "lang-toggle",
        title: `Switch Language to ${lang === "th" ? "English (EN)" : "ไทย (TH)"}`,
        category: "Action",
        icon: <span className="font-mono text-xs font-bold text-[#FF9500]">TH/EN</span>,
        perform: () => {
          setLang(lang === "th" ? "en" : "th");
          onClose();
        },
      },
      {
        id: "sec-tu-photo",
        title: lang === "th" ? "หมวด: งานกิจกรรม (Activities & Events)" : "Section: Activities & Events (งานกิจกรรม)",
        category: "Navigation",
        icon: <ImageIcon className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          onSelectSection("tu-photo");
          onClose();
        },
      },
      {
        id: "sec-psctu",
        title: lang === "th" ? "หมวด: งานต่างๆ (Various Projects)" : "Section: Various Projects (งานต่างๆ)",
        category: "Navigation",
        icon: <ImageIcon className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          onSelectSection("psctu");
          onClose();
        },
      },
      {
        id: "sec-personal",
        title: lang === "th" ? "หมวด: งานส่วนตัว (Personal Works)" : "Section: Personal Works (งานส่วนตัว)",
        category: "Navigation",
        icon: <ImageIcon className="w-4 h-4 text-[#FF9500]" />,
        perform: () => {
          onSelectSection("personal");
          onClose();
        },
      },
    ],
    [lang, resolvedTheme, setLang, toggleTheme, onSelectSection, onClose]
  );

  // Search filtered photos
  const filteredPhotos = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return galleryItems.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        (p.titleTh && p.titleTh.toLowerCase().includes(q)) ||
        p.series.toLowerCase().includes(q) ||
        p.specs.location.toLowerCase().includes(q) ||
        (p.specs.focalLength && p.specs.focalLength.toLowerCase().includes(q)) ||
        p.projectFolder.toLowerCase().includes(q)
      );
    });
  }, [query]);

  // Combined searchable items
  const combinedItems = useMemo(() => {
    const q = query.toLowerCase();
    const matchedActions = query.trim()
      ? quickActions.filter((a) => a.title.toLowerCase().includes(q))
      : quickActions;

    return [
      ...matchedActions.map((a) => ({ type: "action" as const, item: a })),
      ...filteredPhotos.map((p) => ({ type: "photo" as const, item: p })),
    ];
  }, [query, quickActions, filteredPhotos]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleExecuteSelected = useCallback(() => {
    const current = combinedItems[selectedIndex];
    if (!current) return;
    triggerHaptic("snap");
    if (current.type === "action") {
      current.item.perform();
    } else {
      onSelectPhoto(current.item);
      onClose();
    }
  }, [combinedItems, selectedIndex, onSelectPhoto, onClose]);

  // Arrow navigation & Enter key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleExecuteSelected();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyNav);
    return () => window.removeEventListener("keydown", handleKeyNav);
  }, [isOpen, combinedItems.length, handleExecuteSelected, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#161616] border border-[#E5E5DF] dark:border-[#2C2C2B] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#EBEBE6] dark:border-[#242423]">
          <Search className="w-4 h-4 text-[#FF9500] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a command, photo title, lens, or location..."
            className="flex-1 bg-transparent text-[#121212] dark:text-[#F5F5F3] font-mono text-sm outline-none placeholder:text-[#888884]"
          />
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-md text-[#737373] hover:text-[#121212] dark:hover:text-[#F5F5F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="max-h-[380px] overflow-y-auto overscroll-contain p-2 space-y-1"
        >
          {combinedItems.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#737373] dark:text-[#9E9E9C]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            combinedItems.map((entry, idx) => {
              const isSelected = idx === selectedIndex;
              if (entry.type === "action") {
                const action = entry.item;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      triggerHaptic("snap");
                      action.perform();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left font-mono text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#FF9500] text-white font-bold"
                        : "text-[#121212] dark:text-[#F5F5F3] hover:bg-[#F4F4F0] dark:hover:bg-[#202020]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isSelected ? "text-white" : ""}>{action.icon}</span>
                      <span className="truncate">{action.title}</span>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#F0F0EA] dark:bg-[#262625] text-[#737373] dark:text-[#9E9E9C]"
                      }`}
                    >
                      {action.category}
                    </span>
                  </button>
                );
              }

              // Photo item
              const photo = entry.item;
              return (
                <button
                  key={photo.id}
                  onClick={() => {
                    triggerHaptic("snap");
                    onSelectPhoto(photo);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left font-mono text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#FF9500] text-white font-bold"
                      : "text-[#121212] dark:text-[#F5F5F3] hover:bg-[#F4F4F0] dark:hover:bg-[#202020]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-[#FF9500]"}`} />
                    <div className="truncate">
                      <div className="font-semibold truncate">{photo.title}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? "text-white/80" : "text-[#737373] dark:text-[#9E9E9C]"
                        }`}
                      >
                        {photo.series} · {photo.specs.location}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#F0F0EA] dark:bg-[#262625] text-[#737373] dark:text-[#9E9E9C]"
                    }`}
                  >
                    PRINT
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#EBEBE6] dark:border-[#242423] bg-[#FBFBF9] dark:bg-[#121212] flex items-center justify-between font-mono text-[10px] text-[#737373] dark:text-[#9E9E9C]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="text-[#FF9500] font-semibold">CHAKARIN.PICS</div>
        </div>
      </div>
    </div>
  );
}
