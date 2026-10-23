/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface ConcaveCarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface ConcaveCarouselRef {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
}

export interface ConcaveCarouselProps {
  items: ConcaveCarouselItem[];
  startIndex?: number;
  aspect?: number;
  size?: number;
  curvature?: number;
  distance?: number;
  tilt?: number;
  gap?: number;
  radius?: number;
  dim?: number;
  reflection?: number | boolean;
  autoplay?: "off" | "drift" | "step";
  speed?: number;
  interval?: number;
  snap?: boolean;
  inertia?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  captions?: boolean;
  controls?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  onIndexChange?: (index: number) => void;
  onSelect?: (item: ConcaveCarouselItem, index: number) => void;
}

export const ConcaveCarousel = forwardRef<ConcaveCarouselRef, ConcaveCarouselProps>(
  (
    {
      items = [],
      startIndex = 0,
      aspect = 1.25,
      size = 0.46,
      curvature = 0.72,
      distance = 4.0,
      tilt = 0.0,
      gap = 16,
      radius = 14,
      dim = 0.35,
      reflection = 0.06,
      autoplay = "drift",
      speed = 0.16,
      interval = 4.0,
      snap = true,
      inertia = 0.5,
      pauseOnHover = true,
      draggable = true,
      wheel = false,
      captions = true,
      controls = true,
      backgroundColor = "transparent",
      paused = false,
      ariaLabel = "Concave carousel",
      className = "",
      style,
      onIndexChange,
      onSelect,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(540);
    const [activeIndex, setActiveIndex] = useState<number>(startIndex);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isDraggingState, setIsDraggingState] = useState<boolean>(false);

    // Continuous floating offset representing center point in item-units
    const offsetRef = useRef<number>(startIndex);
    const targetOffsetRef = useRef<number>(startIndex);
    const velocityRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const dragStartXRef = useRef<number>(0);
    const dragStartOffsetRef = useRef<number>(startIndex);
    const lastDragXRef = useRef<number>(0);
    const lastDragTimeRef = useRef<number>(0);
    const hasMovedSignificantlyRef = useRef<boolean>(false);
    const rafIdRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastReportedIndexRef = useRef<number>(startIndex);

    const itemCount = items.length;

    // Reflection opacity numeric calculation
    const reflectionOpacity =
      typeof reflection === "boolean" ? (reflection ? 0.08 : 0) : reflection;

    // Normalized index helper
    const normalizeIndex = useCallback(
      (idx: number): number => {
        if (itemCount === 0) return 0;
        return ((Math.round(idx) % itemCount) + itemCount) % itemCount;
      },
      [itemCount]
    );

    // Imperative methods exposed via ref
    const goTo = useCallback(
      (index: number) => {
        if (itemCount === 0) return;
        const currentNorm = normalizeIndex(targetOffsetRef.current);
        let diff = index - currentNorm;
        if (diff > itemCount / 2) diff -= itemCount;
        if (diff < -itemCount / 2) diff += itemCount;
        targetOffsetRef.current = targetOffsetRef.current + diff;
        velocityRef.current = 0;
      },
      [itemCount, normalizeIndex]
    );

    const next = useCallback(() => {
      targetOffsetRef.current = Math.round(targetOffsetRef.current) + 1;
      velocityRef.current = 0;
    }, []);

    const previous = useCallback(() => {
      targetOffsetRef.current = Math.round(targetOffsetRef.current) - 1;
      velocityRef.current = 0;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        goTo,
      }),
      [next, previous, goTo]
    );

    // Resize observer to track dimensions
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          if (height > 0) setContainerHeight(height);
        }
      });

      ro.observe(container);
      return () => ro.disconnect();
    }, []);

    // Autoplay "step" mode timer
    useEffect(() => {
      if (autoplay !== "step" || paused || (pauseOnHover && isHovered) || itemCount <= 1) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        return;
      }

      stepTimerRef.current = setInterval(() => {
        if (!isDraggingRef.current) {
          targetOffsetRef.current = Math.round(targetOffsetRef.current) + 1;
        }
      }, interval * 1000);

      return () => {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      };
    }, [autoplay, paused, isHovered, pauseOnHover, interval, itemCount]);

    // Main animation loop
    const [, setRenderTick] = useState<number>(0);

    useEffect(() => {
      let isMounted = true;
      lastTimeRef.current = performance.now();

      const animate = (time: number) => {
        if (!isMounted) return;

        const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = time;

        const isUserInteracting = isDraggingRef.current;
        const shouldPauseAutoplay = paused || (pauseOnHover && isHovered);

        if (!isUserInteracting) {
          // Autoplay drift handling
          if (autoplay === "drift" && !shouldPauseAutoplay && itemCount > 1) {
            targetOffsetRef.current += speed * dt;
          }

          // Apply velocity and inertia
          if (Math.abs(velocityRef.current) > 0.001) {
            targetOffsetRef.current += velocityRef.current * dt;
            const friction = Math.pow(Math.max(0.1, Math.min(0.95, inertia)), dt * 60);
            velocityRef.current *= friction;
          } else {
            velocityRef.current = 0;
            // Snap to nearest item if snap is enabled and not drifting
            if (snap && autoplay !== "drift") {
              const nearest = Math.round(targetOffsetRef.current);
              targetOffsetRef.current += (nearest - targetOffsetRef.current) * Math.min(1, dt * 10);
            }
          }

          // Smooth spring-damping interpolation towards targetOffset
          const lerpSpeed = snap ? 12 : 8;
          offsetRef.current += (targetOffsetRef.current - offsetRef.current) * Math.min(1, dt * lerpSpeed);
        } else {
          // While dragging, track target directly with subtle spring
          offsetRef.current += (targetOffsetRef.current - offsetRef.current) * Math.min(1, dt * 25);
        }

        // Keep numbers in a reasonable range to avoid precision loss while preserving loop
        if (itemCount > 0 && Math.abs(offsetRef.current) > 10000) {
          const shift = Math.floor(offsetRef.current / itemCount) * itemCount;
          offsetRef.current -= shift;
          targetOffsetRef.current -= shift;
        }

        // Active index update
        const currentActive = normalizeIndex(offsetRef.current);
        if (currentActive !== lastReportedIndexRef.current) {
          lastReportedIndexRef.current = currentActive;
          setActiveIndex(currentActive);
          if (onIndexChange) {
            onIndexChange(currentActive);
          }
        }

        setRenderTick((t) => t + 1);
        rafIdRef.current = requestAnimationFrame(animate);
      };

      rafIdRef.current = requestAnimationFrame(animate);

      return () => {
        isMounted = false;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }, [
      autoplay,
      paused,
      pauseOnHover,
      isHovered,
      speed,
      inertia,
      snap,
      itemCount,
      normalizeIndex,
      onIndexChange,
    ]);

    // Sizing and 3D Geometry calculations
    // Panel height derived from container height & size prop (bounded for responsive stability)
    const baseHeight = Math.max(220, containerHeight * size);
    const panelHeight = Math.min(baseHeight, containerHeight * 0.72);
    const panelWidth = panelHeight * aspect;
    const stepDistance = panelWidth + gap;

    // Perspective viewing distance: closer distance produces a more dramatic 3D concave curvature
    const perspectivePx = Math.max(720, Math.min(1150, (distance ?? 4.0) * 230));

    // Concave cylinder geometry
    // Curvature (0: flat plane, 1: dramatic concave arc)
    const curveClamped = Math.max(0.01, Math.min(1.2, curvature));
    // Substantially increased angular step so panels visibly face inward (~32°-36° at default curvature)
    const angleStepRad = curveClamped * 0.62;
    const radiusPx = stepDistance / Math.max(0.001, angleStepRad);

    // Pointer Drag Handlers
    const onPointerDown = (e: React.PointerEvent) => {
      if (!draggable || itemCount <= 1) return;
      isDraggingRef.current = true;
      setIsDraggingState(true);
      hasMovedSignificantlyRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartOffsetRef.current = targetOffsetRef.current;
      lastDragXRef.current = e.clientX;
      lastDragTimeRef.current = performance.now();
      velocityRef.current = 0;

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      if (Math.abs(deltaX) > 6) {
        hasMovedSignificantlyRef.current = true;
      }

      // Convert pixel delta to item offset (dragging left advances carousel forward)
      const offsetDelta = -deltaX / Math.max(100, stepDistance);
      targetOffsetRef.current = dragStartOffsetRef.current + offsetDelta;

      // Track instantaneous velocity
      const now = performance.now();
      const dt = (now - lastDragTimeRef.current) / 1000;
      if (dt > 0.008) {
        const instantVelocity = -(e.clientX - lastDragXRef.current) / Math.max(100, stepDistance) / dt;
        velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;
        lastDragXRef.current = e.clientX;
        lastDragTimeRef.current = now;
      }
    };

    const onPointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDraggingState(false);

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already been released
      }

      // Cap launch velocity
      velocityRef.current = Math.max(-12, Math.min(12, velocityRef.current));

      // Snap on release if snap is true
      if (snap) {
        const projectedTarget = targetOffsetRef.current + velocityRef.current * (inertia * 0.4);
        targetOffsetRef.current = Math.round(projectedTarget);
        velocityRef.current = 0;
      }
    };

    // Wheel navigation (optional)
    const onWheel = (e: React.WheelEvent) => {
      if (!wheel || itemCount <= 1) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 5) {
        targetOffsetRef.current += (delta / 400);
        velocityRef.current = 0;
      }
    };

    // Keyboard navigation
    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        previous();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };

    // Active item for captions
    const activeItem = items[activeIndex] || items[0];

    return (
      <div
        ref={containerRef}
        className={`concave-carousel-root ${className}`}
        aria-label={ariaLabel}
        role="region"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={wheel ? onWheel : undefined}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "440px",
          height: "64vh",
          maxHeight: "720px",
          overflow: "hidden",
          backgroundColor,
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "pan-y",
          cursor: draggable ? (isDraggingState ? "grabbing" : "grab") : "default",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          ...style,
        }}
      >
        {/* 3D Curved Gallery Stage */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: "relative",
            width: "100%",
            height: `${panelHeight * 1.3}px`,
            perspective: `${perspectivePx}px`,
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {items.map((item, index) => {
            if (itemCount === 0) return null;

            // Calculate wrapped angular distance from current float offset
            const currentOffset = offsetRef.current;
            let diff = index - (currentOffset % itemCount);
            // Wrap into range [-itemCount/2, itemCount/2)
            while (diff > itemCount / 2) diff -= itemCount;
            while (diff < -itemCount / 2) diff += itemCount;

            // Do not render panels that are completely behind or out of view
            if (Math.abs(diff) > 3.2) return null;

            // Concave cylindrical transform math
            const angleRad = diff * angleStepRad;
            const angleDeg = (angleRad * 180) / Math.PI;

            // Along the concave arc:
            // Center is at z = 0, sides curve back/around into depth
            const x = Math.sin(angleRad) * radiusPx;
            // Enhanced concave depth recession: pushes receding panels back into 3D space
            const depthFactor = 2.2 + curveClamped * 1.4;
            const z = -(1 - Math.cos(angleRad)) * radiusPx * depthFactor;

            // Rotation facing inward toward the viewer/center
            const rotateY = -angleDeg * 1.08;

            // Perspective scale & depth layering
            const zIndex = Math.round(100 - Math.abs(diff) * 20);
            const edgeDimOpacity = Math.min(dim, Math.abs(diff) * dim * 0.75);
            const isCenter = Math.abs(diff) < 0.45;
            const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.1);

            return (
              <div
                key={`${item.src}-${index}`}
                role="group"
                aria-label={`${item.title || item.alt} (${index + 1} of ${itemCount})`}
                onClick={(e) => {
                  if (hasMovedSignificantlyRef.current) {
                    e.preventDefault();
                    return;
                  }
                  if (!isCenter) {
                    goTo(index);
                  } else {
                    if (onSelect) onSelect(item, index);
                    if (item.href) {
                      try {
                        const parsed = new URL(item.href, window.location.origin);
                        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
                          window.location.href = parsed.href;
                        }
                      } catch {
                        // Ignore malformed URLs
                      }
                    }
                  }
                }}
                style={{
                  position: "absolute",
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) rotateX(${tilt}deg) scale(${scale})`,
                  transformOrigin: "50% 50%",
                  transformStyle: "preserve-3d",
                  zIndex,
                  borderRadius: `${radius}px`,
                  boxShadow: isCenter
                    ? "0 28px 60px -12px rgba(0, 0, 0, 0.75), 0 0 40px rgba(127, 220, 156, 0.22)"
                    : "0 18px 40px -10px rgba(0, 0, 0, 0.65)",
                  border: isCenter
                    ? "1.5px solid rgba(127, 220, 156, 0.5)"
                    : "1px solid rgba(190, 240, 205, 0.18)",
                  background: "#081d13",
                  overflow: "visible",
                  cursor: isCenter ? (item.href ? "pointer" : "default") : "pointer",
                  transition: isDraggingState
                    ? "box-shadow 0.2s, border 0.2s"
                    : "box-shadow 0.3s, border 0.3s",
                }}
              >
                {/* Main Image Panel */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: `${radius}px`,
                    overflow: "hidden",
                    backgroundColor: "#06180f",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Edge Dimming Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "#020905",
                      opacity: edgeDimOpacity,
                      pointerEvents: "none",
                      transition: "opacity 0.2s ease-out",
                    }}
                  />

                  {/* Subtle glossy vignette */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.35)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Cinematic Floor Reflection */}
                {reflectionOpacity > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      height: "55%",
                      marginTop: "10px",
                      borderRadius: `${radius}px`,
                      overflow: "hidden",
                      transform: "scaleY(-1)",
                      opacity: Math.max(0, reflectionOpacity - Math.abs(diff) * 0.02),
                      filter: "blur(2.5px)",
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 85%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 85%)",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      src={item.src}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Captions & Controls Footer Area */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "960px",
            marginTop: "18px",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            textAlign: "center",
            pointerEvents: "auto",
          }}
        >
          {/* Active Title & Subtitle */}
          {captions && activeItem && (
            <div
              style={{
                minHeight: "68px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
              }}
            >
              {activeItem.title && (
                <h3
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "clamp(20px, 2.4vw, 28px)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "var(--white, #f6fbf1)",
                    textTransform: "uppercase",
                  }}
                >
                  {activeItem.title}
                </h3>
              )}
              {activeItem.subtitle && (
                <p
                  style={{
                    margin: 0,
                    maxWidth: "38em",
                    fontSize: "clamp(14px, 1.3vw, 16px)",
                    lineHeight: 1.55,
                    color: "rgba(238, 246, 230, 0.8)",
                    fontStyle: "italic",
                  }}
                >
                  {activeItem.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Interactive Navigation Controls */}
          {controls && itemCount > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginTop: "4px",
              }}
            >
              {/* Prev Button */}
              <button
                type="button"
                onClick={previous}
                aria-label="Previous image"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "1px solid rgba(190, 240, 205, 0.3)",
                  background: "rgba(12, 59, 39, 0.7)",
                  color: "var(--white, #f6fbf1)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  backdropFilter: "blur(8px)",
                  transition: "background 0.2s, transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(17, 82, 56, 0.95)";
                  e.currentTarget.style.borderColor = "var(--g-light, #7fdc9c)";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(12, 59, 39, 0.7)";
                  e.currentTarget.style.borderColor = "rgba(190, 240, 205, 0.3)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Counter Indicator */}
              <div
                style={{
                  fontFamily: "var(--font, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  color: "var(--g-light, #7fdc9c)",
                  padding: "4px 12px",
                  border: "1px solid rgba(127, 220, 156, 0.2)",
                  borderRadius: "999px",
                  background: "rgba(4, 20, 12, 0.6)",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "1px solid rgba(190, 240, 205, 0.3)",
                  background: "rgba(12, 59, 39, 0.7)",
                  color: "var(--white, #f6fbf1)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  backdropFilter: "blur(8px)",
                  transition: "background 0.2s, transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(17, 82, 56, 0.95)";
                  e.currentTarget.style.borderColor = "var(--g-light, #7fdc9c)";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(12, 59, 39, 0.7)";
                  e.currentTarget.style.borderColor = "rgba(190, 240, 205, 0.3)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ConcaveCarousel.displayName = "ConcaveCarousel";
export default ConcaveCarousel;
