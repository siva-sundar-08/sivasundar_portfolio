import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

type ProjectMediaProps = {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * A project's visual: its cover image when it has one, otherwise a
 * holographic field tinted by the project's hue. Both animate on hover
 * of a `.group` ancestor.
 */
export function ProjectMedia({ project, className, priority, sizes }: ProjectMediaProps) {
  const hue = (offset: number) => `hsl(${(project.hue + offset) % 360} 95% 60%)`;
  const style = {
    "--holo-1": hue(0),
    "--holo-2": hue(70),
    "--holo-3": hue(150),
    "--holo-4": hue(230),
  } as CSSProperties;

  return (
    <div
      style={style}
      className={cn("relative isolate overflow-hidden bg-[var(--void-1)]", className)}
    >
      <div
        aria-hidden
        className="holo-field absolute inset-[-40%] opacity-45 transition-opacity duration-700 group-hover:opacity-90"
      />
      {project.cover ? (
        <Image
          src={project.cover.src}
          width={project.cover.width}
          height={project.cover.height}
          alt={project.cover.alt}
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 40vw, 85vw"}
          className="absolute top-[8%] left-1/2 w-[46%] max-w-[260px] -translate-x-1/2 rounded-[22px] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/15 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="display-wide text-[clamp(4rem,12vw,9rem)] text-white/10 mix-blend-overlay transition-[letter-spacing] duration-700 group-hover:tracking-[0.04em]">
            {project.code.split("//")[1]}
          </span>
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_3px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
}
