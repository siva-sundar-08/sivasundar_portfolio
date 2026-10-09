"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMode } from "@/components/providers/ModeProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { heroSequence } from "@/content/hero";
import { site } from "@/content/site";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/hooks";
import { detectQuality, type Quality } from "@/lib/quality";
import { createLiveState, stageAt, stages } from "./timeline";

const HeroScene = dynamic(() => import("./scene/HeroScene"), { ssr: false });
const FrameSequence = dynamic(() => import("./FrameSequence"), { ssr: false });

const letters = (word: string) => word.split("");

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const live = useMemo(() => createLiveState(), []);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { mode } = useMode();
  const [quality, setQuality] = useState<Quality | null>(null);
  const [active, setActive] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  const stageRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const turbulence = useRef<SVGFETurbulenceElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);

  // WebGL (and the GPU probe that picks its quality tier) loads on the
  // visitor's first sign of intent: scroll, pointer, touch or key. Until
  // then the poster stands in, so first load does no 3D work at all.
  useEffect(() => {
    if (reduced) return;
    const events = [
      "wheel",
      "scroll",
      "pointermove",
      "pointerdown",
      "touchstart",
      "keydown",
    ];
    const arm = () => {
      events.forEach((type) => window.removeEventListener(type, arm));
      setQuality(detectQuality());
    };
    events.forEach((type) =>
      window.addEventListener(type, arm, { passive: true, once: true }),
    );
    return () => events.forEach((type) => window.removeEventListener(type, arm));
  }, [reduced]);

  // Pause rendering while the hero is off-screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      {
        rootMargin: "10% 0px",
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      live.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      live.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [live]);

  useGSAP(
    () => {
      registerGsap();
      const root = section.current;
      if (!root || reduced) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            live.progress = self.progress;
            live.velocity = self.getVelocity();
            const stage = stageAt(self.progress);
            if (stageRef.current) stageRef.current.textContent = stage.label;
            if (percentRef.current)
              percentRef.current.textContent = String(
                Math.round(self.progress * 100),
              ).padStart(3, "0");
            if (barRef.current)
              barRef.current.style.transform = `scaleX(${self.progress})`;
            if (coordsRef.current) {
              const z = 16 - self.progress * 29;
              coordsRef.current.textContent = `Z ${z.toFixed(2)} · FOV ${(42 + Math.sin(self.progress * Math.PI) * 30).toFixed(1)}`;
            }
          },
        },
      });

      tl.to(
        ".hero-intro",
        { opacity: 0, y: -60, filter: "blur(12px)", duration: 0.1, ease: "power2.in" },
        0.02,
      )
        .fromTo(
          ".hero-letter",
          { opacity: 0, yPercent: 110, rotateX: -85, filter: "blur(14px)" },
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.09,
            stagger: 0.008,
            ease: "expo.out",
          },
          0.78,
        )
        .fromTo(
          displacement.current,
          { attr: { scale: 140 } },
          { attr: { scale: 0 }, duration: 0.14, ease: "power3.out" },
          0.78,
        )
        .fromTo(
          turbulence.current,
          { attr: { baseFrequency: "0.02 0.09" } },
          { attr: { baseFrequency: "0.002 0.01" }, duration: 0.14 },
          0.78,
        )
        .set(".hero-name", { filter: "none" }, 0.93)
        .fromTo(
          ".hero-reveal",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.06, stagger: 0.015, ease: "power3.out" },
          0.86,
        )
        .to(".hero-canvas", { opacity: 0, duration: 0.06, ease: "power2.in" }, 0.94)
        .to(".hero-hud", { opacity: 0, duration: 0.04 }, 0.95)
        .to({}, { duration: 0.01 }, 0.99);
    },
    { scope: section, dependencies: [reduced] },
  );

  const showScene = (quality === "high" || quality === "low") && !reduced;

  return (
    <section
      id="hero"
      data-section="hero"
      ref={section}
      aria-labelledby="hero-title"
      className="relative h-[520svh] motion-reduce:h-svh"
    >
      <svg className="absolute size-0" aria-hidden focusable="false">
        <filter id="hero-warp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbulence}
            type="fractalNoise"
            baseFrequency="0.002 0.01"
            numOctaves={2}
            seed={7}
          />
          <feDisplacementMap
            ref={displacement}
            in="SourceGraphic"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Poster: the first frame, shown until WebGL is ready and for static tiers. */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: sceneReady ? 0 : 1 }}
        >
          <div className="absolute top-1/2 left-1/2 size-[min(70vmin,560px)] -translate-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,color-mix(in_oklab,var(--accent)_45%,transparent),transparent_55%),radial-gradient(circle_at_65%_70%,color-mix(in_oklab,var(--accent-2)_55%,transparent),transparent_60%)] opacity-60 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 size-[min(46vmin,360px)] -translate-1/2 rounded-full border border-white/10 opacity-50 [background:conic-gradient(from_120deg,transparent,color-mix(in_oklab,var(--accent)_40%,transparent),transparent_40%,color-mix(in_oklab,var(--accent-3)_35%,transparent),transparent_75%)] [mask:radial-gradient(circle,transparent_62%,#000_63%,#000_64%,transparent_65%)]" />
        </div>

        {showScene ? (
          <div
            className="hero-canvas absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: sceneReady ? 1 : 0 }}
            ref={(el) => {
              if (el && !sceneReady) requestAnimationFrame(() => setSceneReady(true));
            }}
          >
            {heroSequence.type === "frames" ? (
              <FrameSequence live={live} active={active} {...heroSequence} />
            ) : quality === "high" || quality === "low" ? (
              <HeroScene live={live} quality={quality} active={active} mode={mode} />
            ) : null}
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--void-0)] opacity-70" />

        {/* Intro: what the visitor sees before scrolling. */}
        <div className="hero-intro pointer-events-none absolute inset-x-0 bottom-[18svh] flex flex-col items-center gap-5 text-center motion-reduce:hidden">
          <p className="hud">Siva Sundar · iOS & Web</p>
          <p className="max-w-md px-6 font-display text-lg text-ink-dim [font-stretch:115%] md:text-xl">
            A signal is forming. Scroll to bring it into focus.
          </p>
          <span className="relative block h-14 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-out-expo)_infinite] bg-[var(--accent)]" />
          </span>
        </div>

        {/* Portal reveal */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <h1
            id="hero-title"
            className="hero-name [filter:url(#hero-warp)] motion-reduce:[filter:none]"
          >
            <span className="sr-only">
              {site.name}, {site.roles.join(" and ")}
            </span>
            <span aria-hidden className="block [perspective:900px]">
              {[site.firstName, site.lastName].map((word) => (
                <span
                  key={word}
                  className="block display-wide text-[clamp(3.4rem,15vw,13.5rem)] whitespace-nowrap"
                >
                  {letters(word).map((char, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="hero-letter inline-block [transform-origin:50%_100%] opacity-0 motion-reduce:opacity-100"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-reveal mt-8 hud opacity-0 motion-reduce:opacity-100">
            <span className="text-accent">{site.roles[0]}</span>
            <span className="mx-3 text-white/30">/</span>
            <span>{site.roles[1]}</span>
          </p>
          <p className="hero-reveal mt-5 max-w-xl text-sm leading-relaxed text-ink-dim opacity-0 motion-reduce:opacity-100 md:text-base">
            {site.tagline}
          </p>
          <div className="hero-reveal mt-9 flex flex-wrap justify-center gap-3 opacity-0 motion-reduce:opacity-100">
            <Magnetic>
              <a
                href="#projects"
                data-cursor="Explore"
                className="glass inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs tracking-[0.24em] uppercase transition-colors hover:text-[var(--accent)]"
              >
                View work
                <span aria-hidden>↘</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 font-mono text-xs font-semibold tracking-[0.24em] text-[var(--void-0)] uppercase transition-[filter] hover:brightness-110"
              >
                Open uplink
              </a>
            </Magnetic>
          </div>
        </div>

        {/* HUD */}
        <div
          aria-hidden
          className="hero-hud pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 motion-reduce:hidden md:inset-x-8 md:bottom-7"
        >
          <div className="flex flex-col gap-2">
            <span className="hud">
              SYS//00 · <span ref={stageRef}>{stages[0].label}</span>
            </span>
            <span className="relative block h-px w-40 bg-white/10 md:w-56">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]"
              />
            </span>
            <span className="hud tabular-nums">
              SEQ <span ref={percentRef}>000</span>%
            </span>
          </div>
          <span ref={coordsRef} className="hidden hud tabular-nums sm:block">
            Z 16.00 · FOV 42.0
          </span>
        </div>
      </div>
    </section>
  );
}
