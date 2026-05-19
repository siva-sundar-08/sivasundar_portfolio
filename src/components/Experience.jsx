import { gsap } from "gsap";
import useScrollAnimation from "../hooks/useScrollAnimation";

const experiences = [
  {
    label: "Intern 01",
    role: "Flutter App Development",
    company: "Hackwit Technologies Pvt Ltd",
    duration: "Jan 2025 - Feb 2025",
    location: "Shollinganallur, Chennai",
    href: "https://hackwittechnologies.com/",
  },
  {
    label: "Intern 02",
    role: "Development Program on IoT",
    company: "NSIC Technical Service Center",
    duration: "June 2024 - July 2024",
    location: "Ekkaduthangal, Chennai",
    href: "https://www.nsic.co.in/Home/Index",
  },
];

export default function Experience() {
  const ref = useScrollAnimation((container) => {
    gsap.from(container.querySelectorAll(".experience-copy, .experience-card"), {
      opacity: 0,
      y: 28,
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

  return (
    <section
      id="experience"
      ref={ref}
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(239,68,68,0.08),transparent_25%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="experience-copy mb-14 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
            // Experience
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Internships
          </h2>
          <p className="mt-6 text-sm leading-6 text-neutral-400 md:text-[15px]">
            Short-term roles where I worked on applied development work across
            mobile and IoT-oriented training environments.
          </p>
        </div>

        <div className="grid gap-6">
          {experiences.map((item) => (
            <article
              key={`${item.company}-${item.role}`}
              className="experience-card rounded-[2rem] border border-white/10 bg-neutral-950/90 p-6 shadow-2xl md:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.2fr_1fr_0.55fr] lg:items-start">
                <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-red-500">
                  {item.label}
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                    {item.role}
                  </h3>
                  <p className="mt-3 text-sm text-neutral-200 md:text-base">
                    {item.company}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-black px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-300">
                      {item.duration}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-300">
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="lg:justify-self-end">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/10 bg-black px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-neutral-200 transition-all hover:border-red-500/40 hover:bg-red-500 hover:text-white"
                  >
                    Visit Organization
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
