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

      gsap.fromTo(
        ".about-portrait",
        {
          clipPath: "inset(48% 0% 48% 0%)",
          filter: "saturate(0) brightness(1.6)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
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

        <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:max-w-[19rem]">
          {/* No frame: the portrait's dark backdrop dissolves straight into the page. */}
          <figure className="relative">
            <div className="about-portrait relative [mask-image:radial-gradient(ellipse_70%_75%_at_50%_42%,#000_55%,transparent_100%)]">
              <Image
                src={site.portrait.src}
                width={site.portrait.width}
                height={site.portrait.height}
                alt={site.portrait.alt}
                sizes="(min-width: 1024px) 304px, 272px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="-mt-2 flex justify-center gap-4 hud">
              <span className="text-accent">● Online</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
