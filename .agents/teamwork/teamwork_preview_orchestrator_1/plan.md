# Plan: Photography Showcase Portfolio

## Objective
Deliver an editorial, tactile photography showcase website for Thai street & documentary photographer Chakarin L. (BeamingMotion) satisfying all requirements R1 to R5 and acceptance criteria.

## Phase 0: Survey & Discovery (Parallel Exploration)
- Dispatch 3 Explorers (`teamwork_preview_explorer`):
  1. `explorer_codebase`: Survey existing codebase structure, framework (Next.js/React/Vite/Astro), styles (Tailwind/CSS modules), components, build tooling, linting, current `src/config/gallery.ts`.
  2. `explorer_photos`: Survey external photo source `/Volumes/CHAKARIN L` (specifically the 3 collections: October 6 Commemoration, Polsci Live Music, Hua Hin Studies), check availability, image counts, resolutions, EXIF data, and optimization tools (`sips`, `sharp`, `imagemagick`).
  3. `explorer_interactions`: Survey existing interaction implementations (BrandMark scroll morph, themes, Lenis scroll, audio/haptic hooks, modal lightbox), identify gaps vs R2, R3, R4, R5.

## Phase 1: Feature Inventory & Architecture Decomposition
- Merge findings into `PROJECT.md` at project root with:
  - Architecture & Code Layout
  - Feature Inventory (every requirement mapped to milestone)
  - Milestones with dependencies and interface contracts
- Setup E2E test plan / infrastructure (`TEST_INFRA.md`).

## Phase 2: Milestone Execution (Worker -> Reviewer -> Challenger -> Auditor)
- Milestone 1: Photo Curation, Ingestion, Optimization & `src/config/gallery.ts` EXIF configuration.
- Milestone 2: Grid Layout, Visual Themes & Responsive Design (Mobile 375px/393px, Tablet 768px/1024px, Desktop 1440px+, darkroom charcoal vs fine-art paper).
- Milestone 3: Tactile Gimmicks & Interactions (BrandMark scroll morph, lens selector filter, tactile audio/haptics, photobook lightbox modal).
- Milestone 4: Performance, Lenis Smooth Scroll, Turbopack Build & Brand Invariants (`CHAKARIN L.`, strictly `Sony α7 III`, `© CHAKARIN L. 2026`).

## Phase 3: Adversarial Verification & Integrity Audit
- Run Challenger tests for edge cases, viewport overflows, missing Greek α characters, broken images.
- Run Forensic Auditor (`teamwork_preview_auditor`) for authentic logic, zero facade/dummy violations.

## Phase 4: Delivery
- Verify all acceptance criteria.
- Report complete findings with evidence to parent.
