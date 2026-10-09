"use client";

import Image from "next/image";
import { useRef } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/hooks";

export function About() {
  const root = useRef<HTMLElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");

  useGSAP(
    () => {
      registerGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=90%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });
      });

      // Spec panels float at different depths: the deeper, the slower.
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((panel) => {
        const depth = Number(panel.dataset.depth ?? 1);
        gsap.fromTo(
          panel,
          { yPercent: 40 * depth, rotateX: 18 * depth, opacity: 0 },
          {
            yPercent: -30 * depth,
            rotateX: -6 * depth,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 90%",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      gsap.fromTo(
        ".about-portrait",
        {
          clipPath: "inset(48% 0% 48% 0% round 28px)",
          filter: "saturate(0) brightness(1.6)",
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          filter: "saturate(1) brightness(1)",
          ease: "expo.out",
          duration: 1.4,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  // Desktop resolves the text while the section is pinned; mobile resolves
  // each paragraph as it rises into the lower half of the screen.
  const scrambleRange = desktop
    ? { trigger: "section", start: "top top", end: "+=80%" }
    : { start: "top 95%", end: "top 55%" };

  return (
    <section
      id="about"
      data-section="about"
      ref={root}
      aria-labelledby="about-title"
      className="relative flex min-h-svh items-center px-5 py-28 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <SectionHeader section="about" title="About" />
          <div className="flex max-w-2xl flex-col gap-5 text-base leading-relaxed md:text-[1.0625rem]">
            <ScrambleText text={site.bio[0]} {...scrambleRange} />
            <ScrambleText
              text={site.bio[1]}
              className="text-ink-dim"
              {...scrambleRange}
            />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={site.cvUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open CV"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 font-mono text-xs font-semibold tracking-[0.24em] text-[var(--void-0)] uppercase"
              >
                View CV <span aria-hidden>↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="glass inline-flex items-center rounded-full px-6 py-3 font-mono text-xs tracking-[0.24em] uppercase"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm [perspective:1200px] lg:max-w-none">
          <figure className="glass relative overflow-hidden p-3">
            <div className="about-portrait relative overflow-hidden rounded-[22px]">
              <Image
                src={site.portrait.src}
                width={site.portrait.width}
                height={site.portrait.height}
                alt={site.portrait.alt}
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="h-auto w-full"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/0.035)_0_1px,transparent_1px_4px)] mix-blend-overlay"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_40%,color-mix(in_oklab,var(--accent-3)_18%,transparent))] mix-blend-color"
              />
            </div>
            <figcaption className="mt-3 flex justify-between px-1 hud">
              <span>ID · SS-0001</span>
              <span className="text-accent">● Online</span>
            </figcaption>
          </figure>

          <dl className="pointer-events-none absolute inset-0 hidden sm:block">
            {site.specs.map((spec, i) => (
              <div
                key={spec.label}
                data-depth={(i % 2) + 1}
                className={[
                  "glass absolute! w-48 px-4 py-3 [--glass-blur:14px]",
                  i === 0 && "-top-6 -left-16",
                  i === 1 && "top-1/4 -right-14",
                  i === 2 && "bottom-1/4 -left-20",
                  i === 3 && "-right-8 -bottom-8",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <dt className="hud">{spec.label}</dt>
                <dd className="mt-1 font-display text-sm font-semibold [font-stretch:120%]">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
            {site.specs.map((spec) => (
              <div key={spec.label} className="glass px-4 py-3 [--glass-blur:14px]">
                <dt className="hud">{spec.label}</dt>
                <dd className="mt-1 font-display text-sm font-semibold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
