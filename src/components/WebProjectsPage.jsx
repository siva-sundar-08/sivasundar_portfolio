import { useEffect } from "react";
import { gsap } from "gsap";
import useScrollAnimation from "../hooks/useScrollAnimation";

const webProjects = [
  {
    title: "Liver Disease Prediction Website",
    summary:
      "AI-assisted clinical screening interface with prediction flow, image detection, reports, and profile screens.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Personal Portfolio Website",
    summary:
      "Interactive developer portfolio focused on bold presentation, motion, contact flow, and project storytelling.",
    tags: ["ReactJS", "JavaScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "IoT Smart Cart Shopping",
    summary:
      "Project presentation website for an RFID-enabled smart shopping cart with workflow, features, and gallery sections.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "IoT Weather Monitoring System",
    summary:
      "Project showcase page covering real-time environmental monitoring, cloud analytics, and hardware workflow details.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Food Delivery Web UI",
    summary:
      "Frontend interface work for food ordering flows with product browsing, action hierarchy, and responsive layout structure.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export default function WebProjectsPage() {
  const ref = useScrollAnimation((container) => {
    gsap.from(container.querySelectorAll(".web-projects-copy, .web-project-card"), {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.75,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    });
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      ref={ref}
      className="relative z-10 px-6 pb-24 pt-32 md:px-12"
    >
      <section className="web-projects-copy mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-neutral-950/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-400">
              // Web Projects
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              All Web Projects
            </h1>
            <p className="mt-6 text-sm leading-7 text-neutral-300 md:text-[15px]">
              This page shows the project list in a compact format. Each card keeps
              the information to two lines: one short project summary and one tag line
              for the technologies used.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/siva-sundar-08?tab=repositories&q=&type=&language=&sort=name"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-red-200 transition-all hover:border-red-400 hover:bg-red-500 hover:text-white"
            >
              Repository Link
            </a>
            <a
              href="/#projects"
              className="rounded-full border border-white/10 bg-neutral-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-neutral-200 transition-all hover:border-red-500/40 hover:bg-neutral-950"
            >
              Back To Portfolio
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="grid gap-6">
          {webProjects.map((project) => (
            <article
              key={project.title}
              className="web-project-card rounded-[1.75rem] border border-white/10 bg-neutral-950/75 px-6 py-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                {project.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/8 bg-black/45 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
