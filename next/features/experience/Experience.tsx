"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experience } from "@/content/experience";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

// A path through space in a 100 × 100 box, stretched to the timeline's height.
const PATH = "M50 0 C 50 10, 88 14, 82 30 S 18 46, 22 62 S 70 82, 50 100";

/**
 * Trajectory: an SVG path draws itself as you scroll, a comet rides its tip,
 * and each stop lights up as the line reaches it.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const comet = useRef<HTMLDivElement>(null);
  const timeline = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const line = path.current;
      const dot = comet.current;
      if (!line || !dot) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const total = line.getTotalLength();

      if (reduced) {
        gsap.set(line, { strokeDashoffset: 0 });
        gsap.set(".exp-stop", { opacity: 1 });
        return;
      }

      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timeline.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.7,
        },
        onUpdate: () => {
          line.style.strokeDashoffset = String(1 - state.p);
          const point = line.getPointAtLength(state.p * total);
          dot.style.left = `${point.x}%`;
          dot.style.top = `${point.y}%`;
          dot.style.opacity = state.p > 0.001 && state.p < 0.999 ? "1" : "0";
        },
      });

      gsap.utils.toArray<HTMLElement>(".exp-stop").forEach((stop) => {
        gsap.fromTo(
          stop,
          {
            opacity: 0.15,
            x: stop.dataset.side === "left" ? -60 : 60,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "expo.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: stop,
              start: "top 68%",
              toggleActions: "play none none reverse",
              toggleClass: { targets: stop, className: "is-lit" },
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="experience"
      data-section="experience"
      ref={root}
      aria-labelledby="experience-title"
      className="relative overflow-x-clip px-5 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          section="experience"
          title="Experience"
          intro="Internships where I worked on applied development across mobile and IoT."
        />

        <div ref={timeline} className="relative min-h-[110svh] md:min-h-[130svh]">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id="trajectory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="55%" stopColor="var(--accent-2)" />
                <stop offset="100%" stopColor="var(--accent-3)" />
              </linearGradient>
            </defs>
            <path
              d={PATH}
              fill="none"
              stroke="rgb(255 255 255 / 0.08)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={path}
              d={PATH}
              fill="none"
              stroke="url(#trajectory)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
            />
          </svg>
          <div
            ref={comet}
            aria-hidden
            className="absolute size-3 -translate-1/2 rounded-full bg-white opacity-0 shadow-[0_0_24px_6px_var(--accent)]"
          />

          <ol className="relative flex h-full min-h-[inherit] flex-col justify-around gap-24 py-[8%]">
            <li aria-hidden className="absolute -top-2 left-1/2 -translate-x-1/2 hud">
              Origin
            </li>
            {experience.map((item, i) => {
              const side = i % 2 === 0 ? "right" : "left";
              return (
                <li
                  key={item.id}
                  data-side={side}
                  className={cn(
                    "exp-stop group/stop glass w-full max-w-md p-6 md:p-8",
                    side === "right" ? "self-end md:mr-[4%]" : "self-start md:ml-[4%]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-white/30 transition-all duration-500 group-[.is-lit]/stop:bg-[var(--accent)] group-[.is-lit]/stop:shadow-[0_0_14px_var(--accent)]"
                    />
                    <p className="hud tabular-nums">{item.period}</p>
                  </div>
                  <h3 className="mt-4 font-display text-2xl leading-tight font-extrabold uppercase [font-stretch:125%]">
                    {item.role}
                  </h3>
                  <p className="mt-2 text-ink">{item.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">{item.note}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="hud">{item.location}</span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hud transition-colors hover:text-accent"
                    >
                      Visit organization ↗
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
