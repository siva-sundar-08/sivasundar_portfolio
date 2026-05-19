import { gsap } from "gsap";
import useScrollAnimation from "../hooks/useScrollAnimation";

const profiles = [
  {
    label: "GitHub",
    href: "https://github.com/siva-sundar-08",
    value: "github.com/siva-sundar-08",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/siva-sundar-g-b0636225a/",
    value: "linkedin.com/in/siva-sundar-g-b0636225a",
  },
];

export default function Contact() {
  const ref = useScrollAnimation((container) => {
    gsap.from(container.querySelectorAll(".contact-item"), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.7,
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
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-neutral-950/70 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-12">
        <div className="contact-item mb-16 space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
            // Connection Node
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Get In Touch
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-neutral-400 md:text-[15px]">
            Reach out directly through the form below or use the profile links
            if you want to review code, work history, and recent activity first.
          </p>
        </div>

        <div className="contact-item mb-12 grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <a
              key={profile.label}
              href={profile.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-black/40 p-5 transition-all duration-300 hover:border-red-500/40 hover:bg-neutral-950"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-red-500">
                {profile.label}
              </p>
              <p className="mt-3 text-sm text-neutral-300">{profile.value}</p>
            </a>
          ))}
        </div>

        <form
          action="https://formsubmit.co/sivasundar5944@gmail.com"
          method="POST"
          className="w-full max-w-xl space-y-6"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input
            type="hidden"
            name="_subject"
            value="New Portfolio Message from Siva Sundar Website Node"
          />

          <div className="contact-item space-y-2">
            <label className="block font-mono text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-neutral-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="contact-item space-y-2">
            <label className="block font-mono text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Your Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-neutral-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="contact-item space-y-2">
            <label className="block font-mono text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Project / Message Details
            </label>
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Write your project scope, timeline, or message details here"
              className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-neutral-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="contact-item w-full cursor-pointer rounded-xl bg-white py-4 font-mono text-sm font-bold uppercase tracking-[0.28em] text-black shadow-lg transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-red-500/20"
          >
            Send Directly To Gmail
          </button>
        </form>
      </div>
    </section>
  );
}
