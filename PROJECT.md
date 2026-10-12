# Project: Editorial Photography Showcase Portfolio (Chakarin L. / BeamingMotion)

## Architecture
- **Framework**: Next.js 16.3.8 (App Router with Turbopack), React 19.2.8, TypeScript 5.
- **Routes**:
  - `/`: Main gallery exhibition, hero BrandMark scroll morph, SectionFilterBar, EditorialPhotobook, PhotoModal lightbox, AtelierDrawer, SiteFooter.
  - `/about`: Dedicated photographer bio, equipment repertoire, direct inquiries, dedicated back-navigation header, AtelierDrawer, SiteFooter.
- **Styling**: Tailwind CSS v4 with custom theme tokens (`#0D0D0D`, `#161616` darkroom charcoal vs `#FBFBF9`, `#FFFFFF` archival fine-art paper). Frosted glass blur (`backdrop-blur-2xl`, `backdrop-blur-md`).
- **Smooth Scroll**: Lenis smooth scrolling (60fps momentum scrolling on desktop, native on mobile).
- **Data Flow**:
  - `src/config/gallery.ts`: Single source of truth for photo catalog, EXIF specifications, sections, and `siteProfile` (gear profile, lenses, bio).
  - `src/context/`: `ThemeContext` (dark/light sync), `LanguageContext` (TH/EN bilingual), `SoundContext` / audio controls.
  - `src/components/`:
    - `TopNav.tsx` & `BrandMark.tsx`: Header navigation with mobile ergonomics (strictly `CHAKARIN L.` + `Menu` on mobile; horizontal tabs + toggles on desktop).
    - `AtelierDrawer.tsx`: Frosted glass drawer combining Series Archive filter, navigation, bio story, equipment specs, direct contact, and bottom utility switches.
    - `SiteFooter.tsx`: Apple/Vercel-style 4-column editorial sitemap footer + bottom utilities (Theme, TH/EN, copyright `© CHAKARIN L. 2026 · BEAMINGMOTION. ALL RIGHTS RESERVED.`).
    - `SectionFilterBar.tsx`: Project series filter.
    - `EditorialPhotobook.tsx`: Adaptive masonry gallery.
    - `PhotoModal.tsx`: Photobook lightbox modal with zoom, touch swipe, EXIF HUD.
    - `InteractivePrintCard.tsx`: 3D tilt perspective and glossy holographic sheen print card.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Documentary Photo Ingestion | 16 photos ingested from `/Volumes/CHAKARIN L` downscaled to 2400px sRGB quality 86% | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Gallery Metadata & EXIF Config | `gallery.ts` configured with authentic titles, series, aperture, shutter, ISO, locations, and `Sony α7 III` | M1 | ORIGINAL_REQUEST §R1 |
| 3 | BrandMark Scroll Morph | Smooth interpolation of brand title from center hero to top navigation on scroll | M2 | ORIGINAL_REQUEST §R4 |
| 4 | Lens Selector & Filter | Interactive filter UI allowing filtering photos by camera/lens/focal-lengths | M2 | ORIGINAL_REQUEST §R4 |
| 5 | Tactile Audio & Mute Control | Tactile sound effects / controller structure | M2 | ORIGINAL_REQUEST §R4 |
| 6 | Photobook Lightbox Modal | Keyboard navigation, touch swipe, 1:1 zoom inspection, body scroll locking, EXIF HUD | M2 | ORIGINAL_REQUEST §R4 |
| 7 | Cross-Device Responsive Layout | Mobile (375px/393px), tablet (768px/1024px), desktop (1440px+) without horizontal overflow | M2 | ORIGINAL_REQUEST §R2 |
| 8 | High-Contrast Dark & Light Themes | Darkroom charcoal vs archival paper with system preference sync & toggle | M2 | ORIGINAL_REQUEST §R3 |
| 9 | Lenis Smooth Scroll Integration | 60fps momentum scrolling on desktop, native on mobile | M2 | ORIGINAL_REQUEST §R5 |
| 10 | Strict Brand Invariants | Enforce `CHAKARIN L.`, strictly `Sony α7 III` with Greek α (U+03B1), `© CHAKARIN L. 2026` | M2 | ORIGINAL_REQUEST §R5 |
| 11 | Turbopack Build & Lint Integrity | Clean build with `npm run build` and 0 lint errors | M2 | ORIGINAL_REQUEST §R5 |
| 12 | Initial E2E Verification & Audit | Tiers 1–4 test suite, Challenger testing, and Forensic integrity audit for M1/M2 | M2 | ORIGINAL_REQUEST AC |
| 13 | Mobile-Only Navigation Overhaul | Minimal sticky header with only `CHAKARIN L.` + Menu button; frosted glass drawer with filters, bio, equipment, contact, utilities; desktop nav intact | M3 | ORIGINAL_REQUEST Follow-up §R1 |
| 14 | Footer Sitemap & Global Utilities | Apple/Vercel-style editorial sitemap footer with 4 columns: Brand, Archives, Navigation, Equipment; plus bottom utility controls (Theme, TH/EN, Copyright) | M3 | ORIGINAL_REQUEST Follow-up §R2 |
| 15 | Dedicated `/about` Route | Standalone route `chakarin.pics/about` with photographic bio, equipment specs, direct inquiries, editorial typography, dedicated header with back nav | M3 | ORIGINAL_REQUEST Follow-up §R3 |
| 16 | Gear & Invariant Harmonization | Strict lens names (`Zeiss Sonnar FE 35mm F2.8 ZA`, `Zeiss Sonnar FE 55mm F1.8 ZA`, `FE 28-70mm F3.5-5.6 OSS`), copyright `© CHAKARIN L. 2026`, GitHub link, dynamic footer counts | M3 | Survey Findings |
| 17 | Final E2E Suite & Forensic Audit | Comprehensive automated verification suite (Tiers 1-5), adversarial stress tests, and Forensic Integrity Victory Audit | M3 | ORIGINAL_REQUEST Follow-up AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Photo Ingestion & Metadata | Ingest photos, configure `gallery.ts` | None | DONE |
| 2 | Camera Gimmicks & Responsive Layout | BrandMark morph, lens filter, modal, themes, Lenis | M1 | DONE |
| 3 | Follow-up Features Harmonization & Integration | R1 (Mobile Nav), R2 (Footer Sitemap), R3 (/about Route), Gear Harmonization, Build & Verification | M1, M2 | DONE |
| 4 | Final E2E Verification & Forensic Victory Audit | Comprehensive E2E suite, Challenger adversarial stress, Forensic Auditor hard veto check | M3 | IN_PROGRESS |

