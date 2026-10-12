# Original User Request

## Initial Request — 2026-10-11T19:36:05Z

An editorial, tactile photography showcase website for Thai street & documentary photographer Chakarin L. (BeamingMotion) featuring cross-device responsiveness, interactive camera-inspired gimmicks, high-fidelity dark/light aesthetics, and authentic curated documentary photographs from Sony α7 III.

Working directory: `/Users/chakarin/Documents/Geek Stuffs/portfolio`
Integrity mode: demo

## Requirements

### R1. Curate & Ingest Compelling Documentary Photography
- Select and ingest the most visually captivating, authentic street and documentary photographs from `/Volumes/CHAKARIN L`:
  - **October 6 Commemoration Series** (`TU PHOTO 2026/50*6th OCT/0_TU_Photo_Main`): High-emotion documentary frames, candids, candlelight, and student movement at Thammasat University.
  - **Polsci Live Music / Film Look** (`PSC.TU/Polsci Music - FirstM33t 2026/Film Look`): Stage performance, cinematic tones, and moody light.
  - **Hua Hin Coastal & Street Studies** (`Personal Projects 2026/Hua Hin 2026 - Beam's Edited`): Architecture, twilight skies, and coastal geometry.
- Optimize images for web display (~2400–3200px width, sRGB, quality 85–88%) into `public/photos/`.
- Update `src/config/gallery.ts` with rich metadata: titles, series, aperture, shutter speed, ISO, and lenses (strictly `Sony α7 III`).

### R2. Cross-Device Responsive Layout & Adaptive Balanced Grid
- Flawlessly render across mobile (iOS Safari / Android Chrome, 375px–430px), tablet (iPad Mini / iPad Pro, 768px–1024px), and desktop (1280px–1920px+).
- Ensure the adaptive photobook grid balances columns dynamically without awkward whitespace or horizontal overflows on any screen width.

### R3. High-Contrast Dark & Light Visual Themes
- Dark Mode: deep photographic darkroom/charcoal theme (`#0D0D0D`, `#161616`).
- Light Mode: archival fine-art gallery paper theme (`#FBFBF9`, `#FFFFFF`).
- Synchronize automatically with system preference (`prefers-color-scheme`), with an instant tactile manual toggle.

### R4. Camera-Inspired Tactile Gimmicks & Interactive Features
- Fluid hero brand title morphing from center hero to top navigation on scroll without discrete jumps.
- Interactive camera metadata & lens selector / filter (Sony α7 III, Zeiss Sonnar FE 35mm F2.8 ZA, Zeiss Sonnar FE 55mm F1.8 ZA).
- Tactile sound effects and haptic feedback on interactive elements with mute/unmute control.
- Understated photobook lightbox modal with keyboard navigation (Esc, Arrow keys) and zoom inspection.

### R5. Performance & Rigorous Code Integrity
- Zero build errors (`npm run build` with Turbopack), 0 lint errors, and smooth 60fps scrolling via Lenis.
- Preserve brand invariants: Primary name `CHAKARIN L.`, camera name strictly `Sony α7 III` (Greek `α`), copyright `© CHAKARIN L. 2026`.

## Acceptance Criteria

### Photography & Content Verification
- [ ] At least 12–16 compelling, high-quality documentary photos from the October 6, Polsci Music, and Hua Hin series are ingested into `public/photos/` and displayed in the gallery.
- [ ] Photo titles, series, locations, and EXIF camera specs reflect authentic photographer work in `src/config/gallery.ts`.

### Visual & Layout Verification
- [ ] Responsive inspection passes on 375px (iPhone SE), 393px (iPhone 16 Pro), 768px (iPad Mini), 1024px (iPad Pro), and 1440px+ (Desktop).
- [ ] No horizontal scrolling or overflow-x leaks at any viewport width.
- [ ] Dark Mode and Light Mode exhibit distinct, unmistakable color contrast across all components.

### Interaction & Gimmick Verification
- [ ] BrandMark title smoothly morphs between centered hero and header navigation during scrolling without visual jumps.
- [ ] Audio/tactile clicks trigger reliably and respect user interaction states.
- [ ] Photo lightbox opens, closes, and navigates seamlessly via touch and keyboard.

### Build & Integrity Verification
- [ ] `npm run build` completes cleanly with 0 TypeScript and 0 build errors.
- [ ] All camera references strictly output `Sony α7 III` with Greek letter α (U+03B1).


## Follow-up — 2026-10-12T00:37:46Z

Editorial Portfolio Architecture & Features: Mobile Hamburger Navigation, Dedicated About Page (`/about`), and Comprehensive Footer Sitemap for `chakarin.pics`.

Working directory: `/Users/chakarin/Documents/Geek Stuffs/portfolio`

## Requirements

