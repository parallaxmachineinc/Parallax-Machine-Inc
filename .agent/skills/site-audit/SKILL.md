---
name: site-audit
description: >-
  Use this skill when auditing the Parallax Machine Inc website for build integrity,
  TypeScript conformance, accessibility, responsive layout stability, and performance.
---

# Site Audit & Verification Procedure

Follow this multi-step audit to ensure high standards before delivering changes.

## 1. Type Safety & Compilation

Run the TypeScript compiler with no emit:
```bash
npx tsc --noEmit
```
Expected output: Exit code 0 with zero diagnostic errors.

## 2. Production Build Verification

Run Next.js production build:
```bash
npm run build
```
Verify that all routes compile as static or server rendered (`○ (Static)`).

## 3. Layout & Scroll Stability Check

- Verify there are no horizontal scrollbars on desktop or mobile (`overflow-x: hidden`).
- Check that pinned scroll sections (e.g., Section 01 `#idea`, Section 05 `#how`) do not trap or jack scroll unnecessarily.
- Verify that Section 04 `#services` (Concave Carousel) scrolls cleanly vertically while allowing horizontal dragging inside the carousel stage.

## 4. Accessibility & Reduced Motion

- Check that interactive buttons have accessible labels (`aria-label`).
- Verify carousel panels have `role="group"` and counter indicators.
- Confirm animations gracefully pause or simplify when `prefers-reduced-motion: reduce` is active.
