import { gsap } from "gsap";
import profileImage from "../assets/profile.png";
import useScrollAnimation from "../hooks/useScrollAnimation";

export default function About() {
  const ref = useScrollAnimation((container) => {
    gsap.from(container.querySelectorAll(".about-visual, .about-copy"), {
      opacity: 0,
      y: 26,
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
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="about-copy">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
              // About
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              ABOUT ME
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-300 md:text-[15px]">
              I&apos;m Siva Sundar, an iOS-focused developer who enjoys building clean,
              structured, and usable interfaces. My strongest interest is in crafting
              mobile experiences with clear navigation, practical interaction design,
              and product thinking that translates well across both app and web
              interfaces.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-400 md:text-[15px]">
              I place more importance on iPhone application development, especially
              UI building in SwiftUI, while also using frontend web skills to design,
              present, and ship complete digital experiences.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://drive.google.com/file/d/1yU2qlXJwt_IL1XOZVh8M_uM00A78jgsI/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-red-500 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-white transition-all hover:bg-red-400"
              >
                View CV
              </a>
              <a
                href="#projects"
                className="rounded-full border border-white/10 bg-neutral-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-neutral-200 transition-all hover:border-red-500/40 hover:bg-neutral-950"
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="about-visual mx-auto w-full max-w-[20rem] lg:col-start-2 lg:row-start-1 lg:max-w-[22rem]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_35%),linear-gradient(180deg,#171717_0%,#090909_100%)] p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_28%)]" />
              <img
                src={profileImage}
                alt="Siva Sundar profile"
                className="relative aspect-[4/5] w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
