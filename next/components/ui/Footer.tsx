import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="hud">
          © {site.year} {site.name} · Transmitted from Earth
        </p>
        <ul className="flex gap-6">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="hud transition-colors hover:text-accent"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="hud transition-colors hover:text-accent"
            >
              CV ↗
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
