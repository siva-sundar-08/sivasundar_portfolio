import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillHighlights } from "@/content/skills";
import { SkillsOrbit } from "./SkillsOrbit";

export function Skills() {
  return (
    <section
      id="skills"
      data-section="skills"
      aria-labelledby="skills-title"
      className="relative px-5 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          section="skills"
          title="Skills"
          intro="Four orbits around one core: native mobile first, then the backend and web stack behind full-stack builds, and the tools that hold it all together."
        />
        <SkillsOrbit />
        <ul className="mt-16 flex flex-wrap gap-3" aria-label="Strengths">
          {skillHighlights.map((item) => (
            <li key={item} className="rounded-full border border-white/10 px-4 py-2 hud">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
