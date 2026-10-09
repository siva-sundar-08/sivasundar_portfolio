"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { ViewTransition, type PointerEvent } from "react";
import type { Project } from "@/content/types";
import { spring } from "@/lib/motion";
import { ProjectMedia } from "./ProjectMedia";

/** Glass card that tilts toward the pointer and catches a moving highlight. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), spring.tilt);
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), spring.tilt);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.16), transparent 45%)`;

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="project-card w-[min(84vw,440px)] shrink-0 snap-center [transform-style:preserve-3d] lg:w-[min(30vw,calc((100svh-230px)/1.2),480px)]">
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        className="group relative [transform-style:preserve-3d]"
      >
        <Link
          href={`/work/${project.slug}`}
          transitionTypes={["nav-forward"]}
          data-cursor="Open"
          className="glass block p-3 outline-offset-8"
        >
          <ViewTransition name={`media-${project.slug}`} share="morph" default="none">
            <ProjectMedia
              project={project}
              priority={index < 2}
              className="aspect-[4/5] rounded-[22px] lg:aspect-[5/6]"
            />
          </ViewTransition>
          <div className="flex [transform:translateZ(40px)] items-end justify-between gap-4 px-3 pt-5 pb-3">
            <div>
              <p className="hud">
                <span className="text-accent">{project.code}</span> ·{" "}
                {project.category === "mobile" ? "Mobile app" : "Web"}
              </p>
              <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
                <h3 className="mt-3 display-wide text-[clamp(1.6rem,3vw,2.4rem)] uppercase">
                  {project.title}
                </h3>
              </ViewTransition>
              <p className="mt-3 line-clamp-2 max-w-sm text-sm text-ink-dim">
                {project.summary}
              </p>
            </div>
            <span
              aria-hidden
              className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--void-0)]"
            >
              ↗
            </span>
          </div>
        </Link>
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-panel)] mix-blend-overlay"
        />
      </motion.article>
    </div>
  );
}
