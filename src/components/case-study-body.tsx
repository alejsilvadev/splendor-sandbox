"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { CaseStudy } from "@/lib/work";

const SECTIONS = [
  { key: "challenge", label: "The challenge" },
  { key: "approach", label: "The approach" },
  { key: "outcome", label: "The outcome" },
] as const;

export function CaseStudyBody({ study }: { study: CaseStudy }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = Array.from(root.querySelectorAll("[data-reveal]"));
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
    );
  }, [study.slug]);

  return (
    <div ref={rootRef}>
      <p data-reveal className="text-xl leading-relaxed text-stone-600 sm:text-2xl">
        {study.summary}
      </p>

      <dl
        data-reveal
        className="mt-10 grid gap-px overflow-hidden rounded-xl bg-stone-200 sm:grid-cols-3"
      >
        <div className="bg-white px-5 py-4">
          <dt className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Sector
          </dt>
          <dd className="mt-1.5 font-semibold text-stone-900">{study.sector}</dd>
        </div>
        <div className="bg-white px-5 py-4">
          <dt className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Year
          </dt>
          <dd className="mt-1.5 font-semibold tabular-nums text-stone-900">{study.year}</dd>
        </div>
        <div className="bg-white px-5 py-4">
          <dt className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Disciplines
          </dt>
          <dd className="mt-1.5 font-semibold text-stone-900">
            {study.disciplines.join(", ")}
          </dd>
        </div>
      </dl>

      {SECTIONS.map((section) => (
        <section data-reveal key={section.key} className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            {section.label}
          </h2>
          <div className="mt-3 h-0.5 w-12 bg-brand-600" />
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-stone-600">
            {study[section.key]}
          </p>
        </section>
      ))}

      <section data-reveal className="mt-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Deliverables
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {study.deliverables.map((deliverable) => (
            <li
              key={deliverable}
              className="rounded-full bg-stone-100 px-4 py-1.5 text-sm font-semibold text-stone-700"
            >
              {deliverable}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
