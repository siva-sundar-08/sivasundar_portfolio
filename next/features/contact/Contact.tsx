import { Magnetic } from "@/components/ui/Magnetic";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { GravityField } from "./GravityField";

export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden px-5 py-28 md:px-10"
    >
      <GravityField />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          section="contact"
          title="Contact"
          intro="Building an iOS app or a web interface that needs care? Open a channel. Messages land directly in my inbox."
        />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[...site.socials, { label: "CV", href: site.cvUrl, handle: "Résumé" }].map(
              (link) => (
                <li key={link.label}>
                  <Magnetic className="w-full">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group glass flex w-full flex-col gap-1 rounded-2xl px-5 py-4 transition-colors"
                    >
                      <span className="hud transition-colors group-hover:text-accent">
                        {link.label} ↗
                      </span>
                      <span className="text-sm">{link.handle}</span>
                    </a>
                  </Magnetic>
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="glass p-6 md:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
