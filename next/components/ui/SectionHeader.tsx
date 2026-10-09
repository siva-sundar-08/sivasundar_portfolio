import { sections, type SectionId } from "@/content/site";
import { MorphHeading } from "./MorphHeading";

type SectionHeaderProps = {
  section: SectionId;
  title: string;
  intro?: string;
};

export function SectionHeader({ section, title, intro }: SectionHeaderProps) {
  const meta = sections.find((s) => s.id === section);
  return (
    <header className="mb-14 flex flex-col gap-5 md:mb-20">
      <p className="hud flex items-center gap-3">
        <span className="text-accent">{meta?.code}</span>
        <span className="h-px w-10 bg-white/20" aria-hidden />
        <span>{meta?.label}</span>
      </p>
      <MorphHeading id={`${section}-title`}>{title}</MorphHeading>
      {intro ? (
        <p className="text-ink-dim max-w-xl text-base leading-relaxed">{intro}</p>
      ) : null}
    </header>
  );
}
