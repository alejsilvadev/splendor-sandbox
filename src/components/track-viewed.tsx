"use client";

import { useEffect } from "react";
import { useViewedCounter } from "@/context/viewed-counter";

export function TrackViewed({ slug }: { slug: string }) {
  const { markAsViewed } = useViewedCounter();

  useEffect(() => {
    markAsViewed(slug);
  }, [slug, markAsViewed]);

  return null;
}
