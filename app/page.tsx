"use client";

import React, { useEffect, useRef, useState } from "react";
import ConcaveCarousel, { ConcaveCarouselItem } from "@/components/ConcaveCarousel";

const SERVICE_CAROUSEL_ITEMS: ConcaveCarouselItem[] = [
  {
    src: "/services/websites.svg",
    alt: "Websites & digital presence",
    title: "Websites & digital presence",
    subtitle:
      "A useful digital asset, not just a page online. Business and portfolio sites, landing pages and redesigns, built responsive, accessible and fast.",
  },
  {
    src: "/services/creative.svg",
    alt: "Creative experiences",
    title: "Creative experiences",
    subtitle:
      "Design with a reason to exist. Scroll-based storytelling, motion, 3D and illustration, and art-directed brand pages.",
  },
  {
    src: "/services/tech.svg",
    alt: "Technical build",
    title: "Technical build",
    subtitle:
      "Creative ideas, reliably delivered. Right-fit technology, integrations and functionality, with performance and upkeep in mind.",
  },
  {
    src: "/services/bespoke.svg",
    alt: "Shaped around you",
    title: "Shaped around you",
    subtitle:
      "Understand first, then assemble the solution: design, content and automation, scoped by your goals, with support for the next stage.",
  },
];

const RADAR_ITEMS = [
  {
    key: "0",
    title: "Starting from zero",
    desc: "A business or idea with little online presence yet.",
    color: "#f6fbf1",
    left: "50%",
    top: "84%",
  },
  {
    key: "1",
    title: "Growing businesses",
    desc: "Already online, ready for stronger presentation and function.",
    color: "#7fdc9c",
    left: "72%",
    top: "36%",
  },
  {
    key: "2",
    title: "Founders",
    desc: "A concept that needs to become something people can try.",
    color: "#ffb27a",
    left: "30%",
    top: "30%",
  },
  {
    key: "3",
    title: "Distinctive brands",
    desc: "Clear needs, and a wish to stand out in the execution.",
    color: "#7a82ff",
    left: "60%",
    top: "62%",
  },
] as const;

const PRINCIPLES = [
  [
    "Understand before building",
    "Every project starts with your goals, audience and constraints.",
  ],
  [
    "Choose the right solution",
    "Design and technology follow from the problem, never the other way round.",
  ],
  [
    "Make it understandable",
    "You can follow the work and the important decisions along the way.",
  ],
  [
    "Deliver meaningful outcomes",
    "We judge a project by what it enables, not only how it looks.",
  ],
  [
    "Remain adaptable",
    "As you grow, we grow with you, at a consistent standard of work.",
  ],
] as const;

const TERMINAL_LINES = [
  { text: "> scan client.needs", className: "" },
  { text: "ERROR 01: which services do we actually need?", className: "e" },
  { text: "ERROR 02: who can turn this idea into something real?", className: "e" },
  { text: "ERROR 03: too much jargon, not enough answers", className: "e" },
  { text: "ERROR 04: how do we look credible online?", className: "e" },
  { text: "ERROR 05: what is essential, and what is extra?", className: "e" },
  { text: "ERROR 06: what fits our stage and budget?", className: "e" },
  { text: "> run parallax --start-with-problem", className: "" },
  { text: "RESOLVED: complexity → practical solution ✓", className: "ok" },
] as const;

interface DustParticle {
  left: number;
  top: number;
  k: number;
  size: number;
  opacity: number;
}

