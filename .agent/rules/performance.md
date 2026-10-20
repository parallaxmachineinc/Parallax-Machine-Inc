# Performance & Animation Guidelines

## Smooth 60fps Target

1. **Hardware Acceleration**:
   - Use `transform` (specifically `translate3d`, `rotateY`, `scale`) and `opacity` for all continuous scroll and interaction animations.
   - Avoid animating layout properties such as `width`, `height`, `top`, `left`, `margin`, or `padding` in hot animation loops.

2. **Clean Lifecycle Management**:
   - Every `requestAnimationFrame` must be cancelled on unmount with `cancelAnimationFrame`.
   - Every `ResizeObserver` or `IntersectionObserver` must call `disconnect()`.
   - Every `window` event listener (`scroll`, `resize`, `pointermove`) must be removed in the cleanup return of `useEffect`.

3. **Responsive Sizing**:
   - Prevent horizontal overflow (`overflow-x: hidden` where appropriate).
   - Use dynamic clamping (`clamp(...)`) and relative units to support devices from 320px mobile screens to 4K ultra-wide monitors.

4. **Reduced Motion**:
   - Respect user accessibility preferences: wrap continuous loops and drastic scene shifts with `@media (prefers-reduced-motion: reduce)` or `window.matchMedia("(prefers-reduced-motion: reduce)")`.
