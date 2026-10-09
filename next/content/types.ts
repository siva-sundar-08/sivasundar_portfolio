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
  type: "Full-time" | "Internship";
  period: string;
  location: string;
  mode: "On-site" | "Hybrid" | "Remote";
  note: string;
  href?: string;
  current?: boolean;
};
