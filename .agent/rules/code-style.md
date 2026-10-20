# Code Style & Architecture Guidelines

## Architecture

1. **Client Components**:
   - Mark interactive components with `"use client";` at the top of the file.
   - Use standard React hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useImperativeHandle`).
   - Use `forwardRef` when exposing programmatic APIs (e.g. `next()`, `previous()`, `goTo()`).

2. **TypeScript**:
   - Explicit interfaces and type definitions for all component props and data structures.
   - Run `npx tsc --noEmit` before considering any task complete.

3. **Styling**:
   - Use Vanilla CSS definitions in `app/globals.css`.
   - Dynamic 3D transforms and runtime calculations can be applied via inline styles with CSS custom properties or hardware-accelerated transforms (`transform: translate3d(...) rotateY(...)`).
   - Avoid hardcoding arbitrary colors: prefer the project CSS variables (`--g-deep`, `--g-main`, `--g-light`, `--white`, `--line`, `--dot`).
