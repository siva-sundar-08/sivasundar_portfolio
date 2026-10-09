"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/content/projects";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { ProjectCard } from "./ProjectCard";

/**
 * Desktop: the section pins and vertical scroll drives a horizontal track
 * through depth; cards swing in from the side. Touch and narrow screens get
 * a native swipeable, snap-scrolling row instead.
 */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          if (!el) return;
          const distance = () => el.scrollWidth - window.innerWidth + 80;

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });

          gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
            gsap.fromTo(
              card,
              { z: -420, rotateY: -38, opacity: 0.2 },
              {
                z: 0,
                rotateY: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: "left 105%",
                  end: "left 55%",
                  scrub: true,
                },
              },
            );
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="projects"
      data-section="projects"
      ref={root}
      aria-labelledby="projects-title"
      className="relative overflow-hidden py-28 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16"
    >
      <div className="px-5 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            section="projects"
            title="Work"
            intro="Mobile apps and web builds. Open any artifact for the full case study."
          />
        </div>
      </div>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [perspective:1600px] [scrollbar-width:none] md:px-10 lg:w-max lg:snap-none lg:gap-10 lg:overflow-visible lg:px-[max(2.5rem,calc((100vw-80rem)/2))]"
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
        <div className="hud flex w-48 shrink-0 items-center" aria-hidden>
          End of archive ·{" "}
          <span className="text-accent ml-1">{String(projects.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
