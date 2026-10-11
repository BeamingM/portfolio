# E2E Test Infra: Photography Showcase Portfolio

## Test Philosophy
- Opaque-box, requirement-driven, independently verifying user acceptance criteria from ORIGINAL_REQUEST.md.
- 4-Tier Test Architecture:
  - **Tier 1: Feature Coverage (>=5 per feature area)**: Verify presence, integrity, and basic execution of each feature in isolation (photo assets, metadata, filters, audio toggle, theme toggle, lightbox).
  - **Tier 2: Boundary & Corner Cases (>=5 per feature area)**: Viewport stress (375px, 393px, 768px, 1024px, 1440px+), rapid filter clicking, empty state prevention, ESC/arrow boundary navigation in modal, extreme aspect ratio image rendering.
  - **Tier 3: Cross-Feature Combinations**: Filter by Section + Filter by Lens simultaneously; Theme toggle while modal is open; Language toggle while BrandMark is scrolled; Audio click triggering across all interactive controls.
  - **Tier 4: Real-World Application Workloads**: Complete visitor journey: load hero, scroll down with Lenis, observe BrandMark morph into top nav, toggle theme to light and dark, filter by October 6 Commemoration, click photo to open lightbox, zoom in 1:1, swipe/navigate next with arrow keys, inspect complete EXIF HUD (Sony α7 III, aperture, shutter, ISO, location), close modal with ESC.

## Feature Inventory Mapping
| # | Feature | Requirement | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|-------------|:------:|:------:|:------:|:------:|
| 1 | Documentary Photos Ingested | R1 | 5 | 5 | ✓ | ✓ |
| 2 | Gallery Metadata & EXIF | R1 | 5 | 5 | ✓ | ✓ |
| 3 | BrandMark Scroll Morph | R4 | 5 | 5 | ✓ | ✓ |
| 4 | Lens Selector & Filter | R4 | 5 | 5 | ✓ | ✓ |
| 5 | Tactile Audio & Toggle | R4 | 5 | 5 | ✓ | ✓ |
| 6 | Photobook Lightbox Modal | R4 | 5 | 5 | ✓ | ✓ |
| 7 | Cross-Device Responsive Grid | R2 | 5 | 5 | ✓ | ✓ |
| 8 | High-Contrast Themes | R3 | 5 | 5 | ✓ | ✓ |
| 9 | Lenis Smooth Scroll | R5 | 5 | 5 | ✓ | ✓ |
| 10 | Strict Brand Invariants | R5 | 5 | 5 | ✓ | ✓ |
| 11 | Turbopack Build & Lint | R5 | 5 | 5 | ✓ | ✓ |

## Test Suite Execution
- Automated verification script: `scripts/verify-e2e.mjs`
- Command: `node scripts/verify-e2e.mjs`
- Acceptance criteria: 100% test passing, 0 errors.
