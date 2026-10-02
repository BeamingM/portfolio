---
name: "CHAKARIN L. — Visual Media & Photography"
version: "1.0.0"
description: "Utilitarian tech-chic and cinematic scrollytelling design system combining Teenage Engineering hardware aesthetic, Apple minimalism, and OpenAI Astra precision."
theme:
  mode: "light-bone"
  palette:
    background: "#FBFBF9"
    surface: "#F4F4F0"
    border: "#E5E5DF"
    foreground: "#121212"
    muted: "#737373"
    accent: "#FF3E00"
  typography:
    sans: "Geist Sans, Inter, -apple-system, sans-serif"
    mono: "Geist Mono, Space Mono, monospace"
  spacing:
    hud_padding: "1.25rem 2rem"
    border_radius: "2px"
---

# DESIGN.md — Design System Specification

## 1. Aesthetic DNA & Philosophy
- **Teenage Engineering:** Hardware-inspired functionalism, subtle tactile borders (1px hairline), monospace technical badges, and a surgical touch of Safety Orange (`#FF3E00`) for indicators.
- **Apple:** Seamless micro-interactions, effortless typography hierarchy, full-bleed media prominence, and unobtrusive language toggle.
- **OpenAI Astra:** Deliberately quiet, clinical precision, zero clutter, letting the photographic artifacts speak for themselves.

## 2. Color System
| Role | Hex | Usage |
|---|---|---|
| **Canvas Background** | `#FBFBF9` | Warm off-white paper canvas |
| **Surface / Card** | `#F4F4F0` | Matte bone ceramic container (About Drawer) |
| **Hairlines / Dividers** | `#E5E5DF` | 1px subtle technical separation lines |
| **Primary Text** | `#121212` | Deep charcoal black for high legibility |
| **Technical Metadata** | `#737373` | Graphite monospace text for camera specs & coordinates |
| **Hardware Indicator** | `#FF3E00` | Safety orange accent point (pulsing active status) |

## 3. Typography Rules
- **Display & Prose:** `Geist Sans` (Tracking: -0.01em to -0.02em)
  - Used for personal statements, headings, and about section body.
- **Technical Metadata & HUD:** `Geist Mono` (Tracking: +0.05em to +0.1em uppercase)
  - Used for camera EXIF metrics (e.g. `35MM · F/1.4 · 1/500S · ISO 100`), live Bangkok clock, GPS coordinates, frame counters (`[01 / 04]`), and action buttons (`[ABOUT / INFO]`, `[COPY]`).

## 4. UI Architecture & Components
1. **Pinned Viewport Stage (`ScrollytellingStage`):**
   - Full viewport height (`100vh`) with centered framed canvas.
   - 60fps smooth scrubbing with subtle scale/fade transitions.
   - Subtly rounded corners (`rounded-xs`), technical watermark markers on photo corners.
2. **Dynamic Heads-Up Display (HUD Header & Footer):**
   - Fixed positioning (`fixed top-0`, `fixed bottom-0`).
   - Semi-transparent backdrop (`bg-white/70 backdrop-blur-sm`).
   - Live time zone indicator: `BKK HH:MM:SS`.
   - Hardware counter: `FRAME [XX / XX]`.
3. **Slide-over Drawer (`AboutDrawer`):**
   - Clean right-hand drawer on `#F4F4F0` surface.
   - Dual-language support (`EN / TH`).
   - Click-to-copy interaction with instant `[COPIED]` feedback.
