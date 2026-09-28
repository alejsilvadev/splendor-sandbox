import type { CaseStudy, Discipline } from "@/lib/work";

// Browser-side access to the app's own JSON API (see app/api/work). Server
// components read `lib/work` directly instead of fetching over HTTP — a
// server fetching itself is a pointless network hop, and it would force
// every page that did it into dynamic rendering. The API is what the client
// talks to when the visitor changes the discipline filter.
export async function fetchCaseStudies(
  discipline?: Discipline,
  signal?: AbortSignal
): Promise<CaseStudy[]> {
  const query = discipline ? `?discipline=${encodeURIComponent(discipline)}` : "";
  const res = await fetch(`/api/work${query}`, { signal });

  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}`);
  }

  return res.json();
}
