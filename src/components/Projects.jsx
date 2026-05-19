import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const projectCategories = [
  {
    title: "Mobile app project",
    tag: "Mobile Product Work",
    description:
      "Mobile app development work focused on booking flows, product UI, smooth interaction design, and cross-platform experience.",
    stack: ["Xcode", "Swift", "SwiftUI", "UI-Kit", "Flutter", "Dart"],
    cta: "Visit Projects",
    href: "/projects/mobile",
  },
  {
    title: "Web Projects",
    tag: "Frontend And Web Work",
    description:
      "A collection of web projects covering landing pages, interactive interfaces, portfolio builds, and product-focused frontend work.",
    stack: ["HTML", "CSS", "JavaScript", "ReactJS"],
    cta: "Visit Projects",
    href: "/projects/web",
  },
];

export default function Projects() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from(".project-copy", {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.from(".project-card", {
          opacity: 0,
          y: 44,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 72%",
            once: true,
          },
        });
      }, ref);

      return () => ctx.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="projects"
      ref={ref}
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="project-copy mb-16 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
            // Selected Work
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
            Project Categories
          </h2>
          <p className="mt-6 text-sm leading-6 text-neutral-400 md:text-[15px]">
            Two clear categories keep the section compact on the portfolio while the
            web projects page holds the full list.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {projectCategories.map((project) => (
            <article
              key={project.title}
              className="project-card rounded-[2rem] border border-white/10 bg-neutral-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8"
            >
              <div className="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_30%),linear-gradient(180deg,#121212_0%,#090909_100%)] p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                      {project.tag}
                    </p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-white/75 md:text-[15px]">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/8 bg-black/45 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {project.href ? (
                  <div className="mt-10 flex justify-end">
                    <Link
                      to={project.href}
                      className="inline-flex rounded-full bg-red-500 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-white transition-all hover:bg-red-400"
                    >
                      {project.cta}
                    </Link>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
