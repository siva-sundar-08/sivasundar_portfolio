import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useLocation } from "react-router-dom";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/siva-sundar-08",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.35-3.88-1.35-.53-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.74 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.52-2.56-.28-5.26-1.28-5.26-5.72 0-1.27.46-2.3 1.19-3.11-.12-.29-.52-1.46.12-3.03 0 0 .97-.31 3.18 1.19a10.96 10.96 0 0 1 5.79 0c2.2-1.5 3.17-1.2 3.17-1.2.65 1.58.25 2.75.13 3.04.74.81 1.19 1.84 1.19 3.11 0 4.45-2.7 5.43-5.28 5.7.41.36.77 1.06.77 2.15v3.18c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/siva-sundar-g-b0636225a/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM2.75 9.75h4.46v11.5H2.75V9.75Zm7.25 0h4.28v1.57h.06c.59-1.07 2.04-2.2 4.2-2.2 4.5 0 5.33 2.96 5.33 6.81v5.32H19.4v-4.72c0-1.13-.02-2.58-1.57-2.58-1.58 0-1.82 1.23-1.82 2.5v4.8H10V9.75Z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const navRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getSectionHref = (hash) => (isHome ? hash : `/${hash}`);

  useGSAP(
    () => {
      const nav = navRef.current;

      if (!nav) {
        return;
      }

      const onScroll = () => {
        const active = window.scrollY > 100;

        gsap.to(nav, {
          borderColor: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
          backgroundColor: active ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.6)",
          boxShadow: active ? "0 16px 60px rgba(0,0,0,0.45)" : "0 0 0 rgba(0,0,0,0)",
          duration: 0.35,
          ease: "power2.out",
        });
      };

      onScroll();
      window.addEventListener("scroll", onScroll);

      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: navRef },
  );

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <nav
        ref={navRef}
        className="flex w-full max-w-max items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-xl md:gap-6 md:px-6 md:py-3"
      >
        <a
          href={getSectionHref("#home")}
          className="font-mono text-[10px] font-bold tracking-[0.35em] text-red-500 transition-colors hover:text-white md:text-xs"
        >
          SIVA-FOLIO
        </a>
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={getSectionHref(link.href)}
              className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-neutral-300 transition-all hover:border-red-500/40 hover:bg-red-500 hover:text-white"
            >
              {social.icon}
            </a>
          ))}
        </div>
        <a
          href={getSectionHref("#contact")}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:border-red-500 hover:bg-red-500 md:text-xs"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
