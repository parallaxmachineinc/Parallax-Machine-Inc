"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationItem } from "lottie-web";
import animationData from "@/data/see-think-act.json";

export interface OrbitalVisualController {
  goToFrame: (frame: number) => void;
  rotateHalo: (deg: number) => void;
}

interface OrbitalVisualProps {
  activeKey: string;
  activeColor: string;
  onControllerReady?: (ctrl: OrbitalVisualController) => void;
}

export default function OrbitalVisual({ activeKey, activeColor, onControllerReady }: OrbitalVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const onControllerReadyRef = useRef(onControllerReady);
  useEffect(() => {
    onControllerReadyRef.current = onControllerReady;
  }, [onControllerReady]);

  useEffect(() => {
    let animInstance: AnimationItem | null = null;
    let animTween: gsap.core.Tween | null = null;
    let haloTween: gsap.core.Tween | null = null;
    let isMounted = true;
    let lastFrame = -1;
    let lastHaloDeg = Number.NaN;

    // Dynamically import lottie-web only on client
    import("lottie-web").then((lottieModule) => {
      if (!isMounted || !containerRef.current) return;
      const lottie = lottieModule.default || lottieModule;

      animInstance = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });

      animRef.current = animInstance;

      animInstance.addEventListener("DOMLoaded", () => {
        if (!isMounted || !animInstance) return;

        const startFrame = 60; // All layers begin morphing at frame 60
        const endFrame = 110;  // All layers reach 100% completion at frame 110

        animInstance.goToAndStop(startFrame, true);
        lastFrame = startFrame;

        if (onControllerReadyRef.current) {
          onControllerReadyRef.current({
            goToFrame: (frame: number) => {
              const roundedFrame = Math.round(frame);
              if (animInstance && roundedFrame !== lastFrame) {
                lastFrame = roundedFrame;
                animInstance.goToAndStop(roundedFrame, true);
              }
            },
            rotateHalo: (deg: number) => {
              const roundedDeg = Math.round(deg * 10) / 10;
              if (haloRef.current && roundedDeg !== lastHaloDeg) {
                lastHaloDeg = roundedDeg;
                haloRef.current.style.transform = `rotate(${roundedDeg}deg)`;
              }
            },
          });
          return;
        }

        // Fallback: Reactive Scroll scrubbing directly with user's scroll position
        if (typeof window !== "undefined" && gsap) {
          const proxy = { frame: startFrame };

          animTween = gsap.to(proxy, {
            frame: endFrame,
            ease: "none",
            scrollTrigger: {
              trigger: "#orbit-directions",
              start: "top 95%",
              endTrigger: "#orbit-eyebrow",
              end: "top 100px",
              scrub: 2,
            },
            onUpdate: () => {
              if (!animInstance) return;
              animInstance.goToAndStop(proxy.frame, true);
            },
          });

          // Celestial halo reactive scroll rotation synced to same threshold and easing
          if (haloRef.current) {
            haloTween = gsap.to(haloRef.current, {
              rotation: "+=180",
              ease: "none",
              scrollTrigger: {
                trigger: "#orbit-directions",
                start: "top 95%",
                endTrigger: "#orbit-eyebrow",
                end: "top 100px",
                scrub: 2,
              },
            });
          }

          // Recalculate ScrollTrigger cache now that Lottie and DOM are ready
          ScrollTrigger.refresh();
        }
      });
    });

    return () => {
      isMounted = false;
      if (animInstance) {
        animInstance.destroy();
      }
      if (animTween) {
        animTween.kill();
      }
      if (haloTween) {
        haloTween.kill();
      }
    };
  }, []);

  // Tactile micro-pulse when user selects an active category
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.45, ease: "back.out(2)" }
    );
  }, [activeKey]);

  return (
    <div
      className="sunrise-orbit-wrap"
      id="rd"
      style={{ "--active-accent": activeColor } as React.CSSProperties}
      role="region"
      aria-label="Interactive Orbital Network Visual"
    >
      {/* Sunrise Robotics Celestial Halo with reactive scroll rotation */}
      <svg
        ref={haloRef}
        className="sunrise-orbit-halo"
        viewBox="0 0 436 436"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g className="sunrise-halo-dots">
          <path d="M210.852 420.943C210.918 424.092 213.53 426.591 216.685 426.524C219.84 426.458 222.344 423.851 222.277 420.702C222.21 417.553 219.599 415.054 216.443 415.121C213.288 415.187 210.785 417.794 210.852 420.943Z" fill="currentColor"/>
          <path d="M210.852 13.9433C210.918 17.0923 213.53 19.591 216.685 19.5243C219.84 19.4576 222.344 16.8508 222.277 13.7018C222.21 10.5528 219.599 8.05405 216.443 8.12073C213.288 8.18741 210.785 10.7942 210.852 13.9433Z" fill="currentColor"/>
          <path d="M253.312 417.681C254.032 420.748 257.106 422.649 260.178 421.928C263.251 421.206 265.158 418.136 264.438 415.07C263.718 412.003 260.643 410.102 257.571 410.823C254.499 411.545 252.592 414.615 253.312 417.681Z" fill="currentColor"/>
          <path d="M168.692 19.5754C169.412 22.6417 172.486 24.5428 175.558 23.8216C178.631 23.1004 180.538 20.03 179.817 16.9637C179.097 13.8974 176.023 11.9963 172.951 12.7175C169.878 13.4387 167.972 16.5091 168.692 19.5754Z" fill="currentColor"/>
          <path d="M294.166 405.663C295.508 408.513 298.91 409.733 301.766 408.389C304.621 407.044 305.848 403.645 304.506 400.795C303.164 397.946 299.762 396.725 296.906 398.069C294.051 399.414 292.824 402.813 294.166 405.663Z" fill="currentColor"/>
          <path d="M128.624 33.85C129.966 36.6996 133.368 37.9199 136.224 36.5757C139.079 35.2315 140.306 31.8317 138.964 28.9822C137.622 26.1326 134.22 24.9122 131.364 26.2564C128.509 27.6006 127.282 31.0004 128.624 33.85Z" fill="currentColor"/>
          <path d="M331.629 385.413C333.534 387.921 337.116 388.408 339.629 386.499C342.142 384.591 342.636 381.01 340.731 378.502C338.826 375.994 335.244 375.507 332.73 377.416C330.217 379.324 329.724 382.905 331.629 385.413Z" fill="currentColor"/>
          <path d="M92.3994 56.1431C94.3044 58.6515 97.8862 59.1377 100.4 57.2293C102.913 55.3208 103.406 51.7403 101.501 49.2319C99.5961 46.7236 96.0143 46.2373 93.5009 48.1458C90.9876 50.0543 90.4944 53.6348 92.3994 56.1431Z" fill="currentColor"/>
          <path d="M364.062 357.817C366.447 359.874 370.052 359.605 372.113 357.216C374.175 354.827 373.913 351.222 371.528 349.164C369.143 347.107 365.539 347.376 363.477 349.765C361.415 352.155 361.677 355.759 364.062 357.817Z" fill="currentColor"/>
          <path d="M61.6024 85.4806C63.9872 87.5381 67.5919 87.269 69.6535 84.8797C71.7151 82.4904 71.4531 78.8856 69.0682 76.8281C66.6833 74.7707 63.0787 75.0397 61.0171 77.429C58.9555 79.8184 59.2175 83.4232 61.6024 85.4806Z" fill="currentColor"/>
          <path d="M390.049 324.08C392.81 325.597 396.28 324.584 397.8 321.818C399.319 319.053 398.314 315.581 395.553 314.064C392.793 312.548 389.323 313.56 387.803 316.326C386.283 319.092 387.289 322.564 390.049 324.08Z" fill="currentColor"/>
          <path d="M37.5767 120.58C40.3372 122.097 43.8071 121.084 45.3269 118.318C46.8467 115.553 45.8409 112.081 43.0804 110.564C40.3199 109.048 36.85 110.06 35.3302 112.826C33.8104 115.592 34.8162 119.064 37.5767 120.58Z" fill="currentColor"/>
          <path d="M408.455 285.678C411.47 286.587 414.654 284.875 415.566 281.854C416.477 278.833 414.772 275.646 411.756 274.737C408.74 273.827 405.557 275.539 404.645 278.56C403.734 281.582 405.439 284.768 408.455 285.678Z" fill="currentColor"/>
          <path d="M21.3748 159.908C24.3904 160.817 27.5739 159.105 28.4855 156.084C29.3971 153.063 27.6915 149.876 24.6759 148.967C21.6604 148.057 18.4768 149.769 17.5653 152.79C16.6537 155.812 18.3593 158.998 21.3748 159.908Z" fill="currentColor"/>
          <path d="M418.473 244.288C421.612 244.551 424.37 242.214 424.633 239.069C424.897 235.925 422.566 233.162 419.427 232.9C416.289 232.637 413.531 234.973 413.267 238.118C413.004 241.263 415.334 244.025 418.473 244.288Z" fill="currentColor"/>
          <path d="M13.7027 201.745C16.8414 202.008 19.5995 199.671 19.8629 196.526C20.1264 193.382 17.7956 190.619 14.6568 190.357C11.5181 190.094 8.76004 192.43 8.49655 195.575C8.23306 198.72 10.5639 201.482 13.7027 201.745Z" fill="currentColor"/>
          <path d="M419.668 201.719C422.792 201.324 425.004 198.465 424.608 195.334C424.212 192.203 421.358 189.986 418.233 190.382C415.108 190.777 412.896 193.636 413.292 196.767C413.689 199.898 416.543 202.115 419.668 201.719Z" fill="currentColor"/>
          <path d="M14.897 244.263C18.0218 243.867 20.2338 241.008 19.8377 237.877C19.4416 234.747 16.5874 232.529 13.4626 232.925C10.3378 233.32 8.1258 236.179 8.52191 239.31C8.91802 242.441 11.7723 244.658 14.897 244.263Z" fill="currentColor"/>
          <path d="M411.986 159.833C414.96 158.796 416.529 155.54 415.491 152.56C414.452 149.58 411.199 148.005 408.225 149.041C405.251 150.078 403.682 153.334 404.72 156.314C405.758 159.294 409.011 160.87 411.986 159.833Z" fill="currentColor"/>
          <path d="M24.9055 285.603C27.8797 284.566 29.449 281.31 28.4106 278.33C27.3722 275.35 24.1194 273.775 21.1451 274.811C18.1709 275.848 16.6016 279.104 17.64 282.084C18.6784 285.064 21.9312 286.64 24.9055 285.603Z" fill="currentColor"/>
        </g>
      </svg>

      {/* Exact See. Think. Act. Lottie Container */}
      <div
        ref={containerRef}
        className="sunrise-lottie-container"
        aria-hidden="true"
      />

      {/* Atmospheric center glow responsive to active category */}
      <div className="sunrise-ambient-glow" aria-hidden="true" />
    </div>
  );
}
