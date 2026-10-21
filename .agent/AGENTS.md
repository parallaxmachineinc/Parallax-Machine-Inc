# Workspace Agent Instructions: Parallax Machine Inc

Welcome to the **Parallax Machine Inc** repository. This document outlines project conventions, architectural standards, and behavioral constraints for AI agents.

---

## 1. Core Principles & Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript).
- **Styling**: Vanilla CSS in `app/globals.css`. Do not introduce CSS frameworks like Tailwind CSS unless explicitly requested by the user.
- **Design Aesthetic**:
  - Palette: Deep forest green (`#0c3b27`, `#115238`), mint accent (`#7fdc9c`), cream ink (`#f6fbf1`), terracotta orange (`#ffb27a`), and periwinkle violet (`#7a82ff`).
  - Typography: `Baserona` for display titles/headings, `Prevalent Sans Pro` / monospace for body, and `Instrument Serif` / `Caveat` / `Playfair Display` for cursive-italic emphasis statements.
  - Atmosphere: Premium tactile aesthetic with subtle grain textures, CRT glows, 3D spatial perspectives, and smooth 60fps micro-interactions.
- **Browser Compatibility & Accessibility**:
  - Semantic HTML5 structure.
  - Respect `prefers-reduced-motion` settings.
  - Touch and mouse interaction parity for interactive components.

---

## 2. Behavioral Rules & Constraints

1. **Explicit Git Confirmation Required**:
   - **NEVER** run `git push` without direct, explicit confirmation from the user.
   - Always display `git status` or a summary of proposed commits before pushing.
2. **Component Integrity**:
   - Keep components modular in `components/`.
   - Maintain strict TypeScript typings (no arbitrary `any`).
   - Clean up all `requestAnimationFrame`, `ResizeObserver`, and event listeners in `useEffect` returns to prevent memory leaks.
3. **Scroll & Layout Stability**:
   - Avoid excessive vertical scroll padding or scroll-jacking.
   - Ensure components do not cause horizontal layout overflow (`overflow-x: hidden`).
