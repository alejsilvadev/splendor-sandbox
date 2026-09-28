import { NextResponse } from "next/server";
import { CASE_STUDIES } from "@/lib/work";

// The sandbox serves its own content rather than proxying a third-party
// API, but it still goes over HTTP so the pages exercise real async data
// loading, caching and error states.
export async function GET(request: Request) {
  const limitParam = new URL(request.url).searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : null;

  if (limitParam !== null && (Number.isNaN(limit) || limit! < 1)) {
    return NextResponse.json(
      { error: "`limit` must be a positive integer" },
      { status: 400 }
    );
  }

  return NextResponse.json(limit ? CASE_STUDIES.slice(0, limit) : CASE_STUDIES);
}
