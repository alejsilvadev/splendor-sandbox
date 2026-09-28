"use client";

import { useViewedCounter } from "@/context/viewed-counter";

export function ViewedCounterBadge() {
  const { count } = useViewedCounter();

  return (
    <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide leading-[18px] text-brand-700 ring-1 ring-brand-100">
      {count} viewed this visit
    </span>
  );
}
