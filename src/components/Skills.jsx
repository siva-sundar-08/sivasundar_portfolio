import { gsap } from "gsap";
import useScrollAnimation from "../hooks/useScrollAnimation";

const categories = [
  {
    title: "Mobile Development",
    label: "01",
    summary:
      "Native iPhone and iPad interface work with a focus on clean structure, interaction clarity, and maintainable UI code.",
    skills: ["Swift", "SwiftUI"],
  },
  {
    title: "Web Development",
    label: "02",
    summary:
      "Responsive front-end implementation for portfolio and product interfaces across desktop and mobile layouts.",
    skills: ["ReactJS", "HTML5 & CSS3", "JavaScript"],
  },
  {
    title: "Tools & Others",
    label: "03",
    summary:
      "Core tools and foundations I use for building, iterating, versioning, and exploring interface ideas.",
    skills: ["Xcode", "Git & GitHub", "UI/UX Fundamentals", "Swift Playgrounds"],
  },
];

const highlights = [
  "Native mobile UI building",
  "Responsive web interfaces",
  "Version control workflow",
  "Product-focused UI thinking",
];

export default function Skills() {
  const ref = useScrollAnimation((container) => {
    gsap.from(container.querySelectorAll(".skills-copy, .skills-highlight"), {
      opacity: 0,
      y: 24,
      stagger: 0.08,
      duration: 0.75,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(container.querySelectorAll(".skill-card"), {
      y: 24,
      duration: 0.55,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 74%",
        once: true,
      },
    });
  });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative flex w-full justify-center bg-black px-6 py-24 md:px-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_28%)]" />
      <div className="relative w-full max-w-6xl">
        <div className="grid gap-10">
          <div className="skills-copy max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
              // Skills
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white md:text-4xl xl:text-5xl">
              What I Work With
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-neutral-400 md:text-[15px]">
              The section is now aligned around your actual stack instead of
              generic placeholders, with one clear column for intro copy and one
              for the skill groups.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="skills-highlight rounded-2xl border border-white/12 bg-neutral-950 px-4 py-4 text-sm text-neutral-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.title}
                className="skill-card rounded-3xl border border-white/12 bg-neutral-950 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30"
              >
                <div className="flex items-center gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-red-500">
                    {category.label}
                  </p>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-white xl:text-[1.75rem]">
                  {category.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-neutral-300">
                  {category.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/12 bg-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
