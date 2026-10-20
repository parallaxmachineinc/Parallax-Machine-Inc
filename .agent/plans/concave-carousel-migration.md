# Section 04 Migration: React Bits Pro Concave Carousel

## Background & Motivation

The original Section 04 utilized a pinned static horizontal scroll layout (`.hz` with 240vh scroll height) that translated cards along the X axis. This required excessive page scrolling and lacked dynamic spatial presence.

The goal was to replace it with the **Concave Carousel** component from React Bits Pro ([https://pro.reactbits.dev/docs/components/concave-carousel](https://pro.reactbits.dev/docs/components/concave-carousel)).

## Architecture & Implementation Details

1. **Component**: `components/ConcaveCarousel.tsx`
   - Modular Client Component supporting full React Bits Pro configuration API.
   - Props: `items`, `aspect`, `size`, `curvature`, `distance`, `tilt`, `gap`, `radius`, `dim`, `reflection`, `autoplay`, `speed`, `interval`, `snap`, `inertia`, `pauseOnHover`, `draggable`, `wheel`, `captions`, `controls`.
   - Exposes imperative methods via `ref`: `next()`, `previous()`, `goTo(index)`.

2. **3D Concave Geometry**:
   - Arranges cards along a cylindrical arc with angle $\theta = \text{diff} \times \theta_{\text{step}}$.
   - Side panels recede deeply into negative $Z$-space ($z = -(1 - \cos(\theta)) \times R \times \text{depthFactor}$) and rotate inward (`rotateY = -\theta \times 1.08`).
   - Center panel remains the primary focal element ($z = 0, \text{scale} = 1.0$).

3. **Bespoke Service SVGs (`public/services/`)**:
   - `websites.svg`: Clean responsive browser frame with layout blocks.
   - `creative.svg`: Isometric 3D wireframe cube and typography.
   - `tech.svg`: Code terminal showing deployment flow.
   - `bespoke.svg`: Modular brand card composition.