export default function Home() {
  const [activeRadarKey, setActiveRadarKey] = useState<string>("0");
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);

  // Section 01 (#idea) Refs
  const camRef = useRef<HTMLElement>(null);
  const scRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const fg1Ref = useRef<HTMLDivElement>(null);
  const fg2Ref = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const h3Ref = useRef<HTMLDivElement>(null);
  const h4Ref = useRef<HTMLDivElement>(null);
  const hpRef = useRef<HTMLElement>(null);
  const hbRef = useRef<HTMLElement>(null);
  const hdRef = useRef<HTMLElement>(null);
  const dustElementsRef = useRef<(HTMLElement | null)[]>([]);

  // Section 02 (#why) Ref
  const tlRef = useRef<HTMLDivElement>(null);


  // Section 05 (#how) Ref
  const howRef = useRef<HTMLElement>(null);

  // Footer Watermark Refs
  const wmwRef = useRef<HTMLDivElement>(null);
  const wmRef = useRef<HTMLSpanElement>(null);

  // Generate dust particles on client mount
  useEffect(() => {
    const list: DustParticle[] = [];
    for (let i = 0; i < 30; i++) {
      const k = [0.25, 0.6, 1][i % 3];
      list.push({
        left: Math.random() * 100,
        top: Math.random() * 80,
        k,
        size: 1.5 + k * 3,
        opacity: 0.25 + k * 0.4,
      });
    }
    setDustParticles(list);
  }, []);

  // Main scroll & interaction logic
  useEffect(() => {
    document.documentElement.classList.add("js");

    // 1. Intersection Observer for .rv reveal animations
    const rvObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            rvObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".rv").forEach((el) => rvObserver.observe(el));

    // 2. Terminal typewriter in Section 02 (#why)
    const tl = tlRef.current;
    let terminalTimeoutIds: NodeJS.Timeout[] = [];
    if (tl) {
      const pElements = Array.from(tl.children) as HTMLElement[];
      const texts = pElements.map((p) => p.textContent || "");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

      if (!prefersReducedMotion) {
        pElements.forEach((p) => {
          p.textContent = "";
        });

        let typed = false;
        const tlObserver = new IntersectionObserver(
          (entries, obs) => {
            if (entries[0].isIntersecting && !typed) {
              typed = true;
              obs.disconnect();

              const typeLine = (lineIdx: number) => {
                if (lineIdx >= pElements.length) return;
                const p = pElements[lineIdx];
                let charIdx = 0;
                p.classList.add("cur");

                const typeChar = () => {
                  charIdx++;
                  p.textContent = texts[lineIdx].slice(0, charIdx);
                  if (charIdx < texts[lineIdx].length) {
                    const tid = setTimeout(typeChar, 14);
                    terminalTimeoutIds.push(tid);
                  } else {
                    p.classList.remove("cur");
                    const tid = setTimeout(() => typeLine(lineIdx + 1), 260);
                    terminalTimeoutIds.push(tid);
                  }
                };
                typeChar();
              };

              typeLine(0);
            }
          },
          { threshold: 0.4 }
        );

        tlObserver.observe(tl);
      }
    }

    // 3. Section 01 (#idea) Parallax + Section 04 (#services) Horizontal Scroll
    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const hill = (el: HTMLElement | null, a: number, s: number, p: number, W: number) => {
      if (!el) return;
      el.style.transform = `translate3d(${lerp(a * W, -a * W, p)}px,0,0) scale(${lerp(1, s, p)})`;
    };

    const textGroups = [
      { sel: ".eyebrow, .l1", a: 0.02, b: 0.12 },
      { sel: ".l2", a: 0.28, b: 0.38 },
      { sel: ".l3", a: 0.58, b: 0.68 },
      { sel: ".l4", a: 0.78, b: 0.88 },
    ];

    const scene = (p: number) => {
      const cam = camRef.current;
      const sc = scRef.current;
      const sun = sunRef.current;
      const fl = flareRef.current;
      const gl = glowRef.current;
      const st = starsRef.current;
      const fg1 = fg1Ref.current;
      const fg2 = fg2Ref.current;
      const hp = hpRef.current;
      const hb = hbRef.current;
      const hd = hdRef.current;

      if (!cam || !sc || !sun || !fl || !gl || !st || !fg1 || !fg2) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const sx = lerp(0.05 * W, -0.05 * W, p);

      sun.style.transform = `translate3d(${sx}px, ${-0.07 * H * p}px, 0) scale(${lerp(1, 1.12, p)})`;
      hill(h1Ref.current, 0.12, 1.08, p, W);
      hill(h2Ref.current, 0.24, 1.18, p, W);
      hill(h3Ref.current, 0.42, 1.4, p, W);
      hill(h4Ref.current, 0.6, 1.5, p, W);

      fl.style.transform = `translate3d(${-sx * 4}px, ${-0.07 * H * p}px, 0)`;
      fl.style.opacity = (Math.sin(Math.PI * p) * 0.9).toFixed(3);

      dustElementsRef.current.forEach((el, i) => {
        if (!el) return;
        const k = dustParticles[i]?.k ?? 0.6;
        el.style.transform = `translate3d(${lerp(k * 0.5 * W, -k * 0.5 * W, p)}px, ${-p * k * 60}px, 0)`;
      });

      st.style.transform = `translate3d(${lerp(0.02 * W, -0.02 * W, p)}px, 0, 0)`;
      gl.style.transform = `${sun.style.transform} scale(${lerp(1, 1.7, p)})`;
      fg1.style.transform = `translate3d(${lerp(0.18 * W, -0.18 * W, p)}px, 0, 0)`;
      fg2.style.transform = `translate3d(${lerp(0.32 * W, -0.32 * W, p)}px, 0, 0)`;
      sc.style.backgroundPosition = `0 ${p * 70}%`;
      sc.style.setProperty("--go", (p * 900).toFixed(1));

      textGroups.forEach((tg) => {
        const k = clamp((p - tg.a) / (tg.b - tg.a));
        const els = cam.querySelectorAll<HTMLElement>(tg.sel);
        els.forEach((e) => {
          e.style.opacity = String(k);
          e.style.transform = `translateY(${(1 - k) * 40}px)`;
        });
      });

      if (hp) hp.textContent = p < 0.5 ? "A" : "B";
      if (hb) hb.style.width = `${p * 100}%`;
      if (hd) hd.textContent = String(Math.round(sx - lerp(0.24 * W, -0.24 * W, p)));
    };

    let ticking = false;
    let targetP = 0;
    let currentP = -1;
    let isLooping = false;
    let rafId: number | null = null;

    const loop = () => {
      currentP += (targetP - currentP) * 0.14;
      if (Math.abs(targetP - currentP) < 0.0005) {
        currentP = targetP;
      }
      scene(currentP);
      if (currentP !== targetP) {
        rafId = requestAnimationFrame(loop);
      } else {
        isLooping = false;
      }
    };

    const updateAll = () => {
      ticking = false;
      const cam = camRef.current;
      if (cam) {
        targetP = clamp(-cam.getBoundingClientRect().top / (cam.offsetHeight - window.innerHeight));
        if (currentP < 0) currentP = targetP;
        if (!isLooping) {
          isLooping = true;
          loop();
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateAll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateAll);
    updateAll();

    // 4. Fine pointer perspective tilt for Section 01
    const onPointerMove = (e: PointerEvent) => {
      if (scRef.current) {
        scRef.current.style.setProperty("--mx", String((e.clientX / window.innerWidth - 0.5) * 2));
        scRef.current.style.setProperty("--my", String((e.clientY / window.innerHeight - 0.5) * 2));
      }
    };

    if (
      window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion:reduce)").matches
    ) {
      window.addEventListener("pointermove", onPointerMove);
    }

    // 5. Section 05 (#how) Scroll Controller
    const updateVR = () => {
      const v = howRef.current as (HTMLElement & { _s?: number }) | null;
      if (!v) return;

      const m = v.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -v.getBoundingClientRect().top / m));
      const u = p * 4;
      const st = Math.round(u);

      v.style.setProperty("--p", p.toFixed(4));
      v.style.setProperty("--u", u.toFixed(3));

      if (v._s === st) return;
      v._s = st;

      for (let k = 1; k < 5; k++) {
        v.classList.toggle(`k${k}`, st >= k);
      }

      v.querySelectorAll<HTMLElement>(".pi").forEach((el, i) => {
        el.classList.toggle("on", i === st);
      });
    };

    let vrTicking = false;
    const onVRScroll = () => {
      if (!vrTicking) {
        vrTicking = true;
        requestAnimationFrame(() => {
          vrTicking = false;
          updateVR();
        });
      }
    };

    window.addEventListener("scroll", onVRScroll, { passive: true });
    window.addEventListener("resize", onVRScroll);
    updateVR();

    // 6. Watermark width fitting in Footer
    const fitWatermark = () => {
      const wmw = wmwRef.current;
      const wm = wmRef.current;
      if (!wmw || !wm) return;
      wmw.style.setProperty("--fs", "100px");
      const width = wm.getBoundingClientRect().width;
      if (width) {
        wmw.style.setProperty("--fs", `${(100 * wmw.clientWidth) / width}px`);
      }
    };

    fitWatermark();
    window.addEventListener("resize", fitWatermark);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWatermark);
    }

    // Cleanup
    return () => {
      rvObserver.disconnect();
      terminalTimeoutIds.forEach((tid) => clearTimeout(tid));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateAll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onVRScroll);
      window.removeEventListener("resize", onVRScroll);
      window.removeEventListener("resize", fitWatermark);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dustParticles]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="copy">
          <h1>
            Parallax
            <br />
            Machine Inc
          </h1>
          <a className="btn" href="#start">
            Start a project →
          </a>
        </div>
        <div className="tvwrap">
          <img
            alt="Retro CRT television with a glowing blue screen"
            src="/retro-tv.webp"
          />
        </div>
        <div className="blob b1"></div>
        <div className="blob b2"></div>
      </section>

      {/* 01 — THE IDEA */}
      <section className="cam" id="idea" ref={camRef}>
        <div className="scene" id="sc" ref={scRef}>
          <div className="stars layer" ref={starsRef} style={{ "--d": 3 } as React.CSSProperties}></div>
          <div className="glow layer" ref={glowRef} style={{ "--d": 6 } as React.CSSProperties}></div>
          <div className="sun layer" ref={sunRef} style={{ "--d": 6 } as React.CSSProperties}></div>
          <div className="flare" ref={flareRef}></div>
          <div className="hl h1 layer" ref={h1Ref} style={{ "--d": 14 } as React.CSSProperties}></div>
          <div className="fog fg1" ref={fg1Ref}></div>
          <div className="hl h2 layer" ref={h2Ref} style={{ "--d": 26 } as React.CSSProperties}></div>
          <div className="fog fg2" ref={fg2Ref}></div>
          <div className="floor"></div>
          <div className="hl h3 layer" ref={h3Ref} style={{ "--d": 48 } as React.CSSProperties}></div>
          <div className="hl h4 layer" ref={h4Ref} style={{ "--d": 70 } as React.CSSProperties}></div>

          {/* 30 dynamic dust particles */}
          {dustParticles.map((d, i) => (
            <i
              key={i}
              ref={(el) => {
                dustElementsRef.current[i] = el;
              }}
              className="dust"
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: `${d.size}px`,
                height: `${d.size}px`,
                opacity: d.opacity,
              }}
            />
          ))}

          <div className="vig"></div>
          <div className="ref"></div>
          <div className="t1">
            <p className="eyebrow">01 — The idea</p>
            <h2>
              <span className="l1">Same problem.</span>
              <span className="l2">Different angle.</span>
            </h2>
          </div>
          <div className="t2">
            <p className="lead l3">
              Parallax is the way something appears to shift when you change where you stand. Every
              client sees their challenge from a different position. We begin by understanding yours.
            </p>
            <p className="big l4 cursive-italic">Start with the problem, not the service.</p>
          </div>
          <div className="hud">
            <span>
              Position <b id="hp" ref={hpRef}>A</b> → B
            </span>
            <i className="bar">
              <i id="hb" ref={hbRef}></i>
            </i>
            <span className="dl">
              Sun vs ridge <b id="hd" ref={hdRef}>0</b> px
            </span>
          </div>
        </div>
      </section>

      {/* 02 — WHY WE EXIST */}
      <section className="sec d2" id="why">
        <div className="w">
          <p className="eyebrow rv">02 — Why we exist</p>
          <h2 className="rv">Going digital shouldn’t need a translator.</h2>
          <p className="lead rv">
            The gap is rarely a lack of interest. It’s the difficulty of turning a business need into
            something that works online.
          </p>
          <div className="term rv">
            <div className="tb">
              <i></i>
              <i></i>
              <i></i>
              <span>client.exe</span>
            </div>
            <div className="tl" id="tl" ref={tlRef}>
              {TERMINAL_LINES.map((line, i) => (
                <p key={i} className={line.className}>
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — THE CENTRE */}
      <section className="sec d1" id="orbit">
        <div className="w rw">
          <div>
            <p className="eyebrow rv">03 — The centre</p>
            <h2 className="rv">One centre. Many directions.</h2>
            <p className="lead rv">
              Clients arrive from different starting points. We stay the point of connection between
              where you are and where you want to be.
            </p>
            <div id="rl">
              {RADAR_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className={`rb ${activeRadarKey === item.key ? "on" : ""}`}
                  data-k={item.key}
                  style={{ "--c": item.color } as React.CSSProperties}
                  onClick={() => setActiveRadarKey(item.key)}
                  onMouseEnter={() => setActiveRadarKey(item.key)}
                  onFocus={() => setActiveRadarKey(item.key)}
                >
                  <b>{item.title}</b>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="radar" id="rd">
            <div className="sweep"></div>
            {RADAR_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`blip ${activeRadarKey === item.key ? "on" : ""}`}
                data-k={item.key}
                aria-label={item.title}
                style={{
                  "--c": item.color,
                  left: item.left,
                  top: item.top,
                } as React.CSSProperties}
                onClick={() => setActiveRadarKey(item.key)}
                onMouseEnter={() => setActiveRadarKey(item.key)}
                onFocus={() => setActiveRadarKey(item.key)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — WHAT WE DO */}
      <section className="sec services-sec" id="services">
        <div className="w" style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 44px)" }}>
          <p className="eyebrow rv">04 — What we do</p>
          <h2 className="rv" style={{ marginInline: "auto", maxWidth: "16ch" }}>
            Capabilities shaped around your goals
          </h2>
          <p className="lead rv" style={{ marginInline: "auto" }}>
            From high-performance websites to creative 3D motion and custom technical builds, explore our core areas of work.
          </p>
        </div>

        {/* React Bits Pro Concave Carousel */}
        <div className="concave-gallery-container rv">
          <ConcaveCarousel
            items={SERVICE_CAROUSEL_ITEMS}
            aspect={1.25}
            size={0.52}
            curvature={0.88}
            distance={3.6}
            tilt={0.0}
            gap={18}
            radius={16}
            dim={0.4}
            reflection={0.08}
            autoplay="drift"
            speed={0.16}
            interval={4.0}
            snap={true}
            inertia={0.5}
            pauseOnHover={true}
            draggable={true}
            wheel={false}
            captions={true}
            controls={true}
            ariaLabel="Parallax Machine Inc Services Gallery"
          />
        </div>
      </section>

      {/* 05 — HOW WE WORK */}
      <section className="vr v1" id="how" ref={howRef}>
        <div className="vs">
          <p className="eyebrow vl">05 — How we work</p>
          <div className="how-list" data-list>
            {PRINCIPLES.map(([title, desc], i) => (
              <div key={i} className={`pi ${i === 0 ? "on" : ""}`}>
                <span>0{i + 1}</span>
                <b>{title}</b>
                <em>{desc}</em>
              </div>
            ))}
          </div>
          <div className="wrap">
            <div className="win">
              <div className="wb">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="wbody">
                <div className="blk nav">
                  <span className="tx">Parallax</span>
                  <span className="tx">Work · Contact</span>
                </div>
                <div className="blk hero">
                  <span className="tx">Start wherever you are.</span>
                </div>
                <div className="row3">
                  <div className="blk"></div>
                  <div className="blk"></div>
                  <div className="blk"></div>
                </div>
                <div className="chart">
                  <i style={{ height: "30%" }}></i>
                  <i style={{ height: "55%" }}></i>
                  <i style={{ height: "42%" }}></i>
                  <i style={{ height: "80%" }}></i>
                  <i style={{ height: "100%" }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — YOUR MOVE / CTA */}
      <section className="sec d1 cta" id="start">
        <div className="w">
          <p className="eyebrow rv">06 — Your move</p>
          <h2 className="rv">Start wherever you are.</h2>
          <p className="lead rv">
            Know exactly what you need, or only what you want to achieve? Either is a good place to begin.
          </p>
          <div className="row rv">
            <a className="btn" href="#start">
              Start a project →
            </a>
            <a className="btn ghost" href="#how">
              See how we work
            </a>
          </div>
        </div>
        <div className="blob b1"></div>
        <div className="blob b2"></div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="top">
          <p className="tg">Making Digital World Easy for Everyone.</p>
          <div className="lk">
            <a href="#services">What we do</a>
            <a href="#how">How we work</a>
            <a href="#start">Start a project</a>
          </div>
        </div>
        <p className="cp">© 2026 Parallax Machine Inc.</p>
        <div className="wmw" id="wmw" ref={wmwRef}>
          <span className="wm" id="wm" ref={wmRef} aria-label="Parallax">
            Parallax
          </span>
        </div>
      </footer>
    </>
  );
}
