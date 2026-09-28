import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASE_STUDIES, adjacentCaseStudies, findCaseStudy } from "@/lib/work";
import { TrackViewed } from "@/components/track-viewed";
import { CaseStudyBody } from "@/components/case-study-body";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

// Every slug is known at build time, so all ten pages prerender and the
// router rejects anything else with a real 404 — rather than rendering a
// not-found body underneath a 200.
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);

  if (!study) {
    return { title: "Case study not found — Splendor Sandbox" };
  }

  return {
    title: `${study.client} — Splendor Sandbox`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = findCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const { previous, next } = adjacentCaseStudies(study.slug);

  return (
    <main className="flex-1">
      <TrackViewed slug={study.slug} />

      <header className="relative overflow-hidden bg-ink-950 pb-16 pt-32">
        <Image
          src={`https://picsum.photos/id/${study.imageId}/1600/900`}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-45 grayscale"
        />
        <div className="absolute inset-0 bg-brand-900 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />

        <div className="relative mx-auto w-full max-w-3xl px-6">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-1.5 text-sm text-stone-300 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            All work
          </Link>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
            {study.client}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {study.headline}
          </h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <CaseStudyBody study={study} />

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-stone-200 pt-8">
          {previous ? (
            <Link
              href={`/work/${previous.slug}`}
              className="group inline-flex max-w-[45%] items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="truncate">{previous.client}</span>
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="group inline-flex max-w-[45%] items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <span className="truncate">{next.client}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
