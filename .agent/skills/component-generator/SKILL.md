---
name: component-generator
description: >-
  Use this skill when creating or refactoring interactive, 3D, or creative UI components
  for the Parallax Machine Inc Next.js application. Ensures strict adherence to design tokens,
  performance standards, and touch/pointer interaction parity.
---

# Interactive Component Generator

Use this skill to implement creative, interactive components matching the Parallax Machine Inc design standard.

## 1. Design Token Checklist

- **Background Palette**: `--g-deep` (`#0c3b27`), `--g-main` (`#115238`), `--g-light` (`#7fdc9c`), `--paper` (`#eef5e6`)
- **Ink Palette**: `--white` (`#f6fbf1`), `--ink` (`#eef6e6`), `--dot` (`rgba(190, 240, 205, 0.22)`)
- **Accent Accents**: Terracotta (`#ffb27a`), Periwinkle (`#7a82ff`, `#8f96ff`)
- **Typography**: Display titles use `var(--font)` (`Baserona`), body text uses `var(--body)` (`Prevalent Sans Pro`), emphasis quotes use cursive-italic (`Caveat`, `Playfair Display`).

## 2. Component Implementation Workflow

1. **Client Boundary**: Add `"use client";` at line 1.
2. **TypeScript Interface**:
   ```typescript
   export interface ComponentProps {
     className?: string;
     style?: React.CSSProperties;
     // Add explicit typed props here
   }
   ```
3. **Imperative Handle**: If the component is a carousel, modal, or stage, wrap with `forwardRef` and expose methods like `next()`, `previous()`, `goTo(index)` or `reset()`.
4. **Pointer Parity**: Support both mouse dragging and touch gestures with `PointerEvent` (`setPointerCapture`, `releasePointerCapture`).
5. **Memory Leak Prevention**: Always return a cleanup function from `useEffect` cancelling `requestAnimationFrame`, clearing timers, and disconnecting observers.
6. **Validation**: Test compilation with `npx tsc --noEmit` and production build with `npm run build`.
