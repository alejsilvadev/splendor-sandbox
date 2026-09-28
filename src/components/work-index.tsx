"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCaseStudies } from "@/lib/api";
import type { CaseStudy, Discipline } from "@/lib/work";
import { ArrowRightIcon } from "@/components/icons";

const FILTERS: Array<"All" | Discipline> = [
  "All",
  "Branding",
  "Website Design",
  "Digital Marketing",
  "Content Marketing",
];

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; studies: CaseStudy[] };

export function WorkIndex() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [filter, setFilter] = useState<"All" | Discipline>("All");
  // Bumped by the retry button to re-run the effect after a failure.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchCaseStudies(controller.signal)
      .then((studies) => setState({ status: "ready", studies }))
      .catch((error: unknown) => {
        // An abort is this effect cleaning up after itself, not a failure —
        // surfacing it would flash an error on every fast unmount.
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Something went wrong",
        });
      });

    return () => controller.abort();
  }, [attempt]);

  // Resetting to "loading" happens here, in the click handler, rather than
  // at the top of the effect — a synchronous setState inside an effect body
  // costs an extra render pass for no benefit.
  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  if (state.status === "error") {
    return (
      <div className="rounded-r-lg border-l-4 border-rose-400 bg-white py-6 pl-6 pr-8 shadow-sm">
        <p className="text-stone-700">Couldn&apos;t load the work.</p>
        <p className="mt-1 text-sm text-stone-500">{state.message}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          Try again
        </button>
      </div>
    );
  }

  const studies =
    state.status === "ready"
      ? filter === "All"
        ? state.studies
        : state.studies.filter((study) => study.disciplines.includes(filter))
      : [];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by discipline">
        {FILTERS.map((option) => {
          const isActive = option === filter;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={isActive}
              disabled={state.status === "loading"}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {state.status === "loading" ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-stone-200"
              aria-hidden
            />
          ))}
          <span className="sr-only">Loading case studies</span>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-stone-500" aria-live="polite">
            {studies.length} {studies.length === 1 ? "case study" : "case studies"}
            {filter === "All" ? "" : ` in ${filter}`}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                className="group relative flex h-72 flex-col overflow-hidden rounded-xl ring-1 ring-stone-200 transition-shadow duration-300 hover:shadow-xl"
              >
                <Image
                  src={`https://picsum.photos/id/${study.imageId}/640/480`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-800 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/25 to-transparent" />

                <div className="relative mt-auto p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
                    {study.sector}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white">
                    {study.headline}
                  </h3>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    {study.client}
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
