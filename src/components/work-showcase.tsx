"use client";

import { useRef, useState } from "react";
import { fetchCaseStudies } from "@/lib/api";
import { DISCIPLINES, type CaseStudy, type Discipline } from "@/lib/work";
import { WorkCarousel } from "@/components/work-carousel";

type Filter = "All" | Discipline;
const FILTERS: Filter[] = ["All", ...DISCIPLINES];

export function WorkShowcase({ initialStudies }: { initialStudies: CaseStudy[] }) {
  // The full list arrives server-rendered, so the rail is populated on first
  // paint. Only a filter change goes to the network.
  const [studies, setStudies] = useState(initialStudies);
  const [filter, setFilter] = useState<Filter>("All");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters are quick to click through, so responses can land out of order.
  // Only the newest request is allowed to write to state; the rest are
  // aborted and ignored.
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  async function select(next: Filter) {
    if (next === filter && !error) return;

    const id = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFilter(next);
    setPending(true);
    setError(null);

    try {
      const data = await fetchCaseStudies(
        next === "All" ? undefined : next,
        controller.signal
      );
      if (id !== requestRef.current) return;
      setStudies(data);
    } catch (err) {
      if (controller.signal.aborted || id !== requestRef.current) return;
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (id === requestRef.current) setPending(false);
    }
  }

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter work by discipline"
      >
        {FILTERS.map((option) => {
          const isActive = option === filter;
          return (
            <button
              key={option}
              type="button"
              onClick={() => select(option)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {option}
            </button>
          );
        })}

        <p
          className="ml-auto self-center text-sm text-stone-500"
          aria-live="polite"
        >
          {pending
            ? "Loading…"
            : `${studies.length} ${studies.length === 1 ? "case study" : "case studies"}`}
        </p>
      </div>

      {error ? (
        <div className="mt-8 rounded-r-lg border-l-4 border-rose-400 bg-white py-6 pl-6 pr-8 shadow-sm">
          <p className="text-stone-700">Couldn&apos;t load that filter.</p>
          <p className="mt-1 text-sm text-stone-500">{error}</p>
          <button
            type="button"
            onClick={() => select(filter)}
            className="mt-4 rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <div
          className={`mt-8 transition-opacity duration-200 ${
            pending ? "pointer-events-none opacity-40" : "opacity-100"
          }`}
        >
          {/* Keyed on the filter so the rail remounts and its active slide
              resets to the first card, rather than holding an index that may
              no longer exist in the narrowed set. */}
          <WorkCarousel key={filter} studies={studies} />
        </div>
      )}
    </div>
  );
}
