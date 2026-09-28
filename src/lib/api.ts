import type { CaseStudy } from "@/lib/work";

// Browser-side access to the app's own JSON API (see app/api/work). Server
// components read `lib/work` directly instead of fetching over HTTP — a
// server fetching itself is a pointless network hop, and it would force
// every page that did it into dynamic rendering. The API exists for the
// client, and for anything else that wants the data.
export async function fetchCaseStudies(
  signal?: AbortSignal
): Promise<CaseStudy[]> {
  const res = await fetch("/api/work", { signal });

  if (!res.ok) {
    throw new Error(`failed to load case studies (${res.status})`);
  }

  return res.json();
}
