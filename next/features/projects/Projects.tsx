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
          const distance = () => el.scrollWidth - window.innerWidth;

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
      className="relative overflow-hidden py-28 lg:flex lg:h-svh lg:items-center lg:py-0"
    >
      {/* On desktop the header rides the same horizontal track as the cards. */}
      <div
        ref={track}
        className="flex flex-col gap-4 lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:pr-[10vw] lg:pl-[max(2.5rem,calc((100vw-80rem)/2))]"
      >
        <div className="px-5 md:px-10 lg:w-[min(44vw,640px)] lg:shrink-0 lg:px-0 [&_header]:mb-0">
          <SectionHeader
            section="projects"
            title="Work"
            intro="Mobile apps and web builds. Open any artifact for the full case study."
          />
        </div>
        <div className="flex snap-x snap-mandatory [scrollbar-width:none] gap-6 overflow-x-auto px-5 pt-8 pb-6 [perspective:1600px] md:px-10 lg:snap-none lg:gap-10 lg:overflow-visible lg:p-0">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
          <div className="flex w-48 shrink-0 items-center hud" aria-hidden>
            End of archive ·{" "}
            <span className="ml-1 text-accent">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