### R1. Mobile-Only Navigation Overhaul
Merge Category Dropdown and About Me into a clean, unified mobile hamburger drawer. Eliminate Dark Mode and TH/EN buttons from the mobile top header.

### R2. Footer Sitemap & Global Utilities
Add an Apple/Vercel-style editorial sitemap footer at the bottom of the site containing project archives, page navigation, equipment specs, and bottom utility controls (Dark/Light toggle, TH/EN switcher).

### R3. Dedicated `/about` Route
Implement a standalone `/about` route (`chakarin.pics/about`) featuring Chakarin's photographic bio, equipment specs, and direct inquiries.

## Acceptance Criteria

### Visual & Mobile Ergonomics
- [ ] Mobile sticky header contains only `CHAKARIN L.` on the left and a single Menu button on the right
- [ ] Tapping Menu opens a frosted glass drawer with category filter, about story, equipment, contact, and utilities
- [ ] Desktop navigation remains intact with horizontal tabs and utility toggles
- [ ] `/about` renders cleanly with full editorial typography and back navigation
- [ ] Production build passes with 0 errors and passes all E2E verification tests


## Follow-up — 2026-10-12T15:40:07Z

ขยายคลังภาพถ่ายและแกลเลอรีผลงานในเว็บไซต์พอร์ตโฟลิโอ (chakarin.pics) จาก 16 รูป สู่ 30–50+ รูปแบบจัดเต็ม โดยคัดเลือกรูปที่แต่งแล้วจาก Apple Photos (Favorites) และ External SSD เข้าสู่ระบบ พร้อมอัปเดตแคตตาล็อก EXIF แบบสองภาษา และพัฒนาระบบ Batch Lazy Loading / Infinite Collage ให้โหลดเร็ว ลื่นไหล 60fps บนทุกอุปกรณ์

Working directory: `/Users/chakarin/Documents/Geek Stuffs/portfolio`
Integrity mode: development

## Requirements

### R1. Curated Photo Ingestion from Apple Photos (Strict Read-Only)
Extract and export 30–50+ edited and favorited photos from Apple Photos (`❤️` Favorites) and `/Volumes/CHAKARIN L` into `public/photos/`. All source libraries and external drives must be accessed in strictly read-only mode; original photos must never be modified, renamed, or deleted. Ingested images must be web-optimized (JPEG/WebP) with proper dimensions.

### R2. Authentic Bilingual Catalog & EXIF Metadata Generation
Expand `src/config/gallery.ts` with authentic metadata for every new photo, including camera model (`Sony α7 III` with Greek lowercase α `U+03B1`), lens name, typographic ƒ-stop hook, shutter speed, ISO, shoot month/year, bilingual titles/subtitles, and section categories ("งานส่วนตัว", "งานกิจกรรม", "งานต่างๆ" โดยไม่อ้างชื่อหน่วยงานภายนอก).

### R3. High-Capacity Lazy Loading & Interleaved Masonry Collage
Upgrade `src/components/EditorialPhotobook.tsx` to handle 30–50+ photos seamlessly without DOM thrashing or memory bloat. Implement batch rendering, intersection-observer lazy loading, or progressive masonry loading, while maintaining an organic collage rhythm that alternates portrait (แนวตั้ง) and landscape (แนวนอน) photos.

### R4. Modal Viewer & Navigation Scalability
Ensure the fullscreen photo viewer (`src/components/PhotoModal.tsx`), native MacBook trackpad pinch-to-zoom & two-finger pan, icon-only controls, silent anti-theft shield, and keyboard/touch navigation work smoothly across all 30–50+ photos with zero memory leaks.

## Acceptance Criteria

### Data Safety & Asset Integrity
- [ ] Apple Photos library and `/Volumes/CHAKARIN L` are accessed strictly in read-only mode with zero file loss or mutation.
- [ ] Total photo catalog is expanded to between 30 and 50+ curated prints.
- [ ] Every item in `src/config/gallery.ts` corresponds to a valid existing file in `public/photos/` with web-optimized size (< 1.5MB).

### System Invariants & Standards
- [ ] Camera invariant strictly maintained across all entries: `Sony α7 III` with Greek lowercase α (`U+03B1`).
- [ ] Thai name invariant strictly maintained: `จักริน ลิ้มป์อุดม` (with ป์).
- [ ] Tagline invariant strictly maintained: `Photographer based in Bangkok`.
- [ ] `unoptimized: true` strictly maintained in `next.config.ts`.
- [ ] Secret date / birthday invariant strictly maintained (never displayed in UI).
- [ ] Category tabs and SiteFooter use clean generic titles ("งานส่วนตัว", "งานกิจกรรม", "งานต่างๆ") without citing third-party entity names.

### Verification & Performance
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `node scripts/verify-e2e.mjs` passes 100% of tests (updated to reflect new catalog size threshold).
- [ ] Gallery loads fast with lazy loading and maintains 60fps scrolling on both desktop and mobile devices.
