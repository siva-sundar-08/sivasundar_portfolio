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
  period: string;
  location: string;
  href: string;
  note: string;
};
