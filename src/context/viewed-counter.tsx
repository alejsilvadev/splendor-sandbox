"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ViewedCounterValue {
  count: number;
  markAsViewed: (slug: string) => void;
}

const ViewedCounterContext = createContext<ViewedCounterValue | null>(null);

export function ViewedCounterProvider({ children }: { children: ReactNode }) {
  const [viewedSlugs, setViewedSlugs] = useState<Set<string>>(new Set());

  const markAsViewed = (slug: string) => {
    setViewedSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  };

  return (
    <ViewedCounterContext.Provider value={{ count: viewedSlugs.size, markAsViewed }}>
      {children}
    </ViewedCounterContext.Provider>
  );
}

export function useViewedCounter() {
  const ctx = useContext(ViewedCounterContext);
  if (!ctx) {
    throw new Error("useViewedCounter must be used within a ViewedCounterProvider");
  }
  return ctx;
}
