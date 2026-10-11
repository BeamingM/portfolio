# Project: Editorial Photography Showcase Portfolio (Chakarin L. / BeamingMotion)

## Architecture
- **Framework**: Next.js 16.3.8 (App Router with Turbopack), React 19.2.8, TypeScript 5.
- **Styling**: Tailwind CSS v4 with custom theme tokens (`#0D0D0D`, `#161616` darkroom charcoal vs `#FBFBF9`, `#FFFFFF` archival fine-art paper).
- **Smooth Scroll**: Lenis smooth scrolling (60fps momentum scrolling).
- **Audio & Haptics**: Synthesized tactile audio feedback with user mute/unmute persistence.
- **Data Flow**:
  - `src/config/gallery.ts`: Single source of truth for photo metadata, EXIF specifications, sections, and photographer gear profile.
  - `src/context/`: `ThemeContext` (dark/light sync), `LanguageContext` (TH/EN bilingual), `SoundContext` / audio controls.
  - `src/components/`:
    - `TopNav.tsx` & `BrandMark.tsx`: Header navigation with BrandMark scroll morph, sound toggle, theme toggle, language toggle.
    - `SectionFilterBar.tsx`: Project series filter and lens filter.
    - `EditorialPhotobook.tsx`: Adaptive 2-column masonry grid balancing aspect ratios.
    - `PhotoModal.tsx`: Tactile photobook lightbox modal with zoom inspection, touch swipe, keyboard nav, and complete EXIF HUD.
    - `AtelierDrawer.tsx`: Photographer gear drawer, bio, and camera specifications.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Documentary Photo Ingestion | Ingest 16 high-impact photos from `/Volumes/CHAKARIN L` (6 Oct 6, 5 Polsci Music, 5 Hua Hin) downscaled to 2400px sRGB quality 86% into `public/photos/` | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Gallery Metadata & EXIF Config | Configure `src/config/gallery.ts` with authentic titles, series, aperture, shutter, ISO, locations, and `Sony α7 III` | M1 | ORIGINAL_REQUEST §R1 |
| 3 | BrandMark Scroll Morph | Smooth CSS interpolation of brand title from center hero to top navigation on scroll without discrete jumps or text twitch | M2 | ORIGINAL_REQUEST §R4 |
| 4 | Lens Selector & Filter | Interactive filter UI allowing filtering photos by camera/lens/focal-lengths | M2 | ORIGINAL_REQUEST §R4 |
| 5 | Tactile Audio & Mute Control | Tactile sound effects on interactive elements with UI mute/unmute control | M2 | ORIGINAL_REQUEST §R4 |
| 6 | Photobook Lightbox Modal | Keyboard navigation, touch swipe, 1:1 zoom inspection, body scroll locking, and full EXIF HUD | M2 | ORIGINAL_REQUEST §R4 |
| 7 | Cross-Device Responsive Layout | Mobile (375px/393px), tablet (768px/1024px), desktop (1440px+) without horizontal overflow or header collisions | M2 | ORIGINAL_REQUEST §R2 |
| 8 | High-Contrast Dark & Light Themes | Darkroom charcoal (`#0D0D0D`, `#161616`) vs archival paper (`#FBFBF9`, `#FFFFFF`) with system preference sync & toggle | M2 | ORIGINAL_REQUEST §R3 |
| 9 | Lenis Smooth Scroll Integration | Initialize Lenis smooth scroll for fluid 60fps momentum scrolling | M2 | ORIGINAL_REQUEST §R5 |
| 10 | Strict Brand Invariants | Enforce `CHAKARIN L.`, strictly `Sony α7 III` with Greek α (U+03B1), `© CHAKARIN L. 2026` | M2 | ORIGINAL_REQUEST §R5 |
| 11 | Turbopack Build & Lint Integrity | Clean build with `npm run build` and 0 lint errors | M2 | ORIGINAL_REQUEST §R5 |
| 12 | End-to-End Verification & Audit | Tiers 1–4 test suite, Challenger stress testing, and Forensic integrity audit | M3 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Photo Curation, Ingestion & Metadata | Ingest 16 photos into `public/photos/`, configure `gallery.ts` and language copy | None | DONE |
| 2 | Camera Gimmicks, Responsive Layout, Themes & Lenis Scroll | BrandMark scroll morph, lens selector, sound toggle, lightbox zoom/touch, responsive nav & grid, dark/light themes, Lenis smooth scroll | M1 | IN_PROGRESS |
| 3 | E2E Testing, Adversarial Hardening & Final Forensic Audit | Automated E2E verification suite (Tiers 1-4), Challenger stress testing, and Forensic Integrity Victory Audit | M1, M2 | PLANNED |

## Interface Contracts
### `src/config/gallery.ts` ↔ UI Components
```typescript
export interface PhotoSpecs {
  camera: string;      // Strictly "Sony α7 III" (Greek α U+03B1)
  lens: string;        // e.g. "FE 28-70mm F3.5-5.6 OSS (28mm)" or gear lenses
  aperture: string;    // e.g. "f/3.5"
  shutter: string;     // e.g. "1/125s"
  iso: number;         // e.g. 160
  focalLength?: string;// e.g. "28mm"
  location: string;    // e.g. "Hua Hin Beach, Prachuap Khiri Khan"
  year: number;        // e.g. 2026
}

export interface PhotoItem {
  id: string;
  src: string;         // "/photos/<filename>.jpg"
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  title: string;
  titleTh?: string;
  subtitle: string;
  category: string;
  section: "personal" | "tu-photo" | "psctu";
  specs: PhotoSpecs;
  featured?: boolean;
}
```

### Sound Controller Interface (`src/utils/sound.ts`)
```typescript
export function playShutterClick(): void;
export function toggleSound(): boolean;
export function isSoundEnabled(): boolean;
export function setSoundEnabled(enabled: boolean): void;
```

## Code Layout
- `public/photos/`: Optimized Web JPEG assets (~2400px width, sRGB, quality 86%, EXIF preserved).
- `src/config/gallery.ts`: Master photography catalog and metadata.
- `src/components/`:
  - `TopNav.tsx`: Fixed navigation bar, theme toggle, audio toggle, BrandMark morph container.
  - `BrandMark.tsx`: Fluid typography component.
  - `SectionFilterBar.tsx`: Series filter tabs and lens selector filter.
  - `EditorialPhotobook.tsx`: Adaptive masonry gallery.
  - `PhotoModal.tsx`: Photobook lightbox modal with zoom, touch swipe, EXIF HUD.
  - `AtelierDrawer.tsx`: Gear repertoire and documentary statement.
  - `SmoothScroll.tsx`: Lenis smooth scroll provider.
- `src/context/`:
  - `ThemeContext.tsx`: Dark/light mode provider.
  - `LanguageContext.tsx`: Bilingual English/Thai provider.
  - `SoundContext.tsx`: Tactile sound state provider.
- `src/app/globals.css`: Design system CSS variables and styling tokens.
