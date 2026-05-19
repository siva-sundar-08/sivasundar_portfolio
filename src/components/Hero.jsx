import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const words = ["iOS App Developer", "Web Developer"];
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/siva-sundar-08",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/siva-sundar-g-b0636225a/",
  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const animationRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [robotReady, setRobotReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let animationInstance;

    async function loadAnimation() {
      try {
        const [{ default: lottie }, response] = await Promise.all([
          import("lottie-web"),
          fetch("/RobotSaludando.json"),
        ]);
        const animationData = await response.json();

        if (!isMounted || !animationRef.current) {
          return;
        }

        animationInstance = lottie.loadAnimation({
          container: animationRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
        });

        if (isMounted) {
          setRobotReady(true);
        }
      } catch {
        if (isMounted) {
          setRobotReady(false);
        }
      }
    }

    loadAnimation();

    return () => {
      isMounted = false;
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const atWordEnd = displayText === currentWord;
    const atWordStart = displayText === "";

    let timeout;

    if (!isDeleting && atWordEnd) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && atWordStart) {
      setIsDeleting(false);
      setWordIndex((current) => (current + 1) % words.length);
    } else {
      const nextText = isDeleting
        ? currentWord.slice(0, displayText.length - 1)
        : currentWord.slice(0, displayText.length + 1);

      timeout = setTimeout(
        () => setDisplayText(nextText),
        isDeleting ? 60 : 100,
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-line", {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });

        gsap.from(".hero-subline", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          delay: 0.4,
          ease: "power2.out",
          stagger: 0.12,
        });

        gsap.from(".hero-visual", {
          opacity: 0,
          x: 48,
          duration: 0.9,
          delay: 0.25,
          ease: "power3.out",
        });

      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center gap-14 overflow-hidden bg-black px-6 pb-12 pt-28 md:flex-row md:items-center md:px-24"
    >
      <div className="max-w-3xl">
        <p className="hero-subline font-mono text-xs uppercase tracking-[0.32em] text-neutral-400 md:text-sm">
          // Introduction
        </p>
        <div className="mt-6 space-y-1 uppercase leading-none tracking-tight">
          <div className="hero-line text-5xl font-black md:text-7xl lg:text-[6.5rem]">Siva</div>
          <div className="hero-line text-5xl font-black text-white md:text-7xl lg:text-[6.5rem]">
            Sundar
          </div>
        </div>
        <div className="hero-subline mt-8 flex flex-wrap items-center gap-3 font-mono text-sm uppercase tracking-[0.24em] text-neutral-300 md:text-lg">
          <span>I&apos;m into</span>
          <span className="min-h-[1.5em] text-red-500">{displayText}</span>
          <span className="inline-block h-5 w-px animate-pulse bg-red-500" />
        </div>
        <p className="hero-subline mt-8 max-w-xl text-sm leading-6 text-neutral-400 md:text-[15px]">
          I build polished product interfaces with a bias toward motion,
          structure, and clean front-end execution across web and mobile.
        </p>
        <div className="hero-subline mt-10 flex flex-wrap items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-neutral-950 px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-neutral-300 transition-all hover:border-red-500/40 hover:bg-red-500 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="hero-visual relative mx-auto flex w-full max-w-xl items-center justify-center md:mx-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(239,68,68,0.24),transparent_34%),radial-gradient(circle_at_70%_55%,rgba(255,255,255,0.08),transparent_30%)] blur-3xl" />
        <div className="relative w-full max-w-[30rem] [filter:hue-rotate(-120deg)_saturate(1.45)_brightness(1.02)]">
          <div
            ref={animationRef}
            className="h-[22rem] w-full md:h-[30rem]"
          />
          {!robotReady ? <div className="absolute inset-0" /> : null}
        </div>
      </div>
    </section>
  );
}
