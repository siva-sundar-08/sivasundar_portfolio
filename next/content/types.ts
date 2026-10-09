export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type ProjectCategory = "mobile" | "web";

export type Project = {
  slug: string;
  code: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  /** Case-study body paragraphs. Replace with your own write-up when ready. */
  overview: string[];
  highlights: string[];
  stack: string[];
  repo?: string;
  live?: string;
  cover?: ImageAsset;
  /** Base hue (0–360) for the holographic preview when no cover image exists. */
  hue: number;
};

export type SkillGroup = {
  id: string;
  title: string;
  summary: string;
  skills: string[];
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  href: string;
  note: string;
};
