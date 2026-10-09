import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { Footer } from "@/components/ui/Footer";
import { getProject, projects } from "@/content/projects";
import { ProjectMedia } from "@/features/projects/ProjectMedia";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  };
}

export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative px-5 pt-32 pb-24 md:px-10 md:pt-40">
        <Suspense fallback={<CaseStudySkeleton />}>
          <CaseStudy params={params} />
        </Suspense>
      </main>
      <Footer />
    </ViewTransition>
  );
}

function CaseStudySkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-7xl animate-pulse">
      <div className="h-3 w-24 rounded bg-white/10" />
      <div className="mt-12 h-24 w-2/3 rounded-2xl bg-white/[0.06]" />
      <div className="mt-16 aspect-[21/9] rounded-[var(--radius-panel)] bg-white/[0.04]" />
    </div>
  );
}

async function CaseStudy({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-7xl">
      <Link
        href="/#projects"
        transitionTypes={["nav-back"]}
        className="inline-flex items-center gap-3 hud transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> All work
      </Link>

      <header className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div>
          <p className="hud">
            <span className="text-accent">{project.code}</span> ·{" "}
            {project.category === "mobile" ? "Mobile app" : "Web"}
          </p>
          <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
            <h1 className="mt-5 display-wide text-[clamp(2.6rem,8vw,7rem)] uppercase">
              {project.title}
            </h1>
          </ViewTransition>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-dim">
            {project.summary}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="glass px-5 py-4">
            <dt className="hud">Type</dt>
            <dd className="mt-1 font-semibold">
              {project.category === "mobile" ? "Mobile app" : "Website"}
            </dd>
          </div>
          <div className="glass px-5 py-4">
            <dt className="hud">Stack</dt>
            <dd className="mt-1 font-semibold">
              {project.stack.slice(0, 2).join(" · ")}
            </dd>
          </div>
          {project.repo ? (
            <div className="glass col-span-2 px-5 py-4">
              <dt className="hud">Source</dt>
              <dd className="mt-1">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="GitHub"
                  className="font-semibold break-all transition-colors hover:text-accent"
                >
                  {project.repo.replace("https://", "")} ↗
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </header>

      <ViewTransition name={`media-${project.slug}`} share="morph" default="none">
        <ProjectMedia
          project={project}
          priority
          sizes="(min-width: 1280px) 1200px, 95vw"
          className="group mt-16 aspect-[16/10] rounded-[var(--radius-panel)] md:aspect-[21/9]"
        />
      </ViewTransition>

      <div className="mt-20 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <section aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="hud">
            Highlights
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {project.highlights.map((item, i) => (
              <li key={item} className="flex gap-4 border-b border-white/10 pb-3">
                <span className="hud text-accent">0{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-12 hud">Built with</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/12 px-4 py-2 hud"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="overview-title">
          <h2 id="overview-title" className="hud">
            Overview
          </h2>
          <div className="mt-6 flex flex-col gap-6 text-lg leading-relaxed md:text-xl">
            {project.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </section>
      </div>

      <Link
        href={`/work/${next.slug}`}
        transitionTypes={["nav-forward"]}
        data-cursor="Next"
        className="group glass mt-28 flex flex-col gap-4 p-8 md:flex-row md:items-end md:justify-between md:p-12"
      >
        <span className="hud">Next artifact · {next.code}</span>
        <span className="display-wide text-[clamp(2rem,6vw,5rem)] uppercase transition-colors group-hover:text-[var(--accent)]">
          {next.title} <span aria-hidden>→</span>
        </span>
      </Link>
    </article>
  );
}