## Interface Contracts
### `src/config/gallery.ts` ↔ UI Components
```typescript
export interface PhotoSpecs {
  camera: string;      // Strictly "Sony α7 III" (Greek α U+03B1)
  lens: string;        // e.g. "FE 28-70mm F3.5-5.6 OSS (28mm)" or gear lenses
  aperture: string;    // e.g. "f/3.5"
  shutter: string;     // e.g. "1/125s"
  iso: number | string;// e.g. 160 or "ISO 160"
  focalLength?: string;// e.g. "28mm"
  location: string;    // e.g. "Hua Hin Beach, Prachuap Khiri Khan"
  year: number | string;// e.g. 2026
}

export interface PhotoItem {
  id: string;
  src: string;         // "/photos/<filename>.jpg"
  alt: string;
  title: string;
  titleTh?: string;
  subtitle: string;
  series: string;
  section?: "personal" | "tu-photo" | "psctu";
  sectionId: "personal" | "tu-photo" | "psctu";
  projectFolder: string;
  category?: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  specs: PhotoSpecs;
  featured?: boolean;
}

export interface SiteProfile {
  name: string;
  alias: string;
  role: string;
  location: string;
  bio: { en: string; th: string };
  gear: {
    system: string;
    lenses: string[];
    optics: string[];
  };
  contact: {
    email: string;
    instagram: string;
    instagramUrl: string;
    twitter?: string;
    github: string;
  };
}
```

## Code Layout
- `public/photos/`: Optimized Web JPEG assets (~2400px width, sRGB, quality 86%, EXIF preserved).
- `public/resume.pdf`: Photographer CV and curriculum vitae.
- `src/config/gallery.ts`: Master photography catalog and metadata.
- `src/components/`:
  - `TopNav.tsx`: Fixed navigation bar, BrandMark morph container, mobile Menu button, desktop controls.
  - `BrandMark.tsx`: Fluid typography component.
  - `SectionFilterBar.tsx`: Series filter tabs.
  - `EditorialPhotobook.tsx`: Adaptive masonry gallery.
  - `PhotoModal.tsx`: Photobook lightbox modal with zoom, touch swipe, EXIF HUD.
  - `AtelierDrawer.tsx`: Frosted glass drawer with category filters, bio, equipment, and bottom utilities.
  - `SiteFooter.tsx`: 4-column editorial sitemap footer with bottom utilities and copyright.
  - `InteractivePrintCard.tsx`: 3D perspective tilt & holographic print card.
  - `SmoothScroll.tsx`: Lenis smooth scroll provider.
- `src/context/`:
  - `ThemeContext.tsx`: Dark/light mode provider.
  - `LanguageContext.tsx`: Bilingual English/Thai provider.
  - `SoundContext.tsx`: Tactile sound state provider.
- `src/app/`:
  - `page.tsx`: Home photobook exhibition page.
  - `about/page.tsx`: Dedicated /about server route with SEO metadata.
  - `about/AboutClient.tsx`: Dedicated /about client exhibition.
  - `globals.css`: Design system CSS variables and styling tokens.
